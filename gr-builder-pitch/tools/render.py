"""Render the film to JPEG frames: 60 fps, 4 motion-blur subframes per frame (t - 1/240 ... t + 1/240), averaged.
Subframes are clamped inside the frame's own scene, so a hard cut never turns into a one-frame dissolve.
Resumable and frame-range based: existing frames are skipped, so it can run in chunks or be restarted.
    python tools/render.py 16x9 [--captions] [--lang hi] [--start 0] [--end 3978] [--workers 3] [--out frames/16x9]
The Hindi film (--lang hi) runs 80.6 s, 4836 frames.
"""
import argparse
import asyncio
import base64
import io
import multiprocessing as mp
import os
import time
from pathlib import Path

import numpy as np
from PIL import Image
from playwright.async_api import async_playwright

from browser import launch_args

ROOT = Path(__file__).resolve().parent.parent
FPS, SUB = 60, 4
ENDS = {"en": 66.3, "hi": 80.6}  # 3978 / 4836 frames


def sub_times(f, cuts, END):
    t = f / FPS
    a = max(c for c in cuts if c <= t + 1e-9) if any(c <= t + 1e-9 for c in cuts) else 0.0
    b = min((c for c in cuts if c > t + 1e-9), default=END)
    return [float(min(max(t + o, a), b - 1e-4)) for o in np.linspace(-1 / 240, 1 / 240, SUB)]


async def work(shape, captions, lang, frames, out, wid):
    w, h = (1920, 1080) if shape == "16x9" else (1080, 1920)
    async with async_playwright() as p:
        b = await p.chromium.launch(**launch_args())
        pg = await b.new_page(viewport={"width": w, "height": h})
        pg.on("pageerror", lambda e: print(f"[w{wid}] pageerror", e, flush=True))
        q = "&".join(x for x, on in (("captions=1", captions), (f"lang={lang}", lang != "en")) if on)
        await pg.goto((ROOT / f"src/pitch-{shape}.html").as_uri() + ("?" + q if q else ""))
        await pg.evaluate("window.ready")
        cuts = await pg.evaluate("window.CUTS")
        END = await pg.evaluate("window.FILM.END"); assert abs(END - ENDS[lang]) < 1e-6, END
        cdp = await pg.context.new_cdp_session(pg)
        t0 = time.time(); done = 0
        for f in frames:
            dst = out / f"{f:05d}.jpg"
            if dst.exists() and dst.stat().st_size > 0:
                continue
            acc = None
            for ts in sub_times(f, cuts, END):
                await pg.evaluate(f"window.seek({ts!r})")
                shot = await cdp.send("Page.captureScreenshot", {"format": "png", "optimizeForSpeed": True})
                im = np.asarray(Image.open(io.BytesIO(base64.b64decode(shot["data"]))).convert("RGB"), dtype=np.float32)
                acc = im if acc is None else acc + im
            frame = Image.fromarray(np.clip(acc / SUB + .5, 0, 255).astype(np.uint8))
            tmp = dst.with_suffix(".tmp")
            frame.save(tmp, "JPEG", quality=95, subsampling=0); os.replace(tmp, dst)
            done += 1
            if done % 100 == 0:
                print(f"[w{wid}] {done} frames, {done / (time.time() - t0):.2f} fps, at {f}", flush=True)
        await b.close()


def run(args):
    shape, captions, lang, frames, out, wid = args
    asyncio.run(work(shape, captions, lang, frames, out, wid))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("shape"); ap.add_argument("--captions", action="store_true"); ap.add_argument("--lang", default="en", choices=ENDS)
    ap.add_argument("--start", type=int, default=0); ap.add_argument("--end", type=int)
    ap.add_argument("--workers", type=int, default=3); ap.add_argument("--out")
    a = ap.parse_args()
    out = ROOT / (a.out or f"frames/{a.shape}{'-captions' if a.captions else ''}")
    out.mkdir(parents=True, exist_ok=True)
    nframes = int(round(ENDS[a.lang] * FPS))
    frames = list(range(a.start, min(a.end or nframes, nframes)))
    chunks = [frames[i::a.workers] for i in range(a.workers)]  # interleaved: every worker crosses every scene
    with mp.Pool(a.workers) as pool:
        pool.map(run, [(a.shape, a.captions, a.lang, c, out, i) for i, c in enumerate(chunks)])
    missing = [f for f in frames if not (out / f"{f:05d}.jpg").exists()]
    print("done" if not missing else f"missing {len(missing)} frames")


if __name__ == "__main__":
    main()
