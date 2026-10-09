# gr-video — build folder for the Golden Ratio real-estate film

Everything a cloud Claude Code session needs to build the video is in this folder. Nothing here depends on
the owner's Windows machine.

**Branch:** `gr-video`. Work here, not on `main`.

## What is here

| Path | What |
|---|---|
| `PROMPT.md` | The brief. Read it first, in full. |
| `assets/golden-ratio-logo.png` | Stacked logo, gold on transparent, 2000 px wide. For the end card. |
| `assets/golden-ratio-logo-horizontal.png` | Horizontal lockup, in case a wide mark fits better. |

Those two PNGs are **the only image files in the film.** Everything else — phones, chat bubbles, the
spreadsheet, the dashboard, the call waveform, the people — is drawn in code. That is deliberate: those
elements animate, and a screenshot cannot.

## Environment (set this up first)

```bash
pip install playwright pillow
playwright install --with-deps chromium
ffmpeg -version || sudo apt-get update && sudo apt-get install -y ffmpeg
```

Use plain `python3`. There is no virtualenv to activate and no Windows path to honour — if `PROMPT.md`
mentions a `C:\...` path, ignore it, that is from the owner's machine.

Fonts come from Google Fonts over the network: **DM Sans** (400/500/700) and **Noto Sans Devanagari** for
the one Marathi line. Await `document.fonts.ready` before rendering frame 0, and confirm the Devanagari
glyphs actually render in a still before trusting them.

## Rendering

- 1920×1080, 30 fps, frames f0–f2699 (90 seconds).
- Make `record.py` **resumable** — skip frames already on disk. 2700 frames is a long run and a cloud
  session can be interrupted.
- Encode: `libx264 -crf 19 -preset slow -pix_fmt yuv420p -movflags +faststart`.

## Getting the film back to the owner

The MP4 is roughly 20–40 MB. Commit it **to this `gr-video` branch only**, never to `main`:

```bash
git add gr-video/out/*.mp4 gr-video/out/*.jpg gr-video/*.py gr-video/*.html gr-video/SCRIPT.md
git commit -m "Render the Golden Ratio real-estate film"
git push origin gr-video
```

Then tell the owner the branch is pushed. He pulls it on his own machine.

If the file is over 90 MB, do not commit it — re-encode at crf 23 or split the deliverables, and say so.

## Before the full render

`PROMPT.md` asks for four stills to be approved first (f300, f1100, f1900, f2650). Commit those stills to
the branch and wait. Do not burn 2700 frames before the owner has seen them.
