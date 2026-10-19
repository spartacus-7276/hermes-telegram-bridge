"""Encode a frame folder + the mix to H.264 CRF 18 yuv420p, plus a 720p WhatsApp copy and (optionally) a poster.
    python tools/encode.py frames/16x9 out/builder-pitch-16x9 [--poster 64.0]"""
import argparse
import shutil
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ap = argparse.ArgumentParser()
ap.add_argument("frames"); ap.add_argument("name"); ap.add_argument("--poster", type=float)
a = ap.parse_args()
frames, name = ROOT / a.frames, ROOT / a.name
audio = ROOT / "out/audio/mix.wav"
ff = shutil.which("ffmpeg")
first = sorted(frames.glob("*.jpg"))[0]
from PIL import Image
w, h = Image.open(first).size
base = [ff, "-y", "-loglevel", "error", "-framerate", "60", "-i", str(frames / "%05d.jpg"), "-i", str(audio), "-map", "0:v", "-map", "1:a"]
subprocess.run(base + ["-c:v", "libx264", "-preset", "slow", "-crf", "18", "-pix_fmt", "yuv420p", "-profile:v", "high",
                       "-c:a", "aac", "-b:a", "256k", "-ar", "48000", "-movflags", "+faststart", f"{name}.mp4"], check=True)
sw, sh_ = (1280, 720) if w > h else (720, 1280)
subprocess.run(base + ["-vf", f"scale={sw}:{sh_}:flags=lanczos", "-c:v", "libx264", "-preset", "slow", "-crf", "21", "-pix_fmt", "yuv420p",
                       "-profile:v", "high", "-c:a", "aac", "-b:a", "160k", "-ar", "48000", "-movflags", "+faststart", f"{name}-whatsapp.mp4"], check=True)
if a.poster is not None:
    Image.open(frames / f"{int(round(a.poster * 60)):05d}.jpg").save(f"{name}-poster.jpg", quality=92)
print("encoded", name)
