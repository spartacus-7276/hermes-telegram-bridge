#!/usr/bin/env python3
"""Voiceover, subtitles timing, music and sound design for the services film (film.html, the default cut).

  python3 audio.py plan     # speak every line, measure it, write vo.json — the timeline the film is drawn to
  python3 audio.py mix      # after record.py: voice + music + sound design → out/gr-services-*-audio.mp4

The voice is edge-tts Indian English (en-IN-PrabhatNeural) when Microsoft's speech service is reachable,
otherwise the offline RHVoice English voice. `plan` fixes the timeline once; `mix` fits whichever voice is
available into those same windows, so a better voice can be swapped in later without re-rendering.
"""
import asyncio
import json
import os
import shutil
import ssl
import subprocess
import sys
import wave
from pathlib import Path

import numpy as np

HERE = Path(__file__).resolve().parent
OUT = HERE / "out"
AUD = OUT / "audio_services"
PLAN = HERE / "vo.json"
SR = 48000
FPS = 30
WHIP = 12  # frames of overlap in a whip transition

# The script. `text` is the subtitle, `say` is what is spoken (numbers and letters spelled for the voice).
SEGMENTS = [
    {"id": "OV", "min": 200, "lead": 10, "lines": [
        {"text": "We help Pune developers turn enquiries into site visits."},
        {"text": "Six things we build. One by one."}]},
    {"id": "WEB", "min": 170, "lead": 8, "lines": [
        {"text": "One. Your website, built around your projects."},
        {"text": "Live status and RERA on every page.", "say": "Live status, and RERA, on every page."}]},
    {"id": "PAGE", "min": 190, "lead": 6, "lines": [
        {"text": "Two. A page for every project."},
        {"text": "Price and plan up front. One tap to book a visit."}]},
    {"id": "ADS", "old": "S2", "r": [4, 196], "lead": 8, "lines": [
        {"text": "Three. Google ads, shown to people already searching."}]},
    {"id": "WA", "old": "S5", "r": [0, 470], "lead": 8, "lines": [
        {"text": "Four. A WhatsApp assistant that answers in seconds."},
        {"text": "At any hour, in Marathi, Hindi or English."},
        {"text": "And it hands over to your team the moment he asks."}]},
    {"id": "CALL", "old": "S8", "r": [0, 318], "lead": 8, "lines": [
        {"text": "Five. An AI agent that calls every enquiry back.", "say": "Five. An A.I. agent that calls every enquiry back."},
        {"text": "Even the old list nobody followed up."}]},
    {"id": "DASH", "old": "S7", "r": [0, 470], "lead": 8, "lines": [
        {"text": "Six. One dashboard for every lead."},
        {"text": "Assign it, track the visit, mark the booking."}]},
    {"id": "CLOSE", "old": "S9", "r": [0, 121], "speed": 1, "lead": 66, "lines": [
        {"text": "Golden Ratio Solution. Book a free 30-minute check.",
         "say": "Golden Ratio Solution. Book a free, thirty minute check."}]},
]
# where each old shot sat in the 90-second journey cut (its render() takes those global frames)
OLD_F0 = {"S2": 178, "S5": 958, "S7": 1678, "S8": 2218, "S9": 2578}


# ---------------------------------------------------------------- voices
def _edge_ctx():
    import edge_tts.communicate as comm
    ca = os.environ.get("SSL_CERT_FILE") or "/root/.ccr/ca-bundle.crt"
    if Path(ca).exists():  # a cloud session's proxy re-signs TLS; verify against its CA
        comm._SSL_CTX = ssl.create_default_context(cafile=ca)


async def _edge(lines, outdir):
    import edge_tts
    _edge_ctx()
    for i, say in lines:
        dst = outdir / f"edge_{i:02d}.mp3"
        if dst.exists() and dst.stat().st_size:
            continue
        tmp = dst.with_suffix(".part")
        await edge_tts.Communicate(say, "en-IN-PrabhatNeural", rate="+4%").save(str(tmp))
        tmp.replace(dst)


def speak(lines):
    """Returns {index: path} for the best voice available, and the voice's name."""
    AUD.mkdir(parents=True, exist_ok=True)
    try:
        asyncio.run(_edge(lines, AUD))
        return {i: AUD / f"edge_{i:02d}.mp3" for i, _ in lines}, "edge-tts en-IN-PrabhatNeural"
    except Exception as e:  # noqa: BLE001
        for p in AUD.glob("*.part"):
            p.unlink()
        print(f"edge-tts unavailable ({type(e).__name__}); using the offline RHVoice voice")
    if not shutil.which("RHVoice-test"):
        sys.exit("no voice available: install edge-tts (online) or rhvoice + rhvoice-english (offline)")
    out = {}
    for i, say in lines:
        dst = AUD / f"rh_{i:02d}.wav"
        if not dst.exists():
            subprocess.run(["RHVoice-test", "-p", "bdl", "-r", "108", "-o", str(dst)], input=say.encode(), check=True,
                           capture_output=True)
        out[i] = dst
    return out, "RHVoice bdl (offline)"


def decode(path):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(path), "-f", "f32le", "-ac", "1", "-ar", str(SR), "-"],
                         capture_output=True, check=True).stdout
    x = np.frombuffer(raw, dtype=np.float32).astype(np.float64)
    nz = np.nonzero(np.abs(x) > 0.004)[0]  # trim leading/trailing silence
    return x[nz[0]: nz[-1] + 1] if len(nz) else x


def all_lines():
    k = 0
    out = []
    for s in SEGMENTS:
        for ln in s["lines"]:
            out.append((k, ln.get("say", ln["text"])))
            k += 1
    return out


# ---------------------------------------------------------------- plan: the timeline
def plan():
    lines = all_lines()
    files, voice = speak(lines)
    durs = {i: len(decode(p)) / SR for i, p in files.items()}
    segs, chunks, f0, k = [], [], 0, 0
    for n, s in enumerate(SEGMENTS):
        whip = n >= 3  # page → ads onwards are whips; overview → website is a match cut, website → page continuous
        if n > 0 and whip:
            f0 -= WHIP
        t = s["lead"]
        local = []
        for ln in s["lines"]:
            d = int(np.ceil(durs[k] * FPS))
            local.append({"a": t, "b": t + d + 8, "text": ln["text"], "i": k})
            t += d + 10
            k += 1
        need = t + 14
        seg = {"id": s["id"], "f0": f0, "whip": whip}
        if "old" in s:
            r0, r1 = s["r"]
            span = r1 - r0
            if s.get("speed"):
                length = max(need, int(span / s["speed"]) + 1)
                speed = s["speed"]
            else:
                length = int(np.clip(need, span / 2.0, span / 1.15))
                speed = span / (length - 1)
            seg.update({"old": s["old"], "oldF0": OLD_F0[s["old"]], "r0": r0, "speed": round(speed, 5), "len": length})
        else:
            seg["len"] = max(s["min"], need)
        if local and local[-1]["b"] > seg["len"]:
            print(f"  note: {s['id']} voice runs {local[-1]['b'] - seg['len']} frames past its shot")
        for c in local:
            chunks.append({"a": f0 + c["a"], "b": f0 + min(c["b"], seg["len"] - 2), "text": c["text"], "i": c["i"]})
        segs.append(seg)
        f0 += seg["len"]
    total = f0
    PLAN.write_text(json.dumps({"fps": FPS, "whip": WHIP, "total": total, "voice": voice, "segments": segs,
                                "chunks": chunks}, indent=1, ensure_ascii=False))
    print(f"plan → {PLAN}  {total} frames = {total / FPS:.1f} s, voice: {voice}")
    for c in chunks:
        print(f"  {c['a'] / FPS:5.1f}–{c['b'] / FPS:5.1f}s  {c['text']}")


# ---------------------------------------------------------------- synthesis helpers
RNG = np.random.default_rng(7)


def midi(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def env(n, attack, tau):
    t = np.arange(n) / SR
    return np.clip(t / max(attack, 1e-4), 0, 1) * np.exp(-np.maximum(t - attack, 0) / tau)


def tone(f, dur, attack=0.005, tau=0.3, partials=((1, 1.0),)):
    n = int(dur * SR)
    t = np.arange(n) / SR
    return sum(a * np.sin(2 * np.pi * f * k * t) for k, a in partials) * env(n, attack, tau)


def smooth(x, k):
    k = max(1, int(k))
    return np.convolve(x, np.ones(k) / k, mode="same")


def add(buf, sig, at_s, gain=1.0):
    a = int(round(at_s * SR))
    if a >= len(buf):
        return
    if a < 0:
        sig, a = sig[-a:], 0
    b = min(len(buf), a + len(sig))
    buf[a:b] += sig[: b - a] * gain


def fconv(x, ir):
    n = len(x) + len(ir) - 1
    nfft = 1 << (n - 1).bit_length()
    return np.fft.irfft(np.fft.rfft(x, nfft) * np.fft.rfft(ir, nfft), nfft)[: len(x)]


def reverb_ir(seconds, seed):
    rng = np.random.default_rng(seed)
    n = int(seconds * SR)
    t = np.arange(n) / SR
    ir = smooth(rng.standard_normal(n) * np.exp(-t / (seconds / 5.0)), 6)
    ir[0] = 0
    return ir / np.sqrt(np.sum(ir ** 2))


def s_click():
    n = RNG.standard_normal(int(0.03 * SR)) * env(int(0.03 * SR), 0.0005, 0.004)
    n = n - np.concatenate([[0], n[:-1]])
    t = np.arange(int(0.03 * SR)) / SR
    return 0.5 * n + 0.6 * np.sin(2 * np.pi * (1400 - 18000 * t) * t) * env(len(t), 0.0005, 0.008)


def s_key(i):
    n = RNG.standard_normal(int(0.012 * SR)) * env(int(0.012 * SR), 0.0003, 0.0025)
    return (n - np.concatenate([[0], n[:-1]])) * (0.8 + 0.4 * ((i * 53) % 9) / 8)


def s_tock(f=880):
    return tone(f, 0.12, 0.002, 0.03, ((1, 1), (2.7, .2)))


def s_whoosh(dur=0.5):
    n = RNG.standard_normal(int(dur * SR))
    lp = smooth(n, 40) * 4
    bp = lp - smooth(lp, 400)
    t = np.arange(len(n)) / SR
    return bp * np.sin(np.pi * np.clip(t / dur, 0, 1)) ** 2


def s_bell(m):
    f, n = midi(m), int(2.0 * SR)
    t = np.arange(n) / SR
    s = sum(a * np.sin(2 * np.pi * f * k * t) * np.exp(-t / tau) for k, a, tau in ((1, 1, 1.1), (2.0, .35, .6), (2.76, .25, .4)))
    return s * np.clip(t / 0.003, 0, 1)


def s_ring():
    n = int(0.42 * SR)
    t = np.arange(n) / SR
    s = (np.sin(2 * np.pi * 440 * t) + np.sin(2 * np.pi * 480 * t)) * 0.5
    return s * (0.6 + 0.4 * np.sin(2 * np.pi * 20 * t)) * np.clip(t / 0.02, 0, 1) * np.clip((0.42 - t) / 0.05, 0, 1)


# ---------------------------------------------------------------- mix
def music(n, close_at):
    """Original 120 BPM bed in D major; nothing sampled. Resolves on D when the end card lands."""
    prog = [(38, [54, 57, 61, 64]), (35, [50, 54, 57, 61]), (31, [47, 50, 54, 57]), (33, [50, 52, 57, 59])]
    end = (38, [54, 57, 61, 64, 69])
    length = n / SR
    L, R = np.zeros(n), np.zeros(n)
    chord = lambda s: end if s >= close_at else prog[int(s // 4.0) % 4]
    starts = sorted(set(list(np.arange(0, length, 4.0)) + [close_at]))
    for i, s0 in enumerate(starts):
        if s0 >= length:
            continue
        s1 = starts[i + 1] if i + 1 < len(starts) else length
        _, tones = chord(s0 + .01)
        dur = (s1 - s0) + 1.4
        m = int(dur * SR)
        t = np.arange(m) / SR
        e = np.clip(t / 0.7, 0, 1) * np.clip((dur - t) / 1.4, 0, 1)
        for j, mm in enumerate(tones):
            for det, pan in ((-0.0018, 0.7), (0.0018, 0.3)):
                f = midi(mm) * (1 + det)
                v = (np.sin(2 * np.pi * f * t) + 0.2 * np.sin(2 * np.pi * 2 * f * t + j)) * e * 0.05
                add(L, v * pan, s0)
                add(R, v * (1 - pan), s0)
    for k in range(int(length / 1.0)):
        s = k * 1.0
        bass, _ = chord(s + .01)
        sig = tone(midi(bass + 12), 0.9, 0.01, 0.38, ((1, 1), (2, .25))) * 0.13
        add(L, sig, s)
        add(R, sig, s)
    pattern = [0, 2, 1, 3, 2, 1, 3, 2]
    for k in range(int(length / 0.25)):
        s = k * 0.25
        if s >= close_at:
            break
        _, tones = chord(s + .01)
        sig = tone(midi(tones[pattern[k % 8] % len(tones)] + 12), 0.6, 0.004, 0.2, ((1, 1), (2, .3)))
        pan = 0.35 + 0.3 * ((k * 37) % 7) / 6
        g = 0.045 * (1.0 if k % 2 == 0 else 0.7)
        add(L, sig, s, g * pan)
        add(R, sig, s, g * (1 - pan))
    fade = np.clip(np.arange(n) / SR / 0.8, 0, 1)
    return L * fade, R * fade


def sfx(P, n):
    L, R = np.zeros(n), np.zeros(n)
    seg = {s["id"]: s for s in P["segments"]}

    def put(sig, frame, gain, pan=0.5):
        add(L, sig, frame / FPS, gain * (1 - pan) * 2)
        add(R, sig, frame / FPS, gain * pan * 2)

    def old(sid, lf):  # an event at local frame lf of the old shot → frame in this film, or None
        s = seg[sid]
        x = (lf - s["r0"]) / s["speed"]
        return s["f0"] + x if 0 <= x < s["len"] else None

    def at(sid, lf, sig, gain, pan=0.5):
        f = old(sid, lf)
        if f is not None:
            put(sig, f, gain, pan)

    o, w, p = seg["OV"], seg["WEB"], seg["PAGE"]
    put(tone(midi(81), .8, .01, .3), o["f0"] + 2, 0.03)
    for i in range(6):
        put(s_tock(700 + 80 * i), o["f0"] + 34 + 8 * i, 0.05)
    put(s_whoosh(0.6), o["f0"] + o["len"] - 22, 0.05)
    put(s_tock(620), w["f0"] + 4, 0.05)
    for u in (0.22, 0.46, 0.7):
        put(tone(midi(86), .25, .002, .07), w["f0"] + u * w["len"], 0.035)
    put(s_whoosh(0.7), p["f0"] + 2, 0.035)
    for u in (0.28, 0.62):
        put(tone(midi(88), .25, .002, .07), p["f0"] + u * p["len"], 0.035)
    put(s_click(), p["f0"] + 0.82 * p["len"], 0.12)
    # whips
    for s in P["segments"]:
        if s["whip"]:
            put(s_whoosh(0.45), s["f0"] - 2, 0.06)
    # Google ads (old S2)
    for k in range(31):
        at("ADS", 8 + 2 * k, s_key(k), 0.045)
    for i in range(3):
        at("ADS", 78 + 4 * i, s_tock(820 + 60 * i), 0.05)
    at("ADS", 152, s_click(), 0.12)
    # WhatsApp (old S5, picture frames)
    for lf in (24, 196, 300):
        at("WA", lf, np.concatenate([tone(midi(79), .07, .002, .03), tone(midi(86), .18, .002, .06)]), 0.055, 0.4)
    for lf in (84, 120, 134, 152, 232, 320):
        at("WA", lf, tone(midi(84), .16, .002, .045, ((1, 1), (2, .15))), 0.05, 0.6)
    at("WA", 84, s_bell(88), 0.06)
    at("WA", 338, tone(midi(88), .3, .002, .08), 0.045)
    # AI calling (old S8)
    at("CALL", 98, s_ring(), 0.03)
    at("CALL", 112, tone(midi(76), .3, .002, .08), 0.04)
    at("CALL", 246, tone(midi(79), .5, .01, .15), 0.035)
    at("CALL", 266, s_whoosh(0.7), 0.035, 0.35)
    at("CALL", 298, s_whoosh(0.6), 0.03, 0.65)
    # dashboard (old S7)
    at("DASH", 70, s_tock(300), 0.06)
    at("DASH", 152, s_click(), 0.09)
    at("DASH", 198, s_tock(700), 0.055)
    at("DASH", 206, tone(midi(83), .25, .002, .07), 0.04)
    at("DASH", 262, s_whoosh(0.5), 0.04)
    at("DASH", 300, s_whoosh(0.6), 0.03)
    for lf in (344, 370, 404, 428):
        at("DASH", lf, s_click(), 0.085)
    at("DASH", 431, s_bell(86), 0.055)
    # close (old S9)
    for k, m in enumerate((74, 76, 78, 81, 86)):
        at("CLOSE", 2 + 15 * k, tone(midi(m), 1.2, .002, .45, ((1, 1), (4, .18))), 0.06, 0.3 + 0.1 * k)
    for m in (62, 66, 69, 73, 76):
        at("CLOSE", 64, tone(midi(m), 2.6, .25, 1.4, ((1, 1), (2, .12))), 0.02)
    return L, R


def fit(clip, window_s):
    """Speed a voice clip up (at most 1.25×) so it fits its subtitle window."""
    d = len(clip) / SR
    if d <= window_s or window_s <= 0:
        return clip
    r = min(1.25, d / window_s)
    tmp_in, tmp_out = AUD / "_fit_in.wav", AUD / "_fit_out.wav"
    with wave.open(str(tmp_in), "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((np.clip(clip, -1, 1) * 32767).astype(np.int16).tobytes())
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", str(tmp_in), "-af", f"atempo={r:.4f}", str(tmp_out)], check=True)
    return decode(tmp_out)


def mix():
    P = json.loads(PLAN.read_text())
    n = int(P["total"] / FPS * SR)
    lines = all_lines()
    files, voice = speak(lines)
    vo = np.zeros(n)
    for c in P["chunks"]:
        clip = fit(decode(files[c["i"]]), (c["b"] - c["a"]) / FPS)
        add(vo, clip / (np.max(np.abs(clip)) + 1e-9) * 0.8, c["a"] / FPS)
    close = next(s for s in P["segments"] if s["id"] == "CLOSE")
    mL, mR = music(n, (close["f0"] + 64) / FPS)
    sL, sR = sfx(P, n)
    irL, irR = reverb_ir(2.2, 11), reverb_ir(2.2, 12)
    mL, mR = mL + 0.3 * fconv(mL + 0.3 * sL, irL), mR + 0.3 * fconv(mR + 0.3 * sR, irR)
    present = smooth((np.abs(vo) > 0.01).astype(float), SR * 0.3)
    duck = 1 - 0.62 * np.clip(present * 3, 0, 1)  # music sits well under the voice
    fade = np.clip((n / SR - np.arange(n) / SR) / 1.4, 0, 1)
    L = (mL * duck * 0.8 + sL * 0.9 + vo) * fade
    R = (mR * duck * 0.8 + sR * 0.9 + vo) * fade
    peak = max(np.max(np.abs(L)), np.max(np.abs(R)))
    pcm = (np.stack([L, R], axis=1) / peak * 0.89 * 32767).astype(np.int16)
    with wave.open(str(AUD / "mix.wav"), "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes(pcm.tobytes())
    print(f"mix → {AUD / 'mix.wav'}  voice: {voice}")
    for src in ("gr-services-16x9.mp4", "gr-services-9x16.mp4"):
        if (OUT / src).exists():
            dst = OUT / src.replace(".mp4", "-audio.mp4")
            subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", str(OUT / src), "-i", str(AUD / "mix.wav"),
                            "-map", "0:v", "-map", "1:a", "-c:v", "copy", "-af", "loudnorm=I=-16:TP=-1.5:LRA=11",
                            "-ar", "48000", "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart",
                            str(dst)], check=True)
            print("with audio →", dst, f"{dst.stat().st_size / 1e6:.1f} MB")


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else "mix"
    {"plan": plan, "mix": mix}[cmd]()
