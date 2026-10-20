# Findings: painel da analista, rodada r4

Crítico, 19/10/2026, 23:51 BRT (20/10 02:51Z). Contexto novo. Não li o código (`src/`, `estudio/scripts/`, `estudio/filme/`, o
texto de `relatorio/painel.html`), os relatórios técnicos (`tecnico-*.md`) nem o git log. Não rodei o motor,
o servidor nem os scripts de captura: `relatorio/`, `saida/` e `estudio/` ficaram intactos. A especificação
foi a Parte 2 do `STORYBOARD.md`, as duas revisões de texto do Diretor e as três últimas entradas de
"Mudanças" (22:35, 23:26 e 23:27). (Arquivo gravado pelo Diretor com o texto entregue pelo Crítico, sem
outra edição além deste título e do UTC ao lado da hora: o ambiente do subagente não grava em
`estudio/reviews/`.)

O que eu vi:

- As 93 telas de `out/previews/painel-r4/`: 89 da captura e 4 do modo ao vivo (`50` a `53`). Todas em
  tamanho real. Ampliei a faixa de origem a 1440, a 1280 e em projeção a 1280.
- A folha `contact-sheets/painel-r4.png`.
- O vídeo `reproducao-1x.mp4`: 1440×900, 30 qps, 108,2 s de arquivo, 3.246 quadros. A reprodução vai do
  clique, em 1,55 s, à volta ao Resumo, em 105,40 s: 103,9 s. Usei o vídeo de três formas:
  - 541 quadros a 5 qps, lidos por OCR no cartão da comissão, no impacto e nos contadores da mesa;
  - diferença de luma quadro a quadro (30 qps, mesa e impacto separados), para medir as pausas;
  - mosaicos a 10 qps no fecho do checkout, nas Notas e na troca de aba Meridiano/Aurora.
- `captura.json` e `captura-vivo.json`, só para saber o que cada tela é e a hora em que foi capturada.
- Os números, contra `saida/*.csv`, `relatorio/execucao.json` (executado em 20/10 02:28:45Z) e
  `relatorio/eventos.jsonl` (2.511 eventos). As linhas de origem, em `dados/`:
  - relatório da Orbe, linha 727;
  - anexo `.xlsx` da Ponte extraído do `.eml`, aba Operações, linhas 6 a 11, 76, 77, 96, 141, 205 e 228;
  - extrato Aurora, linhas 50, 65 e 92.
- Quadros, OCR e scripts do Crítico ficaram fora do repositório, no scratchpad da sessão (`critico-r4/`).

## 1. Notas

| Critério | Nota | Justificativa |
|---|---|---|
| Composição | 7 | A faixa e a lista em uma linha entram na grade a 1440, a 1280 e em projeção, sem rolagem lateral. Perde em dois pontos: a faixa começa abaixo da primeira dobra nas duas larguras, e os quatro elos alternam a ordem de rótulo e valor, com os valores em três alturas diferentes. |
| Tipografia | 7 | Algarismos tabulares, U+2212 nos negativos, nada abaixo de 13 px e títulos que quebram sem "…". Perde porque o "87 operações", que o Diretor pôs no destaque, saiu em 13 px de meta, e os identificadores do Rastro técnico continuam partidos no meio. |
| Legibilidade do produto | 8 | O Resumo abre na resposta. Em projeção, a lista de pendências se lê de longe: 15 linhas, nenhuma quebra, valores numa borda, selos numa coluna. A faixa diz a cadeia inteira com valores de 20 a 35 px, mas só aparece depois de rolar. |
| Qualidade do movimento | 8 | Comissão, dinheiro em jogo e notas sobem sem descer e sem passar do final. As Notas ganharam "emitindo… (k de 21 notas)", e a troca Meridiano/Aurora ficou na ordem certa. Restam a linha do motor presa na Casa durante a varredura e um "Rotina em lote" que aparece por 0,17 s. |
| Timing | 8 | A reprodução leva 103,9 s em 1x. As 15 batidas narradas, medidas a partir do assentamento, cumprem `max(1500, 670 + 270 × palavras)`, com a Bridge na pausa mínima por decisão do Diretor. Três delas ficam a menos de 0,15 s da regra e não têm folga. |
| Continuidade | 7 | Mesa, impacto, Resumo, gavetas e ao vivo dizem os mesmos números em todo estado conferido. O defeito 02 da r2 foi corrigido só pela metade: a linha do motor fala da Casa por 1,6 s enquanto o olhar carimba outras quatro linhas. |
| Consistência com o `STYLE.md` | 8 | Acento só no olhar e na seleção, estado sempre com ícone e palavra, formato brasileiro, nenhum código do motor fora do Rastro técnico. Ficam o "R$" dentro das células da tabela da gaveta da Ponte e o spread da Maple em duas precisões. |

## 2. Exatidão dos números

Nenhum número errado em modo nenhum: Resumo, gavetas, reprodução tocando e pausada, ao vivo, escuro,
movimento reduzido e projeção. Nenhum parcial contradiz o final. Na versão entregue, um indicador caía de
R$ 93.099,50 para R$ 7.703,98; isso não acontece mais. Em 402 amostras do cartão da comissão, o valor nunca
desce. Os valores intermediários do contador duram um quadro cada e são a animação entre dois valores do
motor, que o Diretor aceitou às 23:27. Todo estado pausado mostra a soma exata dos k fechados.

| Onde | Na tela | Fonte | Resultado |
|---|---|---|---|
| Cabeçalho, legenda, ao vivo | Fechado em 0,08 s; "O motor fechou o mês em 0,08 s" | `execucao.json`, `resumo.duracao_s` 0.08 | bateu |
| Resumo, comissão | R$ 243.278,79 = R$ 203.735,34 + R$ 39.543,45; 21 e 14 lojistas | `comissao_total`, `comissao_checkout`, `comissao_remessa`, `lojistas`; `comissoes_por_lojista.csv` (21 e 14 linhas, mesmas somas) | bateu |
| Resumo, notas | 21 notas, R$ 243.284,29; 20 do checkout e 1 da Ponte; Casa sem nota (−R$ 5,50) | `notas_a_emitir.csv` (21 linhas, soma 243.284,29); `notas_por_linha`; PEN-0011 | bateu |
| Resumo, dinheiro em jogo | R$ 2.995,11 (Orbe R$ 1.576,23, Ponte R$ 1.418,88); R$ 15.396,77; ≈ R$ 7,9 mil, "estimativa", sem soma | `divergencias_brl`, `divergencia_orbe`, `divergencia_ponte`, `devolucao_casa`, `atlas_estimativa` 7.876,05 | bateu |
| Resumo, divergências | 87 · 1.546,28; 23 · 1.418,88; 5 · 29,95; total 115 · 2.995,11 | `divergencias_taxa.csv` agrupado | bateu |
| Faixa de origem | Contrato 3,59%; A Orbe cobrou 4,09%; R$ 32,25 a mais nesta venda; 0,50 ponto; 87 operações; R$ 1.546,28 a cobrar da Orbe; Decide: Financeiro | DIV-0001 (`taxa_contratada_pct`, `taxa_aplicada_pct`, `diferenca_brl`; `diferenca_pp` 0.5 no evento 731); `parcial.grupo.n` 87; PEN-0001 | bateu; a venda é a mesma da gaveta |
| Resumo, pendências | 15 = Financeiro 12 + Comercial 2 + Tesouraria 1; os 15 valores e donos, de PEN-0001 a PEN-0015; Atlas como ≈ R$ 7,9 mil | `pendencias.csv`; `pendencias_por_dono`; nomes da repetida e dos spreads nas linhas 76, 96, 141, 205 e 228 do anexo | bateu; a Atlas aparece como estimativa, não como o bruto, como pede o `BRIEF` |
| Filtro Financeiro | "12 pendências de 15 no mês" | `pendencias_por_dono`, `pendencias` | bateu |
| Feito pela regra | 1.900 + 228 + 20 + 184; "2.332 decisões de rotina" | `decisoes_por_etapa.*.regra`; `decisoes.regra` | bateu |
| Gaveta Rota Global | 12/09/2026 · 8 parcelas; R$ 6.449,10; 3,59% e 4,09%; 0,50 ponto; R$ 32,25; 87 = 83 vendas + 4 estornos; R$ 1.546,28; linha 727; taxa R$ 263,76; líquido R$ 6.185,34; ressarcimento R$ 1.545,86; "10 de 87 operações" | linha 727 do relatório da Orbe; eventos 731 e 2023 (`por_tipo`, `ressarcimento`, `n_linhas`) | bateu |
| Gaveta Mundo Aberto (projeção a 1280) | 04/09/2026; R$ 9.830,65 = CAD 2.438,46 × 4,0315; pago R$ 9.978,18; 1,20% e 1,5007%; 0,3007 ponto; R$ 29,56; 23; R$ 1.418,88 | anexo, linha 10; evento 2032 (DIV-0093); PEN-0010 | bateu |
| Gaveta "Conferir o crédito da Ponte contra a nota" | R$ 39.543,45; 228 linhas; "6 de 228 linhas" e "10 de 228 linhas"; seis linhas (30/09 NZD 17.717,12 · 262,01; 10/09 USD 43.834,41 · 540,78; 02/09 USD 31.023,72 · 488,45; 29/09 CAD 21.210,38 · 261,85; 04/09 CAD 9.978,18 · 147,53; 28/09 GBP 25.635,04 · 378,92); Maple 5.402,22 · PTAX 3,2311 · 1,501%; linha 6 | PEN-0012 (228 referências); anexo, linhas 6 a 11, com as datas pelo serial do Excel | bateu |
| Gaveta Atlas | ≈ R$ 7,9 mil; R$ 7.876,05; 57 = 49 vendas + 5 antecipações + 2 reversões + 1 estorno; R$ 262.138,61, "não receita da Tarvo" | evento 2026 (`estimativa`, `por_tipo`); PEN-0004 | bateu; respeita o `BRIEF` |
| Gaveta Pix | R$ 7.350,00; 16/09/2026; saldo −R$ 752.669,98; linha 50 | extrato Aurora, linha 50; PEN-0013 | bateu |
| Gavetas de comissão | Mundo Aberto: 169 linhas, R$ 18.508,09, "8 de 169 linhas"; linhas e valores por lojista; conta por linha (1.331,35 × 2,49% = 33,15; 10.053,91 × 3,79% = 381,04) | eventos `total` (`n_linhas`, `valor`); `comissoes_por_lojista.csv` | bateu |
| Reprodução, arquivos | 1.943; 14; "30 de 43"; 233; 52; 84; 100 | `execucao.json`, `arquivos`; evento 4 (`linhas_no_arquivo` 43) | bateu |
| Reprodução, contadores da mesa | 723 = 722 + 1; 939 = 925 + 14; 1.992 = 1.900 + 92; 1.993 a 1.996, com 1 a 4 para uma pessoa; 6 = 5 + 1; 81 = 71 + 9 + 1; 245 = 218 + 22 + 5; 256 e 257 de 257 (228 + 23 + 6 no fim); 23 = 20 + 1 + 2; 186 e 187 de 187 (184 + 3 no fim); fim 2.463 = 2.332 + 116 + 15 | `parcial.etapa` dos eventos 731, 947, 2022 a 2026, 2032, 2107, 2271, 2296, 2298, 2321, 2509 e 2510; `decisoes` | bateu |
| Reprodução, comissão corrida | sobe sem descer; pausada: R$ 53.178,61 (6 de 21), R$ 64.858,04 (7), R$ 138.147,60 (15), R$ 150.005,76 (16), R$ 224.528,56 (6 de 14), R$ 226.301,17 (7 de 14); finais R$ 203.735,34 e R$ 243.278,79 | `parcial.mes.comissao` e `parcial.frente` dos eventos `total` | bateu |
| Reprodução, notas corridas | "emitindo… (k de 21 notas)" com R$ 9.259,74 (1), 23.105,45 (2), 33.991,67 (3), 41.307,74 (4), 64.863,54 (6), 94.983,76 (9), 132.255,08 (13), 138.153,10 (14), 196.036,86 (19); fim R$ 243.284,29 · 21 notas a emitir | somas acumuladas de `notas_a_emitir.csv` | bateu |
| Reprodução, dinheiro em jogo | nada fechado; R$ 1.546,28 depois de "Pular"; R$ 1.576,23; R$ 2.995,11; nunca desce | `parcial.mes.em_jogo` dos eventos 2023, 2024 e 2298 | bateu |
| Reprodução, pendências | 1, 2, 3, 4, 5, 6, 7, 9, 10 e assim até 15; donos (Financeiro 2 · Comercial 2; 7 · 2; 10 · 2; 12 · 2 · 1) | `parcial.mes` | bateu |
| Reprodução, linhas do motor | "Orbe cobrou 4,09%; contrato 3,59%. R$ 32,25…"; Bridge 2,59% e 2,19%, R$ 4,50; "Ponte aplicou 1,5007% sobre R$ 9.830,65; contrato 1,20%. R$ 29,56…"; −R$ 687,52, −R$ 509,22, −R$ 292,28, −R$ 345,03; R$ 821,88; R$ 39.543,45; R$ 7.350,00; R$ 12.400,00; −R$ 300.000,00 | eventos 731, 947 e 2032; PEN-0005 a PEN-0009 e PEN-0012 a PEN-0015 | bateu |
| Ao vivo | 1.007 de 1.996 = 986 + 21 (Rota Global 20, Bridge 1); Resumo e gaveta iguais aos do arquivo | evento 1015 (`parcial.etapa`); 20 divergências da PEN-0001 antes dele | bateu |

## 3. Os três defeitos mais importantes

Nenhum é de número errado. Nenhum é de legibilidade da camada principal (ver o veredito).

```text
DEFEITO 01
QUADRO OU MOMENTO: Resumo ao abrir e fluxo do pitch, a 1440×900, a 1280×720 e em projeção.
  - 01-resumo-1440.png: da faixa só aparecem o título (y 862) e o topo dos cartões, até y 900.
  - 20-resumo-1280.png e fluxo-1280-1-rota-global.png: a faixa fica inteira abaixo da dobra; a linha
    da Rota Global está em y 685 a 720.
  - 17-projecao-1440.png e fluxo-1440-1-rota-global.png: a faixa fica fora da tela.
OBSERVAÇÃO: a faixa é o empréstimo principal da r4 e só aparece depois de rolar. O fluxo do pitch do
  storyboard (clique na linha da Rota Global, depois no filtro "Financeiro 12") não rola, então a faixa
  não aparece nem uma vez. Rolada, ela cabe inteira junto com a tabela a 1440 e a 1280
  (r4-resumo-1440-faixa.png, r4-resumo-1280-faixa.png).
POR QUE IMPORTA: a faixa existe para a sala ver, sem clique, o contrato, o que a Orbe cobrou, a
  diferença numa venda e o total a cobrar. Se ela fica fora do ensaio, o CFO vê de novo só a gaveta,
  e a principal mudança da rodada vira trabalho construído que ninguém vê.
MENOR CORREÇÃO ÚTIL: mudar o fluxo do pitch (decisão do Diretor), sem mexer na página. Antes do
  clique, rolar até "Divergências de taxa", onde tabela e faixa cabem juntas. Outra saída: clicar na
  faixa em vez da linha, porque ela abre a mesma gaveta e seleciona a mesma linha.
PRESERVAR: o Resumo abrindo no topo, na resposta; a faixa embaixo da tabela; o clique da faixa abrindo
  a gaveta da Rota Global e selecionando a linha dela.
CONFERIR DE NOVO: o fluxo do pitch a 1440×900, a 1280×720 e em projeção nos dois tamanhos, com uma tela
  da faixa inteira antes do clique e uma com a gaveta aberta.
```

```text
DEFEITO 02
QUADRO OU MOMENTO: faixa de origem no Resumo: r4-resumo-1440-faixa.png (y 550 a 678),
  r4-resumo-1280-faixa.png (y 368 a 496), r4-resumo-proj1280-faixa.png e r4-resumo-proj1440-faixa.png.
OBSERVAÇÃO: o Diretor pediu em destaque "87 operações · R$ 1.546,28 a cobrar da Orbe". Na tela,
  "87 operações" é rótulo de meta (13 px; 16 px em projeção), em texto-2, acima do "R$". O "0,50 ponto"
  também está em meta. Os elos não seguem uma ordem só:
  - "Contrato" e "A Orbe cobrou": rótulo em cima do valor, bloco centrado na altura do cartão;
  - "R$ 32,25": valor em cima do rótulo, alinhado ao topo;
  - quarto elo: rótulo, valor e rótulo.
  Por isso os quatro valores ficam em três alturas. A 1440: 3,59% e 4,09% em y ≈ 624, R$ 32,25 em
  y ≈ 592 e 1.546,28 em y ≈ 598.
POR QUE IMPORTA: o número que transforma R$ 32,25 em R$ 1.546,28 é o texto mais fraco da faixa.
  Em projeção a 1280, 16 px dão uma maiúscula de cerca de 11′ a 6 m, abaixo dos 16′ que o STYLE fixa
  como mínimo legível. Na gaveta, o mesmo número aparece em 28 px ("87 operações assim"): são duas
  hierarquias para o mesmo número. E quem lê da esquerda para a direita sobe e desce o olho a cada elo.
MENOR CORREÇÃO ÚTIL: "87 operações" em tinta, no tamanho dos valores dos elos (20 px; 25 px em
  projeção), na linha do "R$ 1.546,28" ou logo antes dele. Nos quatro elos, rótulo sempre em cima e
  valor sempre embaixo, com os valores numa linha de base comum.
PRESERVAR: os valores e a fonte de cada um; o 1.546,28 como maior número da faixa (28 px); a
  superfície 2 e o selo "Decide: Financeiro"; o conector desenhado; nenhum identificador; o clique que
  abre a gaveta.
CONFERIR DE NOVO: as quatro telas r4-resumo-*-faixa e r4-faixa-abre-gaveta-1440/1280, mais uma tela da
  faixa no tema escuro, que esta rodada não capturou.
```

```text
DEFEITO 03
QUADRO OU MOMENTO: Reprodução em 1x, etapa Notas, vídeo de 79,40 a 81,00 s. Telas
  r3-notas-1x-como-o-critico-a-4-notas-79268ms.png, r3-proj1280-notas-emitindo.png e
  r4-video-notas.png (relógio de 77,99 a 78,49 s).
OBSERVAÇÃO: a pausa da Casa agora vem antes da varredura: a linha assenta em 76,43 s e fica parada
  3,0 s, contra 2,83 s da regra. Mas a varredura começa em 79,40 s e a linha do motor continua dizendo
  "Casa do Estudante sem nota · −R$ 5,50". Enquanto isso, o olhar desce Bem-Vindo, Oxford, Kiwi e
  Fluente, cada uma carimbada "Feito pela regra", e o cartão conta "emitindo… (1 de 21 notas)" até
  "(4 de 21 notas)". A linha só muda para "Rotina em lote" em 81,00 s. Pausado nesse trecho, o olhar
  está na Fluente e o texto fala da Casa (r3-proj1280-notas-emitindo.png).
POR QUE IMPORTA: a peça vende um relógio só, em que o texto descreve a linha que o olhar acabou de
  decidir. É o mesmo descompasso do defeito 02 da r2, reduzido de 3,0 s para 1,6 s. Continua sendo o
  único trecho da reprodução em que a linha do motor fala de uma linha que o olhar já deixou.
MENOR CORREÇÃO ÚTIL: no quadro em que a varredura começa, a linha do motor troca para o texto de lote
  que as outras etapas usam ("Rotina em lote: feito pela regra.") ou volta à legenda da etapa ("Uma nota
  por lojista, a partir da comissão fechada."). O tempo não muda.
PRESERVAR: a pausa da Casa antes da varredura; o contador único das notas com "emitindo… (k de 21
  notas)"; os parciais exatos; a batida da Ponte.
CONFERIR DE NOVO: o vídeo de 76 a 82 s em 1x e o trecho equivalente em 2x; telas pausadas em 4 e em
  13 notas.
```

## 4. Outros achados

Do mais para o menos grave.

1. **Dinheiro em jogo a 1440** (01-resumo-1440.png, 40-escuro-resumo.png, 30-reduzido-resumo.png).
   "cobrar da Orbe R$ 1.576,23" cabe numa linha; já "contestar com a Ponte" quebra, e o "R$ 1.418,88"
   desce para a esquerda. É o achado 3 da r2, sem mudança. A 1280 as duas partes ficam empilhadas e em
   projeção a 1440 formam coluna; só a largura principal da captura fica torta.
2. **Data do crédito da Ponte.** Na gaveta "Conferir o crédito da Ponte contra a nota"
   (r4-gaveta-pendencia-pela-lista-1440.png e a tela do rastro), o 06/10 só aparece no Rastro técnico,
   em "O motor anotou". A parte de cima da gaveta ("Por que", "Nota única de remessa.") não diz quando o
   crédito chega, que é justamente o que a pessoa vai conferir. Está como o Diretor escreveu (o motivo
   do motor como vem), mas só na parte técnica. Se o Diretor quiser, o motivo do motor sobe para o
   "Por que".
3. **Subtítulo da lista.** No Resumo continua "cada uma com motivo, valor e quem decide", mas o motivo
   saiu da linha e agora só está na gaveta. Mudar ou não é decisão de texto do Diretor.
4. **"Rotina em lote: feito pela regra." pisca.** Aparece por 0,17 s entre a Bagagem e o grupo de
   spreads (vídeo, 55,80 a 55,97 s). Nos outros pontos fica de 0,8 a 1,6 s. É o que sobrou do
   achado 6 da r2.
5. **Troca Meridiano/Aurora nos Extratos.** A ordem está corrigida: a mesa volta à Aurora em 90,6 s e o
   Pix entra no impacto em 90,97 s. Mas o quadro de 90,53 s mostra a mesa só com o cabeçalho. É um
   quadro a 30 qps; não se vê na sala.
6. **Spread da Maple em duas precisões:** "1,501%" na gaveta e "1,5010%" na mesa
   (r4-gaveta-pendencia-pela-lista-1440-rastro.png, 06d-rep-mundo-aberto.png). Achado 10 da r2, sem
   mudança.
7. **Rastro técnico.** Identificadores partidos no meio: "PEN-/0001", "PC-/0926-0003",
   "comissoes_/set2026.csv" (12-mergulho-rota-global-rastro.png,
   r4-gaveta-pendencia-pela-lista-1440-rastro.png). Achado 9 da r2, sem mudança.
8. **Nomes cortados com "…" a 1440, fora da projeção**, inclusive na linha focada: "DEVOLUCAO PIX - MU…"
   (32-reduzido-passo-anterior.png) e "CASA DO ESTUDANTE VIAGE…" (03-rep-10s.png). A linha do motor dá
   o nome inteiro. Achado 5 da r2.
9. **Bordas a 1280×720.** A linha da Rota Global, primeiro clique do pitch, fica em y 685 a 720, colada
   na borda (20-resumo-1280.png). Com a gaveta aberta, o filtro "Financeiro 12" fica meio coberto
   (fluxo-1280-1-rota-global.png). Achados 8 e 7 da r2.
10. **Separador pendurado.** "Contestar com a Ponte ·" quebra depois do separador e deixa o "·" no fim
    da primeira linha, a 1440 e a 1280. O Diretor aceitou a quebra; o ponto pendurado é só acabamento.
11. **Cartão "Feito pela regra" em projeção a 1440.** Em quatro colunas, quebra "operações de /
    remessa" e "lançamentos dos / extratos" (r4-resumo-proj1440-faixa.png). Em projeção a 1280 são três
    colunas, sem quebra.
12. **"R$" nas células.** A tabela da gaveta da Ponte repete "R$" em cada célula ("R$ 17.717,12"), sob
    o cabeçalho "Valor". O STYLE manda pôr o "R$" no cabeçalho da tabela.
13. **"fechando… (k de N lojistas)"** continua em 13 px sob o número de 28 px (pausa-1x-checkout-a.png).
    Achado 4 da r2, opcional.
14. **Evidência.**
    - Nenhuma tela mostra a faixa no tema escuro.
    - As telas são de 23:14 a 23:24 BRT (captura de 20/10 02:14:44Z). O `relatorio/painel.html` e o
      `execucao.json` atuais são de 23:28:45 BRT (20/10 02:28:45Z), ou seja, posteriores. Os números
      batem com os arquivos atuais, inclusive os 0,08 s, mas a prova visual é da página gerada antes.
      Quando a faixa for mexida, vale recapturar o Resumo a partir do arquivo atual.

O que está bem e não deve mudar:

- **Nenhum indicador cai.** A comissão sobe de "fechando… (1 de 21 lojistas)" até R$ 203.735,34 e
  depois até R$ 243.278,79. O dinheiro em jogo vai de R$ 1.576,23 a R$ 2.995,11. As notas vão de
  R$ 9.259,74 a R$ 243.284,29. Pausado em qualquer fecho, o cartão mostra a soma exata dos k fechados.
- **O qualificador das Notas.** "emitindo… (k de 21 notas)" resolve o defeito 01 da r2.
- **A lista em uma linha.** Em projeção: 15 linhas, nenhuma quebra, valores numa borda, selos numa
  coluna. A 1440 quebram exatamente os 3 títulos avisados e a 1280 os 10 avisados, sem "…".
- **A faixa.** Textos e números como o Diretor escreveu: "Origem · Rota Global Intercâmbio", ícone de
  crítico no 4,09%, nenhum identificador. O clique abre a gaveta da Rota Global e seleciona a linha
  dela (r4-faixa-abre-gaveta-1440/1280). Os conectores renderizam limpos; pelo pixel não dá para saber
  se são vetor ou glifo.
- **"{mostradas} de {n}" em todas as listas cortadas que vi:** "10 de 87 operações", "8 de 169
  linhas", "6 de 228 linhas", "10 de 228 linhas". Não sobrou nenhum "e mais N".
- **"INTERCÂ" como o Diretor decidiu.** A célula aparece inteira, em 3 linhas, na linha focada em
  projeção a 1280, sem "…" (r3-proj1280-remessa-mundo-aberto.png).
- **Linha focada inteira em projeção a 1280.** A transferência aparece em 4 linhas, sem reticência
  (r3-proj1280-extratos-transferencia.png): o defeito 03 da r2 está corrigido.
- **"Pago (R$)" no cabeçalho da Remessa:** achado 2 da r2 corrigido.
- **Ao vivo.** Antes do motor, a espera não mostra número ("Fechamento · Tarvo"). No meio da rodada, as
  contagens fecham: 1.007 = 986 + 21. No fim, Resumo e gaveta saem iguais aos do arquivo.
- **Tema escuro e movimento reduzido** estão corretos. Com movimento reduzido, a reprodução abre no
  estado final, e o passo anterior mostra o estado exato (186 de 187; 14 pendências).
- **Nenhum código do motor nem formato americano** fora do Rastro técnico, nas telas que vi.

## 5. O que o Diretor pediu nesta rodada

| Pedido | Situação | Prova |
|---|---|---|
| 1. Todo número da tela sai do motor; nenhum parcial contradiz o final | cumprido | Seção 2: os mesmos números no Resumo, na reprodução (tocando e pausada), nas gavetas e no ao vivo. As 402 amostras da comissão nunca descem. |
| 2. Faixa de origem embaixo da tabela, quatro elos, visível sem clicar; o clique abre a gaveta | cumprido, com ressalvas | r4-resumo-*-faixa.png, r4-faixa-abre-gaveta-*.png. Ressalvas: DEFEITO 01 (abaixo da dobra) e DEFEITO 02 ("87 operações" fora do destaque). |
| 3. Pendências em uma linha (título curto, valor, "Decide: &lt;área&gt;"), motivo na gaveta | cumprido | r4-resumo-*-pendencias.png; r4-gaveta-pendencia-pela-lista-*.png. Quebras como avisado (3 a 1440, 10 a 1280, nenhuma em projeção). |
| 4. "{mostradas} de {n}" no lugar de "e mais N" | cumprido | 12-mergulho-rota-global-rastro.png, 16-mergulho-comissao-lojista.png, r4-gaveta-pendencia-pela-lista-*.png |
| Decisões das 23:27: "INTERCÂ" como chegou; títulos que quebram; contador, reescrita do Rastro e zero do estado vazio | aplicadas como escritas | r3-proj1280-remessa-mundo-aberto.png; r4-resumo-*-pendencias.png; o contador só passa por valor intermediário em movimento; o estado vazio diz "nada fechado ainda" |

Pausas medidas no vídeo, do assentamento até a próxima mudança, contra a regra. Nas batidas de pendência,
o anel do pulso de espera mexe poucos pixels; não contei isso como movimento.

| Batida | Parada | Regra |
|---|---|---|
| Rota Global, exceção | 5,47 s | 5,26 s |
| Bridge | 1,77 s | mínima, por decisão do Diretor |
| Cobrar da Orbe | 4,20 s | 3,91 s |
| Devolver à Casa | 3,03 s | 2,83 s |
| Atlas | 3,43 s | 3,37 s |
| Mundo Aberto, exceção | 6,00 s | 5,53 s |
| Bagagem | 2,77 s | 2,56 s |
| Grupo dos spreads | 6,63 s | 6,61 s |
| Mundo Aberto, pendência | 3,47 s (2,73 s depois do contador) | 3,10 s |
| Casa sem nota | 2,97 s | 2,83 s |
| Ponte | 3,93 s | 3,64 s |
| Pix | 2,77 s | 2,56 s |
| Repasse | 2,83 s | 2,56 s |
| Transferência | 3,37 s | 3,10 s |
| Recapitulação | 4,03 s | 3,91 s |

Atlas, grupo dos spreads e recapitulação ficam a menos de 0,15 s da regra. É a mesma ordem da incerteza da
captura (o quadro mais longo dura 133 ms): não há folga para tirar tempo dessas três.

## 6. Itens da r2

| Item da r2 | Situação |
|---|---|
| DEFEITO 01, notas sem qualificador | corrigido ("emitindo… (k de 21 notas)", parciais exatos) |
| DEFEITO 02, varredura das Notas durante a pausa da Casa | parcial: a pausa vem antes, mas o texto não acompanha (DEFEITO 03 desta rodada) |
| DEFEITO 03, reticência na linha focada em projeção a 1280 | corrigido |
| Achado 1, aba que pisca nos Extratos | corrigido na ordem; resta 1 quadro vazio (achado 5) |
| Achado 2, "9.978,18" sem rótulo | corrigido ("Pago (R$)") |
| Achados 3, 4, 5, 7, 8, 9 e 10 | sem mudança (achados 1, 13, 8, 9, 7 e 6 desta rodada) |
| Achado 6, "Rotina em lote" pisca | sobra um ponto, de 0,17 s (achado 4) |
| Achado 11, "‹ Passo" no primeiro estado | não verificável pelas telas |

## 7. Veredito

**PASSA.**

- **Nenhum número errado** em modo nenhum, e nenhum parcial contradiz o final. O pedido 1 do Diretor
  está cumprido na tela.
- **Nenhum defeito de legibilidade na camada principal.** Na faixa, os valores dos elos têm 20 a 28 px
  (25 a 35 px em projeção). O "87" do DEFEITO 02 também está na tabela logo acima (15 px; 19 px em
  projeção). E a meta de 13 px respeita o mínimo do STYLE. O DEFEITO 02 é de hierarquia, não de leitura
  da camada principal. A lista de pendências em projeção se lê de longe.
- **Nenhuma nota abaixo de 7.**

Os três defeitos são locais e cabem num acabamento, sem nova rodada de crítica. Ordem recomendada:

1. DEFEITO 01: só o fluxo do pitch, decisão do Diretor.
2. DEFEITO 02: "87 operações" no destaque e linha de base comum nos elos.
3. DEFEITO 03: trocar a linha do motor quando a varredura das Notas começa.
4. Achado 1: as partes do "Dinheiro em jogo" em coluna a 1440.
