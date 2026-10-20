# Relatório técnico: filme do fechamento, rodada r1

Engenheiro de render, 18/10/2026 21:27 BRT (19/10 00:27Z). Projeto `estudio/filme/` (Remotion 4.0.531,
versões fixas). Reproduzir: `bash estudio/scripts/render_filme.sh all r1`. Os quadros de stills, cortes
e prévia saem da própria linha do tempo (`estudio/scripts/quadros_filme.ts`, executado com esbuild),
então a evidência não fica desatualizada em relação ao código.

## Composição

Saída de `npx remotion compositions src/index.ts`:

| Composição | fps | Dimensões | Quadros | Duração |
|---|---|---|---|---|
| `Fechamento` | 30 | 1920×1080 | 2.400 | 80,00 s |
| `Cena1-OMesChega` … `Cena7-Fecho` (pasta "Cenas") | 30 | 1920×1080 | 221, 235, 358, 691, 339, 277, 279 | cada cena sozinha |

Confirmado com `ffprobe` na prévia completa: 2.400 quadros, 80,000 s, 30/1.

## Duração e pausa de leitura

Alvo do Diretor: 2.400 quadros. O texto r1 cabe nas pausas (1.660 quadros pela regra do `STYLE.md`,
com a emenda), mas o movimento que o storyboard pede soma 1.166 quadros. O filme que cumpre a regra
inteira teria 2.826 quadros (94,2 s). Dentro do alvo, cada grupo de leitura recebe 74% da pausa
(`FIT` = 0,743 em `timeline.ts`). Falta por cena, em quadros: 34, 38, 64, 100, 67, 63, 60. A tabela
completa e a origem do excesso estão na seção "Mudanças" do `STORYBOARD.md`. Nenhuma cena passa de 40
palavras na tela.

## Fontes

- Manrope variável (`wght` 200 a 800), subconjuntos latin e latin-ext em `filme/public/fonts/`, com
  `OFL.txt`. Carregada por `FontFace` com `staticFile` dentro de `<FontGate>` (`src/fonts.tsx`).
- Log em todos os renders: `[fonts] Manrope loaded: loaded, loaded; check 600 36px = true`.
- Glifos ausentes no subconjunto: U+2192, U+2264 e U+2248. O filme não usa os dois primeiros; o "≈"
  da cena 5 é desenhado em vetor. O "…" (U+2026) da faixa de origem existe na fonte.

## Ativos e rede

Único ativo binário: as fontes. Números importados direto de `estudio/dados/fechamento.json`. Na carga,
`src/data.ts` confere as somas (faixas, pesos, donos) e acha cada campo da linha de origem pelo valor;
se algo não bater, o render falha. Nenhuma URL remota em `src/`.

## Erros de execução

Nenhum erro nem aviso nos logs de r1 (`estudio/out/previews/logs/*-r1.log`).

## Tempos de render (Apple M3, 8 núcleos)

| Saída | Quadros | Escala | Tempo |
|---|---|---|---|
| 8 stills PNG | 8 | 1080p | 2 s |
| prévia da cena 4 (`filme-cena4-r1.mp4`) | 739 (784 a 1522) | 0,5 | 12 s |
| prévia do filme (`filme-r1-baixa.mp4`) | 2.400 | 0,5 | 34 s |

## Continuidade nos cortes

| Corte | Quadros | Pixels com diferença acima de 16 | Máximo |
|---|---|---|---|
| 1-2 | 220, 221 | 0 | 0 |
| 2-3 | 455, 456 | 0 | 0 |
| 3-4 | 813, 814 | 0 | 0 |
| 4-5 | 1504, 1505 | 1 | 18 |
| 5-6 | 1843, 1844 | 0 | 1 |
| 6-7 | 2120, 2121 | 0 | 0 |

Na primeira passada do r1, o corte 4-5 deu 3.750 pixels: o número da soma pulava 1 px na vertical,
porque a cena 4 o desenha dentro do contêiner com zoom e a cena 5 o desenhava fora. Corrigido: a cena 5
desenha o número dentro de um contêiner com o mesmo zoom, que volta a 1 durante o deslize. Na varredura
da prévia (um quadro a cada 15), achei e corrigi uma sobreposição de texto no começo da cena 5.

## Mergulho

A faixa de origem numa fileira tem cerca de 1.435 px antes da aproximação; o zoom é calculado para ela
caber em 1.680 px e ficou em cerca de 1,17× (o `STYLE.md` permite até 1,25×).

## Evidência

- Stills: `estudio/out/previews/filme/filme-r1-c<cena>-q<quadro>-<nome>.png` (quadros 166, 381, 747,
  1065, 1439, 1751, 2033, 2390). Os stills do r0 continuam ao lado, sem o prefixo de rodada.
- Folha de contato: `estudio/reviews/contact-sheets/filme-r1.png`.
- Cortes: `estudio/reviews/frames/filme-cortes/r1-*` e `diferencas-r1.txt`.
- Prévias: `estudio/out/previews/filme-cena4-r1.mp4` e `estudio/out/previews/filme-r1-baixa.mp4`.

## Dados: um aviso

O `fechamento.json` usado no render foi gerado às 00:16:17Z, com `duracao_s` 0,07 (legenda da cena 3:
"O motor levou 0,07 s."). Depois disso, o motor rodou de novo às 00:18:30Z e gravou 0,06 no
`relatorio/execucao.json`; o JSON não foi regenerado. As outras contagens não mudaram entre as rodadas.
Esse valor alterna a cada execução do motor. O filme lê o JSON na hora do render, então vale congelar o
JSON antes da entrega.
