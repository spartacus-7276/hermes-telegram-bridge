#!/bin/bash
# Hindi build: cues -> mix -> 4 renders (16:9, 9:16, each with and without captions) -> encode -> pop scan -> delete frames.
# Everything goes to out/hi/ (80.6 s, 4836 frames each).
set -e
cd "$(dirname "$0")/.."
W=${WORKERS:-3}
mkdir -p out/hi/qa
python3 tools/export_cues.py --lang hi
python3 audio/mix.py --lang hi
for v in "16x9" "9x16" "16x9 --captions" "9x16 --captions"; do
  set -- $v; shape=$1; cap=$2
  dir=frames/hi-$shape${cap:+-captions}; name=out/hi/builder-pitch-hi-$shape${cap:+-captions}
  python3 tools/render.py $shape $cap --lang hi --workers $W --out $dir
  python3 tools/popscan.py $dir out/hi/qa/pops-$shape${cap:+-captions}.json
  if [ -z "$cap" ]; then python3 tools/encode.py $dir $name --audio out/hi/audio/mix.wav --poster 79.0
  else python3 tools/encode.py $dir $name --audio out/hi/audio/mix.wav; fi
  rm -rf $dir
done
echo BUILD DONE
