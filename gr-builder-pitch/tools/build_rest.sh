#!/bin/bash
# Resume the build: wait for the running 16:9 render, finish it, then 9:16 and both captioned versions.
cd "$(dirname "$0")/.."
W=${WORKERS:-3}
while pgrep -f "tools/render.py 16x9 --workers" >/dev/null; do sleep 5; done
finish() { # dir name poster
  python3 tools/popscan.py $1 out/qa/pops-$(basename $1).json
  python3 tools/encode.py $1 $2 ${3:+--poster $3}
}
python3 tools/render.py 16x9 --workers $W --out frames/16x9   # completes any frame a stopped worker left
finish frames/16x9 out/builder-pitch-16x9 64.0 && rm -rf frames/16x9
for v in "9x16" "16x9 --captions" "9x16 --captions"; do
  set -- $v; shape=$1; cap=$2
  dir=frames/$shape${cap:+-captions}; name=out/builder-pitch-$shape${cap:+-captions}
  python3 tools/render.py $shape $cap --workers $W --out $dir
  if [ -z "$cap" ]; then finish $dir $name 64.0; else finish $dir $name; fi
  rm -rf $dir
done
echo BUILD DONE
