"""Render single frames for QA: python tools/stills.py 16x9 3.9 10.6 ... [--captions] [--out out/stills] [--prefix name]"""
import argparse
import asyncio
from pathlib import Path

from playwright.async_api import async_playwright

from browser import launch_args

ROOT = Path(__file__).resolve().parent.parent


async def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("shape"); ap.add_argument("times", nargs="+", type=float)
    ap.add_argument("--captions", action="store_true"); ap.add_argument("--out", default="out/stills")
    ap.add_argument("--names", nargs="*")
    a = ap.parse_args()
    w, h = (1920, 1080) if a.shape == "16x9" else (1080, 1920)
    out = ROOT / a.out; out.mkdir(parents=True, exist_ok=True)
    async with async_playwright() as p:
        b = await p.chromium.launch(**launch_args())
        pg = await b.new_page(viewport={"width": w, "height": h})
        pg.on("console", lambda m: print("console:", m.text) if m.type in ("error", "warning") else None)
        pg.on("pageerror", lambda e: print("pageerror:", e))
        url = (ROOT / f"src/pitch-{a.shape}.html").as_uri() + ("?captions=1" if a.captions else "")
        await pg.goto(url); await pg.evaluate("window.ready")
        for i, t in enumerate(a.times):
            await pg.evaluate(f"window.seek({t})")
            name = a.names[i] if a.names else f"{a.shape}-{t:06.2f}"
            await pg.screenshot(path=str(out / f"{name}.jpg"), type="jpeg", quality=92)
            print(out / f"{name}.jpg")
        await b.close()

asyncio.run(main())
