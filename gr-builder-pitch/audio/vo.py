"""Builder pitch voiceover: edge-tts line by line -> trimmed clips + word timings -> audio/timing.json + ../timing.js.
Line starts snap UP to the 0.25 s grid (120 BPM eighth notes), so every cut that hangs on a line lands on the beat.
    python audio/vo.py            (cached; --force re-synthesises)
"""
import asyncio, json, math, sys
from pathlib import Path
import av
import numpy as np
import edge_tts

HERE = Path(__file__).parent
VOICE = "en-US-AndrewMultilingualNeural"
SR = 48000
GRID = .25

# (id, gap before, tts text, rate, emphasised caption words)
LINES = [
    # 1 hook
    ("p01", 0.40, "How many of last month's enquiries did your team call back within an hour?", "+2%", ["hour?"]),
    # 2 the problem
    ("p02", 0.90, "A buyer finds your project at ten forty at night.", "+4%", ["10:40"]),
    ("p03", 0.35, "By morning, he's spoken to three other builders.", "+4%", ["three"]),
    # 3 the promise
    ("p04", 0.80, "Golden Ratio closes the gap between the enquiry and the site visit.", "+2%", ["gap"]),
    # 4 WhatsApp AI
    ("p05", 0.70, "Our WhatsApp A.I. replies in seconds, day or night.", "+4%", ["seconds,"]),
    ("p06", 0.30, "It shares prices and the brochure, answers questions in English or Hinglish, and books the site visit.", "+8%", ["books"]),
    # 5 CRM
    ("p07", 0.65, "Every lead lands in your own CRM, with the whole conversation.", "+6%", ["own"]),
    ("p08", 0.30, "Your manager assigns it in one click.", "+4%", ["one"]),
    ("p09", 0.30, "Each salesperson sees only their own leads, and today's follow-ups.", "+6%", ["today's"]),
    # 6 AI calling
    ("p10", 0.65, "Our A.I. calls every new enquiry back, and calls again on the morning of the visit to confirm.", "+6%", ["confirm."]),
    # 7 analytics + AI tips
    ("p11", 0.65, "And you see everything on one screen: leads, visits and bookings, by channel.", "+6%", ["everything"]),
    ("p12", 0.30, "Every week, A.I. tells you where you're losing buyers.", "+4%", ["losing"]),
    # 8 white label
    ("p13", 0.70, "Your name. Your colours. Your projects.", "-2%", ["projects."]),
    # 9 close
    ("p14", 0.75, "Golden Ratio. Book a free demo at golden ratio solution dot com.", "-4%", ["demo"]),
]
SCREEN = {"A.I.": "AI", "A.I": "AI", "solution": "goldenratiosolution.com"}
MERGE = [(("ten", "forty"), "10:40"), (("golden", "ratio", "goldenratiosolution.com", "dot", "com"), "goldenratiosolution.com.")]


def decode(path):
    c = av.open(str(path))
    rs = av.AudioResampler(format="flt", layout="mono", rate=SR)
    out = [g.to_ndarray().reshape(-1) for f in c.decode(audio=0) for g in rs.resample(f)]
    c.close()
    return np.concatenate(out)


def trim(x, thr_db=-45):
    env = np.abs(x); thr = 10 ** (thr_db / 20) * env.max()
    idx = np.where(env > thr)[0]
    a, b = max(0, idx[0] - int(.015 * SR)), min(len(x), idx[-1] + int(.06 * SR))
    return x[a:b], a / SR


def caption_words(words, text):
    toks, out, i = text.split(), [], 0
    for w in words:
        while i < len(toks) and w["w"].strip(".,'") not in toks[i]:
            i += 1
        tok = toks[i] if i < len(toks) else w["w"]
        out.append({"w": SCREEN.get(tok, tok), "t": w["t"], "d": w["d"]}); i += 1
    for seq, rep in MERGE:
        for k in range(len(out) - len(seq) + 1):
            if tuple(o["w"].strip(".,") for o in out[k:k + len(seq)]) == seq:
                out[k:k + len(seq)] = [{"w": rep, "t": out[k]["t"], "d": sum(o["d"] for o in out[k:k + len(seq)])}]
                break
    return out


async def main():
    raw = HERE / "vo_raw"; raw.mkdir(exist_ok=True)
    timing, t = [], 0.0
    for lid, gap, text, rate, em in LINES:
        mp3, wj = raw / f"{lid}.mp3", raw / f"{lid}.words.json"
        if not mp3.exists() or "--force" in sys.argv:
            words, audio = [], bytearray()
            async for ch in edge_tts.Communicate(text, VOICE, rate=rate, pitch="-2Hz", boundary="WordBoundary").stream():
                if ch["type"] == "audio":
                    audio += ch["data"]
                elif ch["type"] == "WordBoundary":
                    words.append({"w": ch["text"], "t": ch["offset"] / 1e7, "d": ch["duration"] / 1e7})
            mp3.write_bytes(bytes(audio)); wj.write_text(json.dumps(words), encoding="utf-8")
        words = json.loads(wj.read_text(encoding="utf-8"))
        x, lead = trim(decode(mp3))
        np.save(raw / f"{lid}.npy", x.astype(np.float32))
        start = math.ceil((t + gap) / GRID - 1e-6) * GRID
        dur = len(x) / SR
        hop = SR // 60
        env = [float(np.sqrt(np.mean(x[i:i + hop] ** 2))) for i in range(0, len(x), hop)]
        m = max(env) or 1
        cw = caption_words([{"w": w["w"], "t": round(start + w["t"] - lead, 3), "d": round(w["d"], 3)} for w in words], text)
        for w in cw:
            w["em"] = w["w"] in em
        timing.append({"id": lid, "start": start, "dur": round(dur, 3), "end": round(start + dur, 3), "text": text,
                       "words": cw, "env": [round(v / m, 3) for v in env]})
        t = start + dur
        print(f"{lid} {start:6.2f}-{t:6.2f} ({dur:.2f}s)  {' '.join(w['w'] + ('*' if w['em'] else '') for w in cw)}")
    (HERE / "timing.json").write_text(json.dumps(timing, indent=1), encoding="utf-8")
    (HERE.parent / "timing.js").write_text("window.TIMING = " + json.dumps(timing) + ";\n", encoding="utf-8")
    print("total VO end", round(t, 2), "s")

asyncio.run(main())
