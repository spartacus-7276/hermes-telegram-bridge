# Golden Ratio builder pitch (66.3 s)

Brief: `PROMPT.md`. Script: `SCRIPT.md`. Storyboard and decisions: `STORYBOARD.md`.

## Deliverables (`out/`)
- `builder-pitch-16x9.mp4`, `builder-pitch-9x16.mp4`: H.264 CRF 18, yuv420p, 60 fps, AAC 256k
- `builder-pitch-16x9-captions.mp4`, `builder-pitch-9x16-captions.mp4`
- `*-whatsapp.mp4`: 720p copies of all four
- `builder-pitch-16x9-poster.jpg`, `builder-pitch-9x16-poster.jpg`
- `audio/mix.wav` (−14 LUFS, −1 dBTP), `audio/voice.wav`, `audio/sfx.wav`: 48 kHz 24-bit stems at the mix's gain (add music under them)
- `stills/`: one still per scene, per shape; `qa/`: pop-scan reports and the build log

### Hindi version (`out/hi/`, 80.6 s)
- `builder-pitch-hi-16x9.mp4`, `builder-pitch-hi-9x16.mp4`, `builder-pitch-hi-16x9-captions.mp4`, `builder-pitch-hi-9x16-captions.mp4`
- `*-whatsapp.mp4`: 720p copies of all four; `builder-pitch-hi-16x9-poster.jpg`, `builder-pitch-hi-9x16-poster.jpg`
- `audio/mix.wav` (−14 LUFS, −1 dBTP), `audio/voice.wav`, `audio/sfx.wav`
- `stills/`: the review stills; `qa/`: pop-scan reports and the build log

## Rebuild
```
pip install playwright scipy pyloudnorm soundfile pillow numpy
python tools/layers.py        # cut the real screens into layers (masks lead phone numbers)
python tools/composite.py     # our screens into the blank phones and the wall screen
tools/build.sh                # cues -> mix -> 4 renders -> pop scan -> encode (WORKERS=3)
python tools/stills.py 16x9 33.1 --names test   # any single frame, for QA
tools/build_hi.sh             # the Hindi version into out/hi/
python tools/stills.py 16x9 4.3 --lang hi --map # Hindi frame at the English moment 4.3 s (mapped onto the Hindi voice)
```
`src/pitch-16x9.html` / `src/pitch-9x16.html` open in a browser; `window.seek(t)` renders any moment. Add `?lang=hi` for Hindi, `?captions=1` for captions.
Rendering is frame-range based and resumable: `python tools/render.py 16x9 --start 0 --end 600`.
