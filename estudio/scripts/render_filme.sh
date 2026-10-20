#!/usr/bin/env bash
# Render evidence for the film (render engineer): representative stills, contact sheet,
# cut pairs with a pixel diff, and low-quality motion previews.
# Usage: bash estudio/scripts/render_filme.sh [stills|cortes|previa-cena4|previa-filme|parado|trechos|final|all] [round]
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
FILME="$ROOT/filme"
ROUND="${2:-r0}"
STILLS="$ROOT/out/previews/filme"
SHEET="$ROOT/reviews/contact-sheets/filme-$ROUND.png"
CUTS="$ROOT/reviews/frames/filme-cortes"
LOGS="$ROOT/out/previews/logs"
LABEL_FONT="/System/Library/Fonts/Helvetica.ttc" # labels of the review sheet only, never in the film
mkdir -p "$STILLS" "$CUTS" "$LOGS"
cd "$FILME"

# Frames come from src/animation/timeline.ts (REPRESENTATIVE_FRAMES, SCENE_START):
# REPRESENTATIVE = scene:frame:name, one per scene at its reading moment (scene 4 twice);
# CUT_PAIRS = last frame of scene N and first of N+1; SCENE4_RANGE for the scene 4 preview.
eval "$(npx esbuild "$ROOT/scripts/quadros_filme.ts" --bundle --platform=node --format=esm --log-level=error | node --input-type=module)"

pad() { printf "%04d" "$1"; }

stills() {
  local frames="" tmp="$ROOT/out/previews/tmp_stills" # no dot: Remotion reads it as an extension
  rm -rf "$tmp"
  for item in $REPRESENTATIVE; do f="${item#*:}"; frames="$frames${frames:+,}${f%%:*}"; done
  local t0=$SECONDS
  npx remotion render src/index.ts Fechamento "$tmp" --frames="$frames" --image-format=png --log=verbose >"$LOGS/stills-$ROUND.log" 2>&1
  echo "stills: $((SECONDS - t0)) s"
  # labeled half-size copies (PIL draws the label: this ffmpeg has no drawtext), then ffmpeg tile
  local sheet_tmp="$ROOT/out/previews/tmp_sheet" i=0
  rm -rf "$sheet_tmp"; mkdir -p "$sheet_tmp"
  for item in $REPRESENTATIVE; do
    local scene="${item%%:*}" rest="${item#*:}"
    local frame="${rest%%:*}" name="${rest#*:}"
    local out="$STILLS/filme-$ROUND-c${scene}-q$(pad "$frame")-$name.png"
    mv "$tmp/element-$(pad "$frame").png" "$out"
    python3 -I - "$out" "$sheet_tmp/$(printf %02d $i).png" "cena $scene · quadro $frame" "$LABEL_FONT" <<'PY'
import sys
from PIL import Image, ImageDraw, ImageFont
src, dst, label, font_path = sys.argv[1:5]
im = Image.open(src).convert("RGB").resize((960, 540), Image.LANCZOS)
d = ImageDraw.Draw(im)
font = ImageFont.truetype(font_path, 24)
x0, y0, x1, y1 = d.textbbox((0, 0), label, font=font)
d.rectangle((10, 10, 10 + (x1 - x0) + 20, 10 + (y1 - y0) + 16), fill=(255, 255, 255), outline=(218, 213, 219), width=2)
d.text((20 - x0, 18 - y0), label, font=font, fill=(99, 86, 101))
im.save(dst)
PY
    i=$((i + 1))
  done
  ffmpeg -v error -y -framerate 1 -i "$sheet_tmp/%02d.png" -vf "tile=3x3:padding=12:margin=12:color=white" -frames:v 1 "$SHEET"
  rm -rf "$sheet_tmp"
  rmdir "$tmp" 2>/dev/null || true
  echo "contact sheet: $SHEET"
}

cortes() {
  local frames="" tmp="$ROOT/out/previews/tmp_cortes"
  rm -rf "$tmp"
  for pair in $CUT_PAIRS; do frames="$frames${frames:+,}${pair%%:*},${pair##*:}"; done
  npx remotion render src/index.ts Fechamento "$tmp" --frames="$frames" --image-format=png >"$LOGS/cortes-$ROUND.log" 2>&1
  local n=1 report="$CUTS/diferencas-$ROUND.txt"
  echo "pixels whose luma differs by more than 16 (of 2073600), last frame of scene N vs first of N+1" >"$report"
  for pair in $CUT_PAIRS; do
    local a b
    a="$(pad "${pair%%:*}")"; b="$(pad "${pair##*:}")"
    local base="$CUTS/$ROUND-corte-$n-$((n + 1))"
    mv "$tmp/element-$a.png" "$base-q$a-fim.png"
    mv "$tmp/element-$b.png" "$base-q$b-inicio.png"
    ffmpeg -v error -y -i "$base-q$a-fim.png" -i "$base-q$b-inicio.png" \
      -filter_complex "[0:v]scale=960:-1[l];[1:v]scale=960:-1[r];[l][r]hstack=inputs=2,pad=iw+24:ih+24:12:12:white" "$base-par.png"
    local diff
    diff=$(ffmpeg -v error -i "$base-q$a-fim.png" -i "$base-q$b-inicio.png" \
      -filter_complex "[0:v]format=rgb24[x];[1:v]format=rgb24[y];[x][y]blend=all_mode=difference,format=gray" -frames:v 1 -f rawvideo pipe:1 |
      python3 -c "import sys; b=sys.stdin.buffer.read(); print(sum(1 for x in b if x > 16), 'max', max(b))")
    echo "corte $n-$((n + 1)) (q$a -> q$b): $diff" >>"$report"
    n=$((n + 1))
  done
  rmdir "$tmp" 2>/dev/null || true
  cat "$report"
}

previa_cena4() {
  local t0=$SECONDS
  npx remotion render src/index.ts Fechamento "$ROOT/out/previews/filme-cena4-$ROUND.mp4" --frames="$SCENE4_RANGE" --scale=0.5 --crf=23 >"$LOGS/previa-cena4-$ROUND.log" 2>&1
  echo "previa cena 4: $((SECONDS - t0)) s"
}

previa_filme() {
  local t0=$SECONDS
  npx remotion render src/index.ts Fechamento "$ROOT/out/previews/filme-$ROUND-baixa.mp4" --scale=0.5 --crf=23 >"$LOGS/previa-filme-$ROUND.log" 2>&1
  echo "previa filme: $((SECONDS - t0)) s"
}

# Reading time, measured as the Critic does (findings r1, annex A): luma difference between
# consecutive frames; a group is "parado e legível" from the frame its last element lands
# until something moves again. Measured on a lossless PNG sequence (quarter size): the H.264
# preview adds keyframe and quantisation noise to frames that are identical in the film.
parado() {
  local tmp="$ROOT/out/previews/tmp_parado" out="$LOGS/parado-$ROUND.txt"
  rm -rf "$tmp"
  npx remotion render src/index.ts Fechamento "$tmp" --sequence --image-format=png --scale=0.25 >"$LOGS/parado-render-$ROUND.log" 2>&1
  python3 -I - "$tmp" "$GROUP_WINDOWS" >"$out" <<'PY'
import glob, json, sys
from PIL import Image, ImageChops
frames = sorted(glob.glob(sys.argv[1] + "/*.png"))
moved = []
previous = Image.open(frames[0]).convert("L")
for path in frames[1:]:
    current = Image.open(path).convert("L")
    moved.append(ImageChops.difference(previous, current).getbbox() is not None)
    previous = current
# moved[k]: frame k + 1 differs from frame k
print("grupo | do quadro | parado e legível | precisa | saldo")
for w in json.loads(sys.argv[2]):
    k = w["from"]
    while k < len(moved) and not moved[k]:
        k += 1
    held = k - w["from"] + 1  # frames from..k show the same picture
    print(f"{w['group']} | {w['from']} | {held} | {w['need']} | {held - w['need']:+d}")
PY
  rm -rf "$tmp"
  cat "$out"
}

# Close-up stills of the passages changed in this round, and their contact sheet.
trechos() {
  local tmp="$ROOT/out/previews/tmp_trechos" frames="" sheet_tmp="$ROOT/out/previews/tmp_sheet" i=0
  rm -rf "$tmp" "$sheet_tmp"; mkdir -p "$sheet_tmp"
  for item in $PASSAGES; do frames="$frames${frames:+,}${item%%:*}"; done
  npx remotion render src/index.ts Fechamento "$tmp" --frames="$frames" --image-format=png >"$LOGS/trechos-$ROUND.log" 2>&1
  for item in $PASSAGES; do
    local frame="${item%%:*}" name="${item#*:}"
    local out="$STILLS/filme-$ROUND-$name-q$(pad "$frame").png"
    mv "$tmp/element-$(pad "$frame").png" "$out"
    python3 -I - "$out" "$sheet_tmp/$(printf %02d $i).png" "$name · quadro $frame" "$LABEL_FONT" <<'PY'
import sys
from PIL import Image, ImageDraw, ImageFont
src, dst, label, font_path = sys.argv[1:5]
im = Image.open(src).convert("RGB").resize((960, 540), Image.LANCZOS)
d = ImageDraw.Draw(im)
font = ImageFont.truetype(font_path, 24)
x0, y0, x1, y1 = d.textbbox((0, 0), label, font=font)
d.rectangle((10, 10, 10 + (x1 - x0) + 20, 10 + (y1 - y0) + 16), fill=(255, 255, 255), outline=(218, 213, 219), width=2)
d.text((20 - x0, 18 - y0), label, font=font, fill=(99, 86, 101))
im.save(dst)
PY
    i=$((i + 1))
  done
  ffmpeg -v error -y -framerate 1 -i "$sheet_tmp/%02d.png" -vf "tile=4x5:padding=12:margin=12:color=white" -frames:v 1 "$ROOT/reviews/contact-sheets/filme-$ROUND-trechos.png"
  rm -rf "$tmp" "$sheet_tmp"
  echo "trechos: $(echo $PASSAGES | wc -w | tr -d ' ') stills"
}

# Delivery: 1080p master, a deck copy of 20 MB or less, posters and SHA-256 sums.
final() {
  local dir="$ROOT/out/final" t0
  mkdir -p "$dir/posteres"
  t0=$SECONDS
  npx remotion render src/index.ts Fechamento "$dir/tmp-1080p.mp4" --codec=h264 --crf=16 --pixel-format=yuv420p --color-space=bt709 >"$LOGS/final-1080p.log" 2>&1
  ffmpeg -v error -y -i "$dir/tmp-1080p.mp4" -c copy -movflags +faststart "$dir/fechamento-1080p.mp4" && rm "$dir/tmp-1080p.mp4"
  echo "1080p: $((SECONDS - t0)) s"
  t0=$SECONDS
  npx remotion render src/index.ts Fechamento "$dir/tmp-deck.mp4" --codec=h264 --crf="${DECK_CRF:-18}" --pixel-format=yuv420p --color-space=bt709 >"$LOGS/final-deck.log" 2>&1
  ffmpeg -v error -y -i "$dir/tmp-deck.mp4" -c copy -movflags +faststart "$dir/fechamento-deck.mp4" && rm "$dir/tmp-deck.mp4"
  echo "deck: $((SECONDS - t0)) s"
  local tmp="$ROOT/out/previews/tmp_posteres" frames=""
  rm -rf "$tmp"
  for item in $POSTERS; do frames="$frames${frames:+,}${item%%:*}"; done
  npx remotion render src/index.ts Fechamento "$tmp" --frames="$frames" --image-format=png >"$LOGS/final-posteres.log" 2>&1
  for item in $POSTERS; do mv "$tmp/element-$(pad "${item%%:*}").png" "$dir/posteres/${item#*:}.png"; done
  rm -rf "$tmp"
  (cd "$dir" && shasum -a 256 fechamento-1080p.mp4 fechamento-deck.mp4 posteres/*.png >SHA256SUMS)
  ls -l "$dir" "$dir/posteres"
  cat "$dir/SHA256SUMS"
}

case "${1:-all}" in
  stills) stills ;;
  cortes) cortes ;;
  previa-cena4) previa_cena4 ;;
  previa-filme) previa_filme ;;
  parado) parado ;;
  trechos) trechos ;;
  final) final ;;
  all) stills; cortes; previa_cena4; previa_filme; parado ;;
  *) echo "usage: $0 [stills|cortes|previa-cena4|previa-filme|parado|trechos|final|all] [round]" >&2; exit 2 ;;
esac
