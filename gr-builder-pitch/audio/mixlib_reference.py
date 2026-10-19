"""Helpers copied from gr-showreel/audio/mix.py (45 s showreel): music bed + processed voiceover + synthesized sound design + bundled UI foley.

Writes audio/mix.wav (48 kHz stereo). Loudness is normalised later by ffmpeg loudnorm at encode time.
"""
import json
from pathlib import Path
import av
import numpy as np
from scipy import signal as ss

HERE = Path(__file__).parent
SR, DUR = 48000, 55.2
N = int(SR * DUR)
SFX = Path(r"C:\Users\Admin\.claude\plugins\cache\brag\brag\0.4.0\skills\brag\assets\sfx")
MUSIC = Path(r"C:\Users\Admin\.claude\plugins\cache\brag\brag\0.4.0\skills\brag\assets\music\happy-beats-business-moves-vol-1-by-ende-dot-app.mp3")
rng = np.random.default_rng(42)


def load(path, stereo=True):
    c = av.open(str(path))
    rs = av.AudioResampler(format="fltp", layout="stereo" if stereo else "mono", rate=SR)
    parts = [g.to_ndarray() for f in c.decode(audio=0) for g in rs.resample(f)]
    c.close()
    return np.concatenate(parts, axis=1)  # (ch, n)


def st(x, pan=0.0):  # mono -> stereo with constant-power pan (-1..1)
    a = (pan + 1) * np.pi / 4
    return np.vstack([x * np.cos(a), x * np.sin(a)])


def add(bus, x, t, gain=1.0):
    i = int(t * SR)
    if x.ndim == 1:
        x = st(x)
    j = min(N, i + x.shape[1])
    if i < N and j > i:
        bus[:, i:j] += x[:, : j - i] * gain


def db(v):
    return 10 ** (v / 20)


def env_exp(n, k):
    return np.exp(-np.arange(n) / SR * k)


def bp(x, lo, hi, order=2):
    return ss.sosfilt(ss.butter(order, [lo, hi], "band", fs=SR, output="sos"), x)


def lp(x, f, order=2):
    return ss.sosfilt(ss.butter(order, f, "low", fs=SR, output="sos"), x)


def hp(x, f, order=2):
    return ss.sosfilt(ss.butter(order, f, "high", fs=SR, output="sos"), x)


# ---------------------------------------------------------------- synth voices
IR = None


def reverb(x, length=1.8, mix=.35, damp=3.2):
    global IR
    n = int(length * SR)
    if IR is None or IR.shape[1] != n:
        t = np.arange(n) / SR
        IR = np.vstack([lp(rng.standard_normal(n), 6000) * np.exp(-t * damp) for _ in range(2)]) * .05
    if x.ndim == 1:
        x = st(x)
    wet = np.vstack([np.pad(ss.fftconvolve(x[c], IR[c]), (0, 1))[: x.shape[1] + n] for c in range(2)])
    dry = np.pad(x, ((0, 0), (0, n)))
    return dry * (1 - mix) + wet * mix / (np.abs(wet).max() + 1e-9) * np.abs(x).max() * 1.4


def boom(dur=1.6, f0=95, f1=32, k=2.6):
    n = int(dur * SR); t = np.arange(n) / SR
    f = f1 + (f0 - f1) * np.exp(-t * 9)
    ph = 2 * np.pi * np.cumsum(f) / SR
    x = np.sin(ph) * np.exp(-t * k)
    click = lp(rng.standard_normal(n), 3000) * np.exp(-t * 90) * .5
    return np.tanh((x + click) * 1.6)


def impact(big=True):
    n = int(2.4 * SR); t = np.arange(n) / SR
    crash = hp(rng.standard_normal(n), 800) * np.exp(-t * (5 if big else 11)) * .35
    body = lp(rng.standard_normal(n), 900) * np.exp(-t * 16) * .6
    b = boom(2.4 if big else 1.0, 110 if big else 140, 30 if big else 45, 2.2 if big else 4.5)
    b = np.pad(b, (0, n - len(b)))
    x = b + body + crash
    return reverb(x / np.abs(x).max(), 2.4 if big else 1.2, .45 if big else .25)


def whoosh(dur=.7, f_lo=300, f_hi=4000, rise=True, pan=(-.6, .6)):
    n = int(dur * SR); t = np.linspace(0, 1, n)
    noise = rng.standard_normal(n)
    out = np.zeros(n)
    bands = np.geomspace(f_lo, f_hi, 10)
    for i, fc in enumerate(bands if rise else bands[::-1]):
        centre = (i + .5) / len(bands)
        g = np.exp(-((t - centre) ** 2) / (2 * .09 ** 2))
        out += bp(noise, fc * .7, min(fc * 1.4, SR / 2 - 100)) * g
    shape = np.sin(np.pi * t) ** 1.5
    out = out * shape / (np.abs(out).max() + 1e-9)
    pn = np.linspace(pan[0], pan[1], n)
    return np.vstack([out * np.cos((pn + 1) * np.pi / 4), out * np.sin((pn + 1) * np.pi / 4)])


def riser(dur=2.0, f0=180, f1=1400):
    n = int(dur * SR); t = np.linspace(0, 1, n)
    f = f0 * (f1 / f0) ** t
    tone = np.sin(2 * np.pi * np.cumsum(f) / SR) * .35 + np.sin(2 * np.pi * np.cumsum(f * 1.5) / SR) * .15
    nz = np.zeros(n); noise = rng.standard_normal(n)
    for i, fc in enumerate(np.geomspace(400, 9000, 12)):
        g = np.clip(t * 12 - i, 0, 1)
        nz += bp(noise, fc * .8, min(fc * 1.25, 23000)) * g / 12
    x = (tone + nz * 1.4) * (t ** 2.2)
    return st(x / np.abs(x).max())


def rev_swell(dur=1.0):
    x = reverb(hp(rng.standard_normal(int(dur * SR)), 1500) * np.exp(-np.arange(int(dur * SR)) / SR * 4), 1.4, .8)[0]
    y = x[::-1][-int(dur * SR):]
    return st(y / np.abs(y).max() * np.linspace(0, 1, len(y)) ** 2)


def shimmer(freqs=(880, 1108.7, 1318.5, 1760, 2217.5, 2637), dur=3.0, stagger=.06, k=1.4):
    n = int(dur * SR); t = np.arange(n) / SR
    out = np.zeros((2, n))
    for i, f in enumerate(freqs):
        d = int(i * stagger * SR); tt = t[: n - d]
        v = np.sin(2 * np.pi * f * tt + .002 * np.sin(2 * np.pi * 5 * tt) * f) * np.exp(-tt * k) * (1 - np.exp(-tt * 200))
        v += .3 * np.sin(2 * np.pi * f * 2.01 * tt) * np.exp(-tt * k * 2)
        out[:, d:] += st(v, (i / (len(freqs) - 1)) * 1.2 - .6)
    return reverb(out / np.abs(out).max(), 2.0, .5)


def chime(notes=(1318.5, 1760), gap=.09, k=7):
    n = int(1.0 * SR); t = np.arange(n) / SR; out = np.zeros(n)
    for i, f in enumerate(notes):
        d = int(i * gap * SR); tt = t[: n - d]
        out[d:] += (np.sin(2 * np.pi * f * tt) + .25 * np.sin(2 * np.pi * f * 3 * tt)) * np.exp(-tt * k) * (1 - np.exp(-tt * 400))
    return reverb(out / np.abs(out).max(), .9, .25)


def beep(f=1500, dur=.07):
    n = int(dur * SR); t = np.arange(n) / SR
    return np.sin(2 * np.pi * f * t) * np.sin(np.pi * t / dur) ** .5


def thump(f=72, dur=.28):
    n = int(dur * SR); t = np.arange(n) / SR
    fr = f + 90 * np.exp(-t * 40)
    return np.tanh(np.sin(2 * np.pi * np.cumsum(fr) / SR) * np.exp(-t * 14) * 2)


def ring():
    n = int(.9 * SR); t = np.arange(n) / SR
    tone = (np.sin(2 * np.pi * 440 * t) + np.sin(2 * np.pi * 480 * t)) * .5
    gate = ((t % .45) < .3).astype(float)
    return lp(tone * gate * np.exp(-t * 1.2), 3500)


def pad(dur, freqs=(55, 82.41, 110, 164.8), swell=(0, 2.2)):
    n = int(dur * SR); t = np.arange(n) / SR
    out = np.zeros(n)
    for f in freqs:
        for det in (-.3, .3):
            out += np.sin(2 * np.pi * (f + det) * t + rng.random() * 6)
    out = lp(out, 900)
    a = np.clip((t - swell[0]) / swell[1], 0, 1)
    return st(out / np.abs(out).max() * a)


_cache = {}


def foley(name):
    if name not in _cache:
        x = load(SFX / name)
        _cache[name] = x / (np.abs(x).max() + 1e-9)
    return _cache[name]


# ---------------------------------------------------------------- VO chain
def vo_chain(x):
    x = hp(x, 85, 3)
    # presence lift + low-mid cleanup via parallel bands
    x = x + .35 * bp(x, 2500, 6000) - .18 * bp(x, 220, 450)
    # RMS compressor (4:1 above threshold), 10 ms attack / 120 ms release
    e = np.sqrt(ss.lfilter([1 - np.exp(-1 / (.01 * SR))], [1, -np.exp(-1 / (.01 * SR))], x ** 2) + 1e-12)
    e = ss.lfilter([1 - np.exp(-1 / (.12 * SR))], [1, -np.exp(-1 / (.12 * SR))], e)
    thr = .12
    g = np.where(e > thr, (thr * (e / thr) ** .25) / e, 1.0)
    x = x * g
    # gentle de-ess
    s = bp(x, 5500, 9000)
    se = np.abs(ss.hilbert(s)); se = lp(se, 60)
    x = x - s * np.clip((se - .03) / .08, 0, .6)
    return x / (np.abs(x).max() + 1e-9)


