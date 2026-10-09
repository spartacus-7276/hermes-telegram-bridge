#!/usr/bin/env python3
"""Render film.html frame by frame with Playwright, then encode with ffmpeg.

  python3 record.py                      # every frame (resumable: frames already on disk are skipped), then encode
  python3 record.py --frames 0-899       # a range only, no encode
  python3 record.py --stills 300,1100,1900,2650
  python3 record.py --stills             # the storyboard sheet: one still per shot plus the approval frames
  python3 record.py --encode             # encode only, from frames already on disk

Frames land in out/frames/f0000.png … The page is a pure function of the frame number, so any frame
can be rendered on its own and an interrupted run simply picks up where it stopped.
"""
import argparse
import functools
import http.server
import os
import subprocess
import sys
import threading
from pathlib import Path

from playwright.sync_api import sync_playwright

HERE = Path(__file__).resolve().parent
OUT = HERE / "out"
FRAMES = OUT / "frames"
STILLS = OUT / "stills"
W, H = 1920, 1080


def serve():
    """Serve gr-video/ on localhost so fonts and the logo load the same way every run."""
    class Quiet(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *a):
            pass
    handler = functools.partial(Quiet, directory=str(HERE))
    srv = http.server.ThreadingHTTPServer(("127.0.0.1", 0), handler)
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return srv, f"http://127.0.0.1:{srv.server_address[1]}/film.html"


def launch(p):
    exe = os.environ.get("CHROMIUM_PATH")
    try:
        return p.chromium.launch(executable_path=exe) if exe else p.chromium.launch()
    except Exception:
        # fall back to the pre-installed browser when the pinned build is absent
        for cand in sorted(Path("/opt/pw-browsers").glob("chromium-*/chrome-linux*/chrome")):
            return p.chromium.launch(executable_path=str(cand))
        raise


def open_page(browser, url):
    page = browser.new_page(viewport={"width": W, "height": H}, device_scale_factor=1)
    errors = []
    page.on("pageerror", lambda e: errors.append(str(e)))
    page.goto(url)
    total = page.evaluate("window.READY")
    if errors:
        raise RuntimeError("page error: " + errors[0])
    return page, total


def shoot(page, f, path):
    page.evaluate("f => window.seek(f)", f)
    tmp = path.with_suffix(".tmp.png")
    page.locator("#stage").screenshot(path=str(tmp), animations="disabled")
    tmp.replace(path)  # atomic: a half-written PNG never counts as done


def render(frames, dest, force=False):
    dest.mkdir(parents=True, exist_ok=True)
    srv, url = serve()
    with sync_playwright() as p:
        browser = launch(p)
        page, total = open_page(browser, url)
        frames = [f for f in frames if 0 <= f < total]
        todo = [f for f in frames if force or not (dest / f"f{f:04d}.png").exists()]
        print(f"{len(frames) - len(todo)} on disk, {len(todo)} to render (film is {total} frames)", flush=True)
        for n, f in enumerate(todo):
            shoot(page, f, dest / f"f{f:04d}.png")
            if n % 50 == 0 or n == len(todo) - 1:
                print(f"  f{f:04d}  ({n + 1}/{len(todo)})", flush=True)
        browser.close()
    srv.shutdown()
    return total


def storyboard(frames, path):
    from PIL import Image, ImageDraw, ImageFont
    cols, tw = 4, 480
    th = tw * H // W
    rows = (len(frames) + cols - 1) // cols
    sheet = Image.new("RGB", (cols * tw + (cols + 1) * 16, rows * (th + 40) + 16), "#F6F7F9")
    d = ImageDraw.Draw(sheet)
    try:
        font = ImageFont.truetype("DejaVuSans.ttf", 18)
    except OSError:
        font = ImageFont.load_default()
    for i, f in enumerate(frames):
        im = Image.open(STILLS / f"f{f:04d}.png").convert("RGB").resize((tw, th), Image.LANCZOS)
        x, y = 16 + (i % cols) * (tw + 16), 16 + (i // cols) * (th + 40)
        sheet.paste(im, (x, y))
        d.text((x, y + th + 8), f"f{f}", fill="#16181D", font=font)
    sheet.save(path, quality=90)
    print("storyboard →", path)


def encode(total):
    OUT.mkdir(exist_ok=True)
    missing = [f for f in range(total) if not (FRAMES / f"f{f:04d}.png").exists()]
    if missing:
        sys.exit(f"{len(missing)} frames missing (first f{missing[0]}). Run record.py again; it resumes.")
    mp4 = OUT / "gr-realestate-journey-90s.mp4"
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-framerate", "30", "-i", str(FRAMES / "f%04d.png"),
                    "-c:v", "libx264", "-crf", "19", "-preset", "slow", "-pix_fmt", "yuv420p", "-movflags", "+faststart",
                    str(mp4)], check=True)
    print("encoded →", mp4, f"{mp4.stat().st_size / 1e6:.1f} MB")


def parse_frames(s):
    out = []
    for part in s.split(","):
        if "-" in part:
            a, b = part.split("-")
            out += range(int(a), int(b) + 1)
        elif part:
            out.append(int(part))
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--frames", help="e.g. 0-899 or 300,1100")
    ap.add_argument("--stills", nargs="?", const="board", help="comma list of frames, or no value for the storyboard")
    ap.add_argument("--encode", action="store_true")
    ap.add_argument("--force", action="store_true", help="re-render frames already on disk")
    a = ap.parse_args()

    if a.stills:
        board = a.stills == "board"
        # one still per shot (mid-shot) plus the four approval frames
        frames = [90, 300, 540, 820, 1100, 1590, 1900, 2350, 2650] if board else parse_frames(a.stills)
        render(frames, STILLS, force=True)
        if board:
            storyboard(frames, STILLS / "storyboard.jpg")
        return
    if a.encode:
        srv, url = serve()
        with sync_playwright() as p:
            b = launch(p)
            _, total = open_page(b, url)
            b.close()
        srv.shutdown()
        encode(total)
        return
    if a.frames:
        render(parse_frames(a.frames), FRAMES, a.force)
        return
    total = render(list(range(2700)), FRAMES, a.force)
    encode(total)


if __name__ == "__main__":
    main()
