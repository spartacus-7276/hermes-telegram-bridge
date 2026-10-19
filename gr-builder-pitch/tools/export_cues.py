"""Write gen/cues.json: the sound cues the page itself declares (window.CUES), so picture and sound share one clock.
    python tools/export_cues.py"""
import asyncio
import json
from pathlib import Path

from playwright.async_api import async_playwright

from browser import launch_args

ROOT = Path(__file__).resolve().parent.parent


async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(**launch_args())
        pg = await b.new_page(viewport={"width": 1920, "height": 1080})
        await pg.goto((ROOT / "src/pitch-16x9.html").as_uri()); await pg.evaluate("window.ready")
        cues = await pg.evaluate("window.CUES")
        await b.close()
    cues.sort(key=lambda c: c["t"])
    (ROOT / "gen/cues.json").write_text(json.dumps(cues, indent=1))
    print(len(cues), "cues")

asyncio.run(main())
