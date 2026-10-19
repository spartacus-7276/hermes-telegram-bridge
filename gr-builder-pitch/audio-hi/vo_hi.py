"""Builder pitch voiceover, HINGLISH (Edge voice hi-IN-MadhurNeural): line by line -> trimmed clips + word timings
-> hindi/timing.json. Same line ids (p01..p14) and scene meaning as the English version.
Each line also gets "cues": the English cue names the film is keyed to (books, one, confirm, ...) mapped to the
time of the matching Hindi word, so the picture can be re-cut to this voice.
    python vo_hi.py            (cached; --force re-synthesises)"""
import asyncio, json, math, sys
from pathlib import Path
import av
import numpy as np
import edge_tts

HERE = Path(__file__).parent
VOICE = "hi-IN-MadhurNeural"
SR, GRID = 48000, .25
P = ".,'?!।:"

# (id, gap before, tts text, rate, emphasised words, {english cue: hindi word})
LINES = [
    ("p01", 0.40, "पिछले महीने की कितनी enquiries को, आपकी team ने एक घंटे के अंदर call back किया?", "+8%", ["घंटे"], {}),
    ("p02", 0.90, "रात के दस बजकर चालीस मिनट पर, एक buyer आपका project देखता है।", "+10%", ["10:40"], {"10:40": "10:40"}),
    ("p03", 0.35, "सुबह तक, वो तीन और builders से बात कर चुका होता है।", "+10%", ["तीन"], {"morning": "सुबह", "three": "तीन"}),
    ("p04", 0.80, "Golden Ratio, enquiry और site visit के बीच का gap बंद करता है।", "+8%", ["gap"],
     {"Golden": "Golden", "gap": "gap", "visit": "visit"}),
    ("p05", 0.70, "हमारा WhatsApp A.I., सेकंडों में जवाब देता है, दिन हो या रात।", "+10%", ["सेकंडों"], {"seconds": "सेकंडों"}),
    ("p06", 0.30, "ये prices और brochure भेजता है, Hindi, English या Hinglish में जवाब देता है, और site visit book कर देता है।", "+14%",
     ["book"], {"prices": "prices", "brochure": "brochure", "Hinglish": "Hinglish", "books": "book"}),
    ("p07", 0.65, "हर lead आपके अपने CRM में आती है, पूरी बातचीत के साथ।", "+12%", ["अपने"], {"lands": "आती", "conversation": "बातचीत"}),
    ("p08", 0.30, "आपका manager, एक click में उसे assign करता है।", "+10%", ["click"], {"one": "एक"}),
    ("p09", 0.30, "हर salesperson को सिर्फ़ अपनी leads दिखती हैं, और आज के follow-ups।", "+12%", ["आज"], {"today's": "आज"}),
    ("p10", 0.65, "हमारा A.I. हर नई enquiry को वापस call करता है, और visit की सुबह फिर से call करके confirm करता है।", "+14%",
     ["confirm"], {"confirm": "confirm"}),
    ("p11", 0.65, "और सब कुछ एक screen पर दिखता है: leads, visits और bookings, channel के हिसाब से।", "+12%", ["सब"],
     {"everything": "सब", "leads": "leads", "visits": "visits", "bookings": "bookings"}),
    ("p12", 0.30, "हर हफ्ते, A.I. बताता है कि आप buyers कहाँ खो रहे हैं।", "+10%", ["खो"], {"losing": "खो"}),
    ("p13", 0.70, "आपका नाम। आपके रंग। आपके projects।", "+6%", ["projects"], {"name": "नाम", "colours": "रंग", "projects": "projects"}),
    ("p14", 0.75, "Golden Ratio. Free demo book करें, golden ratio solution dot com पर।", "+6%", ["demo"], {"Golden": "Golden", "demo": "demo"}),
]
SCREEN = {"A.I.": "AI", "A.I.,": "AI,", "A.I": "AI"}
MERGE = [(("दस", "बजकर", "चालीस", "मिनट"), "10:40"), (("golden", "ratio", "solution", "dot", "com"), "goldenratiosolution.com")]
norm = lambda s: s.strip(P)


def decode(path):
    c = av.open(str(path)); rs = av.AudioResampler(format="flt", layout="mono", rate=SR)
    out = [g.to_ndarray().reshape(-1) for f in c.decode(audio=0) for g in rs.resample(f)]
    c.close(); return np.concatenate(out)


def trim(x, thr_db=-45):
    env = np.abs(x); thr = 10 ** (thr_db / 20) * env.max(); idx = np.where(env > thr)[0]
    a, b = max(0, idx[0] - int(.015 * SR)), min(len(x), idx[-1] + int(.06 * SR))
    return x[a:b], a / SR


def caption_words(words, text):
    toks, out, i = text.split(), [], 0
    for w in words:
        j = i
        while j < len(toks) and norm(w["w"]) not in toks[j]:
            j += 1
        if j < len(toks):
            i = j
        tok = toks[i] if i < len(toks) else w["w"]
        out.append({"w": SCREEN.get(tok, tok), "t": w["t"], "d": w["d"]}); i += 1
    for seq, rep in MERGE:
        for k in range(len(out) - len(seq) + 1):
            if tuple(norm(o["w"]).lower() for o in out[k:k + len(seq)]) == seq:
                tail = out[k + len(seq) - 1]["w"]; punct = tail[len(tail.rstrip(P)):]
                out[k:k + len(seq)] = [{"w": rep + punct, "t": out[k]["t"], "d": sum(o["d"] for o in out[k:k + len(seq)])}]
                break
    return out


async def main():
    raw = HERE / "vo_raw"; raw.mkdir(exist_ok=True)
    timing, t = [], 0.0
    for lid, gap, text, rate, em, cues in LINES:
        mp3, wj = raw / f"{lid}.mp3", raw / f"{lid}.words.json"
        if not mp3.exists() or "--force" in sys.argv:
            words, audio = [], bytearray()
            async for ch in edge_tts.Communicate(text, VOICE, rate=rate, boundary="WordBoundary").stream():
                if ch["type"] == "audio":
                    audio += ch["data"]
                elif ch["type"] == "WordBoundary":
                    words.append({"w": ch["text"], "t": ch["offset"] / 1e7, "d": ch["duration"] / 1e7})
            mp3.write_bytes(bytes(audio)); wj.write_text(json.dumps(words, ensure_ascii=False), encoding="utf-8")
        words = json.loads(wj.read_text(encoding="utf-8"))
        x, lead = trim(decode(mp3))
        np.save(raw / f"{lid}.npy", x.astype(np.float32))
        start = math.ceil((t + gap) / GRID - 1e-6) * GRID
        dur = len(x) / SR
        cw = caption_words([{"w": w["w"], "t": round(start + w["t"] - lead, 3), "d": round(w["d"], 3)} for w in words], text)
        for w in cw:
            w["em"] = norm(w["w"]) in em
        cue_t = {}
        for en, hi in cues.items():
            hit = [w["t"] for w in cw if norm(w["w"]) == hi]
            assert hit, f"{lid}: cue word {hi!r} not found in {[w['w'] for w in cw]}"
            cue_t[en] = hit[-1] if en == "books" else hit[0]
        timing.append({"id": lid, "start": start, "dur": round(dur, 3), "end": round(start + dur, 3), "text": text,
                       "words": cw, "cues": cue_t})
        t = start + dur
        print(f"{lid} {start:6.2f}-{t:6.2f} ({dur:.2f}s)  {' '.join(w['w'] + ('*' if w['em'] else '') for w in cw)}  cues {cue_t}")
    (HERE / "timing.json").write_text(json.dumps(timing, indent=1, ensure_ascii=False), encoding="utf-8")
    print("total VO end", round(t, 2), "s")

asyncio.run(main())
