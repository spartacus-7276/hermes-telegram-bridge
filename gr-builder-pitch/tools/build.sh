#!/bin/bash
# Full build: cues -> mix -> 4 renders (16:9, 9:16, each with and without captions) -> encode -> pop scan -> delete frames.
set -e
cd "$(dirname "$0")/.."
W=${WORKERS:-3}
python3 tools/export_cues.py
python3 audio/mix.py
for v in "16x9" "9x16" "16x9 --captions" "9x16 --captions"; do
  set -- $v; shape=$1; cap=$2
  dir=frames/$shape${cap:+-captions}; name=out/builder-pitch-$shape${cap:+-captions}
  python3 tools/render.py $shape $cap --workers $W --out $dir
  python3 tools/popscan.py $dir out/qa/pops-$shape${cap:+-captions}.json
  if [ -z "$cap" ]; then python3 tools/encode.py $dir $name --poster 64.0; else python3 tools/encode.py $dir $name; fi
  rm -rf $dir
done
echo BUILD DONE
