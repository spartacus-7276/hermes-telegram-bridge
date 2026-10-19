/* Golden Ratio builder pitch: one lead, never lost.
 * Every style is computed from time inside window.seek(t): no CSS animation, no timers, no randomness, no state
 * carried between frames, so any frame renders on its own.
 * Shape comes from <html data-shape="16x9|9x16">; ?captions=1 adds captions.
 * Readability: at 1920x1080 body text is 28 px or more (labels 24+); at 1080x1920 body text is 34 px or more.
 * Sheet-pixel font sizes of the real screens (measured): WhatsApp 52, new-lead card 41, AI tips 42,
 * CRM tables 31, KPI labels 26, call transcript 44. Every camera scale below is chosen from these. */
(() => {
'use strict';
const SHAPE = document.documentElement.dataset.shape || '16x9';
const V = SHAPE === '9x16';
const W = V ? 1080 : 1920, H = V ? 1920 : 1080;
const Q = new URLSearchParams(location.search);
const CAP = Q.get('captions') || '0';
const LAY = window.LAYERS, TM = window.TIMING;
const pick = (a, b) => (V ? b : a);
const END = 66.3;
const CS = pick(1, 1.3); // lead-card scale for the shape

// ------------------------------------------------------------------ math
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, p) => a + (b - a) * p;
// critically damped spring step response (no overshoot), k = natural frequency
const sp = (t, t0, k = 12) => { const d = t - t0; return d <= 0 ? 0 : 1 - (1 + k * d) * Math.exp(-k * d); };
const ss = (t, a, b) => { const x = clamp((t - a) / (b - a)); return x * x * (3 - 2 * x); };
const eio = x => (x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const ein = x => x * x * x;
const rgbOf = c => (c[0] === '#' ? [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16)) : c.match(/[\d.]+/g).slice(0, 3).map(Number));
const mixc = (c1, c2, p) => { // '#rrggbb' or 'rgb(...)' colours, so mixes can nest
  const a = rgbOf(c1), b = rgbOf(c2);
  return `rgb(${a.map((v, i) => Math.round(lerp(v, b[i], p))).join(',')})`;
};
function wt(id, word, nth = 0) {
  const l = TM.find(x => x.id === id); let k = 0;
  const norm = x => x.replace(/[.,?:!]+$/g, '').toLowerCase();
  for (const w of l.words) if (norm(w.w) === norm(word) && k++ === nth) return w.t;
  throw new Error(`no word ${id}/${word}`);
}

// ------------------------------------------------------------------ DOM helpers
const stage = document.getElementById('stage');
stage.style.width = W + 'px'; stage.style.height = H + 'px';
const IMGS = [];
function E(tag, cls, parent, html) {
  const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html;
  (parent || stage).appendChild(e); return e;
}
const css = (e, o) => { for (const k in o) e.style[k] = typeof o[k] === 'number' && k !== 'opacity' ? o[k] + 'px' : o[k]; return e; };
// centred transform
function put(e, x, y, s = 1, o = 1, r = 0) {
  e.style.transform = `translate(${x}px,${y}px) translate(-50%,-50%) rotate(${r}deg) scale(${s})`;
  e.style.opacity = o;
}
// top-left transform, scale about the top-left corner
function tl(e, x, y, s = 1, o = 1) { e.style.transformOrigin = '0 0'; e.style.transform = `translate(${x}px,${y}px) scale(${s})`; e.style.opacity = o; }
function IMG(src, parent, cls = 'abs') { const e = E('img', cls, parent); e.decoding = 'sync'; e.src = src; IMGS.push(e); return e; }
function LI(name, parent) {
  const m = LAY[name]; if (!m) throw new Error('layer ' + name);
  const e = IMG('../gen/' + m.src, parent, 'lay'); e.m = m;
  css(e, { left: m.x, top: m.y, width: m.w, height: m.h });
  return e;
}
const LSRC = n => '../gen/' + LAY[n].src;
// a window onto part of a layer, in that layer's sheet pixels: shows [x0,x1) x [y0,y1)
function crop(parent, name, x0, y0, x1, y1) {
  const m = LAY[name]; const d = css(E('div', 'crop', parent), { width: x1 - x0, height: y1 - y0 });
  css(IMG(LSRC(name), d, ''), { left: m.x - x0, top: m.y - y0, width: m.w, height: m.h, position: 'absolute' });
  return d;
}
// offset a layer from its home position, scaling about its own origin
function lt(e, dx = 0, dy = 0, s = 1, o = 1, origin = 'center') {
  e.style.transformOrigin = origin; e.style.transform = `translate(${dx}px,${dy}px) scale(${s})`; e.style.opacity = o;
}

/* Compact table: the real rows, cut into column cells and set closer together, so the type can be large.
 * cols: [[x0,x1], ...] in the sheet; xs: the compact x of each column; rows: layer names; rowY/rowH in the sheet. */
function ctable(parent, o) {
  const root = E('div', 'ctab', parent);
  const hh = o.hdr ? o.hdr[2] - o.hdr[1] : 0;
  css(root, { width: o.width, height: hh + (o.rows.length - (o.cutLast ? 1 : 0)) * o.rowH });
  if (o.hdr) {
    const h = css(E('div', 'hdr', root), { height: hh });
    o.cols.forEach(([x0, x1], j) => css(crop(h, o.hdr[0], x0, o.hdr[1], x1, o.hdr[2]), { left: o.xs[j], top: 0 }));
  }
  const rows = o.rows.map((name, i) => {
    const rw = css(E('div', 'rw', root), { top: hh + i * o.rowH, height: o.rowH });
    const y0 = o.rowY(i);
    o.cols.forEach(([x0, x1], j) => css(crop(rw, name, x0, y0, x1, y0 + o.rowH), { left: o.xs[j], top: 0 }));
    return rw;
  });
  // compact position of a sheet point that sits in column j of row i
  const at = (j, i, sx, sy) => [o.xs[j] + sx - o.cols[j][0], hh + i * o.rowH + sy - o.rowY(i)];
  return { root, rows, at, hh };
}

const SVG = {
  wa: '<svg viewBox="0 0 24 24" fill="#fff"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.6.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.9 11.9 0 0 0 4.6 4c1.7.7 2.4.8 3.2.7.5-.1 1.5-.6 1.8-1.2s.2-1.1.2-1.2-.2-.2-.4-.3z"/></svg>',
  missed: '<svg class="mi" viewBox="0 0 24 24"><path d="M19 5 7.5 16.5M7 9v8h8" stroke="#D93A3A" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  check: '<svg viewBox="0 0 24 24"><path d="M5 12.5l4.2 4.2L19 7" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  clock: '<svg class="ic" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" stroke="#fff" stroke-width="1.8" fill="none"/><path d="M12 7v5l3.2 2" stroke="#fff" stroke-width="1.8" fill="none" stroke-linecap="round"/></svg>',
  cursor: '<svg viewBox="0 0 28 34" width="46" height="56"><path d="M2 2v26l7-6.5 4.6 10 4.4-2-4.6-9.8H23z" fill="#1A1712" stroke="#fff" stroke-width="2" stroke-linejoin="round"/></svg>',
  phone: '<svg viewBox="0 0 24 24"><path d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1z" fill="#A9803F"/></svg>',
  cal: '<svg viewBox="0 0 24 24"><rect x="3.5" y="5" width="17" height="15" rx="3" stroke="#A9803F" stroke-width="1.8" fill="none"/><path d="M8 3v4M16 3v4M3.5 10h17" stroke="#A9803F" stroke-width="1.8"/></svg>',
  wag: '<svg viewBox="0 0 24 24" fill="#25D366"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2z"/></svg>',
};

// ------------------------------------------------------------------ scenes
const SC = [];
function scene(a, b) { const r = E('div', 'scene'); const p = E('div', 'push', r); const s = { a, b, root: r, push: p }; SC.push(s); return s; }
// the one camera language: slow push-in, 1.0 -> 1.04 over the scene, about a focus point
function push(s, t, fx, fy, z0 = 1, z1 = 1.04, a = s.a, b = s.b) {
  const z = lerp(z0, z1, eio(clamp((t - a) / (b - a))));
  s.push.style.transformOrigin = `${fx}px ${fy}px`; s.push.style.transform = `scale(${z})`; return z;
}
function setPush(s, fx, fy, z) { s.push.style.transformOrigin = `${fx}px ${fy}px`; s.push.style.transform = `scale(${z})`; }

// surfaces under the captions (and the cut list they split at)
const SURF = [[0, 5.2, 'cream'], [5.2, 7.7, 'photo'], [7.7, 11.8, 'dark'], [11.8, 17.2, 'cream'], [17.2, 19.6, 'photo'],
  [19.6, 39.25, 'cream'], [39.25, 41.6, 'photo'], [41.6, 44.6, 'cream'], [44.6, 46.6, 'photo'], [46.6, END, 'cream']];

// sound cues read by audio/mix.py (peak times)
const CUES = [];
const cue = (t, type, gain = 1) => CUES.push({ t: +t.toFixed(3), type, gain });

// ------------------------------------------------------------------ the lead card
const CW = 580, CH = 146; // base size; CS scales it for the shape
const CARD = E('div', 'lead');
const CF = E('div', 'face', CARD);
const CAV = E('div', 'av', CF, 'KM');
const CTX = E('div', 'tx', CF);
E('div', 'nm', CTX, 'Karan Mehta');
const CSB = E('div', 'sb', CTX);
const CTG = E('div', 'tg', CF);
const CPILL = E('div', 'pill', CARD, SVG.wa + 'Instant reply on WhatsApp');
const CRING = E('div', 'ringf', CARD, '<div class="nh">NH</div><div><div class="rn">Northstar Homes</div><div class="rs">AI assistant · Incoming call</div></div>');
const MI = SVG.missed.replace('class="mi"', '');
const SUBS = {
  missed: [MI, 'Missed call · 10:40 PM'], noreply: [MI, 'Missed call · no reply'],
  enquiry: [SVG.wag, 'Northstar Skyline'], rohan: [SVG.cal, 'Assigned to Rohan'],
  follow: [SVG.cal, 'Visit · Sun 11:00 AM'], calling: [SVG.phone, 'AI calling'],
  today: [SVG.cal, 'Visit today · 11:00 AM'], confirmed: [SVG.cal, 'Confirmed · 11:00 AM'],
  booked: [SVG.cal, 'Northstar Skyline · 2 BHK'],
};
const TAGS = { none: null, ai: ['AI qualified', '#FBF3E4', '#8A6528'], rohan: ['Rohan', '#FBF3E4', '#8A6528'],
  booked: ['Booked', '#E3F6EA', '#17804A'], today: ['Today', '#FBF3E4', '#8A6528'] };
function card(p) {
  if (CARD.parentNode !== p.parent) p.parent.appendChild(CARD);
  CARD.style.display = 'block';
  css(CARD, { width: p.w ?? CW, height: p.h ?? CH, borderRadius: p.radius ?? 22 });
  CARD.style.background = p.bg ?? '#fff';
  CARD.style.borderColor = p.border ?? 'rgba(169,128,63,1)';
  const sh = p.shadow ?? 1;
  CARD.style.boxShadow = `0 ${14 * sh}px ${34 * sh}px rgba(26,23,18,${.13 * sh}),0 2px 6px rgba(26,23,18,${.06 * sh})`;
  put(CARD, p.x, p.y, p.s ?? CS, p.o ?? 1, p.r ?? 0);
  CF.style.opacity = p.face ?? 1;
  const sub = SUBS[p.sub || 'missed']; CSB.innerHTML = sub[0] + '<span>' + sub[1] + '</span>';
  const tg = TAGS[p.tag || 'none'];
  if (tg) { CTG.style.display = 'block'; CTG.textContent = tg[0]; CTG.style.background = tg[1]; CTG.style.color = tg[2]; } else CTG.style.display = 'none';
  CAV.style.background = p.avbg ?? '#F4ECDF'; CAV.style.color = p.avfg ?? '#A9803F';
  CPILL.style.opacity = p.pill ?? 0;
  CRING.style.opacity = p.ring ?? 0;
}
function noCard() { CARD.style.display = 'none'; }

// photos: cover the frame, positioned by (ox, oy) at scale sc
const PHOTO = (scn, name, ox, oy, sc) => css(IMG('../gen/photos/' + name + '.jpg', scn.push),
  { left: ox, top: oy, width: (name.includes('screen') ? (name.includes('tall') ? 941 : 1672) : (name.includes('tall') ? 1024 : 1536)) * sc });
const PS = 1920 / 1672; // the screen plates cover the frame at 1.148 in both shapes

// ================================================================== 1. hook (0 - 5.2)
const s1 = scene(0, 5.2);
const PH1 = pick({ w: 500, h: 1040, x: 710, y: 92, s: 1, rows: 232, lift: [960, 600] },
  { w: 500, h: 1040, x: 290, y: 872, s: 1.04, rows: 232, lift: [540, 760] });
const mph = css(E('div', 'mphone', s1.push), { width: PH1.w, height: PH1.h, left: PH1.x, top: PH1.y, transformOrigin: '50% 0' });
const mscr = E('div', 'scr', mph); E('div', 'notch', mscr); E('div', 'hd', mscr, 'Recents');
E('div', 'tabs', mscr, '<span>All</span><span class="on">Missed</span>');
const mrows = css(E('div', 'abs', mscr), { left: 0, right: 0, top: PH1.rows, bottom: 0, overflow: 'hidden', position: 'absolute' });
const MISSED = ['6:05 PM', '6:48 PM', '7:20 PM', '7:52 PM', '8:31 PM', '9:04 PM', '9:37 PM', '10:12 PM', '10:40 PM'];
const RH = 86;
const ROWT = MISSED.map((_, k) => 0.5 + 0.5 * k);
const mrowEls = MISSED.map((tm, k) => E('div', 'mrow', mrows,
  `${SVG.missed}<div class="mn">${k === 8 ? '+91 98765 43210' : '+91 98…'}<span class="ms">Missed call · Mobile</span></div><div class="mt">${tm}</div>`));
ROWT.forEach(t => cue(t, 'tick', .8));
// the question, typed at the word times
const QW = TM[0].words;
const QL = pick({ split: [0, 6], y: [470, 582] }, { split: [0, 6, 11], y: [270, 375, 500] });
const qlines = QL.y.map(y => css(E('div', 'q', s1.push), { top: y - 50 }));
const qws = QW.map((w, i) => {
  let li = 0; QL.split.forEach((s, k) => { if (i >= s) li = k; });
  return Object.assign(E('span', 'w' + (i >= 11 ? ' serif gold' : ''), qlines[li], w.w), { t: w.t });
});
s1.render = t => {
  push(s1, t, W / 2, H / 2);
  mph.style.opacity = V ? 1 : lerp(.16, 1, ss(t, 4.45, 4.85)); // 9:16: the phone sits below the question, never behind it
  mph.style.transform = `translateY(${lerp(18, 0, sp(t, 4.4, 9))}px) scale(${PH1.s})`;
  MISSED.forEach((_, k) => {
    let y = 0; for (let j = k + 1; j < MISSED.length; j++) y += sp(t, ROWT[j], 16) * RH;
    y -= (1 - sp(t, ROWT[k], 16)) * RH * .7;
    mrowEls[k].style.transform = `translateY(${y}px)`;
    mrowEls[k].style.opacity = ss(t, ROWT[k] - .02, ROWT[k] + .12) * (k === 8 ? 1 - ss(t, 4.62, 4.72) : 1);
  });
  qws.forEach((w, i) => {
    const ex = ss(t, 4.48 + i * .012, 4.78 + i * .012);
    w.style.opacity = ss(t, w.t - .02, w.t + .1) * (1 - ex);
    w.style.transform = `translateY(${(1 - sp(t, w.t, 20)) * 18 - ex * 36}px)`;
  });
  // Karan's row lifts off and becomes the lead object
  if (t >= 4.62) {
    const p = sp(t, 4.62, 8.5);
    const rx = PH1.x + PH1.w / 2, ry = PH1.y + (14 + PH1.rows + RH / 2) * PH1.s;
    const rw = (PH1.w - 28) * PH1.s, rh = RH * PH1.s;
    card({ parent: s1.push, x: rx, y: lerp(ry, PH1.lift[1], p), w: lerp(rw / CS, CW, p), h: lerp(rh / CS, CH, p),
      radius: lerp(0, 22, p), border: `rgba(169,128,63,${p})`, shadow: p, face: ss(t, 4.62, 4.78) });
  }
};

// ================================================================== 2. problem (5.2 - 11.8)
const s2a = scene(5.2, 7.7);
const P2 = pick({ ox: 0, oy: -100, s: 1.25, ph: [1100, 500] }, { ox: -100, oy: 0, s: 1.25, ph: [690, 930] });
PHOTO(s2a, pick('02-buyer-sofa', '02b-buyer-sofa-tall'), P2.ox, P2.oy, P2.s);
// the clock sits top-left over both halves of the scene
const OV = css(E('div', 'abs'), { width: W, height: H, position: 'absolute' });
const clockEl = E('div', 'clock', OV, SVG.clock);
css(clockEl, { left: pick(72, 56), top: pick(64, 110), transformOrigin: '0 0', transform: `scale(${pick(1, 1.25)})` });
const digits = css(E('div', 'digits', clockEl), { width: 290 });
const mkLine = s => { const l = E('div', 'ln', digits); return [...s].map(ch => E('span', '', l, ch === ' ' ? '&nbsp;' : ch)); };
const CLA = mkLine('10:40 PM'), CLB = mkLine('8:12 AM');
const T1040 = wt('p02', '10:40'), TMORN = wt('p03', 'morning');
function clock(t) {
  const on = t >= T1040 - .05 && t < 11.8;
  OV.style.display = on ? 'block' : 'none'; if (!on) return;
  clockEl.style.opacity = ss(t, T1040 - .05, T1040 + .12);
  CLA.forEach((c, i) => {
    const a = sp(t, T1040 + i * .035, 16), b = sp(t, TMORN + i * .03, 15);
    c.style.transform = `translateY(${(1 - a) * 64 - b * 64}px)`; c.style.opacity = a * (1 - b);
  });
  CLB.forEach((c, i) => {
    const b = sp(t, TMORN + .06 + i * .03, 15);
    c.style.transform = `translateY(${(1 - b) * 64}px)`; c.style.opacity = b;
  });
}
s2a.render = t => {
  push(s2a, t, P2.ph[0], P2.ph[1]);
  const p = sp(t, 5.2, 6.5);
  card({ parent: s2a.push, x: lerp(PH1.lift[0], P2.ph[0], p), y: lerp(PH1.lift[1], P2.ph[1] - 10, p), s: lerp(CS, .07, p),
    o: 1 - ss(t, 5.62, 5.82), sub: 'missed' });
};
const s2b = scene(7.7, 11.8);
s2b.root.style.background = '#1A1712';
const comps = ['Called back · 7:55 AM', 'WhatsApp reply · 8:03 AM', 'Visit offered · 8:10 AM'].map((sb, i) =>
  E('div', 'comp', s2b.push, `<div class="av">B${i + 1}</div><div><div class="nm">Another builder</div><div class="sb">${sb}</div></div>`));
const T3 = wt('p03', 'three');
// cards 1.5x the first cut: they fill the night frame
const C2 = pick({ s: 1.18, c: [960, 560], k: [430, 560], cmp: [[1180, 400], [1270, 570], [1360, 740]], from: [2500, 0] },
  { s: 1.3, c: [540, 960], k: [540, 600], cmp: [[500, 1010], [540, 1220], [580, 1430]], from: [0, 2300] });
s2b.render = t => {
  push(s2b, t, W / 2, H / 2);
  comps.forEach((c, i) => {
    const p = sp(t, T3 + i * .15, 8), [fx, fy] = C2.from;
    put(c, fx ? lerp(fx, C2.cmp[i][0], p) : C2.cmp[i][0], fy ? lerp(fy, C2.cmp[i][1], p) : C2.cmp[i][1], C2.s, ss(t, T3 + i * .15, T3 + i * .15 + .1));
  });
  const a = sp(t, 7.7, 9), b = sp(t, T3 + .1, 5.5);
  card({ parent: s2b.push, x: lerp(lerp(P2.ph[0], C2.c[0], a), C2.k[0], b), y: lerp(lerp(P2.ph[1] - 10, C2.c[1], a), C2.k[1], b),
    s: lerp(.07, C2.s, a), sub: 'noreply', shadow: 0 });
};

// ================================================================== 3. promise (11.8 - 17.2)
const s3 = scene(11.8, 17.2);
// 16:9: chips left and right on one line; 9:16: the thread runs down the frame
const L3 = pick({ logo: [960, 250, 820], a: [400, 730], b: [1520, 730], wait: [400, 560], mid: [960, 730], cs: 1 },
  CAP === '1' ? { logo: [540, 330, 860], a: [540, 820], b: [540, 1480], wait: [540, 630], mid: [540, 1150], cs: 1.3 } // clear of the caption strip
    : { logo: [540, 380, 860], a: [540, 900], b: [540, 1640], wait: [540, 690], mid: [540, 1270], cs: 1.3 });
const logoBox = E('div', 'abs', s3.push);
IMG('../assets/brand/golden-ratio-horizontal-gold-2400w.png', logoBox, '').style.width = L3.logo[2] + 'px';
css(logoBox, { left: L3.logo[0] - L3.logo[2] / 2, top: L3.logo[1] - L3.logo[2] * 795 / 2400 / 2 });
const svg3 = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
svg3.setAttribute('width', W); svg3.setAttribute('height', H); css(svg3, { position: 'absolute', left: 0, top: 0 });
s3.push.appendChild(svg3);
const thread = document.createElementNS('http://www.w3.org/2000/svg', 'path');
thread.setAttribute('fill', 'none'); thread.setAttribute('stroke', '#A9803F'); thread.setAttribute('stroke-width', pick(3.5, 4.5));
thread.setAttribute('stroke-linecap', 'round'); svg3.appendChild(thread);
const chipA = E('div', 'chip', s3.push, '<i></i>Enquiry'), chipB = E('div', 'chip', s3.push, '<i></i>Site visit');
const TGR = wt('p04', 'golden'), TGAP = wt('p04', 'gap'), TENQ = wt('p04', 'enquiry'), TSITE = wt('p04', 'site'), TVIS = wt('p04', 'visit');
cue(TGR, 'impact', .6); cue(TVIS + .02, 'thump', .7);
const BT = pick([1027 * PS, 677 * PS, 285 * PS / 520], [543 * PS, 1032 * PS, 268 * PS / 520]); // the WhatsApp button under the thumb
s3.render = t => {
  push(s3, t, W / 2, H / 2);
  const lp = sp(t, TGR, 4.2);
  logoBox.style.clipPath = `inset(-5% ${(1 - lp) * 100}% -5% 0)`;
  logoBox.style.opacity = ss(t, TGR - .05, TGR + .2);
  const ca = sp(t, TGAP, 11), cb = sp(t, TGAP + .12, 11);
  put(chipA, L3.a[0], L3.a[1], L3.cs * lerp(.9, 1, ca), ss(t, TGAP, TGAP + .15));
  put(chipB, L3.b[0], L3.b[1], L3.cs * lerp(.9, 1, cb), ss(t, TGAP + .12, TGAP + .27));
  chipA.firstChild.style.background = mixc('#D8D1C5', '#A9803F', ss(t, TENQ, TENQ + .15));
  chipB.firstChild.style.background = mixc('#D8D1C5', '#A9803F', ss(t, TSITE, TSITE + .15));
  const tight = sp(t, TSITE + .1, 11);
  let d;
  if (!V) {
    const x0 = L3.a[0] + chipA.offsetWidth / 2, x1 = L3.b[0] - chipB.offsetWidth / 2, sag = 150 * (1 - tight);
    d = `M${x0} ${L3.a[1]} Q${(x0 + x1) / 2} ${L3.a[1] + 2 * sag} ${x1} ${L3.a[1]}`;
  } else {
    const y0 = L3.a[1] + chipA.offsetHeight * L3.cs / 2, y1 = L3.b[1] - chipB.offsetHeight * L3.cs / 2, sag = 160 * (1 - tight);
    d = `M${L3.a[0]} ${y0} Q${L3.a[0] + 2 * sag} ${(y0 + y1) / 2} ${L3.a[0]} ${y1}`;
  }
  thread.setAttribute('d', d);
  const len = thread.getTotalLength(), draw = sp(t, TGAP + .15, 6);
  thread.style.strokeDasharray = `${len} ${len}`; thread.style.strokeDashoffset = (1 - draw) * len;
  // Karan's card: from where scene 2 left it to beside the Enquiry chip, then onto the middle of the thread
  const a = sp(t, 11.8, 7), b = sp(t, TVIS, 13), m = sp(t, 16.78, 13);
  const ax = lerp(C2.k[0], L3.wait[0], a), ay = lerp(C2.k[1], L3.wait[1], a);
  card({ parent: s3.push, x: lerp(lerp(ax, L3.mid[0], b), BT[0], m), y: lerp(lerp(ay, L3.mid[1], b), BT[1], m),
    s: lerp(lerp(C2.s, CS, a), BT[2], m), w: lerp(CW, 520, m), h: lerp(CH, 96, m), radius: lerp(22, 48, m),
    bg: mixc('#FFFFFF', '#25D366', ss(m, .1, .5)), border: `rgba(169,128,63,${1 - ss(m, .1, .5)})`,
    face: 1 - ss(m, .05, .35), pill: ss(m, .35, .7), sub: 'enquiry', tag: 'ai' });
};

// ================================================================== 4. WhatsApp AI (17.2 - 27.6)
const s4a = scene(17.2, 19.6);
const P4 = pick({ ox: 0, oy: 0, s: PS, f: [1030 * PS, 470 * PS] }, { ox: 0, oy: 0, s: PS, f: [545 * PS, 815 * PS] });
PHOTO(s4a, pick('03c-thumb-tap-screen', '03d-thumb-tap-screen-tall'), P4.ox, P4.oy, P4.s);
const ring4 = css(E('div', 'abs', s4a.push), { width: 60, height: 60, borderRadius: '50%', border: '3px solid rgba(255,255,255,.9)' });
s4a.render = t => {
  if (t < 19.0) push(s4a, t, P4.f[0], P4.f[1], 1, 1.04, 17.2, 19.0);
  else setPush(s4a, P4.f[0], P4.f[1], lerp(1.04, 2.4, ein(clamp((t - 19.0) / .6))));
  const rp = clamp((t - 17.42) / .45);
  put(ring4, BT[0], BT[1], lerp(.3, 1.6, eio(rp)), rp > 0 && rp < 1 ? (1 - rp) * .9 : 0);
};
cue(17.42, 'pop', .6);

const s4b = scene(19.6, 27.6);
// 16:9: the phone on cream at 0.56 (bubble text 29 px); 9:16: the screen fills the frame at 0.692 (36 px)
const WZ = pick(.56, 1080 / 1560), WTOP = pick(40, 0), BEZ = pick(26, 0);
const WBOT = CAP === '1' ? pick(150, 300) : WTOP; // with captions the phone stops above the caption strip
const WSH = (H - WTOP - WBOT) / WZ - 2 * BEZ; // screen height in sheet px
const waph = E('div', 'waphone' + (V ? ' full' : ''), s4b.push);
const wascr = E('div', 'scr', waph); wascr.style.height = WSH + 'px';
LI('wa_head', wascr);
const chat = css(E('div', 'chat', wascr), { top: 376, height: WSH - 376 - 200 });
LI('wa_foot', wascr).style.top = (WSH - 200) + 'px';
const col = E('div', 'col', chat);
const CHATH = WSH - 376 - 200;
const BUB = [
  ['wa_today', 19.66], ['wa_k1', 19.74], ['wa_ai1', wt('p05', 'night') - .1], ['wa_opts', wt('p06', 'prices')],
  ['wa_pdf', wt('p06', 'brochure')], ['wa_aiq', wt('p06', 'answers')], ['wa_k2', wt('p06', 'hinglish')],
  ['wa_aislot', 25.48], ['wa_slots', 25.6], ['wa_ksun', 25.82], ['wa_done', wt('p06', 'books')],
].map(([n, t]) => { const e = LI(n, col); return { e, t, y: e.m.y - 376, h: e.m.h, right: e.m.x > 400, n }; });
// the film's order: options, brochure, the AI's question, his Hinglish reply, slots, booked
(() => {
  const by = n => BUB.find(b => b.n === n);
  let y = by('wa_opts').y + by('wa_opts').h + 6;
  for (const n of ['wa_pdf', 'wa_aiq', 'wa_k2', 'wa_aislot', 'wa_slots', 'wa_ksun', 'wa_done']) { const b = by(n); b.y = y; y += b.h - (n === 'wa_ksun' ? 14 : 2); }
  BUB.forEach(b => { b.e.style.top = b.y + 'px'; });
})();
BUB.forEach(b => { if (b.n !== 'wa_today') cue(b.t, b.n === 'wa_done' ? 'chime' : 'pop', b.n === 'wa_done' ? 1 : .7); });
function chatScroll(t) {
  let s = 0, prev = 0;
  for (const b of BUB) {
    const target = Math.max(0, b.y + b.h - CHATH + 30);
    if (target > prev) { s += (target - prev) * sp(t, b.t - .05, 11); prev = target; }
  }
  return s;
}
const WX = W / 2 - (1560 + 2 * BEZ) * WZ / 2;
const waPhoneZ = t => lerp(1, 1.04, eio(clamp((t - 19.6) / 8)));
// screen rect of the "booked" bubble (the hand-off into the CRM starts from it)
function doneRect(t) {
  const b = BUB[BUB.length - 1], z = waPhoneZ(t), sc = chatScroll(t);
  const cx = WX + (BEZ + b.e.m.x + b.e.m.w / 2) * WZ, cy = WTOP + (BEZ + 376 + b.y - sc + b.h / 2) * WZ;
  return { x: W / 2 + (cx - W / 2) * z, y: H / 2 + (cy - H / 2) * z, w: b.e.m.w * WZ * z, h: b.h * WZ * z };
}
s4b.render = t => {
  setPush(s4b, W / 2, H / 2, waPhoneZ(t));
  waph.style.transform = `translate(${WX}px,${WTOP}px) scale(${WZ})`;
  col.style.transform = `translateY(${-chatScroll(t)}px)`;
  BUB.forEach(b => {
    const p = sp(t, b.t, 16), lift = b.n === 'wa_done' ? ss(t, 27.1, 27.6) : 0;
    lt(b.e, 0, (1 - p) * 40 - lift * 20, lerp(.94, 1, p) * (1 + lift * .05), ss(t, b.t - .02, b.t + .08), b.right ? '100% 100%' : '0% 100%');
  });
};

// ================================================================== 5. CRM (27.6 - 39.25)
// 5a admin leads list: five rows, Karan's in the middle, about 1.5x the first cut
const s5a = scene(27.6, 34.2);
const s5abg = E('div', 'crmbg', s5a.push);
const T2 = pick({ cols: [[612, 1150], [1900, 2280], [2530, 2975]], xs: [36, 616, 1036], width: 1511, z: 1.15 },
  { cols: [[612, 1040], [2530, 2975]], xs: [30, 488], width: 963, z: 1.08 });
const tab2 = ctable(s5a.push, { cols: T2.cols, xs: T2.xs, width: T2.width, hdr: ['c02_bg', 1133, 1209],
  rows: [0, 1, 2, 3, 4, 5].map(i => 'c02_r' + i), rowY: i => 1210 + i * 130, rowH: 130, cutLast: true });
const T2X = (W - T2.width * T2.z) / 2, T2Y = pick(540, 960) - (tab2.hh + 2 * 130 + 65) * T2.z; // Karan's row centred
// Karan's row as picked for Rohan (crm 02b): gold rules across the whole compact row
const hlrow = css(E('div', 'hlrow', tab2.root), { top: tab2.hh + 2 * 130 - 3, height: 136 });
const k2b = css(E('div', 'rw', tab2.root), { top: tab2.hh + 2 * 130 + 3, height: 124 });
T2.cols.forEach(([x0, x1], j) => css(crop(k2b, 'c02b_karan', x0 + 4, 1476, x1, 1600), { left: T2.xs[j] + 4, top: 0 }));
const DD = crop(tab2.root, 'c02b_dd', 2550, 1506, 2800, 1562);
const ddAt = tab2.at(T2.cols.length - 1, 2, 2550, 1506); css(DD, { left: ddAt[0], top: ddAt[1] });
const tint2 = css(E('div', 'hl', tab2.root), { left: 0, right: 0, top: tab2.hh + 260, height: 130 });
// 9:16: the list re-set as three lead cards (Harsh, Karan, Kavya), Karan's in the middle; names 40 px, Move 36 px
const ST = { x: 60, w: 960, h: 440, gap: 24, s: 1.3 };
ST.top = 960 - ST.h * 1.5 - ST.gap;
const stY = k => ST.top + k * (ST.h + ST.gap);
let stack = [], stTitle;
if (V) {
  tab2.root.style.display = 'none';
  stTitle = crop(s5a.push, 'c02_bg', 640, 1010, 1300, 1100); stTitle.style.mixBlendMode = 'multiply';
  const chev = '<svg viewBox="0 0 24 24" width="34" height="34"><path d="M6 9l6 6 6-6" stroke="#1d1d1d" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  stack = [1, 2, 3].map(ri => {
    const y0 = 1210 + ri * 130;
    const c = css(E('div', 'scard', s5a.push), { left: ST.x, top: 0, width: ST.w, height: ST.h });
    const nm = crop(c, 'c02_r' + ri, 640, y0 + 18, 1040, y0 + 112); tl(nm, 36, 26, ST.s); nm.style.mixBlendMode = 'multiply';
    css(E('div', 'slbl', c, 'OWNER'), { top: 166 });
    const ow = crop(c, 'c02_r' + ri, 1930, y0 + 40, 2200, y0 + 92); tl(ow, 36, 196, ST.s); ow.style.mixBlendMode = 'multiply';
    css(E('div', 'slbl', c, 'MOVE TO'), { top: 284 });
    const dd = css(E('div', 'sdd', c, '<span>Choose\u2026</span>' + chev), { left: 36, top: 320, width: 600, height: 92 });
    css(E('div', 'sbtn', c, 'Move'), { left: 660, top: 320, width: ST.w - 36 - 660, height: 92 });
    return { c, dd };
  });
}
const cursor = E('div', 'abs', s5a.push, SVG.cursor);
// the new-lead card: the real one at 0.72 in 16:9 (29 px text); 9:16 re-sets its parts in a narrower card at 0.84 (34 px)
const leadImg = css(E('div', 'abs', s5a.push), { position: 'absolute' });
let sumBox, LEADW, LEADH, LEADS;
if (!V) {
  LEADW = 1920; LEADH = 1206; LEADS = .72;
  css(leadImg, { width: LEADW, height: LEADH });
  IMG(LSRC('lead_card'), leadImg).style.width = '1920px';
  sumBox = css(E('div', 'abs', leadImg), { left: 180, top: 753, width: 1560, height: 279, border: '5px solid #A9803F', borderRadius: 30, position: 'absolute' });
} else {
  LEADW = 1214; LEADH = 1000; LEADS = .84;
  leadImg.className = 'leadh'; css(leadImg, { width: LEADW, height: LEADH });
  css(crop(leadImg, 'lead_card', 186, 165, 1000, 310), { left: 60, top: 50 });
  css(crop(leadImg, 'lead_card', 1410, 195, 1745, 280), { left: LEADW - 60 - 335, top: 172 });
  css(E('div', 'sep', leadImg), { top: 255 });
  css(crop(leadImg, 'lead_card', 186, 395, 1290, 715), { left: 60, top: 290 });
  css(E('div', 'sum', leadImg, '<div class="l">AI CHAT SUMMARY</div><div class="x">Wants the 810 sq ft 2 BHK. Moving in by mid 2027. Brochure sent. Prefers WhatsApp, coming with his wife.</div>'),
    { left: 60, top: 640, width: LEADW - 120 });
  sumBox = css(E('div', 'abs', leadImg), { left: 54, top: 634, width: LEADW - 108, height: 316, border: '5px solid #A9803F', borderRadius: 34, position: 'absolute' });
}
const xfer = IMG(LSRC('wa_done'), s5a.push); xfer.style.width = LAY.wa_done.w + 'px';
const TLANDS = wt('p07', 'lands'), TCONV = wt('p07', 'with'), TONE = wt('p08', 'one');
cue(TLANDS, 'thump', .8); cue(TONE + .02, 'click', 1); cue(32.45, 'click', .45);
const t2s = (cx, cy) => [T2X + cx * T2.z, T2Y + cy * T2.z]; // compact table -> screen
s5a.render = t => {
  push(s5a, t, W / 2, H / 2);
  // the list rises in behind the card
  const rise = (1 - sp(t, 27.85, 8)) * H * 1.05;
  s5abg.style.transform = `translateY(${rise}px)`;
  const open = sp(t, 30.95, 14);
  if (!V) {
    tl(tab2.root, T2X, T2Y + rise, T2.z, 1);
    tab2.rows.forEach((r, i) => {
      if (i < 2) lt(r, 0, 0, 1, 1);
      else if (i === 2) lt(r, 0, 0, 1, ss(t, 31.28, 31.4) * (1 - ss(t, 33.06, 33.1)));
      else lt(r, 0, -130 * (1 - open), 1, 1);
    });
    hlrow.style.opacity = k2b.style.opacity = ss(t, 33.06, 33.1) * (1 - ss(t, 33.62, 33.72));
    DD.style.opacity = ss(t, 32.45, 32.5) * (1 - ss(t, 33.06, 33.1));
    tint2.style.opacity = ss(t, 31.28, 31.4) * (1 - ss(t, 31.6, 32.4)) * .9;
  } else {
    tl(stTitle, ST.x, ST.top - 150 + rise, ST.s, 1);
    stack.forEach((c, k) => {
      let y = stY(k) + rise, o = 1;
      if (k === 1) o = ss(t, 31.28, 31.4) * (1 - ss(t, 33.62, 33.72));
      if (k === 2) y -= (ST.h + ST.gap) * (1 - open);
      c.c.style.transform = `translateY(${y}px)`; c.c.style.opacity = o;
    });
    const K = stack[1], hi = ss(t, 33.06, 33.1), fl = ss(t, 31.28, 31.4) * (1 - ss(t, 31.6, 32.4));
    K.c.style.background = mixc('#FFFFFF', '#FBF3E4', Math.max(hi, fl * .9));
    K.c.style.border = hi > 0 ? `3px solid rgba(169,128,63,${hi})` : '2px solid #ECEAE7';
    K.dd.firstChild.textContent = t >= 32.45 ? 'Rohan Kulkarni' : 'Choose\u2026';
  }
  // Karan's slot, his dropdown and his Move button, in screen px
  const KS = V ? [ST.x + ST.w / 2, stY(1) + ST.h / 2] : t2s(...tab2.at(0, 2, 880, 1535));
  const DDP = V ? [ST.x + 36 + 300, stY(1) + 366] : t2s(...tab2.at(T2.cols.length - 1, 2, 2671, 1533));
  const MVP = V ? [ST.x + 660 + (ST.w - 696) / 2, stY(1) + 366] : t2s(...tab2.at(T2.cols.length - 1, 2, 2882, 1534));
  // booked bubble -> new-lead card
  const r = doneRect(27.6), bp = sp(t, 27.6, 10);
  put(xfer, lerp(r.x, W / 2, bp), lerp(r.y, pick(500, 900), bp), lerp(r.w / LAY.wa_done.w, .2, bp), 1 - ss(t, 27.72, 27.86));
  const gp = sp(t, 27.68, 9), land = sp(t, TLANDS, 18), fold = sp(t, 30.95, 9);
  const cy = pick(500, 820);
  put(leadImg, lerp(W / 2, KS[0], fold), lerp(lerp(cy - 40, cy, land), KS[1], fold),
    lerp(lerp(.12, LEADS * 1.02, gp) * lerp(1, .98, land), .1, fold), ss(t, 27.68, 27.8) * (1 - ss(t, 31.2, 31.35)));
  const sb = sp(t, TCONV, 5);
  sumBox.style.clipPath = `inset(-10px ${(1 - sb) * 100}% -10px -10px)`;
  sumBox.style.opacity = ss(t, TCONV, TCONV + .1);
  // the manager's one click
  const dd = DDP, mv = MVP;
  const c0 = [pick(1500, 760), pick(960, 1500)];
  const a1 = sp(t, 31.85, 7), a2 = sp(t, 32.62, 9);
  const cx = lerp(lerp(c0[0], dd[0], a1), mv[0], a2), cyy = lerp(lerp(c0[1], dd[1], a1), mv[1], a2);
  const press = Math.max(1 - Math.abs(t - 32.44) / .07, 1 - Math.abs(t - (TONE + .02)) / .07, 0);
  cursor.style.transformOrigin = '3px 3px';
  cursor.style.transform = `translate(${cx - 3}px,${cyy - 3}px) scale(${1 - .12 * clamp(press)})`;
  cursor.style.opacity = ss(t, 31.8, 31.95) * (1 - ss(t, 33.7, 33.85));
  // Karan's row leaves as the card, for Rohan
  if (t >= 33.6) {
    const p = ein(clamp((t - 33.7) / .5));
    const rs = V ? KS : t2s(...tab2.at(0, 2, 900, 1535));
    card({ parent: s5a.push, x: lerp(Math.max(rs[0], CW * CS / 2 + 30), W + 500, p), y: rs[1], s: CS * lerp(.9, 1, ss(t, 33.6, 33.75)),
      o: ss(t, 33.6, 33.7), sub: 'rohan', tag: 'rohan' });
  }
};
// 5b Rohan's leads
const s5b = scene(34.2, 36.9);
E('div', 'crmbg', s5b.push);
const T6 = pick({ cols: [[612, 990], [1500, 1760], [2250, 2500], [3130, 3430], [3600, 3740]], xs: [36, 456, 756, 1046, 1366], width: 1530, z: 1.05, title: [100, 40], top: 200 },
  { cols: [[612, 990], [3130, 3430], [3600, 3740]], xs: [30, 438, 758], width: 920, z: 1.15, title: [60, 330], top: 560 });
const title6 = crop(s5b.push, 'c06_bg', 612, 50, 1200, 190);
const tab6 = ctable(s5b.push, { cols: T6.cols, xs: T6.xs, width: T6.width, hdr: ['c06_bg', 238, 315],
  rows: [0, 1, 2, 3, 4].map(i => 'c06_r' + i), rowY: i => 316 + i * 138, rowH: 138 });
const tint6 = css(E('div', 'hl', tab6.root), { left: 0, right: 0, top: tab6.hh, height: 138 });
const T6X = (W - T6.width * T6.z) / 2;
const t6s = (cx, cy) => [T6X + cx * T6.z, T6.top + cy * T6.z];
s5b.render = t => {
  push(s5b, t, W / 2, H / 2);
  tl(title6, T6.title[0], T6.title[1], T6.z * 1.1, ss(t, 34.2, 34.3));
  tl(tab6.root, T6X, T6.top, T6.z, 1);
  tab6.rows.forEach((r, i) => {
    if (i === 0) { lt(r, 0, 0, 1, ss(t, 34.6, 34.68) * (1 - ss(t, 36.5, 36.56))); return; }
    const ti = 34.25 + i * .06, p = sp(t, ti, 13);
    lt(r, 0, (1 - p) * 60, 1, ss(t, ti, ti + .12));
  });
  tint6.style.opacity = ss(t, 34.6, 34.68) * (1 - ss(t, 35.0, 35.9)) * .9;
  const r0 = t6s(...tab6.at(0, 0, 900, 385));
  const tx = Math.max(r0[0], CW * CS / 2 + 30);
  const inn = sp(t, 34.2, 10), out = ein(clamp((t - 36.5) / .4));
  card({ parent: s5b.push, x: lerp(lerp(-400, tx, inn), W + 500, out), y: r0[1],
    o: t < 34.62 || t >= 36.5 ? 1 : 0, sub: t < 36.5 ? 'rohan' : 'follow', tag: t < 36.5 ? 'rohan' : 'today' });
};
// 5c his follow-ups (and the card leaves to make the call)
const s5c = scene(36.9, 39.25);
E('div', 'crmbg', s5c.push);
const T5 = pick({ cols: [[612, 1150], [1520, 1950], [2540, 3000]], xs: [36, 616, 1086], width: 1576, z: 1.1, title: [110, 120], top: 340 },
  { cols: [[612, 992], [2540, 3000]], xs: [30, 440], width: 930, z: 1.15, title: [40, 520], top: 760 });
const title5 = crop(s5c.push, 'c05', 612, 160, 1560, 290);
const panel5 = E('div', 'tile', s5c.push); // the white "Upcoming Site Visits" panel around title and table
const ptitle5 = crop(s5c.push, 'c05', 640, 740, 1300, 860);
const tab5 = ctable(s5c.push, { cols: T5.cols, xs: T5.xs, width: T5.width, hdr: ['c05', 869, 943],
  rows: [0, 1, 2].map(i => 'c05_v' + i), rowY: i => 944 + i * 86, rowH: 86 });
css(tab5.root, { border: 'none', borderRadius: 0, background: 'transparent' });
const tint5 = css(E('div', 'hl', tab5.root), { left: 0, right: 0, top: tab5.hh + 172, height: 86 });
const T5X = (W - T5.width * T5.z) / 2;
const t5s = (cx, cy) => [T5X + cx * T5.z, T5.top + 130 * T5.z + cy * T5.z];
const TTODAY = wt('p09', "today's");
// the phone on the breakfast table (07 / 07b, framed close so the composited call screen reads)
const P6 = pick({ ox: 0, oy: 0, s: PS, x: 1148 * PS, y: 715 * PS, w: 340 * PS, h: 290 * PS, r: 6, ring: [1160 * PS, 650 * PS] },
  { ox: 0, oy: 0, s: PS, x: 636 * PS, y: 1230 * PS, w: 470 * PS, h: 430 * PS, r: 9.6, ring: [657 * PS, 1133 * PS] });
s5c.render = t => {
  push(s5c, t, W / 2, H / 2);
  tl(title5, T5.title[0], T5.title[1], T5.z * .95, 1);
  css(panel5, { left: T5X, top: T5.top, width: T5.width * T5.z, height: (130 + tab5.hh + 3 * 86) * T5.z, borderRadius: 30 * T5.z });
  tl(ptitle5, T5X + 6 * T5.z, T5.top + 4, T5.z, 1);
  tl(tab5.root, T5X, T5.top + 130 * T5.z, T5.z, 1);
  tab5.rows.forEach((v, i) => {
    const ti = i < 2 ? 36.95 + i * .08 : TTODAY + .08;
    lt(v, 0, (1 - sp(t, ti, 14)) * 40, 1, ss(t, ti, ti + .1) * (i === 2 ? 1 - ss(t, 38.82, 38.9) : 1));
  });
  tint5.style.opacity = ss(t, TTODAY + .08, TTODAY + .2) * (1 - ss(t, TTODAY + .4, TTODAY + 1.3)) * .9;
  const vs = t5s(...tab5.at(0, 2, 880, 1158));
  const vx = Math.max(vs[0], CW * CS / 2 + 30);
  const a = sp(t, 36.9, 10), m = sp(t, 38.82, 9), dark = ss(m, .05, .45);
  card({ parent: s5c.push, x: lerp(lerp(W + 400, vx, a), P6.x, m), y: lerp(vs[1], P6.y, m), r: lerp(0, P6.r, m),
    s: lerp(CS, 1, m), w: lerp(CW, P6.w, m), h: lerp(CH, P6.h, m), radius: lerp(22, 16, m), bg: mixc('#FFFFFF', '#141210', dark),
    border: `rgba(169,128,63,${1 - dark})`, face: 1 - ss(m, 0, .25), ring: ss(m, .2, .5),
    o: t < TTODAY + .1 || t >= 38.82 ? 1 : 0, sub: t < 38.82 ? 'follow' : 'calling', tag: 'today' });
};

// ================================================================== 6. AI calling (39.25 - 44.6)
const s6a = scene(39.25, 41.6);
PHOTO(s6a, pick('07c-morning-call-screen', '07d-morning-call-screen-tall'), P6.ox, P6.oy, P6.s);
const rings6 = [0, 1].map(() => css(E('div', 'abs', s6a.push), { width: 90, height: 90, borderRadius: '50%', border: '3px solid rgba(225,195,135,.95)' }));
const RINGT = [39.5, 40.4];
RINGT.forEach(t => cue(t, 'ring', .8));
s6a.render = t => {
  push(s6a, t, P6.x, P6.y);
  rings6.forEach((r, i) => {
    const p = clamp((t - RINGT[i]) / .8), sc = lerp(.4, 1.6, eio(p));
    r.style.transform = `translate(${P6.ring[0]}px,${P6.ring[1]}px) translate(-50%,-50%) rotate(${P6.r}deg) scale(${sc * 1.3},${sc})`;
    r.style.opacity = p > 0 && p < 1 ? (1 - p) * .9 : 0;
  });
};
const s6b = scene(41.6, 44.6);
// 16:9: real call layers at 0.64 (28 px); 9:16: the transcript set as HTML at 36 px
const L6 = pick({ card: [470, 236], call: [470, 600], cz: .45, panel: [880, 110, 927], tz: .64 },
  CAP === '1' ? { card: [540, 170], call: [540, 505], cz: .45, panel: [40, 760, 1000], tz: 0 } // clear of the caption strip
    : { card: [540, 205], call: [540, 560], cz: .45, panel: [40, 830, 1000], tz: 0 });
const callc = css(E('div', 'callcard', s6b.push), { width: 1560 * L6.cz, height: 1040 * L6.cz });
IMG(LSRC('call_top'), callc).style.width = '100%';
const TRT = [41.68, 41.86, 42.42, 42.92, 43.36];
let panel, trs, conf, PANH, CONFH;
if (!V) {
  const TRH = [136, 312, 149, 240, 159];
  PANH = (TRH.reduce((a, b) => a + b, 0) + 40) * L6.tz;
  panel = css(E('div', 'panel', s6b.push), { left: L6.panel[0], top: L6.panel[1], width: L6.panel[2], height: PANH });
  let y = 20 * L6.tz;
  trs = ['tr_head', 'tr_0', 'tr_1', 'tr_2', 'tr_3'].map((n, i) => { const e = IMG(LSRC(n), panel); e.style.width = (1448 * L6.tz) + 'px'; e.y0 = y; y += TRH[i] * L6.tz; return e; });
  conf = IMG(LSRC('call_confirmed'), s6b.push); conf.style.width = (1448 * L6.tz) + 'px'; CONFH = 232 * L6.tz;
} else {
  panel = css(E('div', 'trh', s6b.push), { left: L6.panel[0], top: L6.panel[1], width: L6.panel[2] });
  const U = [['AI assistant', '#D9B76B', 'Good morning Karan ji! Aaj 11 baje Northstar Skyline, Wakad mein aapki site visit hai. Aap aa rahe hain?'],
    ['Karan', '#8AB4F8', 'Haan, wife ke saath aa raha hoon.'], ['AI assistant', '#D9B76B', 'Badhiya! Location WhatsApp par bhej rahi hoon. Rohan aapse gate par milenge.'],
    ['Karan', '#8AB4F8', 'Thank you, milte hain.']];
  trs = [E('div', 'lt', panel, 'LIVE TRANSCRIPT')].concat(U.map(([w, c, s]) => E('div', 'u', panel, `<div class="who" style="color:${c}">${w}</div><div class="say">${s}</div>`)));
  trs.forEach(e => { e.y0 = 0; });
  conf = css(E('div', 'confh', s6b.push, `<div class="ck">${SVG.check}</div><div><div class="a">Visit confirmed</div><div class="b">Location sent on WhatsApp. Rohan notified.</div></div>`), { width: 1000 });
}
const tick = E('div', 'tick', s6b.push, SVG.check);
const TCONF = wt('p10', 'confirm');
cue(TCONF + .05, 'chime', .55);
s6b.render = t => {
  push(s6b, t, W / 2, H / 2);
  put(callc, L6.call[0], L6.call[1] + (1 - sp(t, 41.6, 10)) * 40, 1, ss(t, 41.6, 41.7));
  trs.forEach((e, i) => {
    const p = sp(t, TRT[i], 14);
    e.style.transform = `translate(0px,${e.y0 + (1 - p) * 30}px)`; e.style.opacity = ss(t, TRT[i], TRT[i] + .1);
  });
  panel.style.opacity = ss(t, 41.62, 41.72);
  panel.style.transform = `translateY(${(1 - sp(t, 41.62, 10)) * 30}px)`;
  const ph = V ? panel.offsetHeight : PANH, ch = V ? conf.offsetHeight : CONFH;
  const cp = sp(t, TCONF, 12);
  put(conf, L6.panel[0] + L6.panel[2] / 2, L6.panel[1] + ph + 22 + ch / 2 + (1 - cp) * 30, 1, ss(t, TCONF, TCONF + .1));
  card({ parent: s6b.push, x: L6.card[0], y: L6.card[1] + (1 - sp(t, 41.6, 9)) * 30, o: ss(t, 41.6, 41.72), sub: t < TCONF ? 'today' : 'confirmed', tag: 'today' });
  const tp = sp(t, TCONF + .05, 14);
  s6b.push.appendChild(tick); // above the card
  put(tick, L6.card[0] + (CW / 2 - 8) * CS, L6.card[1] - (CH / 2 - 8) * CS, CS * lerp(1.6, 1, tp), ss(t, TCONF + .05, TCONF + .15));
};

// ================================================================== 7. analytics + AI tips (44.6 - 53.4)
const s7a = scene(44.6, 46.6);
const P7 = pick({ ox: 0, oy: 0, s: PS, f: [1230 * PS, 450 * PS], z0: 1.22, z1: 2.3 }, { ox: 0, oy: 0, s: PS, f: [625 * PS, 450 * PS], z0: 1.2, z1: 1.9 });
PHOTO(s7a, pick('10c-owner-analytics-screen', '10d-owner-analytics-screen-tall'), P7.ox, P7.oy, P7.s);
s7a.render = t => {
  const back = lerp(P7.z0, 1.0, sp(Math.min(t, 45.95), 44.6, 4.5));
  setPush(s7a, P7.f[0], P7.f[1], t < 45.95 ? back : lerp(back, P7.z1, ein(clamp((t - 45.95) / .65))));
};
const s7b = scene(46.6, 53.4);
E('div', 'crmbg', s7b.push);
// the overview, re-set from its real parts: title, four KPI tiles (numbers roll old -> new), bookings by channel
const L7 = pick({ title: [110, 52, 1.0], tiles: { x: 110, y: 190, w: 400, h: 200, gap: 33, cols: 4, nz: 1.0, lz: 1.08 },
  chart: { x: 110, y: 430, w: 1700, h: 470, t: 36, s: 27, lb: 31, rowH: 76, top: 128, lw: 300, dot: 40, dx: 64, n: 34 } },
  { title: [64, 250, 1.3], tiles: { x: 60, y: 460, w: 470, h: 250, gap: 20, cols: 2, nz: 1.15, lz: 1.32 },
    chart: { x: 40, y: 1020, w: 1000, h: 580, t: 44, s: 34, lb: 38, rowH: 92, top: 156, lw: 330, dot: 46, dx: 72, n: 40 } });
const title7 = crop(s7b.push, 'c12_bg', 612, 172, 1300, 290);
const TILEX = [610, 1408, 2204, 3000];
const KPI = TILEX.map((a0, i) => {
  const T = L7.tiles, tile = E('div', 'tile', s7b.push);
  css(tile, { width: T.w, height: T.h, left: T.x + (i % T.cols) * (T.w + T.gap), top: T.y + Math.floor(i / T.cols) * (T.h + T.gap) });
  const box = css(E('div', 'crop', tile), { left: 26, top: 22, width: 300 * T.nz, height: 90 * T.nz });
  const mk = n => css(IMG(LSRC(n), box, ''), { position: 'absolute', left: 0, top: 0, width: LAY[n].w * T.nz });
  const o = mk('kpi' + i + '_old'), n = mk('kpi' + i + '_new');
  tl(crop(tile, 'c12_bg', a0 + 30, 470, a0 + 300, 515), 26, 22 + 98 * T.nz, T.lz, 1);
  return { o, n, h: 90 * T.nz };
});
const C7 = L7.chart;
const chartEl = css(E('div', 'chart', s7b.push), { left: C7.x, top: C7.y, width: C7.w, height: C7.h });
css(E('div', 't', chartEl, 'Bookings by channel'), { left: 40, top: 30, fontSize: C7.t });
css(E('div', 's', chartEl, 'This month'), { left: 40, top: 30 + C7.t * 1.3, fontSize: C7.s });
css(E('div', 'rule', chartEl), { top: C7.top - 14 });
const CHN = [['WhatsApp', 3, 4], ['Website', 1, 1], ['Google Ads', 1, 1], ['Instagram', 0, 0]];
const TW = C7.w - 4 - 80 - C7.lw - 70, BH = C7.dot; // bar track width and bar height
const chRows = CHN.map(([lb, n0, n1], i) => {
  const r = css(E('div', 'row', chartEl), { left: 40, right: 40, top: C7.top + i * C7.rowH, height: C7.rowH });
  css(E('div', 'lb', r, lb), { width: C7.lw, fontSize: C7.lb });
  const track = css(E('div', 'track', r), { width: TW, height: BH });
  const bar = css(E('div', 'bar', track), { height: BH, width: 0 });
  const n = css(E('div', 'n', track, String(n1)), { fontSize: C7.n, lineHeight: BH + 'px' });
  return { bar, n, n0, n1 };
});
const kseg = css(E('div', 'bar', chRows[0].bar.parentNode), { height: BH, left: TW * 3 / 4, width: TW / 4, background: '#1E9E57' }); // Karan's booking
const DOTXY = [C7.x + 2 + 40 + C7.lw + TW * 7 / 8, C7.y + 2 + C7.top + C7.rowH / 2]; // the centre of Karan's segment, screen px
const scrim = E('div', 'scrim', s7b.push);
// AI tips: the real card at 0.68 (29 px) in 16:9; set as HTML at 35 px in 9:16
let tipsWrap, tipRows, TIPW, TIPH, TIPS;
if (!V) {
  TIPW = 2160; TIPH = 1377; TIPS = .68;
  tipsWrap = css(E('div', 'abs', s7b.push), { width: TIPW, height: TIPH, position: 'absolute' });
  IMG(LSRC('tips'), tipsWrap);
  tipRows = [[372, 615], [617, 829], [831, 984], [984, 1160]];
} else {
  TIPW = 1000; TIPS = 1;
  tipsWrap = css(E('div', 'tipsh', s7b.push), { width: TIPW });
  const hd = E('div', 'hd', tipsWrap);
  css(crop(hd, 'tips', 192, 180, 324, 312), { position: 'relative', flex: 'none' });
  E('div', '', hd, '<div class="t">This week\'s AI tips</div><div class="s">From your leads, calls and visits · Monday 9:00 AM</div>');
  const TIPT = [['<b>WhatsApp leads book 2x more visits</b> than website forms. Move ₹10,000 of the Instagram budget to click-to-WhatsApp ads.', 474],
    ['<b>12 hot leads have no follow-up date.</b> Rohan 5, Sneha 4, Amit 3. Call them before Wednesday.', 693],
    ['<b>Sunday morning visits convert best.</b> Offer the 11 AM slot first in every chat.', 908],
    ['<b>Every lead got a reply in under 1 minute</b> this week, including 38 after 9 PM.', 1062]];
  tipRows = TIPT.map(([html, iy]) => {
    const tp = E('div', 'tp', tipsWrap);
    css(crop(tp, 'tips', 192, iy - 32, 256, iy + 32), { position: 'relative', flex: 'none', marginTop: 4 });
    E('div', '', tp, html); return tp;
  });
  E('div', 'ft', tipsWrap, 'Sample figures for illustration.');
}
const hl = E('div', 'hl', tipsWrap), hlbar = css(E('div', 'abs', tipsWrap), { width: 10, background: '#A9803F', position: 'absolute' });
const dims = [0, 2, 3].map(() => E('div', 'dim', tipsWrap));
const TLEADS = wt('p11', 'leads'), TVISITS = wt('p11', 'visits'), TBOOK = wt('p11', 'bookings'), TCHAN = wt('p11', 'channel');
const TWEEK = wt('p12', 'every'), TLOSE = wt('p12', 'losing');
const KT = [TLEADS, TVISITS, TBOOK, TCHAN];
cue(TBOOK, 'thump', .55); cue(TWEEK + .1, 'whoosh', .35);
const KCARD = pick([1340, 700], [540, 1330]);
s7b.render = t => {
  push(s7b, t, W / 2, H / 2);
  tl(title7, L7.title[0], L7.title[1], L7.title[2], 1);
  KPI.forEach((k, i) => {
    const p = sp(t, KT[i], 14);
    k.o.style.opacity = 0; // the wall screen already shows the new totals, so every counter rolls in from empty on its word
    k.n.style.transform = `translateY(${(1 - p) * k.h}px)`; k.n.style.opacity = ss(p, 0, .5);
  });
  chRows.forEach((r, i) => {
    const w = TW * r.n0 / 4 * sp(t, 46.75 + i * .1, 9);
    r.bar.style.width = w + 'px';
    const n = i === 0 && t >= TBOOK ? r.n1 : r.n0, wend = i === 0 && t >= TBOOK ? TW : w;
    r.n.textContent = String(n);
    r.n.style.left = (wend + 18) + 'px';
    r.n.style.opacity = ss(t, 46.9 + i * .1, 47.05 + i * .1);
  });
  kseg.style.opacity = t >= TBOOK - .02 ? 1 : 0;
  kseg.style.background = mixc('#1E9E57', '#B48A49', ss(t, TBOOK + .5, TBOOK + 1.4));
  // Karan's card turns green as booked, then folds into one dot
  const a = sp(t, 46.62, 9), f = sp(t, TBOOK - .42, 9), g = ss(t, 46.95, 47.25);
  if (t < TBOOK - .02) {
    card({ parent: s7b.push, x: lerp(KCARD[0], DOTXY[0], f), y: lerp(lerp(H + 150, KCARD[1], a), DOTXY[1], f),
      w: lerp(CW, TW / 4 / CS, f), h: lerp(CH, BH / CS, f), radius: lerp(22, 6 / CS, f),
      bg: mixc(mixc('#FFFFFF', '#EEF8F1', g), '#1E9E57', ss(f, .2, .7)),
      border: g > 0 ? `rgba(30,158,87,${g})` : 'rgba(169,128,63,1)', face: 1 - ss(f, .05, .35),
      sub: 'booked', tag: g > .5 ? 'booked' : 'today', avbg: mixc('#F4ECDF', '#DDF2E5', g), avfg: g > .5 ? '#17804A' : '#A9803F' });
  }
  // weekly AI tips: bigger, centred, the dashboard dimmed behind
  const tp = sp(t, TWEEK + .05, 8);
  scrim.style.opacity = .5 * ss(t, TWEEK, TWEEK + .45);
  const th = V ? tipsWrap.offsetHeight : TIPH, ts = TIPS * lerp(1, .82, sp(t, 53.05, 9)), cy = pick(520, 900);
  tipsWrap.style.transformOrigin = '0 0';
  tipsWrap.style.transform = `translate(${W / 2 - TIPW / 2 * ts}px,${lerp(H + 80, cy - th / 2 * ts, tp)}px) scale(${ts})`;
  tipsWrap.style.opacity = ss(t, TWEEK, TWEEK + .1);
  const hp = ss(t, TLOSE - .05, TLOSE + .25);
  const R = V ? tipRows.map(e => [e.offsetTop, e.offsetTop + e.offsetHeight]) : tipRows;
  const X0 = V ? 0 : 122, XW = V ? TIPW : 1916;
  css(hl, { left: X0, top: R[1][0], width: XW, height: R[1][1] - R[1][0], opacity: hp });
  css(hlbar, { left: X0, top: R[1][0], height: R[1][1] - R[1][0], opacity: hp, transform: `scaleY(${hp})` });
  [0, 2, 3].forEach((ri, k) => css(dims[k], { left: X0, top: R[ri][0], width: XW, height: R[ri][1] - R[ri][0], opacity: hp * .55 }));
};

// ================================================================== 8. white label (53.4 - 57.2)
const s8 = scene(53.4, 57.2);
const BR = [
  { c: '#CFC8BD', name: '', email: 'you@yourcompany.in', pj: ['', ''], logo: '', round: 24 },
  { c: '#A9803F', name: 'Northstar Homes', email: 'rohan@northstarhomes.in', pj: ['Northstar Skyline', 'Northstar Greens'], logo: 'NH', round: 52 },
  { c: '#1F3A5F', name: 'Skyline Developers', email: 'sales@skylinedevelopers.in', pj: ['Skyline Heights', 'Skyline One'], logo: 'SD', round: 18 },
  { c: '#2E6B4A', name: 'Greenfield Realty', email: 'team@greenfieldrealty.in', pj: ['Greenfield Meadows', 'Greenfield Park'], logo: 'GF', round: 34 },
];
const TFLIP = [53.4, wt('p13', 'name'), wt('p13', 'colours'), wt('p13', 'projects')];
TFLIP.slice(1).forEach(t => cue(t, 'tick', .55));
const sign = E('div', 'signin', s8.push);
const sbar = E('div', 'bar', sign);
const rolls = [];
function roll(x, y, w, h, fill, delay) {
  const r = css(E('div', 'roll', sign), { left: x, top: y, width: w, height: h });
  rolls.push({ kids: BR.map((b, i) => { const k = E('div', '', r); fill(k, b, i); return k; }), delay });
}
roll(56, 72, 104, 104, (k, b) => { k.className = 'logo'; k.style.background = b.c; k.style.borderRadius = b.round + 'px'; k.textContent = b.logo; }, 0);
roll(184, 78, 420, 50, (k, b, i) => {
  if (i === 0) k.innerHTML = '<div style="margin-top:10px;width:270px;height:30px;border-radius:8px;background:#EEE9E1"></div>';
  else { k.className = 'bn'; k.textContent = b.name; }
}, .03);
css(E('div', 'bs', sign, 'Sales CRM'), { position: 'absolute', left: 184, top: 134 });
E('div', 'lbl', sign, 'WORK EMAIL').style.top = '228px';
E('div', 'fld', sign).style.top = '262px';
roll(78, 262, 500, 68, (k, b) => { k.className = 'fv'; k.style.left = '0'; k.textContent = b.email; }, .06);
E('div', 'lbl', sign, 'PASSWORD').style.top = '358px';
E('div', 'fld', sign, '<div class="fv">••••••••••</div>').style.top = '392px';
roll(56, 498, 528, 78, (k, b) => { k.className = 'btn'; k.style.background = b.c; k.textContent = 'Sign in'; }, .09);
E('div', 'lbl', sign, 'YOUR PROJECTS').style.top = '610px';
roll(56, 646, 528, 58, (k, b, i) => {
  k.innerHTML = '<div class="pj">' + b.pj.map(p => i === 0 ? '<span style="width:200px;height:42px;background:#F1EDE6"></span>' :
    `<span style="background:${mixc(b.c, '#FFFFFF', .88)};color:${b.c}">${p}</span>`).join('') + '</div>';
}, .12);
const brandAt = t => { let b = 0; for (let i = 1; i < 4; i++) if (t >= TFLIP[i]) b = i; return b; };
const L8 = pick({ x: 960, y: 510, s: 1.15 }, { x: 540, y: 880, s: 1.5 });
s8.render = t => {
  push(s8, t, L8.x, L8.y, 1, 1.04);
  put(sign, L8.x, L8.y, L8.s * lerp(.86, 1, sp(t, 53.4, 11)), 1);
  // the leaving brand travels a little past the clip so no hairline of it stays behind
  rolls.forEach(rl => rl.kids.forEach((k, i) => {
    let y;
    if (i === 0) y = -1.05 * sp(t, TFLIP[1] + rl.delay, 16);
    else if (t < TFLIP[i]) y = 1.05;
    else { y = 1.05 * (1 - sp(t, TFLIP[i] + rl.delay, 16)); if (i < 3) y -= 1.05 * sp(t, TFLIP[i + 1] + rl.delay, 16); }
    k.style.transform = `translateY(${y * 100}%)`;
  }));
  const b = brandAt(t), wp = sp(t, TFLIP[b], 12), prev = BR[Math.max(0, b - 1)].c;
  sbar.style.background = `linear-gradient(90deg,${BR[b].c} ${wp * 100}%,${prev} ${wp * 100}%)`;
};

// ================================================================== 9. close (57.2 - 66.3)
const s9 = scene(57.2, END);
const L9 = pick({ logo: [960, 168, 620], fr: [960, 512, 700, 400], cta: 806, url: [960, 896, 470, 68], cs: 1 },
  { logo: [540, 330, 780], fr: [540, 860, 900, 640], cta: 1300, url: [540, 1428, 600, 92], cs: 1.28 });
const fold9 = css(E('div', 'abs', s9.push), { background: '#fff', borderRadius: 30, position: 'absolute' });
const frame = E('div', 'frame', s9.push);
IMG('../gen/photos/09-handshake-keys.jpg', frame);
const lock = E('div', 'abs', s9.push);
IMG('../assets/brand/golden-ratio-horizontal-gold-2400w.png', lock, '').style.width = L9.logo[2] + 'px';
css(lock, { left: L9.logo[0] - L9.logo[2] / 2, top: L9.logo[1] - L9.logo[2] * 795 / 2400 / 2 });
const cta = css(E('div', 'cta', s9.push), { top: L9.cta - 32 * L9.cs, transform: `scale(${L9.cs})`, transformOrigin: '50% 0' });
const ctaws = TM[13].words.slice(2, 6).map(w => Object.assign(E('span', 'w' + (w.em ? ' serif gold' : ''), cta, w.w), { t: w.t }));
const url = css(E('div', 'url', s9.push, 'goldenratiosolution.com'), { width: L9.url[2], height: L9.url[3], fontSize: 30 * L9.cs });
const TGR9 = wt('p14', 'golden'), TDEMO = wt('p14', 'demo');
cue(TGR9 + .03, 'impact', .55); cue(TDEMO + .02, 'thump', .45);
s9.render = t => {
  push(s9, t, W / 2, H / 2, 1, 1.04, 57.2, 63.3);
  // sign-in card folds back into Karan's lead card, which opens into the keys photo
  const f = sp(t, 57.2, 11);
  if (t < 57.5) {
    fold9.style.display = 'block'; frame.style.display = 'none';
    put(fold9, L8.x, L8.y, L8.s, 1);
    css(fold9, { width: lerp(640, CW * CS / L8.s, f), height: lerp(760, CH * CS / L8.s, f), boxShadow: '0 30px 80px rgba(26,23,18,.14)' });
  } else {
    fold9.style.display = 'none';
    const g = sp(t, 57.62, 8);
    const fw = lerp(CW * CS, L9.fr[2], g), fh = lerp(CH * CS, L9.fr[3], g), fx = lerp(L8.x, L9.fr[0], g), fy = lerp(L8.y, L9.fr[1], g);
    frame.style.display = 'block';
    css(frame, { width: fw, height: fh, borderRadius: lerp(22, 30, g) });
    put(frame, fx, fy, 1, ss(t, 57.62, 57.7));
    if (g < .6) card({ parent: s9.push, x: fx, y: fy, s: 1, w: fw, h: fh, face: 1 - ss(g, 0, .3), o: 1 - ss(g, .25, .45), sub: 'booked', tag: 'booked',
      border: 'rgba(30,158,87,1)', bg: '#EEF8F1', avbg: '#DDF2E5', avfg: '#17804A' });
  }
  const lp = sp(t, TGR9, 4.5);
  lock.style.clipPath = `inset(-5% ${(1 - lp) * 100}% -5% 0)`; lock.style.opacity = ss(t, TGR9 - .05, TGR9 + .2);
  ctaws.forEach(w => { w.style.opacity = ss(t, w.t - .02, w.t + .1); w.style.transform = `translateY(${(1 - sp(t, w.t, 16)) * 20}px)`; });
  const up = sp(t, TDEMO, 13);
  put(url, L9.url[0], L9.url[1] - (1 - up) * 34, lerp(1.05, 1, up), ss(t, TDEMO, TDEMO + .1));
};

// ================================================================== captions
const caps = E('div', ''); caps.id = 'caps';
const capP = E('div', 'cp', caps);
const CSZ = pick({ font: 40, bottom: 48, pad: '14px 34px', max: 1560 }, { font: 46, bottom: 130, pad: '18px 36px', max: 980 });
css(capP, { font: `500 ${CSZ.font}px Inter`, padding: CSZ.pad, maxWidth: CSZ.max, lineHeight: '1.25', columnGap: '.28em' });
caps.style.bottom = CSZ.bottom + 'px';
const CUTS = SURF.map(s => s[0]).slice(1);
const SEGS = []; // caption segments: a line's words split at cuts; each segment ends at the next cut
TM.forEach(line => {
  let seg = null;
  line.words.forEach(w => {
    const cutBefore = seg && CUTS.some(c => c <= w.t && c > seg.words[seg.words.length - 1].t);
    if (!seg || cutBefore) { seg = { words: [] }; SEGS.push(seg); }
    seg.words.push(w);
  });
});
SEGS.forEach((s, i) => {
  const a = s.words[0].t, last = s.words[s.words.length - 1];
  const cut = CUTS.find(c => c > a) ?? END, nxt = i + 1 < SEGS.length ? SEGS[i + 1].words[0].t : END;
  s.a = a - .04; s.b = Math.min(cut, nxt, last.t + last.d + .6);
});
// no full stops on screen
const capEls = SEGS.map(s => s.words.map(w => {
  const e = document.createElement('span'); e.className = 'cw' + (w.em ? ' em' : ''); e.textContent = w.w.replace(/\.$/, '');
  if (w.em) e.style.fontSize = (CSZ.font * 1.2) + 'px';
  return e;
}));
function captions(t) {
  if (CAP === '0') { caps.style.display = 'none'; return; }
  const i = SEGS.findIndex(s => t >= s.a && t < s.b);
  if (i < 0) { caps.style.display = 'none'; return; }
  caps.style.display = 'flex';
  caps.className = 'on-' + SURF.find(s => t >= s[0] && t < s[1])[2];
  const els = capEls[i];
  if (capP.dataset.seg !== String(i)) { capP.replaceChildren(...els); capP.dataset.seg = i; }
  SEGS[i].words.forEach((w, k) => {
    els[k].style.display = t >= w.t - .02 ? 'inline-block' : 'none';
    els[k].style.opacity = ss(t, w.t - .02, w.t + .06);
  });
  capP.style.borderRadius = capP.offsetHeight > CSZ.font * 2 ? '28px' : '999px';
}

// ================================================================== seek
let readyRes; window.ready = new Promise(r => { readyRes = r; });
window.seek = async t => {
  t = clamp(t, 0, END - 1e-4);
  noCard(); // each scene that shows the card sets it again, so nothing carries over from the last frame
  for (const s of SC) {
    const on = t >= s.a && t < s.b;
    s.root.style.display = on ? 'block' : 'none';
    if (on) s.render(t);
  }
  clock(t);
  stage.appendChild(OV); stage.appendChild(caps);
  captions(t);
  // every image in the frame is decoded before the screenshot
  for (const i of IMGS) {
    if (!i.isConnected || !i.offsetParent) continue;
    for (let k = 0; k < 3; k++) { try { await i.decode(); break; } catch (e) { if (k === 2) console.error('decode', i.src); await new Promise(r => requestAnimationFrame(r)); } }
  }
  return t;
};
window.CUES = CUES;
window.CUTS = SC.map(s => s.a).concat([END]); // scene boundaries: motion-blur subframes never cross them
window.CAPSEGS = SEGS.map(s => ({ a: s.a, b: s.b, text: s.words.map(w => w.w).join(' ') }));
window.FILM = { W, H, END, SHAPE };
(async () => {
  await document.fonts.ready;
  if (V) { // 9:16: the two Inter lines of the question share the largest size (72 px at most) that fits the frame
    s1.root.style.display = 'block';
    const width = l => { const r = document.createRange(); r.selectNodeContents(l); return r.getBoundingClientRect().width; };
    const k = Math.min(1, ...qlines.slice(0, 2).map(l => (W - 80) / width(l)));
    qlines.slice(0, 2).forEach(l => { l.style.fontSize = (72 * k).toFixed(1) + 'px'; });
    s1.root.style.display = 'none';
  }
  await Promise.all(IMGS.map(i => i.complete && i.naturalWidth ? 0 : new Promise(res => {
    i.addEventListener('load', res, { once: true }); i.addEventListener('error', () => { console.error('load', i.src); res(); }, { once: true });
  })));
  await window.seek(0);
  readyRes(true);
})();
})();
