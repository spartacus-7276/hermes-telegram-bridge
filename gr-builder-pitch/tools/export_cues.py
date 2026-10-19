"""Write gen/cues.json: the sound cues the page itself declares (window.CUES), so picture and sound share one clock.
    python tools/export_cues.py [--lang hi]   (Hindi: gen/cues-hi.json)"""
import asyncio
import sys
import json
from pathlib import Path

from playwright.async_api import async_playwright

from browser import launch_args

ROOT = Path(__file__).resolve().parent.parent


async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(**launch_args())
        pg = await b.new_page(viewport={"width": 1920, "height": 1080})
        await pg.goto((ROOT / "src/pitch-16x9.html").as_uri() + (f"?lang={LANG}" if LANG != "en" else "")); await pg.evaluate("window.ready")
        cues = await pg.evaluate("window.CUES")
        await b.close()
    cues.sort(key=lambda c: c["t"])
    (ROOT / f"gen/cues{'-' + LANG if LANG != 'en' else ''}.json").write_text(json.dumps(cues, indent=1))
    print(len(cues), "cues")

LANG = sys.argv[sys.argv.index("--lang") + 1] if "--lang" in sys.argv else "en"
asyncio.run(main())
