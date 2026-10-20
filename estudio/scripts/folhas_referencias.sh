#!/usr/bin/env bash
# Folhas de contato e quadros-chave das referências gravadas (gravar_referencias.mjs).
# Tempos = tempo do vídeo gravado (25 qps). Cada folha lê da esquerda para a direita,
# de cima para baixo; o intervalo entre quadros está no nome do arquivo.
# Uso: bash estudio/scripts/folhas_referencias.sh
set -euo pipefail
REF="$(cd "$(dirname "$0")/.." && pwd)/referencias"

folha() { # video inicio dur fps crop escala grade saida
  ffmpeg -v error -y -ss "$2" -t "$3" -i "$1" \
    -vf "fps=$4,crop=$5,scale=$6:-1,tile=$7:padding=6:margin=6:color=white" -frames:v 1 "$8"
}
quadro() { # video t crop saida
  ffmpeg -v error -y -ss "$2" -i "$1" -vf "crop=$3" -frames:v 1 "$4"
}

# ---- ai-services: cena "Uma política, de ponta a ponta" (recorte do cartão inteiro)
V="$REF/ai-services/gravacao.webm"; Q="$REF/ai-services/quadros"; mkdir -p "$Q"
CENA="492:596:842:146"
folha "$V" 1.5 8.0 2 "$CENA" 246 8x2 "$Q/folha-cena-caixa-0500ms.png"          # montagem completa, 1 quadro a cada 500 ms
folha "$V" 3.72 0.56 25 "446:94:865:391" 446 2x7 "$Q/folha-passo2-sobe-40ms.png" # passo 2 subindo, quadro a quadro
folha "$V" 5.76 0.32 25 "120:40:1190:434" 240 4x2 "$Q/folha-carimbo-40ms.png"    # selo "baixado" com passar do ponto
folha "$V" 8.88 0.48 25 "220:50:900:640" 220 4x3 "$Q/folha-pedido-40ms.png"      # pedido de aprovação subindo
quadro "$V" 1.0 "$CENA" "$Q/quadro-00-vazio.png"
quadro "$V" 3.0 "$CENA" "$Q/quadro-01-passo1.png"
quadro "$V" 5.0 "$CENA" "$Q/quadro-02-carregando.png"
quadro "$V" 10.0 "$CENA" "$Q/quadro-03-final.png"
quadro "$V" 24.5 "$CENA" "$Q/quadro-04-provisao-meio.png"
quadro "$V" 47.0 "$CENA" "$Q/quadro-05-receita-final.png"

# ---- buser: #fluxos, "sem agente" (12 s) e "com agente" (8 s)
V="$REF/buser/gravacao.webm"; Q="$REF/buser/quadros"; mkdir -p "$Q"
TELA="1112:521:164:149"
folha "$V" 14.0 12.6 2 "$TELA" 278 6x4 "$Q/folha-sem-agente-0500ms.png"       # um ciclo do cursor falso
folha "$V" 38.2 8.4 2.5 "$TELA" 278 7x3 "$Q/folha-com-agente-0400ms.png"      # clique, carregando, resultados, fim
folha "$V" 38.32 0.72 25 "260:70:340:218" 260 3x6 "$Q/folha-botao-afunda-40ms.png"
folha "$V" 39.36 0.40 25 "270:40:755:372" 270 2x5 "$Q/folha-resultado-entra-40ms.png"
quadro "$V" 16.0 "$TELA" "$Q/quadro-00-cursor-andando.png"
quadro "$V" 21.0 "$TELA" "$Q/quadro-01-cursor-digitando.png"
quadro "$V" 38.6 "$TELA" "$Q/quadro-02-clique.png"
quadro "$V" 41.2 "$TELA" "$Q/quadro-03-resultados-meio.png"
quadro "$V" 44.5 "$TELA" "$Q/quadro-04-final.png"

# ---- comp: palco do P&L em 4 atos (rearmados parados)
V="$REF/comp/gravacao.webm"; Q="$REF/comp/quadros"; mkdir -p "$Q"
PALCO="1440:740:0:73"
folha "$V" 6.0 1.6 12.5 "180:480:140:140" 90 13x1 "$Q/folha-ato1-agentes-80ms.png"
folha "$V" 24.1 1.28 12.5 "640:460:650:130" 213 4x4 "$Q/folha-ato3-painel-80ms.png"
folha "$V" 33.4 2.0 12.5 "640:460:650:130" 213 5x5 "$Q/folha-ato4-linhas-80ms.png"
quadro "$V" 9.5 "$PALCO" "$Q/quadro-01-ato1.png"
quadro "$V" 18.0 "$PALCO" "$Q/quadro-02-ato2.png"
quadro "$V" 26.5 "$PALCO" "$Q/quadro-03-ato3.png"
quadro "$V" 37.5 "$PALCO" "$Q/quadro-04-ato4.png"
echo "folhas ok"
