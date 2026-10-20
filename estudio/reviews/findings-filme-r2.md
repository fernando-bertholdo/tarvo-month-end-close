# Findings: filme do fechamento, corte r2

Crítico, 18/10/2026 22:40 BRT (19/10 01:40Z). Segunda revisão do filme, em contexto novo: não vi o
código, a conversa do Animador nem o relatório técnico. (Arquivo gravado pelo Diretor com o texto
entregue pelo Crítico: o ambiente do subagente recusou a gravação.)

O que vi: os 9 stills `out/previews/filme/filme-r2-*.png`, a folha `reviews/contact-sheets/filme-r2.png`,
os pares de corte `reviews/frames/filme-cortes/r2-*` e as prévias `filme-r2-baixa.mp4` (2.499 quadros,
83,3 s, 30 qps) e `filme-cena4-r2.mp4`. Renderizei o filme inteiro sem perda em meia resolução para o
mapa de movimento, trechos sem perda em resolução cheia (360–440, 785–830, 1120–1230, 1284–1324,
1320–1660) e stills avulsos. Tempo parado medido por luma quadro a quadro, sem compressão. Números
conferidos contra `dados/fechamento.json` (`executado_em` 2026-10-19T01:19:42Z). Evidência em
`reviews/frames/critico-filme-r2/`.

## 1. Notas

| Critério | Nota | Justificativa |
|---|---|---|
| Composição | 8 | Grade limpa, margens certas, um objeto por vez; a cena 3 segue com contagens no terço de cima e legenda solta no rodapé. |
| Tipografia | 9 | Nada abaixo de 36 px, formato brasileiro, "87 operações assim" a 44 px em tinta, "116" e "15" proporcionais, nome do pôster no papel Destaque. |
| Legibilidade do produto | 8 | Conta, origem e quem decide se entendem sem narração; o rastro que sai do total para uma linha só pode ser lido como "o R$ 1.546,28 vem desta linha". |
| Qualidade do movimento | 7 | Curvas limpas, parado é parado, clique visível; a troca do botão pelo contador mostra rótulo cortado e um bloco preto mudo, e o cartão da cena 4 passa por cima de texto. |
| Timing | 7 | Todos os grupos cumprem o mapa, inclusive os três que estavam curtos; folga de 3 a 11 quadros e nenhuma cena com os 15 quadros de fim de cena. |
| Continuidade | 8 | Botão vira contador, "116" vira cartão, "R$ 32,25" viaja com o rótulo, "R$ 1.546,28" vira a coluna 1; passagens com quadros intermediários sujos. |
| Consistência com o `STYLE.md` | 8 | Selo sem fundo, contadores pela emenda, anel do clique, acento e crítico separados; faltam a margem de fim de cena e os 6 quadros (são 11) antes de contar "R$ 32,25". |

## 2. Exatidão dos números

Nenhum número errado. Cena 2: 60. Cena 3: faixas 1.996 · 257 · 23 · 187 (somam 2.463), barras
proporcionais, contador nunca abaixo das faixas visíveis; 2.463 · 2.332 · 116 · 15; "O motor levou
0,06 s." Cena 4: Rota Global Intercâmbio Ltda, 12/09/2026, R$ 6.449,10, 3,59%, 4,09%, 0,50 ponto,
R$ 32,25, 87 operações (29 × 3), R$ 1.546,28, Financeiro, linha 727; células iguais a
`linha_origem_texto`, com "…" nos quatro vãos; contadores sobem sem descer e param na string exata.
Cena 5: R$ 2.995,11, R$ 15.396,77, ≈ R$ 7,9 mil, nunca somados. Cena 6: 15; 12 · 2 · 1; 1.546,28,
15.396,77 e 7.350,00 com os donos certos. Cena 7: 15 decisões; "menos de um segundo".

## 3. Os três defeitos mais importantes

```text
DEFEITO 01
QUADRO OU MOMENTO: transição 2–3, quadros 409 a 431 (pior: 410 a 423)
OBSERVAÇÃO: o botão encolhe com o rótulo ainda dentro ("odar o fechament" em 410). De 414 a 423 sobra um bloco preto sem conteúdo; de 424 a 431 o "0" surge enquanto o bloco se apaga. "0 decisões" limpo só em 432.
POR QUE IMPORTA: é o instante em que o produto roda; texto cortado e bloco preto parecem falha de render.
MENOR CORREÇÃO ÚTIL: o rótulo chega a opacidade 0 antes de a largura diminuir; o "0" em tinta aparece dentro da caixa enquanto o preenchimento some; nenhum quadro com bloco vazio por mais de 3 quadros.
PRESERVAR: contador nasce no lugar do botão; clique com 0,96 e anel; "0" só quando começa a contar; contador é a soma das barras.
CONFERIR DE NOVO: 405 a 435, em resolução cheia.
```

```text
DEFEITO 02
QUADRO OU MOMENTO: cena 4, origem, quadros 1358 a 1515 (q1450)
OBSERVAÇÃO: o rastro sai do total de R$ 1.546,28 e pousa numa linha só, a 727; a venda que a linha prova saiu da tela uns 230 quadros antes.
POR QUE IMPORTA: o CFO pode procurar o R$ 1.546,28 na linha, que tem 6449,10, 4,09 e 263,76.
MENOR CORREÇÃO ÚTIL: decisão do Diretor: a legenda diz de qual venda é a linha, ou o rastro sai de um ponto da grade.
PRESERVAR: soma em cima e origem embaixo; mergulho sem mais nada se mexendo; "…" em cada vão; 6449,10 e 4,09 em destaque; legenda a 44 px.
CONFERIR DE NOVO: 1286 a 1515 e o corte 4–5.
```

```text
DEFEITO 03
QUADRO OU MOMENTO: transição 3–4, quadros 786 a 810
OBSERVAÇÃO: o cartão cresce a partir do "116" e passa por cima do "2.332", que ainda apaga; de 802 a 808 mostra "Rota Global Intercâmbio Ltda" com "116" na linha do valor.
POR QUE IMPORTA: por um quarto de segundo a tela liga a Rota Global às 116 sinalizadas do mês.
MENOR CORREÇÃO ÚTIL: o "116" some antes de o nome entrar (ou o nome entra 6 a 8 quadros depois); o cartão só cresce com o "2.332" abaixo de ~20% de opacidade.
PRESERVAR: cartão nasce da caixa do "116", sem cartão vazio; conteúdo em ordem.
CONFERIR DE NOVO: 785 a 830.
```

## 4. Outros achados

1. **Margem de fim de cena:** o `STYLE.md` pede pausa + 15 quadros antes da transição e nenhuma cena tem; na prática a leitura cabe. Diretor decide: aplicar (~60 quadros) ou registrar que a transição por continuidade dispensa a margem.
2. **Mapa contra regra literal:** o mapa conta de forma mais solta que o `STYLE.md` em seis grupos; todos ficam legíveis por mais tempo desde o primeiro elemento. Escrever no `STYLE.md` as regras de contagem usadas ("rótulo com o próprio valor conta 1"; "texto legível antes do último elemento já conta como lido").
3. "a mais nesta venda" fica 11 quadros sozinho antes de o número contar (o `STYLE.md` pede 6).
4. Cena 3: contagens no terço de cima e legenda solta (já na r1).
5. Duração do motor: o filme mostra 0,06 s, igual ao JSON. Congelar antes do render final.
6. Transição 6–7: seis quadros de fundo vazio, no limite do `STYLE.md`.
7. Barras da cena 3 enchem enquanto o contador conta (aceito na r1; só o contador principal conta).
8. Ruído de antisserrilhado em 9 px da célula 6449,10, invisível.

## 5. Veredito

**PASSA.** Nenhum número errado, nenhum texto da camada principal ilegível ou curto pelo mapa de
leitura, nenhuma nota abaixo de 7. Os defeitos 01 e 03 são correções locais; o 02 é decisão do
Diretor. Nenhum bloqueia a entrega; numa rodada curta antes dela, conferir só os quadros listados.

## Anexo A. Tempo de leitura, grupo a grupo

| Grupo | Parado | Precisa (mapa) | Saldo | r1 (parado / saldo) | Literal |
|---|---|---|---|---|---|
| 1. Título e cartões | 84 | 76 | +8 | 118 / +40 | 76 |
| 2. "60", regra e botão | 106 | 100 | +6 | 113 / +13 | 148 |
| 3a. Faixas e "2.463 decisões" | 79 | 68 | +11 | 101 / +25 | 100 |
| 3b. Três contagens e legenda | 153 | 148 | +5 | 104 / −44 | 148 |
| 4a. Cartão, taxas, diferença, selo | 199 | 196 | +3 | 159 / −37 | 212 |
| 4b. Recuo completo | 63 | ≥ 60 | +3 | 11 / −34 | 45 |
| 4c. Origem | 145 | 140 | +5 | 146 / +6 | 132 |
| 5. Dinheiro | 242 | 236 | +6 | 207 / −21 | 268 |
| 6. Pendências | 239 | 236 | +3 | 201 / −27 | 252 |
| 7. Fecho | 246 / 209 | 236 | +10 | 222 / −14 | 236 |

## Anexo B. A r1, item por item

Os três defeitos da r1 corrigidos; 11 dos 12 achados corrigidos (o 5, congelar o JSON, segue para a
entrega). Problemas novos: defeitos 01 e 03 (transições) e 02 (legenda da origem), mais a meia frase
parada de 11 quadros.

## Anexo C. O que o CFO entende sozinho

A conta, sim. A origem, sim, com o risco do defeito 02. A decisão, sim. O dinheiro: três valores lado
a lado, sem total, "≈" na estimativa; nada sugere somá-los.
