"""Contact sheet of the panel captures (estudio/out/previews/painel-<rodada>) for the Critic.

Reads captura.json (written by capturar_painel.mjs) for the order and the caption of each
screen, scales every screen to the same box and tiles them with their file name and caption.

Usage (from the repository root, after capturar_painel.mjs):
    python3 estudio/scripts/folha_painel.py [r0]
Output: estudio/reviews/contact-sheets/painel-<rodada>.png

From r4 on, each round keeps its screens in out/previews/painel-<rodada> (earlier rounds: out/previews/painel).
From r3 on, if the capture kept video frames in reviews/frames/painel-<rodada>/tiras.json, each strip
(frames of the 1x video with the replay clock written under them) goes to out/previews/painel/ as
<rodada>-video-<name>.png and into the sheet.
"""
import json
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ESTUDIO = Path(__file__).resolve().parents[1]
PREVIEWS = ESTUDIO / "out" / "previews" / "painel"  # rounds up to r3; see pasta_da_rodada
OUT_DIR = ESTUDIO / "reviews" / "contact-sheets"
COLS, CELL_W, CELL_H, GAP, LABEL_H = 4, 480, 300, 16, 48
SKIP = ("01b-",)  # full-page screens do not fit the box; they stay as separate files


def font(size):
    for path in ("/System/Library/Fonts/Supplemental/Arial.ttf", "/System/Library/Fonts/Helvetica.ttc"):
        try:
            return ImageFont.truetype(path, size)
        except OSError:
            continue
    return ImageFont.load_default()


def pasta_da_rodada(rodada):
    """The round's own folder of screens (r4 on), else the shared one of the earlier rounds."""
    propria = ESTUDIO / "out" / "previews" / f"painel-{rodada}"
    return propria if (propria / "captura.json").exists() else ESTUDIO / "out" / "previews" / "painel"


def strips(rodada):
    """Video frames of a stretch of the replay, in clock order, each with its clock time."""
    pasta = ESTUDIO / "reviews" / "frames" / f"painel-{rodada}"
    index = pasta / "tiras.json"
    if not index.exists():
        return []
    out = []
    cols, w, h, gap, lab = 4, 480, 300, 12, 26
    for chave, tira in json.loads(index.read_text(encoding="utf-8")).items():
        frames = tira["quadros"]
        rows = (len(frames) + cols - 1) // cols
        sheet = Image.new("RGB", (cols * w + (cols + 1) * gap, 56 + rows * (h + lab + gap) + gap), (240, 236, 241))
        draw = ImageDraw.Draw(sheet)
        draw.text((gap, 18), tira["titulo"], fill=(27, 18, 29), font=font(22))
        for i, q in enumerate(frames):
            img = Image.open(pasta / q["arquivo"]).convert("RGB").resize((w, h), Image.LANCZOS)
            x = gap + (i % cols) * (w + gap)
            y = 56 + (i // cols) * (h + lab + gap)
            sheet.paste(img, (x, y))
            relogio = f"{q['relogio_ms'] / 1000:.2f}".replace(".", ",")
            video = f"{q['video_s']:.2f}".replace(".", ",")
            draw.text((x, y + h + 4), f"relógio {relogio} s · vídeo {video} s", fill=(27, 18, 29), font=font(15))
        dest = PREVIEWS / f"{rodada}-video-{chave}.png"
        sheet.save(dest, optimize=True)
        out.append({"arquivo": str(dest.relative_to(ESTUDIO)), "descricao": tira["titulo"], "viewport": {"width": 1440, "height": 900}})
        print(dest.relative_to(ESTUDIO.parent), f"{sheet.width}x{sheet.height}", len(frames), "quadros")
    return out


def main(rodada):
    global PREVIEWS
    PREVIEWS = pasta_da_rodada(rodada)
    report = json.loads((PREVIEWS / "captura.json").read_text(encoding="utf-8"))
    telas = list(report["telas"]) + strips(rodada)
    live = PREVIEWS / "captura-vivo.json"
    if live.exists():  # the live run is captured separately, before the final command run
        telas += json.loads(live.read_text(encoding="utf-8"))["telas"]
    screens = [t for t in telas if not Path(t["arquivo"]).name.startswith(SKIP)]
    rows = (len(screens) + COLS - 1) // COLS
    width = COLS * CELL_W + (COLS + 1) * GAP
    height = 72 + rows * (CELL_H + LABEL_H + GAP) + GAP
    sheet = Image.new("RGB", (width, height), (240, 236, 241))
    draw = ImageDraw.Draw(sheet)
    draw.text((GAP, 20), f"Painel da analista, rodada {rodada}: {len(screens)} telas (captura.json, {report['gerado_em']})",
              fill=(27, 18, 29), font=font(24))
    small, tiny = font(15), font(13)
    for i, tela in enumerate(screens):
        img = Image.open(ESTUDIO / tela["arquivo"]).convert("RGB")
        img.thumbnail((CELL_W, CELL_H), Image.LANCZOS)
        col, row = i % COLS, i // COLS
        x = GAP + col * (CELL_W + GAP)
        y = 72 + row * (CELL_H + LABEL_H + GAP)
        box = Image.new("RGB", (CELL_W, CELL_H), (255, 255, 255))
        box.paste(img, ((CELL_W - img.width) // 2, (CELL_H - img.height) // 2))
        sheet.paste(box, (x, y))
        draw.rectangle([x - 1, y - 1, x + CELL_W, y + CELL_H], outline=(218, 213, 219))
        vp = tela.get("viewport") or {}
        draw.text((x, y + CELL_H + 6), f"{Path(tela['arquivo']).stem}  ({vp.get('width')}×{vp.get('height')})", fill=(27, 18, 29), font=small)
        caption = tela["descricao"]
        if len(caption) > 66:
            caption = caption[:65] + "…"
        draw.text((x, y + CELL_H + 26), caption, fill=(99, 86, 101), font=tiny)
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    out = OUT_DIR / f"painel-{rodada}.png"
    sheet.save(out, optimize=True)
    print(out.relative_to(ESTUDIO.parent), f"{width}x{height}", len(screens), "telas")


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "r0")
