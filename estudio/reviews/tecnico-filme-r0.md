# Relatório técnico: filme do fechamento, rodada r0

Engenheiro de render, 18/10/2026 21:02 BRT (19/10 00:02Z). Projeto `estudio/filme/` (Remotion 4.0.531,
versões fixas). Reproduzir: `bash estudio/scripts/render_filme.sh all r0`.

## Composição

Saída de `npx remotion compositions src/index.ts`:

| Composição | fps | Dimensões | Quadros | Duração |
|---|---|---|---|---|
| `Fechamento` | 30 | 1920×1080 | 2.100 | 70,00 s |
| `Cena1-OMesChega` … `Cena7-Fecho` (pasta "Cenas") | 30 | 1920×1080 | 240, 240, 330, 540, 330, 240, 180 | cada cena sozinha |

Confirmado com `ffprobe` na prévia completa (2.100 quadros, 70,000 s, 30/1) e num render de teste em
1080p (2.100 quadros, 1920×1080, 70,000 s; descartado depois da medição).

## Duração

1.920 quadros no storyboard, 2.100 agora (o teto de 70 s). Cresceram as cenas 1, 2, 5 e 6 (+30 cada) e a
4 (+60). Motivo e números na seção "Mudanças" do `STORYBOARD.md`. Mesmo com o teto, o texto aprovado não
cumpre a regra de pausa de leitura nem o limite de 40 palavras em quatro cenas; o aviso, com os números
por cena, está na mesma seção.

## Fontes

- Manrope variável (eixo `wght` 200 a 800), subconjuntos latin e latin-ext copiados de
  `estudio/ferramentas/fontes/` para `filme/public/fonts/`, com `OFL.txt` ao lado.
- Carregada por `FontFace` com `staticFile`, um rosto por subconjunto com o `unicode-range` do Google
  Fonts, dentro de `<FontGate>` (`src/fonts.tsx`), que segura o render com `delayRender` até as duas
  faces carregarem. Log do Chrome em todos os renders: `[fonts] Manrope loaded: loaded, loaded; check
  600 36px = true` (as quatro abas). Handle liberado em 19 a 31 ms.
- Conferido nos stills: as formas de "R", "g", "ç" e dos algarismos são as da Manrope, sem queda para
  fonte de sistema.
- Glifos que o subconjunto não tem, verificados com fontTools: U+2192 (seta), U+2264 (menor ou igual) e
  U+2248 ("≈"). O filme não usa seta nem "≤"; o "≈" da cena 5 é desenhado em vetor
  (`src/components/Approx.tsx`). O U+2212 existe; o U+00A0 existe e vai entre "R$" e o número.

## Ativos e rede

- Único ativo binário: as fontes. Números vêm de `estudio/dados/fechamento.json`, importado direto
  (`src/data.ts`), sem cópia. O módulo confere na carga que a soma das cinco faixas, a soma por peso e a
  soma por dono batem com os totais do JSON; se não baterem, o render falha.
- Nenhuma URL remota em `src/` (busca por `http`). O render não usa rede.

## Erros de execução

Nenhum erro nem aviso nos logs de stills, cortes e prévias (`estudio/out/previews/logs/`). Uma
observação de ferramenta: a skill do Remotion instalada (4.0.536) recomenda `Track` e
`Interactive.create`; `Track` não existe na 4.0.531, então as cenas usam `<Sequence>` e cada cena foi
registrada também como composição própria.

## Tempos de render (Apple M3, 8 núcleos)

| Saída | Quadros | Escala | Tempo |
|---|---|---|---|
| 8 stills PNG | 8 | 1080p | 3 s |
| prévia da cena 4 (`filme-cena4-r0.mp4`, 584 KB) | 586 (780 a 1365) | 0,5 | 10 s |
| prévia do filme (`filme-r0-baixa.mp4`, 1,7 MB) | 2.100 | 0,5 | 30 s |
| teste em 1080p, H.264 (descartado) | 2.100 | 1 | 44 s, 6,3 MB |

## Continuidade nos cortes

Último quadro da cena N contra o primeiro da N+1, pixels com diferença de luminância acima de 16 (de
2.073.600):

| Corte | Quadros | Pixels | Máximo |
|---|---|---|---|
| 1-2 | 239, 240 | 0 | 0 |
| 2-3 | 479, 480 | 0 | 0 |
| 3-4 | 809, 810 | 0 | 0 |
| 4-5 | 1349, 1350 | 28 | 55 |
| 5-6 | 1679, 1680 | 2 | 43 |
| 6-7 | 1919, 1920 | 0 | 0 |

Os 30 pixels são antialiasing de texto: na cena 5 a soma é desenhada fora do contêiner com zoom em que a
cena 4 a desenhou. Não aparecem a olho. A abertura tem 6 quadros de fundo vazio (0 a 5).

## Evidência

- Stills: `estudio/out/previews/filme/filme-c<cena>-q<quadro>-<nome>.png` (quadros 200, 436, 766, 1015,
  1310, 1650, 1890, 2090).
- Folha de contato: `estudio/reviews/contact-sheets/filme-r0.png` (FFmpeg `tile` 4×2; o rótulo de cada
  quadro é desenhado com Pillow em Helvetica, porque o FFmpeg instalado não tem `drawtext`; a fonte do
  rótulo é da folha, não do filme).
- Cortes: `estudio/reviews/frames/filme-cortes/` (os dois quadros de cada corte, o par lado a lado e
  `diferencas-r0.txt`).
- Prévias: `estudio/out/previews/filme-cena4-r0.mp4` e `estudio/out/previews/filme-r0-baixa.mp4`.

## Dados: um aviso

Durante a sessão, outro processo rodou o motor duas vezes. As contagens não mudaram; mudou só a
duração da conta. `estudio/dados/fechamento.json` foi gerado às 23:54:38Z com `duracao_s` 0,07, e
`relatorio/execucao.json` foi regravado às 23:58:23Z com 0,06. O filme mostra o que está no JSON
("0,07 s", cena 3). Não regenerei o JSON: é um artefato compartilhado e o motor estava em uso. Quem
rodar `estudio/scripts/extrair_dados.py` de novo atualiza a legenda sem mexer no código.
