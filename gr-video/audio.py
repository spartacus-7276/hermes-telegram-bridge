#!/usr/bin/env python3
"""Sound for the film: an original 120 BPM music bed, sound design synced to the picture, and the
voiceover when a TTS voice is reachable. Muxed onto copies of both cuts; the silent masters stay as they are.

  python3 audio.py            # build out/audio/mix.wav and the *-audio.mp4 files
  python3 audio.py --no-vo    # music and sound design only

Everything musical is synthesised here — no samples, nothing licensed. Events are written in film frames
(30 fps) so they land on the same frames as the picture in both cuts.

Voiceover: edge-tts, Indian English (en-IN-PrabhatNeural), lines from SCRIPT.md. If the speech service is
unreachable the mix is built without it; run this again on a machine that can reach it to add the voice.
"""
import argparse
import asyncio
import os
import ssl
import subprocess
import wave
from pathlib import Path

import numpy as np

HERE = Path(__file__).resolve().parent
OUT = HERE / "out"
AUD = OUT / "audio"
SR = 48000
FPS = 30
LENGTH = 90.0
N = int(LENGTH * SR)
VOICE = "en-IN-PrabhatNeural"
RNG = np.random.default_rng(7)  # fixed seed: the mix is reproducible

# ---------------------------------------------------------------- voiceover lines (seconds, text)
VO = [
    (1.2, "It's ten forty-two at night. Someone is looking for a two B H K in Wakad. Right now."),
    (6.9, "We put your project in front of people who are already searching for it."),
    (17.3, "He looks, and leaves without enquiring."),
    (20.1, "Then Meta brings him back."),
    (24.2, "One page for each project. Price, plan, RERA, possession. Built to make him ask."),
    (32.4, "He taps WhatsApp. It answers in nine seconds. At any hour."),
    (39.2, "In his language."),
    (43.0, "And the moment he asks for a person, it hands him over."),
    (52.4, "Every lead writes itself down. Nothing is retyped."),
    (57.0, "You see every lead the moment it lands."),
    (61.4, "Give it to the right person,"),
    (67.7, "and watch it become a booking."),
    (74.7, "Even the old list gets called, by an AI agent that speaks his language."),
    (83.0, "The hot ones land in the same place."),
    (86.6, "Golden Ratio Solution. Book a free thirty-minute check."),
]


async def _tts():
    import edge_tts
    import edge_tts.communicate as comm
    ca = os.environ.get("SSL_CERT_FILE") or "/root/.ccr/ca-bundle.crt"
    if Path(ca).exists():  # a cloud session's proxy re-signs TLS; verify against its CA
        comm._SSL_CTX = ssl.create_default_context(cafile=ca)
    for i, (_, text) in enumerate(VO):
        dst = AUD / f"vo_{i:02d}.mp3"
        if dst.exists() and dst.stat().st_size > 0:
            continue
        tmp = dst.with_suffix(".part")
        await edge_tts.Communicate(text, VOICE, rate="-6%").save(str(tmp))
        tmp.replace(dst)


def make_vo():
    try:
        asyncio.run(_tts())
        return True
    except Exception as e:  # noqa: BLE001 — any network or service failure means "no voice this run"
        for p in AUD.glob("vo_*.part"):
            p.unlink()
        print(f"voiceover skipped ({type(e).__name__}): the speech service is not reachable from here")
        return False


def decode(path):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(path), "-f", "f32le", "-ac", "1", "-ar", str(SR), "-"],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32).astype(np.float64)


# ---------------------------------------------------------------- helpers
def midi(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def add(buf, sig, at_s, gain=1.0):
    a = int(round(at_s * SR))
    if a >= len(buf):
        return
    if a < 0:
        sig, a = sig[-a:], 0
    b = min(len(buf), a + len(sig))
    buf[a:b] += sig[: b - a] * gain


def env(n, attack, tau):
    t = np.arange(n) / SR
    return np.clip(t / max(attack, 1e-4), 0, 1) * np.exp(-np.maximum(t - attack, 0) / tau)


def tone(f, dur, attack=0.005, tau=0.3, partials=((1, 1.0),)):
    n = int(dur * SR)
    t = np.arange(n) / SR
    s = sum(a * np.sin(2 * np.pi * f * k * t) for k, a in partials)
    return s * env(n, attack, tau)


def noise(dur):
    return RNG.standard_normal(int(dur * SR))


def smooth(x, k):
    k = max(1, int(k))
    return np.convolve(x, np.ones(k) / k, mode="same")


def curve(points):
    """Piecewise-linear control curve over the film, points = [(seconds, value), ...]."""
    xs, ys = zip(*points)
    return np.interp(np.arange(N) / SR, xs, ys)


def fconv(x, ir):
    n = len(x) + len(ir) - 1
    nfft = 1 << (n - 1).bit_length()
    y = np.fft.irfft(np.fft.rfft(x, nfft) * np.fft.rfft(ir, nfft), nfft)[: len(x)]
    return y


def reverb_ir(seconds, seed):
    rng = np.random.default_rng(seed)
    n = int(seconds * SR)
    t = np.arange(n) / SR
    ir = rng.standard_normal(n) * np.exp(-t / (seconds / 5.0))
    ir = smooth(ir, 6)  # soften the tail
    ir[0] = 0
    return ir / np.sqrt(np.sum(ir ** 2))


# ---------------------------------------------------------------- music
BEAT = 0.5
# D major, two bars per chord: Dmaj9, Bm9, Gmaj7, Asus2 — (bass, chord tones) in MIDI
PROG = [(38, [54, 57, 61, 64]), (35, [50, 54, 57, 61]), (31, [47, 50, 54, 57]), (33, [50, 52, 57, 59])]
END_CHORD = (38, [54, 57, 61, 64, 69])

# section levels, in seconds (cuts: 5.93 S2 · 13.93 S3 · 21.93 S4 · 31.93 S5 · 49.93 S6 · 55.93 S7 · 73.93 S8 · 85.93 S9)
PAD = curve([(0, 0), (1.5, .55), (5.9, .6), (6.2, .8), (17.2, .8), (17.8, .22), (20.0, .22), (20.4, .85),
             (31.9, .9), (32.2, 1), (73.8, 1), (74.2, .85), (85.8, .85), (86.2, 1), (88.2, .9), (90, 0)])
PLUCK = curve([(0, 0), (5.9, 0), (6.4, .55), (17.2, .55), (17.6, 0), (20.0, 0), (20.6, .75), (31.9, .75),
               (32.3, 1), (73.8, 1), (74.2, .4), (85.7, .4), (86.0, 0), (90, 0)])
BASS = curve([(0, 0), (5.9, 0), (6.4, .5), (17.2, .5), (17.6, 0), (20.0, 0), (20.6, .7), (31.9, .7),
              (32.3, .85), (73.8, .85), (74.2, .6), (85.8, .6), (86.2, .7), (90, .7)])
BRIGHT = curve([(0, .4), (5.9, .4), (6.3, 1), (73.8, 1), (74.3, .25), (85.8, .25), (86.2, 1), (90, 1)])


def chord_at(sec):
    return END_CHORD if sec >= 85.93 else PROG[int(sec // 4.0) % 4]


def music():
    L = np.zeros(N)
    Rr = np.zeros(N)
    t_all = np.arange(N) / SR
    # pad: one voice per chord tone, overlapping crossfades between chords
    seg = 4.0
    starts = list(np.arange(0, 86.0, seg)) + [85.93]
    for i, s0 in enumerate(starts):
        s1 = starts[i + 1] if i + 1 < len(starts) else LENGTH
        bass, tones = chord_at(s0 + .01)
        dur = (s1 - s0) + 1.6
        n = int(dur * SR)
        t = np.arange(n) / SR
        e = np.clip(t / 0.9, 0, 1) * np.clip((dur - t) / 1.6, 0, 1)
        a = int(s0 * SR)
        b = min(N, a + n)
        bright = BRIGHT[a:b]
        lvl = PAD[a:b]
        for j, m in enumerate(tones):
            f = midi(m)
            for det, pan in ((-0.0018, 0.7), (0.0018, 0.3)):
                ff = f * (1 + det)
                v = np.sin(2 * np.pi * ff * t[: b - a]) + bright * (0.22 * np.sin(2 * np.pi * 2 * ff * t[: b - a] + j)
                                                                    + 0.08 * np.sin(2 * np.pi * 3 * ff * t[: b - a]))
                v *= e[: b - a] * lvl * 0.055
                L[a:b] += v * pan
                Rr[a:b] += v * (1 - pan)
    # bass on beats 1 and 3
    for k in range(int(LENGTH / (2 * BEAT))):
        s = k * 2 * BEAT
        lvl = BASS[min(N - 1, int(s * SR))]
        if lvl <= 0.01:
            continue
        bass, _ = chord_at(s + .01)
        sig = tone(midi(bass + 12), 0.9, 0.01, 0.38, ((1, 1), (2, .25))) * 0.16 * lvl
        add(L, sig, s)
        add(Rr, sig, s)
    # plucked arpeggio on eighth notes, up an octave
    pattern = [0, 2, 1, 3, 2, 1, 3, 2]
    for k in range(int(LENGTH / (BEAT / 2))):
        s = k * BEAT / 2
        lvl = PLUCK[min(N - 1, int(s * SR))]
        if lvl <= 0.01:
            continue
        _, tones = chord_at(s + .01)
        m = tones[pattern[k % 8] % len(tones)] + 12
        dark = s > 73.93 and s < 85.93
        sig = tone(midi(m - (12 if dark else 0)), 0.7, 0.004, 0.22, ((1, 1), (2, .3), (4, .05)))
        accent = 1.0 if k % 2 == 0 else 0.7
        pan = 0.35 + 0.3 * ((k * 37) % 7) / 6
        add(L, sig, s, 0.05 * lvl * accent * pan)
        add(Rr, sig, s, 0.05 * lvl * accent * (1 - pan))
    return L, Rr


# ---------------------------------------------------------------- sound design (frames → seconds)
def F(f):
    return f / FPS


def s_click():
    n = noise(0.03) * env(int(0.03 * SR), 0.0005, 0.004)
    n = n - np.concatenate([[0], n[:-1]])  # high-pass
    t = np.arange(int(0.03 * SR)) / SR
    body = np.sin(2 * np.pi * (1400 - 18000 * t) * t) * env(len(t), 0.0005, 0.008)
    return 0.5 * n + 0.6 * body


def s_key(i):
    n = noise(0.012) * env(int(0.012 * SR), 0.0003, 0.0025)
    n = n - np.concatenate([[0], n[:-1]])
    return n * (0.8 + 0.4 * ((i * 53) % 9) / 8)


def s_tock(f=880):
    return tone(f, 0.12, 0.002, 0.03, ((1, 1), (2.7, .2)))


def s_whoosh(dur=0.6, centre=1.0):
    n = noise(dur)
    lp = smooth(n, 40) * 4
    bp = lp - smooth(lp, 400)
    t = np.arange(len(n)) / SR
    shape = np.sin(np.pi * np.clip(t / dur, 0, 1)) ** 2
    return bp * shape * centre


def s_msg_in():
    return np.concatenate([tone(midi(79), 0.07, 0.002, 0.03), tone(midi(86), 0.18, 0.002, 0.06)])


def s_msg_out():
    return tone(midi(84), 0.16, 0.002, 0.045, ((1, 1), (2, .15)))


def s_bell(m):
    f = midi(m)
    n = int(2.2 * SR)
    t = np.arange(n) / SR
    s = np.zeros(n)
    for k, a, tau in ((1, 1, 1.1), (2.0, .35, .6), (2.76, .25, .4), (5.4, .08, .2)):
        s += a * np.sin(2 * np.pi * f * k * t) * np.exp(-t / tau)
    return s * np.clip(t / 0.003, 0, 1)


def s_marimba(m):
    return tone(midi(m), 1.2, 0.002, 0.45, ((1, 1), (4, .18), (10, .03)))


def s_ring():
    n = int(0.42 * SR)
    t = np.arange(n) / SR
    s = (np.sin(2 * np.pi * 440 * t) + np.sin(2 * np.pi * 480 * t)) * 0.5
    s *= (0.6 + 0.4 * np.sin(2 * np.pi * 20 * t)) * np.clip(t / 0.02, 0, 1) * np.clip((0.42 - t) / 0.05, 0, 1)
    return s


def s_crinkle(dur=0.6):
    n = noise(dur)
    gates = (RNG.random(len(n)) < 0.004).astype(float)
    gates = smooth(gates, 120) * 60
    hp = n - smooth(n, 6)
    return hp * gates * np.sin(np.pi * np.clip(np.arange(len(n)) / len(n), 0, 1))


def sfx():
    L = np.zeros(N)
    R = np.zeros(N)

    def put(sig, frame, gain, pan=0.5):
        add(L, sig, F(frame), gain * (1 - pan) * 2)
        add(R, sig, F(frame), gain * pan * 2)

    def whoosh_at(cut_frame, gain=0.05, dur=0.7):
        put(s_whoosh(dur), cut_frame - dur * FPS * 0.62, gain)

    # S1 — the screen wakes; the screen becomes the frame
    put(tone(midi(81), 1.2, 0.02, 0.5, ((1, 1), (2, .2))), 18, 0.035)
    whoosh_at(178, 0.06)
    # S2 — typing, results, the press
    for k in range(31):
        put(s_key(k), 186 + 2 * k, 0.05, 0.45 + 0.1 * ((k * 7) % 3) / 2)
    for i in range(3):
        put(s_tock(820 + 60 * i), 256 + 4 * i, 0.05)
    put(s_click(), 330, 0.12)
    whoosh_at(418, 0.06)
    # S3 — scrolls, back, the silence, the feed, the tap
    put(s_whoosh(0.5), 448, 0.025)
    put(s_whoosh(0.5), 478, 0.025)
    put(s_click(), 510, 0.1)
    put(s_whoosh(1.2), 562, 0.045)
    put(s_click(), 626, 0.12)
    whoosh_at(658, 0.06)
    # S4 — the page builds, the template crumples, the door, the bar locks, WhatsApp
    for k in range(5):
        put(s_tock(1180 + 90 * k), 660 + 6 * k, 0.03)
    put(s_crinkle(0.7), 670, 0.09, 0.35)
    put(s_whoosh(0.6), 700, 0.035, 0.3)
    put(s_tock(620), 746, 0.06)
    put(s_click(), 872, 0.13)
    whoosh_at(958, 0.06, 0.9)
    # S5 — the thread (picture frames, including the 0:09 hold)
    for lf in (24, 196, 300):
        put(s_msg_in(), 958 + lf, 0.06, 0.4)
    for lf in (84, 120, 134, 152, 232, 320):
        put(s_msg_out(), 958 + lf, 0.055, 0.6)
    put(s_bell(88), 958 + 84, 0.075)            # the 0:09 moment
    put(np.concatenate([s_msg_out(), tone(midi(88), .3, .002, .08)]), 958 + 338, 0.05)  # handed to a human
    whoosh_at(1498, 0.06, 0.9)
    # S6 — five cells on the eighth notes
    for k, lf in enumerate((32, 40, 47, 55, 62)):
        put(s_tock(1900 + 70 * k), 1498 + lf, 0.035)
    put(tone(midi(86), .4, .002, .12), 1498 + 68, 0.03)
    # S7 — lands, drag, assign, her screen, Saturday, the two status changes, 11 → 12
    put(s_tock(300), 1678 + 70, 0.07)
    put(s_click(), 1678 + 152, 0.09)
    put(s_tock(700), 1678 + 198, 0.06)
    put(tone(midi(83), .25, .002, .07), 1678 + 206, 0.04)
    whoosh_at(1678 + 262, 0.05)
    put(s_whoosh(0.8), 1678 + 296, 0.035)
    for lf in (344, 370, 404, 428):
        put(s_click(), 1678 + lf, 0.09)
    put(tone(midi(81), .5, .002, .15, ((1, 1), (2, .2))), 1678 + 373, 0.035)  # visit done
    put(s_bell(86), 1678 + 431, 0.06)                                        # booking done
    put(s_key(1), 1678 + 448, 0.06)
    put(s_key(2), 1678 + 452, 0.06)
    whoosh_at(2218, 0.07, 1.1)
    # S8 — ring, connect, the row goes green, two flights, the line
    put(s_ring(), 2218 + 98, 0.035)
    put(s_ring(), 2218 + 112 - 6, 0.0)
    put(tone(midi(76), .3, .002, .08), 2218 + 112, 0.04)
    put(tone(midi(79), .5, .01, .15), 2218 + 246, 0.04)
    put(s_whoosh(0.9), 2218 + 266, 0.04, 0.35)
    put(s_whoosh(0.7), 2218 + 298, 0.035, 0.65)
    put(s_tock(500), 2218 + 318, 0.05)
    whoosh_at(2578, 0.04)
    # S9 — five notes on the beat, the logo blooms
    for k, m in enumerate((74, 76, 78, 81, 86)):
        put(s_marimba(m), 2578 + 2 + 15 * k, 0.07, 0.3 + 0.1 * k)
    for m in (62, 66, 69, 73, 76):
        put(tone(midi(m), 2.6, 0.25, 1.4, ((1, 1), (2, .12))), 2578 + 64, 0.022)
    put(tone(midi(93), .9, .004, .3), 2578 + 74, 0.015)
    return L, R


# ---------------------------------------------------------------- mix
def build(with_vo):
    AUD.mkdir(parents=True, exist_ok=True)
    mL, mR = music()
    sL, sR = sfx()
    # room: more on the music, a touch on the effects
    irL, irR = reverb_ir(2.4, 11), reverb_ir(2.4, 12)
    wetL = fconv(mL + 0.3 * sL, irL)
    wetR = fconv(mR + 0.3 * sR, irR)
    music_L = mL + 0.32 * wetL
    music_R = mR + 0.32 * wetR
    vo = np.zeros(N)
    if with_vo:
        for i, (start, _) in enumerate(VO):
            p = AUD / f"vo_{i:02d}.mp3"
            if p.exists():
                add(vo, decode(p), start, 1.0)
        present = smooth((np.abs(vo) > 0.01).astype(float), SR * 0.3)
        duck = 1 - 0.5 * np.clip(present * 3, 0, 1)
        music_L, music_R = music_L * duck, music_R * duck
    fade = np.clip((LENGTH - np.arange(N) / SR) / 1.6, 0, 1)
    L = (music_L * 0.9 + sL + vo * 0.95) * fade
    R = (music_R * 0.9 + sR + vo * 0.95) * fade
    peak = max(np.max(np.abs(L)), np.max(np.abs(R)))
    L, R = L / peak * 0.89, R / peak * 0.89
    pcm = (np.stack([L, R], axis=1) * 32767).astype(np.int16)
    with wave.open(str(AUD / "mix.wav"), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())
    print("mix →", AUD / "mix.wav", "(with voiceover)" if with_vo else "(music and sound design)")


def mux():
    for src in ("gr-realestate-journey-90s.mp4", "gr-realestate-journey-9x16.mp4"):
        if not (OUT / src).exists():
            continue
        dst = OUT / src.replace(".mp4", "-audio.mp4")
        subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", str(OUT / src), "-i", str(AUD / "mix.wav"),
                        "-map", "0:v", "-map", "1:a", "-c:v", "copy",
                        "-af", "loudnorm=I=-16:TP=-1.5:LRA=11", "-ar", "48000", "-c:a", "aac", "-b:a", "192k",
                        "-shortest", "-movflags", "+faststart", str(dst)], check=True)
        print("with audio →", dst, f"{dst.stat().st_size / 1e6:.1f} MB")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--no-vo", action="store_true", help="music and sound design only")
    a = ap.parse_args()
    AUD.mkdir(parents=True, exist_ok=True)
    with_vo = False if a.no_vo else make_vo()
    with_vo = with_vo and all((AUD / f"vo_{i:02d}.mp3").exists() for i in range(len(VO)))
    build(with_vo)
    mux()


if __name__ == "__main__":
    main()
