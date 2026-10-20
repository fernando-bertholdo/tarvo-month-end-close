"""Embute a Manrope (base64) num HTML do estúdio, entre /* FONTE:INICIO */ e /* FONTE:FIM */.

Abrir por file:// bloqueia fonte carregada de outro arquivo; embutida, a página abre sem
servidor e sem rede. Idempotente: reescreve só o bloco marcado.
Uso: python3 -I estudio/scripts/embutir_fonte.py estudio/referencias/proposta-estilo.html
"""
import base64
import re
import sys
from pathlib import Path

FONTES = Path(__file__).resolve().parents[1] / "ferramentas" / "fontes"
LATIN = "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD"
LATIN_EXT = "U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF"


def face(arquivo, faixa):
    b64 = base64.b64encode((FONTES / arquivo).read_bytes()).decode()
    return ("@font-face { font-family: 'Manrope'; font-style: normal; font-weight: 400 800; font-display: block;\n"
            f"  src: url(data:font/woff2;base64,{b64}) format('woff2'); unicode-range: {faixa}; }}")


def main(caminho):
    p = Path(caminho)
    html = p.read_text(encoding="utf-8")
    bloco = ("/* FONTE:INICIO (Manrope, SIL OFL 1.1, gerado por estudio/scripts/embutir_fonte.py) */\n"
             + face("manrope-latin-ext.woff2", LATIN_EXT) + "\n" + face("manrope-latin.woff2", LATIN) + "\n/* FONTE:FIM */")
    novo, n = re.subn(r"/\* FONTE:INICIO.*?/\* FONTE:FIM \*/", lambda _: bloco, html, flags=re.S)
    if n != 1:
        sys.exit("marcadores FONTE:INICIO/FONTE:FIM não encontrados")
    p.write_text(novo, encoding="utf-8")
    print(p, len(novo) // 1024, "KB")


if __name__ == "__main__":
    main(sys.argv[1])
