# Findings: filme do fechamento, corte r1

Crítico, 18/10/2026 21:45 BRT (19/10 00:45Z). Primeira revisão do Crítico sobre o filme. (Arquivo
gravado pelo Diretor com o texto entregue pelo Crítico: o ambiente do subagente recusou a gravação.)

Visto: os 8 stills `out/previews/filme/filme-r1-*.png`, a folha `reviews/contact-sheets/filme-r1.png`,
os pares de corte `reviews/frames/filme-cortes/r1-*`, as prévias `filme-r1-baixa.mp4` e
`filme-cena4-r1.mp4` (quadro a quadro) e 19 quadros em resolução cheia renderizados do projeto. Números
conferidos contra `dados/fechamento.json`. Não li o código do filme nem usei o relatório técnico como
prova. Tempo parado medido por diferença de luma entre quadros seguidos na prévia (2.400 quadros). Mapa
de movimento, tiras e quadros em `reviews/frames/critico-filme-r1/`.

## 1. Notas

| Critério | Nota | Justificativa |
|---|---|---|
| Composição | 8 | Grade limpa, margem de 120 px, muito respiro, um objeto por quadro; só a cena 3 deixa as contagens no terço de cima e a legenda solta no rodapé. |
| Tipografia | 8 | Escala do `STYLE.md` respeitada, nada abaixo de 36 px, formato brasileiro; mas "87 operações assim" sai no mínimo (36 px, `texto-2`), e "116" e "15" tabulares a 112 px abrem vão depois do "1". |
| Legibilidade do produto | 7 | Entende-se a conta, a origem e quem decide, mas "Pendências 7" contra "15 pendências" e conectores que ligam arquivo à faixa errada confundem quem lê com atenção. |
| Qualidade do movimento | 7 | Curvas limpas, parado é parado, uma curva que passa do ponto por cena; mas na cena 3 contador e cinco faixas contam juntos, e botão e "116" se dissolvem em vez de virar o elemento seguinte. |
| Timing | 5 | Três grupos curtos de verdade; o pior, "87 operações assim", fica 11 quadros parado. Outros três sem folga (anexo A). |
| Continuidade | 6 | Pares de corte idênticos porque as transições acontecem dentro da cena seguinte; ali o botão some sob o contador, o "116" apaga e cresce um cartão vazio, e o "R$ 32,25" perde o rótulo e ganha o da soma antes de contar. |
| Consistência com o `STYLE.md` | 8 | Paleta, acento só na cena 1, cena 4 sem acento, rastro em `texto-2`, selos com ícone e palavra; desvios: contador junto das faixas, selo "feitas pela regra" com fundo verde, contadores que esperam 10 quadros em vez de 6. |

## 2. Exatidão dos números

Nenhum número errado. Conferidos: 7 arquivos; 60 regras; faixas 1.992 · 257 · 184 · 23 · 7 (soma
2.463, contador parcial nunca menor que as partes); 2.463 · 2.332 · 116 · 15; 0,07 s; Rota Global,
12/09/2026, R$ 6.449,10, 3,59%, 4,09%, 0,50 ponto, R$ 32,25, 87 operações (grade 29 × 3), R$ 1.546,28,
Financeiro, campos da linha 727; R$ 2.995,11, R$ 15.396,77, ≈ R$ 7,9 mil, nunca somados; 15 · 12 · 2 ·
1; 1.546,28 · 15.396,77 · 300.000,00 (módulo); 15 decisões. Contadores sobem sem descer e param na
string exata.

## 3. Os três defeitos mais importantes

```text
DEFEITO 01
QUADRO OU MOMENTO: cena 4, recuo, quadros 1130 a 1294 (pior: 1187 a 1263)
OBSERVAÇÃO: o elo "uma venda, 87 operações, R$ 1.546,28, decide o Financeiro" nunca fica parado. "a mais nesta venda" sai em 1137 e o "R$ 32,25" atravessa sem rótulo até 1187. Em 1195 entra "a cobrar da Orbe" sob ele: de 1195 a 1205 a tela afirma, parada, "R$ 32,25 a cobrar da Orbe" (q1200). A soma conta de 1205 a 1235, o selo carimba de 1242 a 1252, e em 1263 grade e rótulo começam a sair. O estado completo fica 11 quadros parado. "87 operações assim" fica 28 quadros parado, em três pedaços, no tamanho mínimo, em texto-2.
POR QUE IMPORTA: é o momento que convence; o CFO não lê "87 operações assim" e o único texto parado que vê é uma frase falsa.
MENOR CORREÇÃO ÚTIL: segurar o estado completo (soma, selo, grade, rótulo) pelo menos 45 quadros, de preferência 60, antes de a origem subir; espera entre rótulo e contagem de 6 quadros; manter "a mais nesta venda" no "R$ 32,25" até o rótulo novo entrar, com troca sobreposta de 3 quadros; "87 operações assim" pode ir a 44 px.
PRESERVAR: contagem a partir de R$ 32,25, grade 29 × 3 em crítico, "Decide: Financeiro" sem curva que passa do ponto, mergulho com nada mais se mexendo, estado final soma em cima e origem embaixo.
CONFERIR DE NOVO: 1130 a 1210, 1252 a 1320 deslocados, corte 4–5.
```

```text
DEFEITO 02
QUADRO OU MOMENTO: cena 3, faixas, quadros 472 a 645 (q0600)
OBSERVAÇÃO: a quinta faixa diz "Pendências 7"; vinte quadros depois a tela diz "15 para uma pessoa decidir", e as cenas 6 e 7 dizem 15. Os conectores ligam cartão 1 à faixa 1, 2 à 2 etc.: "Ajustes da Orbe" vai para Remessa, "Taxas contratadas" para Extratos, "Plano de contas" para Pendências, e os extratos ficam sem linha.
POR QUE IMPORTA: parcial que contradiz o final ("são 7 ou 15?") e origem falsa num filme cuja tese é "cada número com origem".
MENOR CORREÇÃO ÚTIL: o Diretor renomeia ou elimina a quinta faixa; as linhas convergem num feixe único ou cada faixa recebe linha só do arquivo dela.
PRESERVAR: os totais e a soma corrida, barras proporcionais, cartões no mesmo lugar desde a cena 1.
CONFERIR DE NOVO: 470 a 645 e 683.
```

```text
DEFEITO 03
QUADRO OU MOMENTO: cena 3, três contagens e legenda (683 a 787); cena 4, cartão, taxas e diferença (971 a 1130)
OBSERVAÇÃO: as contagens e a legenda ficam 104 quadros paradas e legíveis antes de o resto esmaecer a 40%; precisam de ~148 (faltam ~44). Na cena 4, cartão, taxas, colchete, R$ 32,25 e selo entram com 7 a 10 quadros de intervalo; a leitura fica para os 159 quadros finais, que precisam de ~196 (faltam ~37).
POR QUE IMPORTA: a cena 3 é "a conta" e a 4 é a prova.
MENOR CORREÇÃO ÚTIL: ~45 quadros a mais nas contagens e ~40 na cena 4, tirados de onde sobra: título da cena 1 (~40), faixas da cena 3 (~25), cena 2 (~10) e movimento que não comunica (cartão vazio 826 a 842, espera em "R$ 0,00" 913 a 923, os 46 quadros dos 87 pontos, os 73 do enchimento das faixas). Pausas grupo a grupo, não um fator único de 74%.
PRESERVAR: os textos aprovados, a ordem das entradas, a pausa de 22 quadros do 116 em foco, "parado é parado".
CONFERIR DE NOVO: 683 a 820 e 971 a 1130 deslocados, refazendo o anexo A.
```

## 4. Outros achados

1. Grupos sem folga: dinheiro da cena 5 (faltam ~21), pendências da cena 6 (~27), rodapé do fecho (~14).
2. Transição 3–4 (814 a 842): o "116" apaga e um cartão branco vazio cresce no lugar (~16 quadros sem texto); o storyboard pede que o número se abra no cartão.
3. Transição 2–3 (457 a 470): o botão se dissolve sob "0 decisões"; não vira o contador.
4. A fileira de origem esconde campos em dois vãos sem "…" (código do estabelecimento; VENDA, CREDITO PARCELADO, 8, ELO). Decisão do Diretor.
5. Tempo do motor instável (0,07 s no JSON, 0,06 s na rodada atual): congelar antes do render final.
6. Cena 3: contador principal e os cinco números das faixas contam juntos por 73 quadros; cada total poderia aparecer quando a barra termina.
7. Selo "feitas pela regra" com fundo verde, contra o `STYLE.md` (cor só no ícone e na palavra).
8. Contadores esperam 10 quadros depois do rótulo ("R$ 0,00 a mais nesta venda", "R$ 32,25 a cobrar da Orbe"): frases falsas paradas.
9. Clique quase invisível na cena 2 (425 a 429): sem anel e sem os 6 quadros entre causa e efeito.
10. "116" e "15" tabulares a 112 px abrem vão; aqui o `STYLE.md` permite proporcional.
11. Pôster: "Fechamento de setembro · Tarvo" em 44 px `texto-2`, a linha mais fraca do quadro do deck. Decisão do Diretor.
12. Textos que um CFO pode ler errado (Diretor): "R$ 1.546,28 a cobrar da Orbe" sem o lojista soa como total da Orbe; "R$ 2.995,11 taxa acima do contrato", nascido da soma da Orbe, sugere que tudo é da Orbe (R$ 1.418,88 é da Ponte); "300.000,00 · Transferência em trânsito" é o maior número do filme, sem contexto; "Cobrar a Orbe" e "a cobrar da Orbe" usam duas regências.

## 5. Veredito

**NÃO PASSA.** Nenhum número errado, mas timing (5) e continuidade (6) abaixo de 7 e defeito de
legibilidade na camada principal ("87 operações assim"; "Pendências 7" contra 15). O defeito 02 depende
de texto do Diretor.

## Anexo A. Tempo de leitura, grupo a grupo

| Grupo | Parado e legível | Precisa | Saldo |
|---|---|---|---|
| 1. Título e cartões | 118 | ~76 | +40 |
| 2. "60", regra e botão | 113 | ~100 | +13 |
| 3a. Faixas e "2.463 decisões" | 101 | ~76 | +25 |
| 3b. Três contagens e legenda | 104 | ~148 | −44 |
| 4a. Cartão, taxas, diferença, selo | 159 | ~196 | −37 |
| 4b. "87 operações assim" e soma | 11 (mais 10 e 7 em pedaços) | ≥ 45 | −34 |
| 4c. Origem | 146 | ~140 | +6 |
| 5. Dinheiro | 207 | ~228 | −21 |
| 6. Pendências | 201 | ~228 | −27 |
| 7. Fecho | 188 (222 desde 2178) | ~236 desde 2178 | −14 |

O filme não precisa ir aos 94 s: os três grupos curtos cabem em 80 s redistribuindo; com margem também
para os sem folga, cerca de 82 s.

## Anexo B. Desvios do Animador

Fator único de 74%: em parte (tira de quem não tem folga). Botão que vira contador: não no render.
Contador junto das faixas: vale para as barras, não para os números. Contagens lado a lado: sim. Curva
que passa do ponto no selo: sim. Soma a partir de R$ 32,25: sim, mas cria a frase falsa. Mergulho
1,17×: sim. "…" só nas pontas: são dois vãos. Números de 112 px na cena 5: sim. Soma esperando 8
quadros: sim. Pôster parado 184 quadros: sim. `duracao_s` instável: confirmado.
