"""Mede o movimento das referências gravadas por gravar_referencias.mjs.

Método: o FFmpeg recorta uma região do vídeo e entrega os quadros em cinza (25 qps, a taxa
nativa da gravação do Playwright). Para cada quadro, conta os pixels que mudaram mais de
LIMIAR níveis em relação ao quadro anterior ("energia de movimento"). Quadros com energia
viram rajadas de movimento; quadros sem energia são pausas. De cada rajada saem:

- inicio_ms / fim_ms: primeiro e último quadro com mudança (fim = assentamento total);
- t90_ms: quando 90% da mudança acumulada da rajada já aconteceu (assentamento percebido);
- e o mesmo em quadros a 30 qps, que é a unidade do filme.

Precisão: 1 quadro da gravação = 40 ms. Uso: python3 -I estudio/scripts/medir_referencias.py
Saída: estudio/referencias/<ref>/energia-<regiao>.csv e estudio/referencias/<ref>/medicoes.json.
Só biblioteca padrão mais Pillow (já presente no Python do sistema).
"""
import csv
import json
import subprocess
import sys
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw

ESTUDIO = Path(__file__).resolve().parents[1]
REF = ESTUDIO / "referencias"
FPS_GRAV = 25
LIMIAR = 24       # níveis de cinza (0-255) para contar um pixel como mudado
CHAVE = 128       # o VP8 do Playwright grava um quadro-chave a cada 128 quadros (5,12 s); a
                  # troca de qualidade nesses quadros não é movimento e é descartada
MIN_PIX = 6       # pixels mudados para o quadro contar como "em movimento"
JUNTA = 2         # quadros parados que ainda não quebram uma rajada (80 ms)

# Regiões em pixels da tela 1440x900 (caixas lidas do DOM; ver contexto.json).
REGIOES = {
    "ai-services": [
        # Cada região isola um elemento da cena (caixas lidas do DOM a 1440x900, rolagem 0).
        # O chip de regra tem um brilho contínuo depois de entrar e a espinha tem a faísca
        # que desce; por isso eles têm regiões próprias e ficam fora das regiões de texto.
        {"nome": "verbo1", "x": 932, "y": 320, "w": 80, "h": 30},   # "Aprende"
        {"nome": "verbo2", "x": 932, "y": 399, "w": 80, "h": 30},   # "Executa"
        {"nome": "verbo3", "x": 932, "y": 493, "w": 80, "h": 30},   # "Melhora"
        {"nome": "verbo4", "x": 932, "y": 572, "w": 80, "h": 30},   # "Escala"
        {"nome": "fontes1", "x": 908, "y": 350, "w": 150, "h": 31}, # chips Extrato / ERP
        {"nome": "regra1", "x": 1060, "y": 350, "w": 212, "h": 31}, # chip de regra (pop)
        {"nome": "linha2", "x": 908, "y": 432, "w": 270, "h": 40},  # "Acme Logística  −R$ 190"
        {"nome": "carimbo2", "x": 1232, "y": 440, "w": 44, "h": 24},# selo "baixado" (sem o carregando)
        {"nome": "carregando2", "x": 1278, "y": 443, "w": 18, "h": 18},
        {"nome": "pedido4", "x": 908, "y": 646, "w": 140, "h": 36}, # "Aprovar a baixa?"
        {"nome": "espinha", "x": 865, "y": 312, "w": 36, "h": 380},
    ],
    "buser": [
        # "Sem agente" vai de 7,2 s a 32,7 s do vídeo; o clique no interruptor troca para
        # "com agente" (a partir de 33,3 s). Cada região só conta rajadas na sua janela.
        {"nome": "tela-sem-agente", "x": 164, "y": 149, "w": 1112, "h": 521, "janela": [7600, 32600]},
        {"nome": "celula-digitada", "x": 790, "y": 386, "w": 201, "h": 39, "janela": [7600, 32600]},
        {"nome": "botao-com-agente", "x": 350, "y": 228, "w": 236, "h": 48, "janela": [33400, 54000]},
        {"nome": "status-com-agente", "x": 600, "y": 240, "w": 320, "h": 26, "janela": [33400, 54000]},
        {"nome": "chip-linha1", "x": 765, "y": 375, "w": 252, "h": 34, "janela": [33400, 54000]},
        {"nome": "chip-linha2", "x": 765, "y": 417, "w": 252, "h": 34, "janela": [33400, 54000]},
        {"nome": "chip-linha3", "x": 765, "y": 458, "w": 252, "h": 34, "janela": [33400, 54000]},
        {"nome": "chip-linha4", "x": 765, "y": 500, "w": 252, "h": 34, "janela": [33400, 54000]},
        {"nome": "chip-linha5", "x": 765, "y": 542, "w": 252, "h": 34, "janela": [33400, 54000]},
        {"nome": "chip-linha6", "x": 765, "y": 583, "w": 252, "h": 34, "janela": [33400, 54000]},
    ],
    "comp": [
        # Rearmes no vídeo (marcas do contexto.json): ato 1 = 5,6 s, 2 = 14,1 s, 3 = 22,7 s, 4 = 31,2 s.
        {"nome": "agentes", "x": 160, "y": 150, "w": 90, "h": 470, "janela": [5500, 10000]},
        {"nome": "orquestrador", "x": 400, "y": 300, "w": 140, "h": 190, "janela": [14000, 18500]},
        {"nome": "painel", "x": 655, "y": 140, "w": 630, "h": 450, "janela": [22500, 27000]},
        {"nome": "pnl-linha2", "x": 700, "y": 248, "w": 300, "h": 38, "janela": [31000, 38000]},  # Receita
        {"nome": "pnl-linha3", "x": 700, "y": 290, "w": 300, "h": 38, "janela": [31000, 38000]},  # Impostos
        {"nome": "pnl-linha4", "x": 700, "y": 332, "w": 300, "h": 38, "janela": [31000, 38000]},  # Custo direto
        {"nome": "pnl-linha5", "x": 700, "y": 374, "w": 300, "h": 38, "janela": [31000, 38000]},  # Margem bruta
        {"nome": "pnl-linha6", "x": 700, "y": 416, "w": 300, "h": 38, "janela": [31000, 38000]},  # Pessoas
        {"nome": "pnl-linha7", "x": 700, "y": 458, "w": 300, "h": 38, "janela": [31000, 38000]},  # G&A
        {"nome": "pnl-linha8", "x": 700, "y": 500, "w": 300, "h": 38, "janela": [31000, 38000]},  # Growth
        {"nome": "pnl-resultado", "x": 700, "y": 542, "w": 300, "h": 36, "janela": [31000, 38000]},
        {"nome": "legenda", "x": 400, "y": 720, "w": 640, "h": 80},
    ],
}


def quadros(video, r):
    cmd = ["ffmpeg", "-v", "error", "-i", str(video), "-vf",
           f"crop={r['w']}:{r['h']}:{r['x']}:{r['y']},format=gray", "-f", "rawvideo", "-"]
    tam = r["w"] * r["h"]
    p = subprocess.Popen(cmd, stdout=subprocess.PIPE)
    while True:
        buf = p.stdout.read(tam)
        if len(buf) < tam:
            break
        im = Image.frombytes("L", (r["w"], r["h"]), buf)
        for ex, ey, ew, eh in r.get("excl", []):
            ImageDraw.Draw(im).rectangle([ex - r["x"], ey - r["y"], ex - r["x"] + ew, ey - r["y"] + eh], fill=0)
        yield im
    p.wait()


def energia(video, r):
    serie, ant = [], None
    tabela = [255 if v > LIMIAR else 0 for v in range(256)]
    for i, im in enumerate(quadros(video, r)):
        n = 0
        if ant is not None and i % CHAVE not in (0, 1):
            n = ImageChops.difference(im, ant).point(tabela).histogram()[255]
        serie.append((i, round(i * 1000 / FPS_GRAV), n))
        ant = im
    return serie


def rajadas(serie, janela=None):
    if janela:
        serie = [(i, ms, n if janela[0] <= ms <= janela[1] else 0) for i, ms, n in serie]
    out, atual, parado = [], None, 0
    for i, ms, n in serie:
        if n >= MIN_PIX:
            if atual is None:
                atual = {"q": [], "e": []}
            atual["q"].append(i)
            atual["e"].append(n)
            parado = 0
        elif atual is not None:
            parado += 1
            if parado > JUNTA:
                out.append(atual)
                atual, parado = None, 0
    if atual:
        out.append(atual)
    res = []
    for a in out:
        q0, q1 = a["q"][0], a["q"][-1]
        tot, acc, q90 = sum(a["e"]), 0, q1
        for q, e in zip(a["q"], a["e"]):
            acc += e
            if acc >= 0.9 * tot:
                q90 = q
                break
        ms = lambda q: round(q * 1000 / FPS_GRAV)
        # a mudança do quadro q aconteceu entre q-1 e q: início = q0-1
        ini, fim, t90 = ms(q0 - 1), ms(q1), ms(q90)
        res.append({"inicio_ms": ini, "fim_ms": fim, "dur_ms": fim - ini, "t90_ms": t90 - ini,
                    "dur_q30": round((fim - ini) * 30 / 1000), "t90_q30": round((t90 - ini) * 30 / 1000),
                    "pico_px": max(a["e"]), "soma_px": tot})
    # pausas entre rajadas
    for a, b in zip(res, res[1:]):
        a["pausa_depois_ms"] = b["inicio_ms"] - a["fim_ms"]
        a["pausa_depois_q30"] = round(a["pausa_depois_ms"] * 30 / 1000)
    return res


def cursor(video, r, escuro=22, minimo=15, lado=26):
    """Ponta do cursor falso (preto #0D0C0C com contorno branco) em cada quadro.

    Procura a mancha escura perto da posição anterior (janela de 120 px); só aceita
    manchas do tamanho do cursor (até `lado` px), para não confundir com texto escuro.
    """
    tabela = [255 if v < escuro else 0 for v in range(256)]
    pontos, ant = [], None
    for i, im in enumerate(quadros(video, r)):
        m = im.point(tabela)
        achou = None
        janelas = []
        if ant:
            ax, ay = ant[0] - r["x"], ant[1] - r["y"]
            janelas.append((max(0, ax - 120), max(0, ay - 120), min(r["w"], ax + 120), min(r["h"], ay + 120)))
        janelas.append((0, 0, r["w"], r["h"]))
        for j in janelas:
            sub = m.crop(j)
            if sub.histogram()[255] < minimo:
                continue
            bb = sub.getbbox()
            if bb and bb[2] - bb[0] <= lado and bb[3] - bb[1] <= lado:
                achou = (r["x"] + j[0] + bb[0], r["y"] + j[1] + bb[1])
                break
        if achou:
            ant = achou
            pontos.append((i, round(i * 1000 / FPS_GRAV), achou[0], achou[1]))
        else:
            pontos.append((i, round(i * 1000 / FPS_GRAV), None, None))
    return pontos


def trechos_cursor(pontos, janela):
    """Divide a trajetória em trechos andando (>1 px/quadro) e parado."""
    seg, ant, out = None, None, []
    for i, ms, x, y in pontos:
        if not (janela[0] <= ms <= janela[1]) or x is None:
            continue
        estado = "parado"
        if ant is not None and abs(x - ant[0]) + abs(y - ant[1]) > 1:
            estado = "andando"
        if seg is None or seg["estado"] != estado:
            if seg:
                out.append(seg)
            seg = {"estado": estado, "inicio_ms": ms - (40 if estado == "andando" else 0), "fim_ms": ms, "de": [x, y], "ate": [x, y]}
        seg["fim_ms"], seg["ate"] = ms, [x, y]
        ant = (x, y)
    if seg:
        out.append(seg)
    for s_ in out:
        s_["dur_ms"] = s_["fim_ms"] - s_["inicio_ms"]
        s_["dur_q30"] = round(s_["dur_ms"] * 30 / 1000)
        s_["dist_px"] = abs(s_["ate"][0] - s_["de"][0]) + abs(s_["ate"][1] - s_["de"][1])
    return [s_ for s_ in out if s_["dur_ms"] >= 80]


def main(pedidas):
    for ref in pedidas:
        video = REF / ref / "gravacao.webm"
        resumo = {"metodo": {"fps_gravacao": FPS_GRAV, "limiar_niveis": LIMIAR, "min_pixels": MIN_PIX, "quadro_chave": CHAVE,
                             "junta_quadros": JUNTA}, "regioes": {}}
        for r in REGIOES[ref]:
            serie = energia(video, r)
            with open(REF / ref / f"energia-{r['nome']}.csv", "w", newline="") as f:
                w = csv.writer(f)
                w.writerow(["quadro_25qps", "t_ms", "pixels_mudados"])
                w.writerows(serie)
            resumo["regioes"][r["nome"]] = {"caixa": r, "rajadas": rajadas(serie, r.get("janela"))}
            print(ref, r["nome"], len(resumo["regioes"][r["nome"]]["rajadas"]), "rajadas")
        if ref == "buser":
            r = {"x": 164, "y": 149, "w": 1112, "h": 521}
            pts = cursor(video, r)
            with open(REF / ref / "cursor.csv", "w", newline="") as f:
                w = csv.writer(f)
                w.writerow(["quadro_25qps", "t_ms", "x_ponta", "y_ponta"])
                w.writerows(pts)
            resumo["cursor"] = trechos_cursor(pts, [7600, 32600])
        (REF / ref / "medicoes.json").write_text(json.dumps(resumo, ensure_ascii=False, indent=1))


if __name__ == "__main__":
    main(sys.argv[1:] or list(REGIOES))
