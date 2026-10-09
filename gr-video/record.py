#!/usr/bin/env python3
"""Render film.html frame by frame with Playwright, then encode with ffmpeg.

  python3 record.py                      # every frame (resumable: frames already on disk are skipped), then encode
  python3 record.py --vertical           # the same for the 1080 x 1920 cut
  python3 record.py --workers 4          # split the frames across several browsers
  python3 record.py --frames 0-899       # a range only, no encode
  python3 record.py --stills 300,1100,1900,2650
  python3 record.py --stills             # the storyboard sheet: one still per shot plus the approval frames
  python3 record.py --poster 1062        # out/poster.jpg from one frame
  python3 record.py --encode             # encode only, from frames already on disk

Frames land in out/frames/f0000.png (out/frames_v/ for the vertical cut). The page is a pure function of the
frame number, so any frame can be rendered on its own and an interrupted run simply picks up where it stopped.
"""
import argparse
import functools
import http.server
import multiprocessing as mp
import os
import subprocess
import sys
import threading
from pathlib import Path

from playwright.sync_api import sync_playwright

HERE = Path(__file__).resolve().parent
OUT = HERE / "out"
STILLS = OUT / "stills"


class Cut:
    def __init__(self, vertical):
        self.vertical = vertical
        self.w, self.h = (1080, 1920) if vertical else (1920, 1080)
        self.frames = OUT / ("frames_v" if vertical else "frames")
        self.mp4 = OUT / ("gr-realestate-journey-9x16.mp4" if vertical else "gr-realestate-journey-90s.mp4")
        self.query = "?v=1" if vertical else ""


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


def open_page(browser, url, cut):
    page = browser.new_page(viewport={"width": cut.w, "height": cut.h}, device_scale_factor=1)
    errors = []
    page.on("pageerror", lambda e: errors.append(str(e)))
    page.goto(url + cut.query)
    total = page.evaluate("window.READY")
    if errors:
        raise RuntimeError("page error: " + errors[0])
    return page, total


def shoot(page, f, path):
    page.evaluate("f => window.seek(f)", f)
    tmp = path.with_suffix(".tmp.png")
    page.locator("#stage").screenshot(path=str(tmp), animations="disabled")
    tmp.replace(path)  # atomic: a half-written PNG never counts as done


def _worker(args):
    url, vertical, frames, dest, tag = args
    cut = Cut(vertical)
    with sync_playwright() as p:
        browser = launch(p)
        page, _ = open_page(browser, url, cut)
        for n, f in enumerate(frames):
            shoot(page, f, Path(dest) / f"f{f:04d}.png")
            if n % 100 == 0 or n == len(frames) - 1:
                print(f"  [{tag}] f{f:04d}  ({n + 1}/{len(frames)})", flush=True)
        browser.close()
    return len(frames)


def film_length(url, cut):
    with sync_playwright() as p:
        b = launch(p)
        _, total = open_page(b, url, cut)
        b.close()
    return total


def render(frames, dest, cut, force=False, workers=1):
    dest.mkdir(parents=True, exist_ok=True)
    srv, url = serve()
    total = film_length(url, cut)
    frames = [f for f in frames if 0 <= f < total]
    todo = [f for f in frames if force or not (dest / f"f{f:04d}.png").exists()]
    print(f"{len(frames) - len(todo)} on disk, {len(todo)} to render (film is {total} frames)", flush=True)
    if todo:
        workers = max(1, min(workers, len(todo)))
        chunks = [todo[i::workers] for i in range(workers)]
        jobs = [(url, cut.vertical, c, str(dest), f"w{i}") for i, c in enumerate(chunks)]
        if workers == 1:
            _worker(jobs[0])
        else:
            with mp.get_context("fork").Pool(workers) as pool:
                pool.map(_worker, jobs)
    srv.shutdown()
    return total


def storyboard(frames, path, cut):
    from PIL import Image, ImageDraw, ImageFont
    cols, tw = 4, 480
    th = tw * cut.h // cut.w
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


def encode(total, cut):
    OUT.mkdir(exist_ok=True)
    missing = [f for f in range(total) if not (cut.frames / f"f{f:04d}.png").exists()]
    if missing:
        sys.exit(f"{len(missing)} frames missing (first f{missing[0]}). Run record.py again; it resumes.")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-framerate", "30", "-i", str(cut.frames / "f%04d.png"),
                    "-c:v", "libx264", "-crf", "19", "-preset", "slow", "-pix_fmt", "yuv420p", "-movflags", "+faststart",
                    str(cut.mp4)], check=True)
    print("encoded →", cut.mp4, f"{cut.mp4.stat().st_size / 1e6:.1f} MB")


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
    ap.add_argument("--poster", type=int, help="frame to save as out/poster.jpg")
    ap.add_argument("--encode", action="store_true")
    ap.add_argument("--vertical", action="store_true", help="the 1080 x 1920 cut")
    ap.add_argument("--workers", type=int, default=1)
    ap.add_argument("--force", action="store_true", help="re-render frames already on disk")
    a = ap.parse_args()
    cut = Cut(a.vertical)

    if a.stills:
        board = a.stills == "board"
        # one still per shot (mid-shot) plus the four approval frames
        frames = [90, 300, 540, 820, 1100, 1590, 1900, 2350, 2650] if board else parse_frames(a.stills)
        render(frames, STILLS, cut, force=True, workers=a.workers)
        if board:
            storyboard(frames, STILLS / "storyboard.jpg", cut)
        return
    if a.poster is not None:
        from PIL import Image
        tmp = OUT / "poster_src"
        render([a.poster], tmp, cut, force=True)
        Image.open(tmp / f"f{a.poster:04d}.png").convert("RGB").save(OUT / "poster.jpg", quality=92)
        print("poster →", OUT / "poster.jpg")
        return
    if a.encode:
        srv, url = serve()
        total = film_length(url, cut)
        srv.shutdown()
        encode(total, cut)
        return
    if a.frames:
        render(parse_frames(a.frames), cut.frames, cut, a.force, a.workers)
        return
    total = render(list(range(2700)), cut.frames, cut, a.force, a.workers)
    encode(total, cut)


if __name__ == "__main__":
    main()
