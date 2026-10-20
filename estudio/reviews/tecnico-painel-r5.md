# Relatório técnico: painel da analista, rodada r5 (acabamento)

Engenheiro de render, 20/10/2026, 00:36 BRT (03:36Z). Trabalho do Animador sobre a ordem do Diretor de 19/10, 23:56 BRT
(`STORYBOARD.md`, "Mudanças"), itens 1 a 5, pela menor correção. Evidência para a conferência do Diretor; não é prova de
qualidade. O Animador não aprova o próprio trabalho.

## O que foi gerado

| Item | Onde |
|---|---|
| Página (modelo, fonte editável) | `src/tarvo/vitrine/painel.html` (commits `90c099a`, `b2cbb09`, `e766713`, `e3bb089`) |
| Script de captura (fluxo novo do pitch e conferências da r5) | `estudio/scripts/capturar_painel.mjs` (commit `9ae57ea`) |
| Página gerada pelo comando | `relatorio/painel.html`, de `TARVO_IA_PORTA=nenhuma python3 -m src.tarvo dados` (commit `23c7ff2`) |
| Telas r5 | `estudio/out/previews/painel-r5/*.png`: 94 da captura, 4 do modo ao vivo (`50` a `53`) e 2 tiras do vídeo (`r5-video-notas`, `r5-video-extratos`) |
| Vídeo da Reprodução inteira em 1x | `estudio/out/previews/painel-r5/reproducao-1x.mp4` |
| Relatórios da captura (máquina) | `estudio/out/previews/painel-r5/captura.json` e `captura-vivo.json` |
| Folha de contato | `estudio/reviews/contact-sheets/painel-r5.png` (99 telas) |

`painel.py` e `engine.py` não mudaram: nenhum teste novo foi preciso, e a suíte roda igual.

Como reproduzir, da raiz:

```text
TARVO_IA_PORTA=nenhuma python3 -m src.tarvo dados
git diff --stat saida/                                     # vazio: os seis CSVs não mudam
PAINEL_RAIZ_VIVO=<cópia com src, dados, relatorio, saida> PLAYWRIGHT_BROWSERS_PATH=$PWD/estudio/ferramentas/ms-playwright \
  node estudio/scripts/capturar_painel.mjs --so-vivo --rodada=r5
PLAYWRIGHT_BROWSERS_PATH=$PWD/estudio/ferramentas/ms-playwright node estudio/scripts/capturar_painel.mjs --sem-vivo --rodada=r5
python3 estudio/scripts/folha_painel.py r5
python3 -m unittest discover -s tests -t .
$(uv python find 3.8) -m unittest discover -s tests -t .
python3 verificacao/reconcilia.py
```

O comando reescreveu `relatorio/`: nos 2.511 eventos só mudaram os carimbos `ts`; `execucao.json` só mudou em
`executado_em` (20/10 03:16:51Z); o cabeçalho continua "Fechado em 0,08 s". Os seis CSVs de `saida/` saíram idênticos
(`git diff --stat saida/` vazio). As telas são da página regenerada: a captura é de 03:27:31Z, depois da regeneração
(achado 14 do Crítico r4). O modo ao vivo rodou numa cópia; os CSVs da cópia saíram iguais aos do repositório, e os hashes
de `saida/`, `relatorio/eventos.jsonl` e `relatorio/painel.html` do repositório não mudaram durante ele.

## Hashes

| Arquivo | SHA-256 |
|---|---|
| `src/tarvo/vitrine/painel.html` (r5) | `46f7115b629a0e7a41ef6d802f011dc883655333a5d89fc2b59e7d0de220c95b` |
| `relatorio/painel.html` (r5, de onde saíram as telas e o vídeo) | `5dfe35f08e6681335823b66372b9ff8175e1774b80d302380122299582dbef95` |
| `estudio/out/previews/painel-r5/reproducao-1x.mp4` | `47cd0380ed93a6b4d60afdc0b9d5ca505851796ca4b0c054b7e3409b5f7b9c49` |
| `estudio/reviews/contact-sheets/painel-r5.png` | `2d9ddb5f6a40a79d627f6fdb1c43db9ccfce9c8941f72707da796ca6c2878fee` |

## Duração

| Medida | Valor |
|---|---|
| Relógio da Reprodução | **103,8 s** (103.819 ms), igual à r4 no milissegundo |
| 1x, na parede (vídeo, do clique à volta ao Resumo) | **104,1 s** (104.108 ms; r4: 104,1 s) |
| 2x, na parede (cronometrado) | **52,0 s** (52.037 ms; r4: 52.028 ms) |
| Vídeo | 1440×900, H.264, 30 qps, 108,2 s de arquivo, 3.247 quadros; 2.986 capturas de tela durante a reprodução real, 27,6 por segundo, maior intervalo 166 ms |

Por etapa (relógio), iguais à r4: ler os arquivos 6,2 s; checkout 33,1 s; remessa 30,8 s; notas 14,1 s; extratos 14,8 s;
recapitulação 4,4 s.

**O tempo não mudou: a prova.** A página r4 e a r5, montadas com os mesmos eventos, foram percorridas pelo mesmo relógio a
cada 50 ms (2.077 amostras; banco de prova no scratchpad da sessão, fora do repositório). Duração, duração por etapa e por
tipo de batida, marcos e as 22 pausas saíram iguais. O olhar, as contagens da mesa, os cartões do impacto e a lista de
decisões saíram iguais em todas as amostras. Só o texto da linha do motor difere, em 32 amostras, de 77,85 s a 79,40 s
do relógio, que é a janela da varredura das Notas (77,82 s a 79,42 s).

## Pausas contra a regra

Cada linha que pausa fica na tela pelo menos `entrada (500 ms) + max(1500, 670 + 270 × palavras)` ms, com variação de até
8% para cima, por semente fixa. Fonte: `captura.json`, campo `pausas`. Nenhuma pausa abaixo da regra.

| Relógio | Item | Palavras | Regra (ms) | Exigido (ms) | Na tela (ms) | Parado (ms) |
|---|---|---|---|---|---|---|
| 0,4 s | Etapa, "Lendo os arquivos do mês, como chegaram." | 7 | 2.560 | 3.235 | 6.219 | 5.719 |
| 6,6 s | Etapa, "Conferindo cada venda contra a taxa do contrato." | 8 | 2.830 | 3.412 | 3.412 | 2.912 |
| 12,4 s | Primeira exceção, Rota Global | 16 | 4.990 | 5.847 | 5.847 | 5.347 |
| 18,9 s | Bridge, pausa mínima por decisão do Diretor | 15 | 4.720 | 2.114 | 2.114 | 1.614 |
| 22,6 s | "Fechando a comissão de cada lojista." | 13 | 4.180 | 4.971 | 4.971 | 4.471 |
| 27,5 s | Grupo "Cobrar da Orbe" | 12 | 3.910 | 4.900 | 4.900 | 4.240 |
| 32,4 s | Devolver à Casa do Estudante | 8 | 2.830 | 3.399 | 3.399 | 2.899 |
| 35,8 s | Confirmar a taxa da Atlas Idiomas | 10 | 3.370 | 3.917 | 3.917 | 3.417 |
| 39,7 s | Etapa, "Conferindo o spread de cada remessa contra o contrato." | 9 | 3.100 | 3.783 | 3.783 | 3.283 |
| 43,5 s | Primeira exceção da remessa, Mundo Aberto | 18 | 5.530 | 6.401 | 6.401 | 5.901 |
| 51,0 s | Operação repetida · Bagagem Livre | 7 | 2.560 | 3.189 | 3.189 | 2.689 |
| 54,4 s | Grupo dos quatro spreads negativos | 21 | 6.340 | 7.455 | 7.455 | 6.475 |
| 61,9 s | "Fechando a comissão de cada lojista." | 13 | 4.180 | 4.844 | 4.844 | 4.344 |
| 66,7 s | Contestar com a Ponte · Mundo Aberto | 9 | 3.100 | 3.807 | 3.807 | 3.307 |
| 70,5 s | Etapa, "Uma nota por lojista, a partir da comissão fechada." | 9 | 3.100 | 3.856 | 3.856 | 3.356 |
| 74,4 s | Casa do Estudante sem nota | 8 | 2.830 | 3.458 | **3.458** | **2.958** |
| 80,3 s | Conferir o crédito da Ponte contra a nota | 11 | 3.640 | 4.296 | 4.296 | 3.796 |
| 84,6 s | Etapa, "Classificando cada lançamento dos extratos por regra." | 7 | 2.560 | 3.147 | 3.147 | 2.647 |
| 89,3 s | Pix recebido sem identificação | 7 | 2.560 | 3.095 | 3.095 | 2.595 |
| 92,4 s | Repasse devolvido · Mundo Aberto | 7 | 2.560 | 3.217 | 3.217 | 2.717 |
| 95,7 s | Transferência para o Meridiano, em trânsito | 9 | 3.100 | 3.747 | 3.747 | 3.247 |
| 99,4 s | Recapitulação, "15 decisões para pessoas." | 12 | 3.910 | 4.410 | 4.410 | 3.910 |

22 itens; menor sobra 0 ms. A única linha que mudou é a da Casa: na r4, "Na tela" (5.058 ms) incluía a varredura que vinha
depois da pausa; na r5 a varredura troca a linha, e a Casa fica na tela exatamente o exigido (3.458 ms), com 2.958 ms
parada, contra 2.830 ms da regra. A pausa continua antes da varredura, no mesmo relógio.

## Item a item, na ordem do Diretor

| Item | O que mudou | Tela que prova |
|---|---|---|
| **1. Defeito 01, só o fluxo do pitch** | A página não mudou por este item. A captura segue o fluxo novo da Parte 2: rola até "Divergências de taxa" (título logo abaixo do cabeçalho fixo, ou o fim da página), fotografa, clica na faixa, espera a cadeia assentar e fotografa a gaveta, fecha com Esc, volta ao topo e clica em "Financeiro 12". A tabela e a faixa cabem inteiras na tela nos quatro modos (faixa em y 455 a 605 a 1440, 318 a 476 a 1280, 370 a 540 em projeção). O clique abre a gaveta da Rota Global e seleciona a linha dela; a gaveta não cobre a faixa nem a linha. | `fluxo-1440-1-faixa`, `fluxo-1440-2-gaveta`, `fluxo-1440-3-financeiro`, e o mesmo trio para `1280`, `projecao-1280` e `projecao-1440` |
| **2. Defeito 02, hierarquia da faixa** | Nos quatro elos, rótulo em cima e valor embaixo. A faixa é uma grade de três linhas (rótulo, valor, o que vem depois) e cada elo usa as linhas como subgrade, então os quatro valores dividem a mesma linha de base (medida: diferença 0 px nas cinco telas). "87 operações" saiu do rótulo de meta e virou valor, em tinta, a 20 px (25 px em projeção), na linha do R$ 1.546,28 a 1440 e em projeção, e logo antes dele (na linha de cima) a 1280, onde não cabe na mesma linha. O "·" entre os dois só aparece quando estão na mesma linha; quando a linha quebra, a borda do valor o corta. O "0,50 ponto" ficou logo abaixo do R$ 32,25. O 1.546,28 continua o maior número (28 px; 35 px em projeção). Preservados: valores e fonte de cada um, superfície 2, selo, conector em vetor, nenhum identificador, o clique que abre a gaveta. | `r4-resumo-1440-faixa`, `r4-resumo-1280-faixa`, `r4-resumo-proj1440-faixa`, `r4-resumo-proj1280-faixa`, `r4-faixa-abre-gaveta-1440` e `-1280`, `r5-escuro-faixa` (tela nova) |
| **3. Defeito 03, linha do motor na varredura das Notas** | A primeira batida da varredura que vem logo depois de uma linha sobre uma só linha (pendência, exceção ou sinalizada) troca o texto do motor para "Rotina em lote: feito pela regra.", o texto de lote das outras etapas. Nos dados de setembro isso só acontece nas Notas, depois da Casa. Só o texto muda: a batida mantém a duração, e o lote seguinte não redesenha a mesma linha. No relógio: até 77,82 s a linha fala da Casa (a pausa dela); de 77,82 s em diante, nas quatro batidas da varredura (Bem-Vindo, Oxford, Kiwi, Fluente), diz "Rotina em lote" com o olhar na nota carimbada "Feito pela regra". | `r3-notas-1x-como-o-critico-a-4-notas-79270ms` e `r3-notas-2x-como-o-critico-a-4-notas-79301ms` (pausadas em 4 notas), `r3-notas-1x-como-o-critico-b-13-notas-79850ms`, `r3-proj1280-notas-emitindo`, tira `r5-video-notas` (vídeo de 72 a 80 s do relógio) |
| **4. Achado 1, "Dinheiro em jogo" a 1440** | As duas partes da taxa acima do contrato ficam sempre na mesma disposição: se uma não cabe com rótulo e valor lado a lado, as duas empilham, rótulo sobre valor; se as duas cabem, ficam lado a lado com os valores na mesma borda. A página mede ao desenhar, ao trocar a projeção, ao mudar o tamanho e quando a fonte carrega, como já fazia com a coluna dos selos da lista. A 1440, a 1280 e em projeção a 1280: empilhadas. Em projeção a 1440: lado a lado, como antes. O cartão não ficou mais alto a 1440 (a coluna da Atlas continua a mais alta). | `01-resumo-1440`, `20-resumo-1280`, `17-projecao-1440`, `40-escuro-resumo`, `30-reduzido-resumo` |
| **5. Achado 10, separador pendurado** | Quando um título da lista quebra, a quebra fica antes do "·", que desce junto com o nome ("Contestar com a Ponte" / "· Mundo Aberto"). O texto da linha não muda. Quebram os mesmos títulos da r4 (3 a 1440, 10 a 1280, nenhum em projeção); nenhum termina a primeira linha em "·". | `r4-resumo-1440-pendencias`, `r4-resumo-1280-pendencias` |

Medidas da faixa (`captura.json`, campo `r5`):

| Tela | Linha de base dos quatro valores (y) | "87 operações" | Separador | "Dinheiro em jogo" | Títulos que quebram / com "·" pendurado |
|---|---|---|---|---|---|
| 1440 | 940,8 nos quatro | 20 px, tinta, na linha do total | entre os dois | empilhadas | 3 / 0 |
| 1280 | 938,0 nos quatro | 20 px, tinta, logo antes do total | cortado | empilhadas | 10 / 0 |
| projeção 1440 | 1.054,9 nos quatro | 25 px, tinta, na linha do total | entre os dois | lado a lado | 0 / 0 |
| projeção 1280 | 1.059,8 nos quatro | 25 px, tinta, na linha do total | entre os dois | empilhadas | 0 / 0 |
| escuro 1440 | 615,8 nos quatro | 20 px, tinta, na linha do total | entre os dois | empilhadas | 3 / 0 |

A linha de base é o fundo da caixa do texto do número menos a descida da fonte, medida num canvas com a fonte computada.

Fluxo do pitch cronometrado (leitura pela regra do painel; não inclui a fala):

| Tela | Ler a faixa | Cadeia assenta | Ler a cadeia | Filtro responde | Ler a lista | Total | Filtro à vista no topo |
|---|---|---|---|---|---|---|---|
| 1440 | 7,7 s | 1,8 s | 12,3 s | 0,8 s | 6,6 s | 29,2 s | sim |
| 1280 | 7,7 s | 1,8 s | 12,3 s | 0,8 s | 6,6 s | 29,2 s | sim |
| projeção 1280 | 7,7 s | 1,8 s | 12,3 s | 0,8 s | 6,6 s | 29,2 s | não: a página rola até o filtro |
| projeção 1440 | 7,7 s | 1,9 s | 12,3 s | 0,8 s | 6,6 s | 29,2 s | não: a página rola até o filtro |

Preservado e conferido: relógio único com semente fixa e a ordem dos eventos do motor; pausas pela regra; o Resumo abrindo
no topo, na resposta (primeira dobra igual à r4); a contagem da gaveta sem valor antigo sob o rótulo novo (0 quadros); notas
pausadas com "emitindo… (k de 21 notas)" e o valor exato; projeção compacta; passo a passo reduzido (`31`, `32`); tema
escuro (`40` a `42`); nenhuma linguagem do motor nem formato americano na camada principal (0 ocorrências); 1440×900 e
1280×720 sem rolagem lateral.

## Contagens e números

- **Em todo quadro, na reprodução real** (amostrador dentro da página): 6.227 quadros em 1x e 3.118 em 2x. Decisões = regra
  + sinalizadas + pessoa em todos; nenhum parcial da comissão sem "fechando…"; nenhum parcial das notas sem "emitindo…";
  nenhum quadro de mesa vazia com o impacto reagindo.
- **A cada 250 ms do relógio** (416 amostras): as mesmas contas; o valor do cartão das notas igual à soma das k primeiras
  notas; e, nova na r5, nenhuma amostra com nota emitida em que a linha do motor fale da Casa do Estudante.
- **Final da Reprodução contra o resumo do motor** (`conferencia`): os últimos valores corridos fecham com o `resumo` em
  todos os campos.
- **Números da tela contra `fechamento.json`**: 282 de 282 na captura e 25 de 25 no modo ao vivo.
- **Valores finais de setembro**, os mesmos da r4: comissão R$ 243.278,79 (checkout R$ 203.735,34, remessa
  R$ 39.543,45); taxa acima do contrato R$ 2.995,11 (Orbe R$ 1.576,23, Ponte R$ 1.418,88); Casa R$ 15.396,77; Atlas
  ≈ R$ 7,9 mil; 21 notas, R$ 243.284,29; 15 pendências, Financeiro 12 · Comercial 2 · Tesouraria 1.

## Busca no `painel.html`: soma, contagem e regex

As sete buscas do relatório r4 rodadas no modelo r5 e comparadas linha a linha com o modelo r4 (`a250fdb`): nomes das contas
antigas, 0; acumulação, 7 linhas; conversão de escala, 9; regex com dígito, 4; `exec`/`match`, 2; leitura de número, 11. Os
mesmos conteúdos da r4, nenhuma linha nova nem saída. O que a r5 acrescentou na página é layout medido
(`getBoundingClientRect` em `alinharDinheiro`) e texto de lote; nenhum número novo chega à tela.

## Técnico

- **Dimensões:** 1440×900 e 1280×720, `deviceScaleFactor` 1; vídeo 1440×900 a 30 qps.
- **Fontes:** Manrope embutida; `document.fonts.check('700 20px Manrope')` verdadeiro em todas as telas.
- **Subgrade:** a faixa usa `grid-template-rows: subgrid` (Chrome 117 ou mais novo, Safari 16, Firefox 71).
- **Console:** nenhum erro ou aviso, em nenhum contexto (captura, vídeo, 2x, modo ao vivo).
- **Rolagem lateral:** nenhuma, nas 98 telas.
- **Testes:** `python3 -m unittest discover -s tests -t .` (Python 3.14.6) e o mesmo em Python 3.8.20: 89 testes, OK nos dois.
- **Reconciliação:** `python3 verificacao/reconcilia.py`, saída 0 ("Tudo reconcilia.").
- **Saídas do motor:** `git diff --stat saida/` vazio depois do comando.

## Modo ao vivo

Como na r4: numa cópia do repositório (`src/`, `dados/`, `relatorio/`, `saida/`) no scratchpad da sessão, com
`PAINEL_RAIZ_VIVO` apontando para ela, o servidor real subiu com o modelo r5, rodou o motor por SSE e montou o Resumo com os
eventos recebidos. Telas `50` (antes de rodar, nenhum número), `51` (rodando), `52` (Resumo montado, com a faixa nova e a
lista) e `53` (Mergulho da Rota Global). 25 de 25 números; console limpo; os seis CSVs da cópia iguais aos do repositório.

## Escolhas para o Diretor

1. **Inicial maiúscula em dois rótulos.** Com o rótulo em cima, "a mais nesta venda" e "a cobrar da Orbe" viraram "A mais
   nesta venda" e "A cobrar da Orbe", como "Contrato" e "A Orbe cobrou". Nenhuma palavra mudou. A legenda para o leitor de
   tela continua a frase inteira, em minúscula.
2. **"87 operações" a 1280 fica logo antes do total, não na linha dele.** Numa linha, "87 operações · R$ 1.546,28" pede 297 px
   no quarto elo (medido); a 1280 ele tem 228 px de conteúdo, e a 1440, 301. A 1440 e em projeção cabe na linha. As duas posições são as que o
   Diretor deu ("na linha do R$ 1.546,28 ou logo antes dele").
3. **Colunas da faixa pelo conteúdo.** Para o quarto elo caber numa linha a 1440, os três primeiros elos ficaram com a largura
   do próprio conteúdo e o quarto, em destaque, com o resto (na r4 eram frações fixas). Os três primeiros ficaram mais
   estreitos e o destaque, mais largo.
4. **"Dinheiro em jogo" a 1440 empilha as duas partes.** Lado a lado, "contestar com a Ponte R$ 1.418,88" pede 338 px (medido);
   a coluna tem 278 px de conteúdo a 1440 e 248 a 1280. As duas partes empilham, como a 1280. Em projeção a 1440, onde as duas cabem, ficam lado a lado
   como antes. A r4 também misturava as duas disposições em projeção a 1280 (sem tela que mostrasse); a r5 corrige as duas
   larguras.
5. **Fluxo em projeção: o filtro não está à vista no topo.** O Resumo em projeção é uma coluna, e a lista de pendências vem
   depois da faixa e do "Feito pela regra". "Volte ao topo e clique em Financeiro 12" vira, em projeção, rolar até as
   pendências; na captura, o próprio clique leva a página até o filtro. Se o Diretor quiser, o texto do fluxo ganha essa
   ressalva.
6. **Nome de uma tela antiga.** `r3-notas-*-varredura-0-notas-*` tem o nome da r3, mas desde a r3 o momento (76,5 s do
   relógio) cai no meio da pausa da Casa, antes da varredura. A tela pausada na varredura é a `como-o-critico-a`, com 4 notas.
