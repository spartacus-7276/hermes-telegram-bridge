"""Scan rendered frames for single-frame pops: frame i differs from both neighbours while i-1 and i+1 agree.
Cuts (scene boundaries) are expected changes and are listed separately.
    python tools/popscan.py frames/16x9 out/qa/pops-16x9.txt"""
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image

src, report = Path(sys.argv[1]), Path(sys.argv[2])
files = sorted(src.glob("*.jpg"))
small = lambda f: np.asarray(Image.open(f).convert("L").resize((240, 135) if Image.open(f).width > Image.open(f).height else (135, 240)), dtype=np.float32)
prev2 = prev = None; d_prev = 0.0
pops, jumps = [], []
for i, f in enumerate(files):
    cur = small(f)
    if prev is not None:
        d = float(np.abs(cur - prev).mean())
        if d > 12:
            jumps.append((i, round(d, 1)))
        if prev2 is not None:
            skip = float(np.abs(cur - prev2).mean())
            # i-1 is a pop when it jumps away from both neighbours that agree with each other
            if d_prev > 6 and d > 6 and skip < .35 * min(d_prev, d):
                pops.append((i - 1, round(d_prev, 1), round(d, 1), round(skip, 1)))
        d_prev = d
    prev2, prev = prev, cur
report.parent.mkdir(parents=True, exist_ok=True)
report.write_text(json.dumps({"frames": len(files), "single_frame_pops": pops, "large_changes_(cuts)": jumps}, indent=1))
print(f"{src}: {len(files)} frames, {len(pops)} single-frame pops, {len(jumps)} large changes")
for p in pops:
    print("  pop at frame", p[0], f"t={p[0] / 60:.3f}", p[1:])
