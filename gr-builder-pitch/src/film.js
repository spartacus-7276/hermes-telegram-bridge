/* Golden Ratio builder pitch: one lead, never lost.
 * Every style is computed from time inside window.seek(t): no CSS animation, no timers, no randomness, no state
 * carried between frames, so any frame renders on its own.
 * Shape comes from <html data-shape="16x9|9x16">; ?captions=1 adds captions, ?captions=only renders captions alone. */
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

// ------------------------------------------------------------------ math
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, p) => a + (b - a) * p;
// critically damped spring step response (no overshoot), k = natural frequency
const sp = (t, t0, k = 12) => { const d = t - t0; return d <= 0 ? 0 : 1 - (1 + k * d) * Math.exp(-k * d); };
const ss = (t, a, b) => { const x = clamp((t - a) / (b - a)); return x * x * (3 - 2 * x); };
const eio = x => (x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const ein = x => x * x * x;
const mixc = (c1, c2, p) => { // hex colours
  const a = [1, 3, 5].map(i => parseInt(c1.slice(i, i + 2), 16)), b = [1, 3, 5].map(i => parseInt(c2.slice(i, i + 2), 16));
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
// centred transform
function put(e, x, y, s = 1, o = 1, r = 0) {
  e.style.transform = `translate(${x}px,${y}px) translate(-50%,-50%) rotate(${r}deg) scale(${s})`;
  e.style.opacity = o;
}
// layer image at its own sheet coordinates
function LI(name, parent) {
  const m = LAY[name]; if (!m) throw new Error('layer ' + name);
  const e = E('img', 'lay', parent); e.decoding = 'sync'; e.src = '../gen/' + m.src; e.m = m;
  Object.assign(e.style, { left: m.x + 'px', top: m.y + 'px', width: m.w + 'px', height: m.h + 'px' });
  IMGS.push(e); return e;
}
function IMG(src, parent, cls = 'abs') { const e = E('img', cls, parent); e.decoding = 'sync'; e.src = src; IMGS.push(e); return e; }
// offset a layer from its home position (sheet px), scaling about its own origin
function lt(e, dx = 0, dy = 0, s = 1, o = 1, origin = 'center') {
  e.style.transformOrigin = origin;
  e.style.transform = `translate(${dx}px,${dy}px) scale(${s})`; e.style.opacity = o;
}
function sheet(parent, w, h) { const d = E('div', 'sheet', parent); d.style.width = w + 'px'; d.style.height = h + 'px'; return d; }
function cam(d, cx, cy, z, dx = 0, dy = 0) { d.style.transform = `translate(${W / 2 - cx * z + dx}px,${H / 2 - cy * z + dy}px) scale(${z})`; }
const toS = (c, x, y) => [W / 2 + (x - c.cx) * c.z, H / 2 + (y - c.cy) * c.z];

const SVG = {
  wa: '<svg viewBox="0 0 24 24" fill="#fff"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.6.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.9 11.9 0 0 0 4.6 4c1.7.7 2.4.8 3.2.7.5-.1 1.5-.6 1.8-1.2s.2-1.1.2-1.2-.2-.2-.4-.3z"/></svg>',
  missed: '<svg class="mi" viewBox="0 0 24 24"><path d="M19 5 7.5 16.5M7 9v8h8" stroke="#D93A3A" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  check: '<svg viewBox="0 0 24 24"><path d="M5 12.5l4.2 4.2L19 7" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  clock: '<svg class="ic" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" stroke="#fff" stroke-width="1.8" fill="none"/><path d="M12 7v5l3.2 2" stroke="#fff" stroke-width="1.8" fill="none" stroke-linecap="round"/></svg>',
  cursor: '<svg viewBox="0 0 28 34" width="34" height="41"><path d="M2 2v26l7-6.5 4.6 10 4.4-2-4.6-9.8H23z" fill="#1A1712" stroke="#fff" stroke-width="2" stroke-linejoin="round"/></svg>',
  phone: '<svg viewBox="0 0 24 24" width="20" height="20"><path d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1z" fill="#A9803F"/></svg>',
  cal: '<svg viewBox="0 0 24 24" width="20" height="20"><rect x="3.5" y="5" width="17" height="15" rx="3" stroke="#A9803F" stroke-width="1.8" fill="none"/><path d="M8 3v4M16 3v4M3.5 10h17" stroke="#A9803F" stroke-width="1.8"/></svg>',
  wag: '<svg viewBox="0 0 24 24" width="20" height="20" fill="#25D366"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2z"/></svg>',
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
const CARD = E('div', 'lead');
const CF = E('div', 'face', CARD);
const CAV = E('div', 'av', CF, 'KM');
const CTX = E('div', 'tx', CF);
const CNM = E('div', 'nm', CTX, 'Karan Mehta');
const CSB = E('div', 'sb', CTX);
const CTG = E('div', 'tg', CF);
const CPILL = E('div', 'pill', CARD, SVG.wa + 'Instant reply on WhatsApp');
const CRING = E('div', 'ringf', CARD, '<div class="nh">NH</div><div><div class="rn">Northstar Homes</div><div class="rs">AI assistant · Incoming call</div></div>');
const SUBS = {
  missed: [SVG.missed.replace('class="mi"', 'width="20" height="20"'), 'Missed call · 10:40 PM'],
  noreply: [SVG.missed.replace('class="mi"', 'width="20" height="20"'), 'Missed call · no reply yet'],
  enquiry: [SVG.wag, 'Enquiry · Northstar Skyline'],
  rohan: [SVG.cal, 'Assigned to Rohan Kulkarni'],
  follow: [SVG.cal, 'Site visit · Sun 11:00 AM'],
  calling: [SVG.phone, 'AI calling · visit reminder'],
  today: [SVG.cal, 'Site visit today · 11:00 AM'],
  confirmed: [SVG.cal, 'Visit confirmed · 11:00 AM'],
  booked: [SVG.cal, 'Northstar Skyline · 2 BHK'],
};
const TAGS = { none: null, ai: ['AI qualified', '#FBF3E4', '#8A6528'], rohan: ['Rohan', '#FBF3E4', '#8A6528'],
  booked: ['Booked', '#E3F6EA', '#17804A'], today: ['Today', '#FBF3E4', '#8A6528'] };
let cardParent = null;
function card(p) {
  const par = p.parent; if (cardParent !== par || CARD.parentNode !== par) { par.appendChild(CARD); cardParent = par; }
  CARD.style.display = 'block';
  const w = p.w ?? 440, h = p.h ?? 116;
  CARD.style.width = w + 'px'; CARD.style.height = h + 'px';
  CARD.style.borderRadius = (p.radius ?? 22) + 'px';
  CARD.style.background = p.bg ?? '#fff';
  CARD.style.borderColor = p.border ?? 'rgba(169,128,63,1)';
  const sh = p.shadow ?? 1;
  CARD.style.boxShadow = `0 ${14 * sh}px ${34 * sh}px rgba(26,23,18,${.13 * sh}),0 2px 6px rgba(26,23,18,${.06 * sh})`;
  put(CARD, p.x, p.y, p.s ?? 1, p.o ?? 1, p.r ?? 0);
  CF.style.opacity = p.face ?? 1;
  const sub = SUBS[p.sub || 'missed']; CSB.innerHTML = sub[0] + '<span>' + sub[1] + '</span>';
  const tg = TAGS[p.tag || 'none'];
  if (tg) { CTG.style.display = 'block'; CTG.textContent = tg[0]; CTG.style.background = tg[1]; CTG.style.color = tg[2]; } else CTG.style.display = 'none';
  CAV.style.background = p.avbg ?? '#F4ECDF'; CAV.style.color = p.avfg ?? '#A9803F';
  CPILL.style.opacity = p.pill ?? 0;
  CRING.style.opacity = p.ring ?? 0;
}
function noCard() { CARD.style.display = 'none'; }

// ================================================================== 1. hook (0 - 5.2)
const s1 = scene(0, 5.2);
const PH1 = pick({ w: 500, h: 1040, x: 710, y: 92, rows: 232 }, { w: 640, h: 1330, x: 220, y: 560, rows: 250 });
const mph = E('div', 'mphone', s1.push);
Object.assign(mph.style, { width: PH1.w + 'px', height: PH1.h + 'px', left: PH1.x + 'px', top: PH1.y + 'px' });
const mscr = E('div', 'scr', mph); E('div', 'notch', mscr); E('div', 'hd', mscr, 'Recents');
E('div', 'tabs', mscr, '<span>All</span><span class="on">Missed</span>');
const mrows = E('div', 'abs', mscr); Object.assign(mrows.style, { left: 0, right: 0, top: PH1.rows + 'px', bottom: 0, overflow: 'hidden', position: 'absolute' });
const MISSED = ['6:05 PM', '6:48 PM', '7:20 PM', '7:52 PM', '8:31 PM', '9:04 PM', '9:37 PM', '10:12 PM', '10:40 PM'];
const RH = 86;
const ROWT = MISSED.map((_, k) => 0.5 + 0.5 * k);
const mrowEls = MISSED.map((tm, k) => {
  const r = E('div', 'mrow', mrows);
  const who = k === 8 ? '+91 98765 43210' : '+91 98…';
  r.innerHTML = `${SVG.missed}<div class="mn">${who}<span class="ms">Missed call · Mobile</span></div><div class="mt">${tm}</div>`;
  return r;
});
ROWT.forEach(t => cue(t, 'tick', .8));
// the question, two lines, typed at the word times
const QW = TM[0].words;
const qlines = [E('div', 'q', s1.push), E('div', 'q', s1.push)];
const QY = pick([470, 582], [470, 590]);
qlines.forEach((l, i) => { l.style.top = (QY[i] - 50) + 'px'; });
const QSPLIT = pick(6, 4); // words before the line break
const qws = QW.map((w, i) => {
  const line = qlines[i < QSPLIT ? 0 : 1];
  const serif = i >= 11;
  return Object.assign(E('span', 'w' + (serif ? ' serif gold' : ''), line, w.w), { t: w.t });
});
if (V) { // 9:16: three lines
  qlines.push(E('div', 'q', s1.push)); qlines[2].style.top = (650 - 50) + 'px';
}
s1.render = t => {
  push(s1, t, W / 2, H / 2);
  const po = lerp(.16, 1, ss(t, 4.45, 4.85));
  mph.style.opacity = po;
  mph.style.transform = `translateY(${lerp(18, 0, sp(t, 4.4, 9))}px)`;
  MISSED.forEach((_, k) => {
    let y = 0; for (let j = k + 1; j < MISSED.length; j++) y += sp(t, ROWT[j], 16) * RH;
    y -= (1 - sp(t, ROWT[k], 16)) * RH * .7;
    const o = ss(t, ROWT[k] - .02, ROWT[k] + .12) * (k === 8 ? 1 - ss(t, 4.62, 4.72) : 1);
    mrowEls[k].style.transform = `translateY(${y}px)`; mrowEls[k].style.opacity = o;
  });
  qws.forEach((w, i) => {
    const ex = ss(t, 4.48 + i * .012, 4.78 + i * .012);
    const o = ss(t, w.t - .02, w.t + .1) * (1 - ex);
    const dy = (1 - sp(t, w.t, 20)) * 18 - ex * 36;
    w.style.opacity = o; w.style.transform = `translateY(${dy}px)`;
  });
  // Karan's row lifts off and becomes the lead object
  if (t >= 4.62) {
    const p = sp(t, 4.62, 8.5);
    const rx = PH1.x + PH1.w / 2, ry = PH1.y + 14 + PH1.rows + RH / 2;
    card({ parent: s1.push, x: rx, y: lerp(ry, pick(560, 980), p), w: lerp(PH1.w - 28, 440, p), h: lerp(RH, 116, p),
      radius: lerp(0, 22, p), border: `rgba(169,128,63,${p})`, shadow: p, face: ss(t, 4.62, 4.78), s: lerp(1, 1, p) });
  }
};

// ================================================================== 2. problem (5.2 - 11.8)
const s2a = scene(5.2, 7.7);
const PHOTO = (scn, name, ox, oy, sc) => {
  const e = IMG('../gen/photos/' + name + '.jpg', scn.push);
  Object.assign(e.style, { left: ox + 'px', top: oy + 'px', width: (1536 * sc) + 'px' });
  return e;
};
const P2 = pick({ ox: 0, oy: -100, s: 1.25, phx: 1100, phy: 500 }, { ox: -120, oy: 0, s: 1.25, phx: 640, phy: 470 });
PHOTO(s2a, pick('02-buyer-sofa', '02b-buyer-sofa-tall'), P2.ox, P2.oy, P2.s);
// the clock sits top-left over both halves of the scene
const OV = E('div', 'abs'); OV.style.width = W + 'px'; OV.style.height = H + 'px'; OV.style.position = 'absolute';
const clockEl = E('div', 'clock', OV, SVG.clock); clockEl.style.left = pick(72, 64) + 'px'; clockEl.style.top = pick(64, 120) + 'px';
const digits = E('div', 'digits', clockEl); digits.style.width = '290px';
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
  push(s2a, t, P2.phx, P2.phy);
  const p = sp(t, 5.2, 6.5);
  card({ parent: s2a.push, x: lerp(W / 2, P2.phx, p), y: lerp(pick(560, 980), P2.phy - 10, p), s: lerp(1, .08, p),
    o: 1 - ss(t, 5.62, 5.82), sub: 'missed' });
};
const s2b = scene(7.7, 11.8);
s2b.root.style.background = '#1A1712';
const comps = ['Called back · 7:55 AM', 'WhatsApp reply · 8:03 AM', 'Site visit offered · 8:10 AM'].map((sb, i) => {
  const c = E('div', 'comp', s2b.push, `<div class="av">B${i + 1}</div><div><div class="nm">Another builder</div><div class="sb">${sb}</div></div>`);
  return c;
});
const T3 = wt('p03', 'three');
s2b.render = t => {
  push(s2b, t, W / 2, H / 2);
  const C2 = pick({ cx: 960, cy: 540, kx: 300, cmp: [[1040, 450], [1090, 540], [1140, 630]], from: 2350 },
    { cx: 540, cy: 960, kx: 250, cmp: [[600, 870], [640, 960], [680, 1050]], from: 1500 });
  comps.forEach((c, i) => {
    const p = sp(t, T3 + i * .15, 8);
    put(c, lerp(C2.from, C2.cmp[i][0], p), C2.cmp[i][1], 1, ss(t, T3 + i * .15, T3 + i * .15 + .1));
  });
  const a = sp(t, 7.7, 9), b = sp(t, T3 + .1, 5.5);
  card({ parent: s2b.push, x: lerp(lerp(P2.phx, C2.cx, a), C2.kx, b), y: lerp(P2.phy - 10, C2.cy, a), s: lerp(.08, 1, a),
    sub: 'noreply', shadow: 0 });
};

// ================================================================== 3. promise (11.8 - 17.2)
const s3 = scene(11.8, 17.2);
const L3 = pick({ logo: [960, 300, 820], ch: [470, 1450], cy: 700, card0: [300, 540] },
  { logo: [540, 560, 760], ch: [250, 830], cy: 1120, card0: [250, 960] });
const logoBox = E('div', 'abs', s3.push);
const logoImg = IMG('../assets/brand/golden-ratio-horizontal-gold-2400w.png', logoBox, '');
logoImg.style.width = L3.logo[2] + 'px';
Object.assign(logoBox.style, { left: (L3.logo[0] - L3.logo[2] / 2) + 'px', top: (L3.logo[1] - L3.logo[2] * 795 / 2400 / 2) + 'px' });
const svg3 = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
svg3.setAttribute('width', W); svg3.setAttribute('height', H); svg3.style.position = 'absolute'; svg3.style.left = 0; svg3.style.top = 0;
s3.push.appendChild(svg3);
const thread = document.createElementNS('http://www.w3.org/2000/svg', 'path');
thread.setAttribute('fill', 'none'); thread.setAttribute('stroke', '#A9803F'); thread.setAttribute('stroke-width', pick(3.5, 4));
thread.setAttribute('stroke-linecap', 'round'); svg3.appendChild(thread);
const chipA = E('div', 'chip', s3.push, '<i></i>Enquiry'), chipB = E('div', 'chip', s3.push, '<i></i>Site visit');
const TGR = wt('p04', 'golden'), TGAP = wt('p04', 'gap'), TENQ = wt('p04', 'enquiry'), TSITE = wt('p04', 'site'), TVIS = wt('p04', 'visit');
cue(TGR, 'impact', .6); cue(TVIS + .02, 'thump', .7);
s3.render = t => {
  push(s3, t, W / 2, L3.cy);
  // the logo draws in left to right
  const lp = sp(t, TGR, 4.2);
  logoBox.style.clipPath = `inset(-5% ${(1 - lp) * 100}% -5% 0)`;
  logoBox.style.opacity = ss(t, TGR - .05, TGR + .2);
  const ca = sp(t, TGAP, 11), cb = sp(t, TGAP + .12, 11);
  put(chipA, L3.ch[0], L3.cy, lerp(.9, 1, ca), ss(t, TGAP, TGAP + .15));
  put(chipB, L3.ch[1], L3.cy, lerp(.9, 1, cb), ss(t, TGAP + .12, TGAP + .27));
  chipA.firstChild.style.background = mixc('#D8D1C5', '#A9803F', ss(t, TENQ, TENQ + .15));
  chipB.firstChild.style.background = mixc('#D8D1C5', '#A9803F', ss(t, TSITE, TSITE + .15));
  const x0 = L3.ch[0] + chipA.offsetWidth / 2, x1 = L3.ch[1] - chipB.offsetWidth / 2;
  const sag = pick(150, 120) * (1 - sp(t, TSITE + .1, 11));
  thread.setAttribute('d', `M${x0} ${L3.cy} Q${(x0 + x1) / 2} ${L3.cy + 2 * sag} ${x1} ${L3.cy}`);
  const len = thread.getTotalLength();
  const draw = sp(t, TGAP + .15, 6);
  thread.style.strokeDasharray = `${len} ${len}`; thread.style.strokeDashoffset = (1 - draw) * len;
  // Karan's card: from the frame edge onto the Enquiry chip, then snaps to the middle of the thread
  const a = sp(t, 11.8, 7), b = sp(t, TVIS, 13);
  const ax = lerp(L3.card0[0], L3.ch[0], a), ay = lerp(L3.card0[1], L3.cy - pick(140, 150), a);
  const m = sp(t, 16.78, 13); // becomes the WhatsApp button
  const BT = pick([1160, 531, .36], [636, 1010, .5]);
  card({ parent: s3.push, x: lerp(lerp(ax, (x0 + x1) / 2, b), BT[0], m), y: lerp(lerp(ay, L3.cy, b), BT[1], m),
    s: lerp(1, BT[2], m), w: lerp(440, 520, m), h: lerp(116, 96, m), radius: lerp(22, 48, m),
    bg: mixc('#FFFFFF', '#25D366', ss(m, .1, .5)), border: `rgba(169,128,63,${1 - ss(m, .1, .5)})`,
    face: 1 - ss(m, .05, .35), pill: ss(m, .35, .7), sub: 'enquiry', tag: 'ai' });
};

// ================================================================== 4. WhatsApp AI (17.2 - 27.6)
const s4a = scene(17.2, 19.6);
const P4 = pick({ ox: 0, oy: -100, s: 1.25, fx: 1195, fy: 394, tap: [1160, 531] }, { ox: -150, oy: -60, s: 1.25, fx: 590, fy: 750, tap: [580, 900] });
PHOTO(s4a, pick('03-thumb-tap', '03b-thumb-tap-tall'), P4.ox, P4.oy, P4.s);
const ring4 = E('div', 'abs', s4a.push);
Object.assign(ring4.style, { width: '60px', height: '60px', borderRadius: '50%', border: '3px solid rgba(255,255,255,.9)' });
s4a.render = t => {
  // slow push, then into the phone
  const z = t < 19.0 ? push(s4a, t, P4.fx, P4.fy, 1, 1.04, 17.2, 19.0) : (setPush(s4a, P4.fx, P4.fy, lerp(1.04, 3.0, ein(clamp((t - 19.0) / .6)))), 0);
  const rp = clamp((t - 17.42) / .45);
  put(ring4, P4.tap[0], P4.tap[1], lerp(.3, 1.6, eio(rp)), rp > 0 && rp < 1 ? (1 - rp) * .9 : 0);
  noCard();
};
cue(17.42, 'pop', .6);

const s4b = scene(19.6, 27.6);
const WZ = pick(.55, .66);
const WTOP = pick(40, 120);
const WSH = (H - WTOP * 2) / WZ - 52; // screen height in sheet px
const waph = E('div', 'waphone', s4b.push);
const wascr = E('div', 'scr', waph); wascr.style.height = WSH + 'px';
LI('wa_head', wascr);
const chat = E('div', 'chat', wascr); chat.style.top = '376px'; chat.style.height = (WSH - 376 - 200) + 'px';
const foot = LI('wa_foot', wascr); foot.style.top = (WSH - 200) + 'px';
const col = E('div', 'col', chat);
const CHATH = WSH - 376 - 200;
const OFF2 = (2410 - 376) + 24 - (402 - 376); // chat 02 continues under chat 01
const BUB = [
  ['wa_today', 19.66, 0], ['wa_k1', 19.74, 0], ['wa_ai1', wt('p05', 'night') - .1, 0], ['wa_opts', wt('p06', 'prices'), 0],
  ['wa_pdf', wt('p06', 'brochure'), OFF2], ['wa_aiq', wt('p06', 'answers'), 0], ['wa_k2', wt('p06', 'hinglish'), 0],
  ['wa_aislot', 25.48, OFF2], ['wa_slots', 25.6, OFF2], ['wa_ksun', 25.82, OFF2], ['wa_done', wt('p06', 'books'), OFF2],
].map(([n, t, off]) => {
  const e = LI(n, col); const m = e.m; const y = m.y - 376 + off - (n === 'wa_aiq' || n === 'wa_k2' ? 0 : 0);
  e.style.top = y + 'px';
  return { e, t, y, h: m.h, right: m.x > 400, n };
});
// AI question and Karan's Hinglish reply sit after the brochure in the film's order: move them below it
(() => {
  const by = n => BUB.find(b => b.n === n);
  const pdf = by('wa_pdf'), aiq = by('wa_aiq'), k2 = by('wa_k2');
  const opts = by('wa_opts');
  pdf.y = opts.y + opts.h + 6; aiq.y = pdf.y + pdf.h + 2; k2.y = aiq.y + aiq.h + 2;
  let y = k2.y + k2.h + 4;
  for (const n of ['wa_aislot', 'wa_slots', 'wa_ksun', 'wa_done']) { const b = by(n); b.y = y; y += b.h - (n === 'wa_ksun' ? 14 : 2); }
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
const WX = W / 2 - (1560 + 52) * WZ / 2;
function waPhoneZ(t) { return lerp(1, 1.04, eio(clamp((t - 19.6) / 8))); }
// screen rect of the "booked" bubble (used by the hand-off into the CRM)
function doneRect(t) {
  const b = BUB[BUB.length - 1], z = waPhoneZ(t), sc = chatScroll(t);
  const x0 = WX + (26 + b.e.m.x) * WZ, y0 = WTOP + (26 + 376 + b.y - sc) * WZ;
  const cx = x0 + b.e.m.w * WZ / 2, cy = y0 + b.h * WZ / 2;
  return { x: W / 2 + (cx - W / 2) * z, y: H / 2 + (cy - H / 2) * z, w: b.e.m.w * WZ * z, h: b.h * WZ * z };
}
s4b.render = t => {
  setPush(s4b, W / 2, H / 2, waPhoneZ(t));
  waph.style.transform = `translate(${WX}px,${WTOP}px) scale(${WZ})`;
  col.style.transform = `translateY(${-chatScroll(t)}px)`;
  BUB.forEach(b => {
    const p = sp(t, b.t, 16);
    const lift = b.n === 'wa_done' ? ss(t, 27.1, 27.6) : 0;
    lt(b.e, 0, (1 - p) * 40 - lift * 20, lerp(.94, 1, p) * (1 + lift * .05), ss(t, b.t - .02, b.t + .08),
      b.right ? '100% 100%' : '0% 100%');
  });
  noCard();
};

// ================================================================== 5. CRM (27.6 - 39.25)
// 5a admin list
const s5a = scene(27.6, 34.2);
const C5A = pick({ cx: 1770, cy: 1640, z: .74 }, { cx: 1500, cy: 1560, z: .7 });
const sh2 = sheet(s5a.push, 3840, 2400);
LI('c02_bg', sh2);
const R2 = [...Array(9).keys()].map(i => LI('c02_r' + i, sh2));
const R2B = LI('c02b_karan', sh2), DD = LI('c02b_dd', sh2);
const tint2 = E('div', 'hl', sh2); Object.assign(tint2.style, { left: '612px', top: '1470px', width: '3145px', height: '130px' });
const leadImg = E('div', 'abs', s5a.push); Object.assign(leadImg.style, { width: '1920px', height: '1206px', position: 'absolute' });
IMG('../gen/' + LAY.lead_card.src, leadImg).style.width = '1920px';
// "with the whole conversation": a gold rule draws round the card's AI chat summary
const sumBox = E('div', 'abs', leadImg);
Object.assign(sumBox.style, { left: '180px', top: '753px', width: '1560px', height: '279px', border: '5px solid #A9803F', borderRadius: '30px', position: 'absolute' });
const xfer = IMG('../gen/' + LAY.wa_done.src, s5a.push);
const cursor = E('div', 'abs', s5a.push, SVG.cursor);
const TLANDS = wt('p07', 'lands'), TCONV = wt('p07', 'with'), TONE = wt('p08', 'one');
cue(TLANDS, 'thump', .8); cue(TONE + .02, 'click', 1); cue(32.45, 'click', .45);
const LEADS = pick(.47, .5);
s5a.render = t => {
  push(s5a, t, W / 2, H / 2);
  // the page rises in behind the card
  cam(sh2, C5A.cx, C5A.cy, C5A.z, 0, (1 - sp(t, 27.85, 8)) * H * 1.05);
  const open = sp(t, 30.95, 14);
  R2.forEach((r, i) => {
    if (i < 2) lt(r, 0, 0, 1, 1);
    else if (i === 2) lt(r, 0, 0, 1, ss(t, 31.28, 31.4) * (1 - ss(t, 33.06, 33.1)));
    else lt(r, 0, -130 * (1 - open), 1, 1);
  });
  lt(R2B, 0, 0, 1, ss(t, 33.06, 33.1) * (1 - ss(t, 33.62, 33.72)));
  lt(DD, 0, 0, 1, ss(t, 32.45, 32.5) * (1 - ss(t, 33.06, 33.1)));
  tint2.style.opacity = ss(t, 31.28, 31.4) * (1 - ss(t, 31.6, 32.4)) * .9;
  // booked bubble -> new-lead card
  const r = doneRect(27.6);
  const bp = sp(t, 27.6, 10);
  put(xfer, lerp(r.x, W / 2, bp), lerp(r.y, pick(480, 900), bp), lerp(r.w / LAY.wa_done.w, .2, bp), 1 - ss(t, 27.72, 27.86));
  xfer.style.width = LAY.wa_done.w + 'px';
  const gp = sp(t, 27.68, 9), land = sp(t, TLANDS, 18);
  const fold = sp(t, 30.95, 9);
  const cy = pick(470, 880);
  const rowS = toS(C5A, 1100, 1535);
  put(leadImg, lerp(W / 2, rowS[0], fold), lerp(lerp(cy - 40, cy, land), rowS[1], fold),
    lerp(lerp(.12, LEADS * 1.02, gp) * lerp(1, .98, land), .1, fold), ss(t, 27.68, 27.8) * (1 - ss(t, 31.2, 31.35)));
  const sb = sp(t, TCONV, 5);
  sumBox.style.clipPath = `inset(-10px ${(1 - sb) * 100}% -10px -10px)`;
  sumBox.style.opacity = ss(t, TCONV, TCONV + .1);
  // the manager's one click
  const dd = toS(C5A, 2671, 1533), mv = toS(C5A, 2882, 1534);
  const c0 = [pick(1500, 800), pick(900, 1300)];
  const a1 = sp(t, 31.85, 7), a2 = sp(t, 32.62, 9);
  const cx = lerp(lerp(c0[0], dd[0], a1), mv[0], a2), cyy = lerp(lerp(c0[1], dd[1], a1), mv[1], a2);
  const press = Math.max(1 - Math.abs(t - 32.44) / .07, 1 - Math.abs(t - (TONE + .02)) / .07, 0);
  cursor.style.transform = `translate(${cx - 3}px,${cyy - 3}px) scale(${1 - .12 * clamp(press)})`;
  cursor.style.transformOrigin = '3px 3px';
  cursor.style.opacity = ss(t, 31.8, 31.95) * (1 - ss(t, 33.7, 33.85));
  // Karan's row leaves as the card, for Rohan
  if (t >= 33.6) {
    const p = ein(clamp((t - 33.7) / .5));
    const rs = toS(C5A, 1000, 1535);
    card({ parent: s5a.push, x: lerp(rs[0] + 60, W + 400, p), y: rs[1], s: lerp(.9, 1, ss(t, 33.6, 33.75)), o: ss(t, 33.6, 33.7),
      sub: 'rohan', tag: 'rohan' });
  } else noCard();
};
// 5b Rohan's leads
const s5b = scene(34.2, 36.9);
const C5B = pick({ cx: 2150, cy: 950, z: .57 }, { cx: 1400, cy: 1160, z: .72 });
const sh6 = sheet(s5b.push, 3840, 2400);
LI('c06_bg', sh6);
const R6 = [...Array(15).keys()].map(i => LI('c06_r' + i, sh6));
const tint6 = E('div', 'hl', sh6); Object.assign(tint6.style, { left: '612px', top: '316px', width: '3145px', height: '138px' });
s5b.render = t => {
  push(s5b, t, W / 2, H / 2);
  cam(sh6, C5B.cx, C5B.cy, C5B.z);
  const r0 = toS(C5B, 1100, 385);
  R6.forEach((r, i) => {
    if (i === 0) { lt(r, 0, 0, 1, ss(t, 34.6, 34.68) * (1 - ss(t, 36.5, 36.56))); return; }
    const ti = 34.25 + i * .045, p = sp(t, ti, 13);
    lt(r, 0, (1 - p) * 60, 1, ss(t, ti, ti + .12));
  });
  tint6.style.opacity = ss(t, 34.6, 34.68) * (1 - ss(t, 35.0, 35.9)) * .9;
  const inn = sp(t, 34.2, 10), out = ein(clamp((t - 36.5) / .4));
  card({ parent: s5b.push, x: lerp(lerp(-300, r0[0], inn), W + 300, out), y: r0[1],
    o: t < 34.62 ? 1 : (t >= 36.5 ? 1 : 0), sub: t < 36.5 ? 'rohan' : 'follow', tag: t < 36.5 ? 'rohan' : 'today' });
};
// 5c his follow-ups (and the card leaves to make the call)
const s5c = scene(36.9, 39.25);
const C5C = pick({ cx: 2150, cy: 1000, z: .57 }, { cx: 1420, cy: 980, z: .72 });
const sh5 = sheet(s5c.push, 3840, 2400);
LI('c05', sh5);
const cover5 = E('div', 'abs', sh5); Object.assign(cover5.style, { left: '612px', top: '944px', width: '3145px', height: '258px', background: '#fff', position: 'absolute' });
const V5 = [0, 1, 2].map(i => LI('c05_v' + i, sh5));
const tint5 = E('div', 'hl', sh5); Object.assign(tint5.style, { left: '612px', top: '1116px', width: '3145px', height: '84px' });
const TTODAY = wt('p09', "today's");
// photo 07 phone screen (the call lands here)
const P6 = pick({ ox: 0, oy: -200, s: 1.25, x: 1384, y: 836, w: 261, h: 112, r: -13.3 }, { ox: -360, oy: -150, s: 1.85, x: 1, y: 1, w: 1, h: 1, r: -17 });
s5c.render = t => {
  push(s5c, t, W / 2, H / 2);
  cam(sh5, C5C.cx, C5C.cy, C5C.z);
  V5.forEach((v, i) => {
    const ti = i < 2 ? 36.95 + i * .08 : TTODAY + .08;
    lt(v, 0, (1 - sp(t, ti, 14)) * 40, 1, ss(t, ti, ti + .1) * (i === 2 ? 1 - ss(t, 38.82, 38.9) : 1));
  });
  tint5.style.opacity = ss(t, TTODAY + .08, TTODAY + .2) * (1 - ss(t, TTODAY + .4, TTODAY + 1.3)) * .9;
  const vs = toS(C5C, 1100, 1158);
  const a = sp(t, 36.9, 10), m = sp(t, 38.82, 9);
  const dark = ss(m, .05, .45);
  card({ parent: s5c.push, x: lerp(lerp(W + 300, vs[0], a), P6.x, m), y: lerp(vs[1], P6.y, m), r: lerp(0, P6.r, m),
    w: lerp(440, P6.w, m), h: lerp(116, P6.h, m), radius: lerp(22, 14, m), bg: mixc('#FFFFFF', '#141210', dark),
    border: `rgba(169,128,63,${1 - dark})`, face: 1 - ss(m, 0, .3), ring: ss(m, .35, .7),
    o: t < TTODAY + .1 ? 1 : (t >= 38.82 ? 1 : 0), sub: t < 38.82 ? 'follow' : 'calling', tag: 'today' });
};

// ================================================================== 6. AI calling (39.25 - 44.6)
const s6a = scene(39.25, 41.6);
PHOTO(s6a, pick('07-morning-call', '07b-morning-call-tall'), P6.ox, P6.oy, P6.s);
const rings6 = [0, 1].map(() => { const r = E('div', 'abs', s6a.push); Object.assign(r.style, { width: '80px', height: '80px', borderRadius: '50%', border: '2.5px solid rgba(220,190,130,.95)' }); return r; });
const RINGT = [39.5, 40.4];
RINGT.forEach(t => cue(t, 'ring', .8));
s6a.render = t => {
  push(s6a, t, P6.x, P6.y);
  rings6.forEach((r, i) => {
    const p = clamp((t - RINGT[i]) / .8);
    r.style.transform = `translate(${P6.x - 62}px,${P6.y + 6}px) translate(-50%,-50%) rotate(${P6.r}deg) scale(${lerp(.4, 1.5, eio(p))},${lerp(.4, 1.5, eio(p)) * .5})`;
    r.style.opacity = p > 0 && p < 1 ? (1 - p) * .9 : 0;
  });
  noCard();
};
const s6b = scene(41.6, 44.6);
const L6 = pick({ card: [560, 236], call: [560, 612], cz: .4, panel: [1010, 196, 760], tz: .525 },
  { card: [540, 250], call: [540, 640], cz: .5, panel: [100, 1000, 880], tz: .6 });
const callc = E('div', 'callcard', s6b.push);
Object.assign(callc.style, { width: (1560 * L6.cz) + 'px', height: (1040 * L6.cz) + 'px' });
const callImg = IMG('../gen/' + LAY.call_top.src, callc); callImg.style.width = '100%';
const panel = E('div', 'panel', s6b.push);
const TRH = [136, 312, 149, 240, 159];
const PANH = (TRH.reduce((a, b) => a + b, 0) + 40) * L6.tz;
Object.assign(panel.style, { left: L6.panel[0] + 'px', top: L6.panel[1] + 'px', width: L6.panel[2] + 'px', height: PANH + 'px' });
const trs = ['tr_head', 'tr_0', 'tr_1', 'tr_2', 'tr_3'].map(n => { const e = IMG('../gen/layers/' + n + '.png', panel); e.style.width = (1448 * L6.tz) + 'px'; return e; });
const conf = IMG('../gen/layers/call_confirmed.png', s6b.push); conf.style.width = (1448 * L6.tz) + 'px';
const tick = E('div', 'tick', s6b.push, SVG.check);
const TRT = [41.68, 41.86, 42.42, 42.92, 43.36];
const TCONF = wt('p10', 'confirm');
cue(TCONF + .05, 'chime', .55);
s6b.render = t => {
  push(s6b, t, W / 2, H / 2);
  const cin = sp(t, 41.6, 10);
  put(callc, L6.call[0], L6.call[1] + (1 - cin) * 40, 1, ss(t, 41.6, 41.7));
  let y = 20 * L6.tz;
  trs.forEach((e, i) => {
    const p = sp(t, TRT[i], 14);
    e.style.transform = `translate(0px,${y + (1 - p) * 30}px)`; e.style.opacity = ss(t, TRT[i], TRT[i] + .1);
    y += TRH[i] * L6.tz;
  });
  panel.style.opacity = ss(t, 41.62, 41.72);
  panel.style.transform = `translateY(${(1 - sp(t, 41.62, 10)) * 30}px)`;
  const cp = sp(t, TCONF, 12);
  put(conf, L6.panel[0] + L6.panel[2] / 2, L6.panel[1] + PANH + 20 + 232 * L6.tz / 2 + (1 - cp) * 30, 1, ss(t, TCONF, TCONF + .1));
  const kp = sp(t, 41.6, 9);
  card({ parent: s6b.push, x: L6.card[0], y: L6.card[1] + (1 - kp) * 30, sub: t < TCONF ? 'today' : 'confirmed', tag: 'today' });
  CARD.style.opacity = ss(t, 41.6, 41.72);
  const tp = sp(t, TCONF + .05, 14);
  put(tick, L6.card[0] + 214, L6.card[1] - 52, lerp(1.6, 1, tp), ss(t, TCONF + .05, TCONF + .15));
};

// ================================================================== 7. analytics + AI tips (44.6 - 53.4)
const s7a = scene(44.6, 46.6);
const P7 = pick({ ox: 0, oy: -60, s: 1.25, fx: 1560, fy: 400 }, { ox: -1150, oy: 0, s: 1.875, fx: 520, fy: 640 });
PHOTO(s7a, '10-owner-analytics', P7.ox, P7.oy, P7.s);
s7a.render = t => {
  const back = sp(t, 44.6, 4.5);
  const z = t < 45.95 ? lerp(1.22, 1.0, back) : lerp(lerp(1.22, 1.0, sp(45.95, 44.6, 4.5)), 3.0, ein(clamp((t - 45.95) / .65)));
  setPush(s7a, P7.fx, P7.fy, z);
  noCard();
};
const s7b = scene(46.6, 53.4);
const C7 = pick({ cx: 2150, cy: 1075, z: .57 }, { cx: 1500, cy: 1000, z: .66 });
const sh12 = sheet(s7b.push, 3840, 2400);
LI('c12_bg', sh12);
const KPI = [0, 1, 2, 3].map(i => {
  const box = E('div', 'abs', sh12); const m = LAY['kpi' + i + '_new'];
  Object.assign(box.style, { left: m.x + 'px', top: m.y + 'px', width: m.w + 'px', height: m.h + 'px', overflow: 'hidden', position: 'absolute' });
  const o = IMG('../gen/layers/kpi' + i + '_old.png', box), n = IMG('../gen/layers/kpi' + i + '_new.png', box);
  return { o, n, h: m.h };
});
const chartEl = E('div', 'chart', sh12, '<div class="t">Bookings by channel</div><div class="s">This month · each dot is one booking</div><div class="rule"></div>');
const CH = [['WhatsApp', 3, 4], ['Website', 1, 1], ['Google Ads', 1, 1], ['Instagram', 0, 0]];
const DOTX = 64;
const chRows = CH.map(([lb, n0, n1], i) => {
  const r = E('div', 'row', chartEl); r.style.top = (168 + i * 96) + 'px';
  E('div', 'lb', r, lb); const dots = E('div', 'dots', r); const n = E('div', 'n', r, String(n1));
  const ds = [...Array(n0).keys()].map(k => { const d = E('div', 'dot', dots); d.style.left = (k * DOTX) + 'px'; return d; });
  return { r, ds, n, n0, n1 };
});
const kdot = E('div', 'dot', chRows[0].r.children[1]); kdot.style.left = (3 * DOTX) + 'px'; kdot.style.background = '#1E9E57';
const tipsWrap = E('div', 'abs', s7b.push); Object.assign(tipsWrap.style, { width: '2160px', height: '1377px', transformOrigin: '0 0', position: 'absolute' });
IMG('../gen/layers/tips.png', tipsWrap);
const dims = [[372, 615], [831, 984], [984, 1160]].map(([a, b]) => { const d = E('div', 'dim', tipsWrap); Object.assign(d.style, { left: '122px', top: a + 'px', width: '1916px', height: (b - a) + 'px' }); return d; });
const hl = E('div', 'hl', tipsWrap); Object.assign(hl.style, { left: '122px', top: '617px', width: '1916px', height: '212px' });
const hlbar = E('div', 'abs', tipsWrap); Object.assign(hlbar.style, { left: '122px', top: '617px', width: '10px', height: '212px', background: '#A9803F', position: 'absolute' });
const TLEADS = wt('p11', 'leads'), TVISITS = wt('p11', 'visits'), TBOOK = wt('p11', 'bookings'), TCHAN = wt('p11', 'channel');
const TWEEK = wt('p12', 'every'), TLOSE = wt('p12', 'losing');
const KT = [TLEADS, TVISITS, TBOOK, TCHAN];
cue(TBOOK, 'thump', .55); cue(TWEEK + .1, 'whoosh', .35);
const TIPS = pick({ s: .47, x: 960, y: 560 }, { s: .45, x: 540, y: 1180 });
s7b.render = t => {
  push(s7b, t, W / 2, H / 2);
  cam(sh12, C7.cx, C7.cy, C7.z);
  KPI.forEach((k, i) => {
    const p = sp(t, KT[i], 14);
    const first = i === 0; // leads: rolls in from empty
    k.o.style.transform = `translateY(${-p * k.h}px)`; k.o.style.opacity = first ? 0 : 1 - ss(p, .5, 1);
    k.n.style.transform = `translateY(${(1 - p) * k.h}px)`; k.n.style.opacity = ss(p, 0, .5);
  });
  chRows.forEach((r, i) => {
    r.ds.forEach((d, k) => { const ti = 46.75 + i * .1 + k * .05; d.style.transform = `scale(${sp(t, ti, 16)})`; });
    const ti = TCHAN + i * .06; r.n.style.opacity = ss(t, ti, ti + .12);
    r.n.style.transform = `translateY(${(1 - sp(t, ti, 15)) * 20}px)`;
    r.n.textContent = String(i === 0 && t < TBOOK ? r.n0 : r.n1);
  });
  // Karan's card turns green as booked, then folds into one dot
  const dotS = toS(C7, 610 + 44 + 420 + 3 * DOTX + 18, 602 + 168 + 42);
  const a = sp(t, 46.62, 9), f = sp(t, TBOOK - .42, 9);
  const g = ss(t, 46.95, 47.25);
  kdot.style.transform = `scale(${t >= TBOOK - .02 ? 1 : 0})`;
  if (t < TBOOK - .02) {
    card({ parent: s7b.push, x: lerp(W / 2, dotS[0], f), y: lerp(lerp(H + 120, pick(820, 1500), a), dotS[1], f),
      w: lerp(440, 36, f), h: lerp(116, 36, f), s: lerp(1, C7.z, f), radius: lerp(22, 30, f),
      bg: mixc(mixc('#FFFFFF', '#EEF8F1', g), '#1E9E57', ss(f, .2, .7)),
      border: g > 0 ? `rgba(30,158,87,${g})` : 'rgba(169,128,63,1)', face: 1 - ss(f, .05, .35),
      sub: 'booked', tag: g > .5 ? 'booked' : 'today', avbg: mixc('#F4ECDF', '#DDF2E5', g), avfg: g > .5 ? '#17804A' : '#A9803F' });
  } else noCard();
  // weekly AI tips
  const tp = sp(t, TWEEK + .05, 8);
  const ts = TIPS.s * lerp(1, .82, sp(t, 53.05, 9));
  tipsWrap.style.transform = `translate(${TIPS.x - 1080 * ts}px,${lerp(H + 80, TIPS.y - 688 * ts, tp)}px) scale(${ts})`;
  tipsWrap.style.opacity = ss(t, TWEEK, TWEEK + .1);
  const hp = ss(t, TLOSE - .05, TLOSE + .25);
  dims.forEach(d => { d.style.opacity = hp * .55; });
  hl.style.opacity = hp; hlbar.style.opacity = hp;
  hlbar.style.transform = `scaleY(${hp})`;
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
  const r = E('div', 'roll', sign); Object.assign(r.style, { left: x + 'px', top: y + 'px', width: w + 'px', height: h + 'px' });
  const kids = BR.map((b, i) => { const k = E('div', '', r); fill(k, b, i); return k; });
  rolls.push({ r, kids, delay }); return r;
}
roll(56, 72, 104, 104, (k, b, i) => {
  k.className = 'logo'; k.style.background = b.c; k.style.borderRadius = b.round + 'px'; k.textContent = b.logo;
}, 0);
roll(184, 78, 420, 50, (k, b, i) => {
  if (i === 0) k.innerHTML = '<div style="margin-top:10px;width:270px;height:30px;border-radius:8px;background:#EEE9E1"></div>';
  else { k.className = 'bn'; k.textContent = b.name; }
}, .03);
E('div', 'bs', sign, 'Sales CRM').style.cssText = 'position:absolute;left:184px;top:134px';
E('div', 'lbl', sign, 'WORK EMAIL').style.top = '232px';
E('div', 'fld', sign).style.top = '262px';
roll(78, 262, 500, 68, (k, b) => { k.className = 'fv'; k.style.left = '0'; k.textContent = b.email; }, .06);
E('div', 'lbl', sign, 'PASSWORD').style.top = '362px';
E('div', 'fld', sign, '<div class="fv">••••••••••</div>').style.top = '392px';
roll(56, 498, 528, 78, (k, b) => { k.className = 'btn'; k.style.background = b.c; k.textContent = 'Sign in'; }, .09);
E('div', 'lbl', sign, 'YOUR PROJECTS').style.top = '616px';
roll(56, 646, 528, 54, (k, b, i) => {
  k.innerHTML = '<div class="pj">' + b.pj.map(p => i === 0 ? '<span style="width:200px;height:38px;background:#F1EDE6"></span>' :
    `<span style="background:${mixc(b.c, '#FFFFFF', .88)};color:${b.c}">${p}</span>`).join('') + '</div>';
}, .12);
function brandAt(t) { let b = 0; for (let i = 1; i < 4; i++) if (t >= TFLIP[i]) b = i; return b; }
const L8 = pick({ x: 960, y: 548 }, { x: 540, y: 900 });
s8.render = t => {
  push(s8, t, L8.x, L8.y, 1, 1.04);
  const ip = sp(t, 53.4, 11);
  put(sign, L8.x, L8.y, lerp(.86, 1, ip), 1);
  rolls.forEach(rl => rl.kids.forEach((k, i) => {
    let y;
    // the leaving brand travels a little past the clip so no hairline of it stays behind
    if (i === 0) y = -1.05 * sp(t, TFLIP[1] + rl.delay, 16);
    else if (t < TFLIP[i]) y = 1.05;
    else { y = 1.05 * (1 - sp(t, TFLIP[i] + rl.delay, 16)); if (i < 3) y -= 1.05 * sp(t, TFLIP[i + 1] + rl.delay, 16); }
    k.style.transform = `translateY(${y * 100}%)`;
  }));
  const b = brandAt(t);
  const prev = BR[Math.max(0, b - 1)].c;
  const wp = sp(t, TFLIP[b], 12);
  sbar.style.background = `linear-gradient(90deg,${BR[b].c} ${wp * 100}%,${prev} ${wp * 100}%)`;
  noCard();
};

// ================================================================== 9. close (57.2 - 66.3)
const s9 = scene(57.2, END);
const L9 = pick({ logo: [960, 168, 620], fr: [960, 512, 700, 400], cta: 806, url: [960, 896, 470, 68] },
  { logo: [540, 330, 760], fr: [540, 860, 860, 640], cta: 1300, url: [540, 1420, 560, 84] });
const fold9 = E('div', 'abs', s9.push); Object.assign(fold9.style, { background: '#fff', borderRadius: '30px', position: 'absolute' });
const frame = E('div', 'frame', s9.push);
const keys = IMG('../gen/photos/09-handshake-keys.jpg', frame);
const lock = E('div', 'abs', s9.push);
const lockImg = IMG('../assets/brand/golden-ratio-horizontal-gold-2400w.png', lock, ''); lockImg.style.width = L9.logo[2] + 'px';
Object.assign(lock.style, { left: (L9.logo[0] - L9.logo[2] / 2) + 'px', top: (L9.logo[1] - L9.logo[2] * 795 / 2400 / 2) + 'px' });
const cta = E('div', 'cta', s9.push); cta.style.top = (L9.cta - 32) + 'px';
const CTAW = TM[13].words.slice(2, 6);
const ctaws = CTAW.map(w => Object.assign(E('span', 'w' + (w.em ? ' serif gold' : ''), cta, w.w), { t: w.t }));
const url = E('div', 'url', s9.push, 'goldenratiosolution.com');
Object.assign(url.style, { width: L9.url[2] + 'px', height: L9.url[3] + 'px' });
const TGR9 = wt('p14', 'golden'), TDEMO = wt('p14', 'demo');
cue(TGR9 + .03, 'impact', .55); cue(TDEMO + .02, 'thump', .45);
s9.render = t => {
  push(s9, t, W / 2, H / 2, 1, 1.04, 57.2, 63.3);
  // sign-in card folds back into Karan's lead card
  const f = sp(t, 57.2, 11);
  const sw = lerp(640, 440, f), shh = lerp(760, 116, f);
  if (t < 57.5) {
    fold9.style.display = 'block'; put(fold9, L8.x, L8.y, 1, 1);
    fold9.style.width = sw + 'px'; fold9.style.height = shh + 'px';
    fold9.style.boxShadow = '0 30px 80px rgba(26,23,18,.14)';
    noCard(); frame.style.display = 'none';
  } else {
    fold9.style.display = 'none';
    const g = sp(t, 57.62, 8);
    const fw = lerp(440, L9.fr[2], g), fh = lerp(116, L9.fr[3], g);
    const fx = lerp(L8.x, L9.fr[0], g), fy = lerp(L8.y, L9.fr[1], g);
    frame.style.display = 'block';
    Object.assign(frame.style, { width: fw + 'px', height: fh + 'px', borderRadius: lerp(22, 30, g) + 'px' });
    put(frame, fx, fy, 1, ss(t, 57.62, 57.7));
    if (g < .6) card({ parent: s9.push, x: fx, y: fy, w: fw, h: fh, face: 1 - ss(g, 0, .3), o: 1 - ss(g, .25, .45), sub: 'booked', tag: 'booked',
      border: 'rgba(30,158,87,1)', bg: '#EEF8F1', avbg: '#DDF2E5', avfg: '#17804A' });
    else noCard();
  }
  const lp = sp(t, TGR9, 4.5);
  lock.style.clipPath = `inset(-5% ${(1 - lp) * 100}% -5% 0)`; lock.style.opacity = ss(t, TGR9 - .05, TGR9 + .2);
  ctaws.forEach(w => { const p = sp(t, w.t, 16); w.style.opacity = ss(t, w.t - .02, w.t + .1); w.style.transform = `translateY(${(1 - p) * 20}px)`; });
  const up = sp(t, TDEMO, 13);
  put(url, L9.url[0], L9.url[1] - (1 - up) * 34, lerp(1.05, 1, up), ss(t, TDEMO, TDEMO + .1));
};

// ================================================================== captions
const caps = E('div', ''); caps.id = 'caps';
const capP = E('div', 'cp', caps);
const CS = pick({ font: 40, bottom: 52, pad: '16px 34px', max: 1500 }, { font: 44, bottom: 230, pad: '18px 34px', max: 920 });
Object.assign(capP.style, { font: `500 ${CS.font}px Inter`, padding: CS.pad, maxWidth: CS.max + 'px', lineHeight: 1.25, columnGap: '.28em' });
caps.style.bottom = CS.bottom + 'px';
const CUTS = SURF.map(s => s[0]).slice(1);
const SEGS = []; // caption segments: words split at cuts, each ends at the next cut
TM.forEach((line, li) => {
  const nextStart = li + 1 < TM.length ? TM[li + 1].words[0].t : END;
  let seg = null;
  line.words.forEach(w => {
    const cutBefore = seg && CUTS.some(c => c > seg.words[0].t - 1e-6 && c <= w.t && c > seg.words[seg.words.length - 1].t);
    if (!seg || cutBefore) { seg = { words: [] }; SEGS.push(seg); }
    seg.words.push(w);
  });
});
SEGS.forEach((s, i) => {
  const a = s.words[0].t, last = s.words[s.words.length - 1];
  const cut = CUTS.find(c => c > a) ?? END;
  const nxt = i + 1 < SEGS.length ? SEGS[i + 1].words[0].t : END;
  s.a = a - .04; s.b = Math.min(cut, nxt, last.t + last.d + .6);
});
const capEls = SEGS.map(s => s.words.map(w => {
  const e = document.createElement('span'); e.className = 'cw' + (w.em ? ' em' : ''); e.textContent = w.w.replace(/[.]$/, '').replace(/[.](?=\s|$)/g, '');
  if (w.em) e.style.fontSize = (CS.font * 1.2) + 'px';
  return e;
}));
function captions(t) {
  if (CAP === '0') { caps.style.display = 'none'; return; }
  const i = SEGS.findIndex(s => t >= s.a && t < s.b);
  if (i < 0) { caps.style.display = 'none'; return; }
  caps.style.display = 'flex';
  const surf = SURF.find(s => t >= s[0] && t < s[1])[2];
  caps.className = 'on-' + surf;
  const els = capEls[i];
  if (capP.dataset.seg !== String(i)) { capP.replaceChildren(...els); capP.dataset.seg = i; }
  SEGS[i].words.forEach((w, k) => {
    const on = t >= w.t - .02;
    els[k].style.display = on ? 'inline-block' : 'none';
    els[k].style.opacity = ss(t, w.t - .02, w.t + .06);
  });
  capP.style.borderRadius = capP.offsetHeight > CS.font * 2 ? '28px' : '999px';
}

// ================================================================== seek
let readyRes; window.ready = new Promise(r => { readyRes = r; });
window.seek = async t => {
  t = clamp(t, 0, END - 1e-4);
  const capOnly = CAP === 'only';
  noCard(); // each scene that shows the card sets it again, so nothing carries over from the last frame
  for (const s of SC) {
    const on = !capOnly && t >= s.a && t < s.b;
    s.root.style.display = on ? 'block' : 'none';
    if (on) s.render(t);
  }
  if (capOnly) noCard();
  clock(capOnly ? -1 : t);
  stage.appendChild(OV); stage.appendChild(caps);
  captions(t);
  // every image in the frame is decoded before the screenshot
  const vis = IMGS.filter(i => i.offsetParent !== null || (i.parentElement && i.parentElement.offsetParent !== null));
  for (const i of vis) { for (let k = 0; k < 3; k++) { try { await i.decode(); break; } catch (e) { if (k === 2) console.error('decode', i.src); await new Promise(r => requestAnimationFrame(r)); } } }
  return t;
};
window.CUES = CUES;
window.FILM = { W, H, END, SHAPE };
if (CAP === 'only') { document.body.classList.add('caponly'); }
(async () => {
  await document.fonts.ready;
  // wait for every file to load; decoding happens per frame in seek() for what is on screen
  await Promise.all(IMGS.map(i => i.complete && i.naturalWidth ? 0 : new Promise((res, rej) => {
    i.addEventListener('load', res, { once: true }); i.addEventListener('error', () => { console.error('load', i.src); res(); }, { once: true });
  })));
  await window.seek(0);
  readyRes(true);
})();
})();
