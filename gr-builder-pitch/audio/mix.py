"""Builder pitch soundtrack: final voice-over + soft synthesized SFX (no music: that is added at home).

The voice clips sit at their timing.json starts, untouched apart from one static gain.
The SFX come from the page's own cue list (gen/cues.json, written by tools/export_cues.py); each one is placed
so that its peak lands on the cue. Synth voices follow audio/mixlib_reference.py.
Loudness: one static gain brings the mix to -14 LUFS integrated, then a true-peak-safe limiter holds -1 dBTP.
The same gain is applied to both stems, so voice.wav + sfx.wav sum to the mix (before the limiter).

Writes out/audio/mix.wav, out/audio/voice.wav, out/audio/sfx.wav (48 kHz stereo, 24-bit).
    python audio/mix.py
"""
import json
from pathlib import Path

import numpy as np
import pyloudnorm as pyln
import soundfile as sf
from scipy import signal as ss
from scipy.ndimage import minimum_filter1d

HERE = Path(__file__).parent
ROOT = HERE.parent
OUT = ROOT / "out" / "audio"; OUT.mkdir(parents=True, exist_ok=True)
SR, DUR = 48000, 66.3
N = int(SR * DUR)
rng = np.random.default_rng(42)  # seeded: the same mix every run


def st(x, pan=0.0):  # mono -> stereo with constant-power pan (-1..1)
    a = (pan + 1) * np.pi / 4
    return np.vstack([x * np.cos(a), x * np.sin(a)])


def bp(x, lo, hi, order=2):
    return ss.sosfilt(ss.butter(order, [lo, hi], "band", fs=SR, output="sos"), x)


def lp(x, f, order=2):
    return ss.sosfilt(ss.butter(order, f, "low", fs=SR, output="sos"), x)


def hp(x, f, order=2):
    return ss.sosfilt(ss.butter(order, f, "high", fs=SR, output="sos"), x)


def reverb(x, length=1.2, mix=.25, damp=3.2):
    n = int(length * SR); t = np.arange(n) / SR
    ir = np.vstack([lp(rng.standard_normal(n), 6000) * np.exp(-t * damp) for _ in range(2)]) * .05
    if x.ndim == 1:
        x = st(x)
    wet = np.vstack([np.pad(ss.fftconvolve(x[c], ir[c]), (0, 1))[: x.shape[1] + n] for c in range(2)])
    dry = np.pad(x, ((0, 0), (0, n)))
    return dry * (1 - mix) + wet * mix / (np.abs(wet).max() + 1e-9) * np.abs(x).max() * 1.4


# ---------------------------------------------------------------- synth voices (soft, short)
def tick():  # one missed-call row / one brand flip: a small wooden tick
    n = int(.05 * SR); t = np.arange(n) / SR
    x = np.sin(2 * np.pi * 1850 * t) * np.exp(-t * 160) + .35 * bp(rng.standard_normal(n), 2500, 7000) * np.exp(-t * 400)
    return reverb(x / np.abs(x).max(), .4, .12)


def pop():  # a chat bubble landing
    n = int(.12 * SR); t = np.arange(n) / SR
    f = 520 + 520 * np.exp(-t * 45)
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 38) * (1 - np.exp(-t * 900))
    return reverb(x / np.abs(x).max(), .5, .14)


def chime(notes=(1318.5, 1760), gap=.09, k=7):
    n = int(1.0 * SR); t = np.arange(n) / SR; out = np.zeros(n)
    for i, f in enumerate(notes):
        d = int(i * gap * SR); tt = t[: n - d]
        out[d:] += (np.sin(2 * np.pi * f * tt) + .25 * np.sin(2 * np.pi * f * 3 * tt)) * np.exp(-tt * k) * (1 - np.exp(-tt * 400))
    return reverb(out / np.abs(out).max(), .9, .25)


def click():  # the manager's mouse click: two tiny transients
    n = int(.06 * SR); t = np.arange(n) / SR
    a = hp(rng.standard_normal(n), 1800) * np.exp(-t * 700)
    b = np.roll(hp(rng.standard_normal(n), 1200) * np.exp(-t * 900), int(.018 * SR)) * .6
    x = a + b
    return st(x / np.abs(x).max())


def ring():  # one soft ring of the incoming call
    n = int(.9 * SR); t = np.arange(n) / SR
    tone = (np.sin(2 * np.pi * 440 * t) + np.sin(2 * np.pi * 480 * t)) * .5
    gate = np.clip(np.minimum(t / .02, (.42 - t) / .06), 0, 1) + np.clip(np.minimum((t - .48) / .02, (.88 - t) / .06), 0, 1)
    return reverb(lp(tone * gate, 2400), .8, .2)


def thump(f=72, dur=.3):  # a card landing
    n = int(dur * SR); t = np.arange(n) / SR
    fr = f + 90 * np.exp(-t * 40)
    x = np.tanh(np.sin(2 * np.pi * np.cumsum(fr) / SR) * np.exp(-t * 14) * 2)
    return reverb(x, .5, .1)


def impact():  # the logo resolving: a soft, low bloom
    n = int(1.6 * SR); t = np.arange(n) / SR
    f = 34 + 70 * np.exp(-t * 9)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 3.2)
    air = lp(rng.standard_normal(n), 2200) * np.exp(-t * 18) * .25
    x = np.tanh((body + air) * 1.3)
    return reverb(x / np.abs(x).max(), 1.8, .35)


def whoosh(dur=.6, f_lo=300, f_hi=3200):  # the tips card sliding up
    n = int(dur * SR); t = np.linspace(0, 1, n)
    noise = rng.standard_normal(n); out = np.zeros(n)
    bands = np.geomspace(f_lo, f_hi, 10)
    for i, fc in enumerate(bands):
        g = np.exp(-((t - (i + .5) / len(bands)) ** 2) / (2 * .09 ** 2))
        out += bp(noise, fc * .7, min(fc * 1.4, SR / 2 - 100)) * g
    out = out * np.sin(np.pi * t) ** 1.5 / (np.abs(out).max() + 1e-9)
    pn = np.linspace(-.4, .4, n)
    return np.vstack([out * np.cos((pn + 1) * np.pi / 4), out * np.sin((pn + 1) * np.pi / 4)])


SYNTH = {"tick": tick, "pop": pop, "chime": chime, "click": click, "ring": ring, "thump": thump, "impact": impact, "whoosh": whoosh}
LEVEL = {"tick": -27, "pop": -24, "chime": -24, "click": -24, "ring": -25, "thump": -23, "impact": -21, "whoosh": -28}  # dBFS peak, pre-gain


def place(bus, x, t_peak):
    """Add x so that its loudest sample lands at t_peak."""
    if x.ndim == 1:
        x = st(x)
    env = np.abs(x).max(0)
    pk = int(np.argmax(env))
    i = int(round(t_peak * SR)) - pk
    a, b = max(0, i), min(N, i + x.shape[1])
    if b > a:
        bus[:, a:b] += x[:, a - i: b - i]


def true_peak_db(x):
    up = ss.resample_poly(x, 4, 1, axis=1)
    return 20 * np.log10(np.abs(up).max() + 1e-12)


def limiter(x, ceiling_db=-1.0, release=.08):
    """Look-ahead peak limiter on the 4x-oversampled envelope (gain only ever goes down where needed)."""
    ceil = 10 ** (ceiling_db / 20) * .985
    up = np.abs(ss.resample_poly(x, 4, 1, axis=1)).max(0)
    env = up.reshape(-1, 4).max(1)[: x.shape[1]]
    need = np.minimum(1.0, ceil / (env + 1e-12))
    la = int(.005 * SR)  # 5 ms look-ahead: the gain starts falling before the peak
    need = minimum_filter1d(need, 2 * la + 1)
    g = np.empty_like(need); cur = 1.0; k = np.exp(-1 / (release * SR))
    for i, v in enumerate(need):
        cur = v if v < cur else v + (cur - v) * k
        g[i] = cur
    return x * g


def main():
    timing = json.loads((HERE / "timing.json").read_text())
    voice = np.zeros((2, N)); sfx = np.zeros((2, N))
    for line in timing:
        x, sr = sf.read(HERE / "vo" / f"{line['id']}.wav", dtype="float64")
        assert sr == SR
        i = int(round(line["start"] * SR))
        voice[:, i: i + len(x)] += st(x)[:, : N - i]
    for c in json.loads((ROOT / "gen" / "cues.json").read_text()):
        x = SYNTH[c["type"]]()
        x = x / np.abs(x).max() * 10 ** ((LEVEL[c["type"]] + 20 * np.log10(c["gain"])) / 20)
        place(sfx, x, c["t"])
    mix = voice + sfx
    meter = pyln.Meter(SR)
    lufs = meter.integrated_loudness(mix.T)
    gain = 10 ** ((-14.0 - lufs) / 20)
    voice *= gain; sfx *= gain; mix *= gain
    print(f"pre-gain {lufs:.2f} LUFS, gain {20 * np.log10(gain):+.2f} dB, true peak before limiter {true_peak_db(mix):.2f} dBTP")
    mix = limiter(mix, -1.0)
    print(f"final {meter.integrated_loudness(mix.T):.2f} LUFS, true peak {true_peak_db(mix):.2f} dBTP")
    for name, x in (("mix", mix), ("voice", voice), ("sfx", sfx)):
        sf.write(OUT / f"{name}.wav", x.T.astype(np.float32), SR, subtype="PCM_24")
    print("wrote", OUT)


if __name__ == "__main__":
    main()
