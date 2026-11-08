#!/bin/sh
# Renders both versions of part 2 (A = he opened, B = he hid). LIB = the Lemo-Opuscar library; FFBIN = folder with ffmpeg 7+.
set -e
HERE=$(cd "$(dirname "$0")" && pwd)
LIB=${LIB:-/root/lemo-opuscar}; export LIB
cd "$LIB"
for v in ${VERSIONS:-A B}; do
  node core/render/events.mjs "$HERE" --q v=$v --out "$HERE/events_$v.json"
  node core/render/video.mjs "$HERE" --q v=$v --fps 30 --workers 4 --size 1080x1920 --out "$HERE/out/video_$v.mp4"
  EVENTS="$HERE/events_$v.json" OUT=mix_$v.wav "$LIB/.venv/bin/python" "$HERE/mix.py" > /dev/null || true
  PATH=${FFBIN:-}:$PATH sh core/render/mux.sh "$HERE/out/video_$v.mp4" "$HERE/out/mix_$v.wav" "$HERE/le_secret_partie2_$v.mp4" 30 2
done
