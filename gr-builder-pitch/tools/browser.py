"""Chromium for Playwright: the pre-installed headless shell if the pip build's own browser is missing."""
import os
from pathlib import Path

CANDIDATES = ["/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell", "/opt/pw-browsers/chromium"]


def launch_args():
    exe = os.environ.get("PW_CHROMIUM") or next((c for c in CANDIDATES if Path(c).exists()), None)
    args = {"args": ["--force-color-profile=srgb", "--disable-lcd-text", "--font-render-hinting=none", "--hide-scrollbars"]}
    if exe:
        args["executable_path"] = exe
    return args
