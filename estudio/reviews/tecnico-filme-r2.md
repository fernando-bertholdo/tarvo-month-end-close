# Relatório técnico: filme do fechamento, rodada r2

Engenheiro de render, 18/10/2026 22:17 BRT (19/10 01:17Z). Rodada de correção sobre
`reviews/findings-filme-r1.md`, com a revisão de texto r2 do Diretor. Projeto `estudio/filme/`
(Remotion 4.0.531). Reproduzir: `bash estudio/scripts/render_filme.sh all r2`.

## Composição

| Composição | fps | Dimensões | Quadros | Duração |
|---|---|---|---|---|
| `Fechamento` | 30 | 1920×1080 | 2.499 | 83,30 s |
| cenas 1 a 7 (pasta "Cenas") | 30 | 1920×1080 | 182, 226, 377, 730, 367, 317, 300 | começam em 0, 182, 408, 785, 1515, 1882, 2199 |

## Defeitos e achados: o que mudou

| Defeito ou achado | O que mudou | Quadros para conferir |
|---|---|---|
| Defeito 01: recuo da cena 4 | "a mais nesta venda" viaja com o "R$ 32,25" até o lugar da soma; troca para "a cobrar da Orbe · Rota Global" com 3 quadros de sobreposição; a soma conta a partir do quadro em que o rótulo novo começa a entrar (r2b); estado completo parado 63 quadros; "87 operações assim" a 44 px, tinta; a faixa da origem só sobe depois de a grade sair | 1122–1223 (recuo), 1223–1285 (estado completo parado), 1285–1320 (grade sai, origem sobe), corte 4–5 |
| Defeito 01: frase falsa parada | Na primeira aparição, o número só surge quando começa a contar, 6 quadros depois do rótulo (nunca "R$ 0,00 a mais nesta venda"). Quando só o rótulo muda, a contagem começa junto com o rótulo novo (emenda do `STYLE.md`, r2b): nenhum quadro mostra valor antigo sob rótulo novo | 855–876, 1165–1202, 1538–1568 |
| Defeito 02: faixas da cena 3 | Quatro faixas por etapa (`eventos.por_etapa`: 1.996 · 257 · 23 · 187 = 2.463); feixe único dos sete cartões até um barramento, sem casar arquivo com faixa | 422–482 |
| Defeito 03: grupos curtos | Pausas grupo a grupo (tabela abaixo): contagens da cena 3 com 151 quadros parados, diferença da cena 4 com 199 | 610–760, 924–1122 |
| Achado 1: grupos sem folga | Dinheiro, pendências e fecho com o que o anexo A pede, mais 2 quadros | 1644–1882, 1961–2199, 2261–2499 |
| Achado 2: transição 3–4 | O "116" não apaga: o cartão cresce a partir da caixa dele e o carrega até a linha do valor, onde ele dá lugar ao conteúdo; nenhum quadro de cartão vazio | 785–810 |
| Achado 3: transição 2–3 | O botão encolhe até a caixa do "0" e vira o contador; o rótulo dele sai em 5 quadros, antes de ficar cortado | 408–432 |
| Achado 6: contadores da cena 3 | Só o contador principal conta (soma das barras); o total de cada faixa aparece quando a barra dela fica cheia | 432–482 |
| Achado 7: selo "feitas pela regra" | Sem fundo; cor só no ícone e na palavra | 700 |
| Achado 8: espera dos contadores | Primeira aparição: 6 quadros entre rótulo assentado e contagem, e o número só aparece contando ("60" da cena 2 incluído). Troca de rótulo: conta junto com o rótulo novo (r2b) | 213–219, 870–876; 1172, 1538 |
| Achado 9: clique da cena 2 | Afunda a 0,96 em 5 quadros; anel de acento de 2 px de 1 a 1,35, some em 22; efeito 6 quadros depois do clique | 372–399 |
| Achado 10: algarismos | "116", "15" e "2.332" proporcionais nas contagens e na passagem para a cena 4 | 700, 785 |
| Diretor: textos r2 | "a cobrar da Orbe · Rota Global"; "…" em cada vão da linha de origem; "Orbe e Ponte" na coluna 1; exemplos novos da cena 6; título do pôster como Destaque | 1260, 1458, 1786, 2103, 2489 |
| Achado próprio, na varredura | A faixa da origem subia por cima da grade que ainda saía (r2 intermediário); "0 respostas…" parado 6 quadros na cena 2 | 1285–1320, 198–219 |

Achados 4 (vãos sem "…"), 11 (pôster) e 12 (textos): resolvidos com o texto r2 do Diretor. Achado 5
(tempo do motor instável): continua, ver "Dados".

## Tempo de leitura, grupo a grupo (anexo A refeito)

Método do Crítico: diferença de luma entre quadros seguidos; um grupo fica "parado e legível" do quadro
em que o último elemento dele para até o primeiro quadro em que algo se move de novo. Nos grupos que
fecham cena, os 15 quadros de fim de cena entram na conta, como no anexo A. Medido numa sequência PNG
sem perda (1/4 da resolução), porque a prévia H.264 cria diferenças de compressão em quadros que, no
filme, são idênticos (conferido: quadros PNG idênticos onde a prévia acusava movimento). Saída de
`render_filme.sh parado r2`, em `out/previews/logs/parado-r2.txt`.

| Grupo | Do quadro | Parado e legível | Precisa | Saldo |
|---|---|---|---|---|
| 1. Título e cartões | 104 | 79 | 76 | +3 |
| 2. "60", regra e botão | 270 | 103 | 100 | +3 |
| 3a. Faixas e "2.463 decisões" | 482 | 79 | 76 | +3 |
| 3b. Três contagens e legenda | 610 | 151 | 148 | +3 |
| 4a. Cartão, taxas, diferença, selo | 924 | 199 | 196 | +3 |
| 4b. Recuo completo ("87 operações assim", soma, rótulo, selo) | 1223 | 63 | 60 | +3 |
| 4c. Origem | 1373 | 142 | 140 | +2 |
| 5. Dinheiro | 1644 | 238 | 236 | +2 |
| 6. Pendências | 1961 | 239 | 236 | +3 |
| 7. Fecho | 2294 (rodapé) | 205 parado; 238 desde a terceira linha (2261) | 236 desde a terceira linha | +2 |

"Precisa" é o anexo A atualizado para o texto r2: 4b é o mínimo de 60 quadros pedido; 5 soma o rótulo
curto "Orbe e Ponte"; 6 soma uma palavra dos exemplos novos. "87 operações assim" fica assentado de 1168
até começar a sair em 1285 (117 quadros), dos quais os últimos 63 com tudo parado.

## Fontes, ativos, erros

- Manrope variável embutida (`filme/public/fonts/`, com `OFL.txt`), carregada por `FontFace` com
  `staticFile`. Log em todos os renders: `[fonts] Manrope loaded: loaded, loaded; check 600 36px = true`.
- Sem URL remota em `src/`; números importados de `estudio/dados/fechamento.json`, com as somas
  conferidas na carga (faixas por etapa, pesos, donos).
- Nenhum erro nem aviso nos logs de r2.

## Continuidade nos cortes

| Corte | Quadros | Pixels com diferença acima de 16 | Máximo |
|---|---|---|---|
| 1-2 | 181, 182 | 0 | 0 |
| 2-3 | 407, 408 | 0 | 0 |
| 3-4 | 784, 785 | 0 | 1 |
| 4-5 | 1514, 1515 | 0 | 12 |
| 5-6 | 1881, 1882 | 0 | 1 |
| 6-7 | 2198, 2199 | 0 | 0 |

As transformações de cada corte (botão em contador, "116" em cartão, soma em coluna 1) acontecem dentro
da cena seguinte; os quadros de conferência estão na tabela de defeitos.

## Mergulho

Com um "…" em cada vão, a faixa de origem tem cerca de 1.494 px antes da aproximação; o zoom é
calculado para ela caber em 1.680 px e ficou em cerca de 1,11× (o `STYLE.md` diz "até 1,25×").

## Tempos de render (Apple M3, 8 núcleos)

| Saída | Quadros | Escala | Tempo |
|---|---|---|---|
| 9 stills PNG | 9 | 1080p | 2 s |
| prévia da cena 4 (`filme-cena4-r2.mp4`) | 776 (755 a 1530) | 0,5 | 12 s |
| prévia do filme (`filme-r2-baixa.mp4`) | 2.499 | 0,5 | 36 s |
| sequência sem perda para medir o tempo parado | 2.499 | 0,25 | cerca de 30 s |

## Evidência

- Stills: `out/previews/filme/filme-r2-c<cena>-q<quadro>-<nome>.png` (quadros 150, 331, 700, 1042,
  1260, 1458, 1786, 2103, 2489).
- Folha de contato: `reviews/contact-sheets/filme-r2.png` (3×3).
- Cortes: `reviews/frames/filme-cortes/r2-*` e `diferencas-r2.txt`.
- Prévias: `out/previews/filme-cena4-r2.mp4` e `out/previews/filme-r2-baixa.mp4`.
- Tempo parado: `out/previews/logs/parado-r2.txt`.

## Dados

O `fechamento.json` usado em toda a evidência r2 (refeita no r2b) foi gerado às 01:19:42Z, com
`duracao_s` 0,06 (legenda da cena 3: "O motor levou 0,06 s."). A data do arquivo foi conferida antes e depois do render
final e não mudou. Durante a rodada ele foi regenerado mais de uma vez, com 0,08 e 0,07: o valor
continua mudando a cada execução do motor e precisa ser congelado antes da entrega.

## Microcorreção r2b

Emenda do Diretor ao "Contador" do `STYLE.md`: quando o valor já está na tela e só o rótulo muda,
a contagem começa no quadro em que o rótulo novo começa a entrar. Aplicada à soma da cena 4
(R$ 32,25 para R$ 1.546,28, quadros 1172 a 1202) e à coluna 1 da cena 5 (R$ 1.546,28 para
R$ 2.995,11, quadros 1538 a 1568). Some a frase falsa de 1187 a 1193 e de 1574 a 1580. A cena 4
encurta 21 quadros (a espera não existe mais) e o filme vai a 2.499 quadros (83,3 s); todo quadro
depois de 1172 anda 21 para trás, por isso a evidência r2 foi refeita inteira. Nenhum grupo perdeu
tempo parado: a tabela acima é a medição do r2b, igual à do r2 grupo a grupo.

## r3 e entrega

18/10/2026 22:59 BRT (19/10 01:59Z). Acabamento sobre `reviews/findings-filme-r2.md` (PASSA), só os
pontos pedidos, e render final. Dados congelados: `estudio/dados/fechamento.json` com SHA-256
`58d50e14240fbc0249d619b50c36be49e8585e992248a9da5e3d6be01ef0b632`, igual ao de
`out/final/congelado/SHA256SUMS`, conferido antes e depois de cada render (motor e extrator não rodaram).
O filme mostra "O motor levou 0,06 s.".

| Defeito ou achado | O que mudou | Quadros para conferir |
|---|---|---|
| Defeito 01: transição 2–3 | O rótulo do botão chega a 0 em 4 quadros com o botão parado; depois o botão vira a caixa do número enquanto o preenchimento escuro some em 6 quadros e o "0" em tinta aparece no mesmo ritmo. Bloco escuro vazio: 1 quadro (412) | 405–435 (stills `transicao-2-3`) |
| Defeito 03: transição 3–4 | O cartão só começa a crescer no quadro 785, com o "2.332" a cerca de 14% de opacidade; o "116" vai dentro dele e some de 799 a 805; o nome do lojista entra em 805. Nenhum quadro tem nome e "116" juntos; um quadro (805) de cartão vazio entre os dois | 777–830 (stills `transicao-3-4`) |
| Defeito 02 (Diretor) | Legenda da origem: "Relatório da Orbe, linha 727: a venda de 12/09, como chegou." (dd/mm tirado de `data_venda`). O grupo 4c passou a precisar de 164 quadros parados (+3 palavras) | 1370–1536, still 1469 |
| Achado 3 | "a mais nesta venda" fica legível sozinho 6 quadros (867 a 873) antes de o "R$ 32,25" aparecer contando | 857–876 |
| Emendas do `STYLE.md` | Registram o método que já estava em uso; nada mudou por causa delas | |

Duração: **2.520 quadros (84,0 s)**. Cenas: 182, 226, 369, 759, 367, 317, 300 (começam em 0, 182,
408, 777, 1536, 1903, 2220).

Tempo parado, medido sem perda (`out/previews/logs/parado-r3.txt`):

| Grupo | Do quadro | Parado e legível | Precisa | Saldo |
|---|---|---|---|---|
| 1 | 104 | 79 | 76 | +3 |
| 2 | 270 | 103 | 100 | +3 |
| 3a | 474 | 79 | 76 | +3 |
| 3b | 602 | 151 | 148 | +3 |
| 4a | 921 | 199 | 196 | +3 |
| 4b | 1220 | 63 | 60 | +3 |
| 4c | 1370 | 166 | 164 | +2 |
| 5 | 1665 | 238 | 236 | +2 |
| 6 | 1982 | 239 | 236 | +3 |
| 7 | 2315 (rodapé) | 205; 238 desde a terceira linha (2282) | 203; 236 desde a terceira linha | +2 |

Cortes (`reviews/frames/filme-cortes/r3-*`, `diferencas-r3.txt`): 0 pixels com diferença acima de 16
nos seis; máximo 12 no 4–5 (antisserrilhado).

Evidência r3: stills `out/previews/filme/filme-r3-*` (os 9 de leitura e 18 dos trechos alterados),
folhas `reviews/contact-sheets/filme-r3.png` e `filme-r3-trechos.png`, prévias
`out/previews/filme-r3-baixa.mp4` e `filme-cena4-r3.mp4`.

### Arquivos finais (`estudio/out/final/`)

| Arquivo | Tamanho | Duração | Formato | SHA-256 |
|---|---|---|---|---|
| `fechamento-1080p.mp4` | 5.410.230 bytes (5,4 MB) | 84,000 s, 2.520 quadros | H.264 High, 1920×1080, 30 fps, yuv420p, BT.709, CRF 16, faststart, sem áudio | `03d4aae75906bf2dd3cd5d920b4fcbaf517d12903e9c588617c6acdce1225ba3` |
| `fechamento-deck.mp4` | 4.463.912 bytes (4,5 MB) | 84,000 s, 2.520 quadros | o mesmo, CRF 18 | `84e664be0b1f1639e25d86df74f769eefc84fa29c5c1925dec044a919fea197b` |

O master já fica bem abaixo de 20 MB porque o filme é quase todo parado; o do deck usa CRF 18 em vez de
baixar a resolução. Os dois saíam em `yuvj420p` (faixa cheia), que alguns players e o PowerPoint
interpretam mal; o render final força `yuv420p` com BT.709, e o fundo decodificado do MP4 dá
(250, 245, 251) contra o alvo `#F9F5FA` (249, 245, 250). Tempo de render: 60 s (1080p) e 63 s (deck).
O encoder não é determinístico byte a byte; os hashes valem para os arquivos entregues e estão em
`out/final/SHA256SUMS`, junto com os dos pôsteres.

Pôsteres (PNG 1920×1080, `out/final/posteres/`), no momento de leitura do grupo principal de cada cena:
`cena1-o-mes-chega` (150), `cena2-as-regras` (331), `cena3-a-conta` (692), `cena4-a-diferenca`
(1039), `cena4-o-recuo` (1257), `cena4-a-origem` (1469), `cena5-o-dinheiro` (1807),
`cena6-as-pessoas` (2124), `cena7-fecho` (2510) e `cena7-quadro-final` (2519). Os dois da cena 7 são
idênticos, porque o pôster fica parado até o último quadro.

Reproduzir: `bash estudio/scripts/render_filme.sh all r3`, `trechos r3` e `final r3`.
