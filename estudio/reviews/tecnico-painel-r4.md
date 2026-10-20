# Relatório técnico: painel da analista, rodada r4 (refino depois da entrega)

Engenheiro de render, 19/10/2026, 23:24 BRT (20/10 02:24Z). Trabalho do Animador sobre a ordem do Diretor de
19/10, 22:35 BRT (`STORYBOARD.md`, "Mudanças"), na ordem de prioridade dele. Evidência para o Crítico r4; não é
prova de qualidade. O Animador não aprova o próprio trabalho.

## O que foi gerado

| Item | Onde |
|---|---|
| Página (modelo, fonte editável) | `src/tarvo/vitrine/painel.html` |
| Exportação de origem (data ISO e spread em pontos, com teste) | `src/tarvo/painel.py`, `tests/test_painel.py` (classe `ConversoesDaPonte`) |
| Página gerada pelo comando | `relatorio/painel.html`, de `TARVO_IA_PORTA=nenhuma python3 -m src.tarvo dados` (não commitada: o Diretor regenera e commita) |
| Telas r4 | `estudio/out/previews/painel-r4/*.png`: 89 da captura e 4 do modo ao vivo (`50` a `53`) |
| Vídeo da Reprodução inteira em 1x | `estudio/out/previews/painel-r4/reproducao-1x.mp4` |
| Relatórios da captura (máquina) | `estudio/out/previews/painel-r4/captura.json` e `captura-vivo.json` |
| Folha de contato | `estudio/reviews/contact-sheets/painel-r4.png` |
| Scripts | `estudio/scripts/capturar_painel.mjs` (pasta por rodada, `--rodada=r4`, bloco r4), `estudio/scripts/folha_painel.py` (lê a pasta da rodada) |

Como reproduzir, da raiz:

```text
TARVO_IA_PORTA=nenhuma python3 -m src.tarvo dados
git diff --stat saida/                                     # vazio: os seis CSVs não mudam
PAINEL_RAIZ_VIVO=<cópia com src, dados, relatorio, saida> PLAYWRIGHT_BROWSERS_PATH=$PWD/estudio/ferramentas/ms-playwright \
  node estudio/scripts/capturar_painel.mjs --so-vivo
PLAYWRIGHT_BROWSERS_PATH=$PWD/estudio/ferramentas/ms-playwright node estudio/scripts/capturar_painel.mjs --sem-vivo
python3 estudio/scripts/folha_painel.py r4
```

O motor (`engine.py`) não foi tocado. O comando reescreveu `relatorio/` (carimbos de hora dos eventos, `execucao.json`,
`painel.html`); os seis CSVs de `saida/` saíram idênticos aos commitados (`git diff --stat saida/` vazio, nas duas
rodadas do comando). O modo ao vivo rodou numa cópia; os CSVs da cópia saíram iguais aos do repositório e os hashes de
`saida/` e `relatorio/eventos.jsonl` do repositório não mudaram durante ele.

## Hashes

| Arquivo | SHA-256 |
|---|---|
| `src/tarvo/vitrine/painel.html` (r4) | `9fc858453f96110d5f61c0fa69fbb2db37190fea40dc74719bb2cee07b82b693` |
| `relatorio/painel.html` (r4, de onde saíram as telas e o vídeo) | `8330a0539da9d45776ad67b253cac573af1f08fe1bd55e77d4bab3323a14b00e` |
| `estudio/out/previews/painel-r4/reproducao-1x.mp4` | `cb22489dddae29b67664f3a51e66cd0fc9f713558fd1d3f6ab88a2988e59fca7` |
| `estudio/reviews/contact-sheets/painel-r4.png` | `5766ebded5e54357787492c3b44e391d4f338d99112b71c209b673f031816a52` |

## Duração

| Medida | Valor |
|---|---|
| Relógio da Reprodução | **103,8 s** (103.819 ms); r3: 102,5 s |
| 1x, na parede (vídeo, do clique à volta ao Resumo) | **104,1 s** |
| 2x, na parede (cronometrado) | **52,0 s** (52.028 ms); r3: 51,4 s |
| Vídeo | 1440×900, H.264, 30 qps; 2.667 capturas de tela durante a reprodução real, 24,7 por segundo, maior intervalo 133 ms |

Por etapa (relógio): ler os arquivos 6,2 s (r3: 4,7); checkout 33,1 s (33,2); remessa 30,8 s (30,6); notas 14,1 s (14,2);
extratos 14,8 s (15,0); recapitulação 4,4 s (4,4).

De onde vem a diferença: o motor refinado emite os sete eventos de arquivo na etapa 1 (no v5, Aurora e Meridiano chegavam
na etapa dos extratos). A leitura ganhou duas batidas de arquivo. E a variação com semente fixa (até 8% acima da regra) é
sorteada na ordem dos eventos: os dois eventos a mais deslocam os sorteios seguintes, e cada pausa mudou alguns décimos
de segundo para cima ou para baixo, sempre acima da regra. Conferido batida a batida contra a página r3 (o mesmo modelo
v5 com os eventos de antes do refino, gerada à parte): as mesmas 22 linhas narradas, com o mesmo texto, o mesmo número
de palavras e na mesma ordem. Os quatro totais de frente que o motor agora emite (`escopo: frente`) entram no relógio
sem duração.

## Auditoria do relógio, item a item

Cada linha que pausa fica na tela pelo menos `entrada (500 ms) + max(1500, 670 + 270 × palavras)` ms, com variação de
até 8% para cima, por semente fixa. Fonte: `captura.json`, campo `pausas`.

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
| 74,4 s | Casa do Estudante sem nota | 8 | 2.830 | 3.458 | 5.058 | 4.558 |
| 80,3 s | Conferir o crédito da Ponte contra a nota | 11 | 3.640 | 4.296 | 4.296 | 3.796 |
| 84,6 s | Etapa, "Classificando cada lançamento dos extratos por regra." | 7 | 2.560 | 3.147 | 3.147 | 2.647 |
| 89,3 s | Pix recebido sem identificação | 7 | 2.560 | 3.095 | 3.095 | 2.595 |
| 92,4 s | Repasse devolvido · Mundo Aberto | 7 | 2.560 | 3.217 | 3.217 | 2.717 |
| 95,7 s | Transferência para o Meridiano, em trânsito | 9 | 3.100 | 3.747 | 3.747 | 3.247 |
| 99,4 s | Recapitulação, "15 decisões para pessoas." | 12 | 3.910 | 4.410 | 4.410 | 3.910 |

22 itens; nenhum fica menos que o exigido (menor sobra 0 ms). A Bridge (18,9 s) segue na pausa mínima, por decisão do
Diretor. Na Casa do Estudante sem nota, "Na tela" inclui a varredura depois da pausa, como na r3.

## Contagens e números

- **Em todo quadro, na reprodução real** (amostrador dentro da página): 6.229 quadros em 1x e 3.118 em 2x. Decisões =
  regra + sinalizadas + pessoa em todos; nenhum parcial da comissão sem "fechando…"; nenhum parcial das notas sem
  "emitindo…"; nenhum quadro de mesa vazia com o impacto reagindo.
- **A cada 250 ms do relógio** (416 amostras): as mesmas contas; o valor do cartão das notas igual à soma das k
  primeiras notas, calculada pelo script a partir de `relatorio/eventos.jsonl` (a página mostra `parcial.frente.valor`;
  o script confere por fora).
- **Final da Reprodução contra o resumo do motor** (`conferencia`): os últimos valores corridos fecham com o `resumo`
  em todos os campos (comissão total, checkout, remessa, Orbe, Ponte, acima do contrato, Casa, estimativa da Atlas,
  notas e quantidade, pendências).
- **Números da tela contra `fechamento.json`**: 236 de 236 na captura e 25 de 25 no modo ao vivo. O cabeçalho
  ("Fechado em 0,08 s") é conferido contra `fim.resumo.duracao_s` dos eventos; o `fechamento.json` do filme está
  congelado com 0,06 s de outra rodada.
- **Valores finais de setembro**, todos na tela como antes: comissão R$ 243.278,79 (checkout R$ 203.735,34, remessa
  R$ 39.543,45); taxa acima do contrato R$ 2.995,11 (Orbe R$ 1.576,23, Ponte R$ 1.418,88); Casa R$ 15.396,77;
  Atlas ≈ R$ 7,9 mil; 21 notas, R$ 243.284,29; 15 pendências, Financeiro 12 · Comercial 2 · Tesouraria 1.

## Item a item, na ordem do Diretor

| Item | O que mudou | Tela que prova |
|---|---|---|
| **1. Números do motor** | Tabela abaixo ("Contas trocadas"). O v5 com os eventos do motor refinado somava os totais de frente como se fossem lojistas e mostrava comissão de R$ 486.557,58; a r4 lê os campos e mostra R$ 243.278,79. | Resumo `01-resumo-1440`, `20-resumo-1280`; Reprodução `02` a `08`; gavetas `11` a `16`; ao vivo `51` (mesa com "de 1.996 decisões", o `n` do motor, desde a primeira decisão) |
| **2. Faixa de origem** | Embaixo da tabela de divergências, para o primeiro grupo: "Origem · Rota Global Intercâmbio" e quatro elos ("Contrato 3,59%"; "A Orbe cobrou 4,09%" com o ícone de crítico; "R$ 32,25 a mais nesta venda" e "0,50 ponto"; em destaque, pelo tamanho de número de cartão e pela superfície 2, "87 operações", "R$ 1.546,28 a cobrar da Orbe" e o selo "Decide: Financeiro"). Conector desenhado em SVG; nenhum identificador nem glifo. Clique abre a gaveta da Rota Global e seleciona a linha dela na tabela. | `r4-resumo-1440-faixa`, `r4-resumo-1280-faixa`, `r4-resumo-proj1440-faixa`, `r4-resumo-proj1280-faixa`, `r4-faixa-abre-gaveta-1440` e `-1280` |
| **3. Pendências em uma linha** | Título curto do dicionário da Reprodução, valor e selo. A coluna do selo tem a largura do maior selo (medida na tela) e os valores terminam na mesma borda; o título fica a 15 px (tabela) e, se não cabe, quebra na própria coluna, sem "…", com o nome depois do "·" junto. O ícone de pessoa do começo da linha saiu (o selo traz o ícone). O complemento foi para a gaveta, embaixo do valor. | `r4-resumo-1440-pendencias`, `r4-resumo-1280-pendencias`, `r4-resumo-proj1440-pendencias`, `r4-resumo-proj1280-pendencias`, `r4-gaveta-pendencia-pela-lista-1440` (clique na posição do valor) e `-rastro` |
| **4. "INTERCÂ"** | Nenhuma mudança: não é corte da página. A célula "Cliente" do anexo da Ponte tem 20 caracteres em todas as 228 operações ("MUNDO ABERTO INTERCÂ", "MAPLE STUDY ASSESSOR", "NÓRDICA EDUCAÇÃO INT"; a linha crua está no Rastro técnico da gaveta da Mundo Aberto). A linha focada mostra a célula inteira, em 3 linhas a 19 px, sem reticência; contagem 5 px acima da legenda, como na r3; nenhum pulo da linha do motor a cada 50 ms do relógio. Decisão do Diretor, abaixo. | `r3-proj1280-remessa-mundo-aberto`, `g-mundo-aberto-*` |
| **5. Restos** | "{mostradas} de {n}" em cinco lugares; spread em pontos e datas ISO pelo `painel.py` (teste escrito antes, visto falhar, depois verde em Python 3.14 e 3.8); o motivo do motor como vem no Rastro técnico da pendência da Ponte, com o "06/10". | gavetas `r4-gaveta-pendencia-pela-lista-*`, `13-mergulho-atlas` ("6 de 57 linhas"), `12-mergulho-rota-global-rastro` ("10 de 87 operações") |

Títulos que quebram em duas linhas (aviso pedido pelo Diretor, medido em `captura.json`, campo `r4`):

| Tela | Quebram | Quais |
|---|---|---|
| 1440×900 | 3 de 15 | Contestar com a Ponte · Mundo Aberto; Conferir o crédito da Ponte contra a nota; Transferência para o Meridiano, em trânsito |
| 1280×720 | 10 de 15 | Devolver à Casa do Estudante; Confirmar a taxa da Atlas Idiomas; Operação repetida · Bagagem Livre; Spread negativo · Ponte Aérea; Spread negativo · Novo Horizonte; Contestar com a Ponte · Mundo Aberto; Conferir o crédito da Ponte contra a nota; Pix recebido sem identificação; Repasse devolvido · Mundo Aberto; Transferência para o Meridiano, em trânsito |
| projeção 1440 e 1280 | 0 | (o Resumo em projeção é uma coluna só) |

Preservado e conferido: relógio único com semente fixa e a ordem dos eventos do motor; pausas pela regra; primeira dobra
a 1280×720 igual à r3 (a linha da Rota Global termina em y 725, como na r3); fluxo do pitch com a cadeia assentada em
1,8 s a 1,9 s nos quatro modos e a contagem da gaveta sem valor antigo sob o rótulo novo; pausas coerentes no fecho em 1x
e 2x; notas pausadas com "emitindo… (k de 21 notas)"; projeção compacta (linha focada inteira, 5 linhas, selo em duas,
contagem acima da legenda); passo a passo reduzido (`31`, `32`); tema escuro (`40` a `42`); nenhuma linguagem do motor
nem formato americano na camada principal (0 ocorrências); 1440×900 e 1280×720 sem rolagem lateral.

## Técnico

- **Dimensões:** 1440×900 e 1280×720, `deviceScaleFactor` 1; vídeo 1440×900 a 30 qps.
- **Fontes:** Manrope embutida; `document.fonts.check('700 20px Manrope')` verdadeiro em todas as telas.
- **Console:** nenhum erro ou aviso, em nenhum contexto (captura, vídeo, 2x, modo ao vivo).
- **Rolagem lateral:** nenhuma, nas 93 telas.
- **Testes:** `python3 -m unittest discover -s tests -t .` e o mesmo em Python 3.8: 76 testes, OK nos dois.
- **Saídas do motor:** `git diff --stat saida/` vazio depois do comando.

## Modo ao vivo

Numa cópia do repositório (`src/`, `dados/`, `relatorio/`, `saida/`) na pasta temporária da sessão, com
`PAINEL_RAIZ_VIVO` apontando para ela: o servidor real subiu na cópia com o modelo r4, rodou o motor por SSE e montou o
Resumo com os eventos recebidos. Telas `50` (antes de rodar: título "Fechamento · Tarvo", nenhum número; o mês só aparece
quando o motor diz a competência), `51` (rodando: a mesa conta pelo `parcial.etapa` e já diz "de 1.996 decisões"), `52`
(Resumo montado, com a faixa e a lista) e `53` (Mergulho da Rota Global). 25 de 25 números; console limpo; os seis CSVs
da cópia iguais aos do repositório; os hashes de `saida/`, `relatorio/eventos.jsonl` e `relatorio/painel.html` do
repositório os mesmos antes e depois (8 de 8).

## Contas trocadas: função antiga e campo do motor

As 45 linhas do inventário (`inventario-painel.md`, numeração dele). Linha de código citada é a do v5 (commit
`aae6444`). "Corrido" é o valor que a Reprodução mostra enquanto o mês fecha; "final" é o do Resumo e das gavetas.

### Dinheiro

| # | Na tela | Antes (função, conta da página) | Agora (campo do motor) |
|---|---|---|---|
| D1 | Comissão apurada | `desenharResumo` e `desenharImpacto`: `ck.c + rm.c`, soma dos totais de lojista | final `fim.resumo.comissao_total`; corrido `parcial.mes.comissao` do último total de lojista |
| D2 | Checkout e remessa | `parte`, `textoParte`: `bloco.c` (Σ por frente) | final `resumo.comissao_checkout` e `comissao_remessa`; antes do fim, `valor` do total de frente (`escopo: frente`) ou `parcial.frente.valor` |
| D3 | Taxa acima do contrato | `desenharResumo`, `gavetaAcima`, `desenharImpacto`: `d.orbe.c + d.ponte.c` | final `resumo.divergencias_brl`; corrido `parcial.mes.em_jogo.acima_do_contrato` |
| D4 | Cobrar da Orbe, contestar com a Ponte | `addPendencia`: `S.din[k].c += p.c` | `resumo.divergencia_orbe` e `divergencia_ponte` |
| D5 | Valor total da tabela | `tabelaDivergencias`: `totalC += c` | `resumo.divergencias_brl` |
| D6 | Valor de cada grupo | `aplicar`: `g.c += cents(e.valor)`; grupo e pendência casados por heurística (`grupoDaPendencia`) | grupo = a pendência que a divergência nomeia (`pendencia`); `parcial.grupo.valor` enquanto corre e o `valor` da pendência no fim |
| D7 | A devolver à Casa | `addPendencia`: Σ das devoluções | final `resumo.devolucao_casa`; corrido `em_jogo.devolver_casa` |
| D8 | Atlas ≈ R$ 7,9 mil e R$ 7.876,05 | `estimativaAtlas` (Σ `valor_taxa` das linhas cruas), `milC` (centavos ÷ 100.000) | pendência `SEM_CONTRATO`: `estimativa.mil` (o motor já arredonda) e `estimativa.valor` |
| D9 | Base do spread, R$ 9.830,65 | `baseSpread`: Valor ME × PTAX Ref. da linha crua | divergência `base` |
| D10 | Notas a emitir, R$ 243.284,29 | `contar`: `S.notas.c += cents(e.valor)` | final `resumo.notas_brl`; corrido `parcial.frente.valor` da nota |
| D11 | "notas somam R$ 5,50 a mais" | `gavetaNotas`: notas − comissão | `resumo.notas_menos_comissao` |
| D12 | Ressarcimento ao lojista, R$ 1.545,86 | `gavetaGrupo`: regex no motivo | pendência `ressarcimento` |
| D13 | Casa sem nota (−R$ 5,50) | filtro `c <= 0` | total de lojista `emite_nota: false` (o valor é o `valor` dele) |

### Contagens

| # | Na tela | Antes | Agora |
|---|---|---|---|
| K1 | 21 e 14 lojistas | `parte`: `bloco.lista.length` | `resumo.lojistas`; antes do fim, `n_lojistas` do total de frente |
| K2 | "fechando… (k de N lojistas)" | `fechandoFrente`: `TL.lojistas` (contagem de eventos) e `lista.length` | `parcial.frente {k, n}` do último total de lojista; antes do primeiro, zero do `n` que o primeiro total traz |
| K3 | "emitindo… (k de N notas)" | `emitindoNotas`: `TL.notas` e `lista.length` | `parcial.frente {k, n}` da última nota |
| K4 | 21 notas | `F.notas.lista.length` | `resumo.notas`; corrido `parcial.frente.k` |
| K5 | 20 lojistas do checkout e 1 nota da Ponte | contagem por filtro | `resumo.notas_por_linha` |
| K6 | 15 pendências (cartão, filtro, mesa, recapitulação, leitor de tela) | `F.pend.length`, `S.pend.length`, eventos filtrados | `resumo.pendencias`; corrido `parcial.mes.pendencias` |
| K7 | Financeiro 12 · Comercial 2 · Tesouraria 1 | `S.porDono[d]++`, dono vazio virava "Financeiro" | `resumo.pendencias_por_dono`; corrido `parcial.mes.por_dono`; dono vazio não vira mais "Financeiro" |
| K8 | 87, 23 e 5 operações por grupo | `g.divs.length` | `parcial.grupo.n` (no impacto, `parcial.grupo.k` corrido) |
| K9 | Total da tabela, 115 | `totalN += g.divs.length` | último `parcial.mes.divergencias` |
| K10 | "· 115 operações acima do contrato" corrido | `S.divergencias++` | `parcial.mes.divergencias` |
| K11 | "83 vendas e 4 estornos", "5 vendas assim" | `contagemTipos` sobre as linhas cruas de cada divergência | pendência `por_tipo` |
| K12 | Atlas: 57 lançamentos (49 + 5 + 2 + 1) | `estimativaAtlas` | pendência `n_linhas` e `por_tipo` |
| K13/14 | "87 operações no relatório", "118 linhas", "De onde vem: 118 linhas" | `p.refs.length` | pendência `n_linhas` |
| K15 | Feito pela regra 2.332: 1.900 / 228 / 20 / 184 | `cartaoRotina`: Σ de `S.rotina` | `resumo.decisoes.regra` e `resumo.decisoes_por_etapa[*].regra` |
| K16 | Mesa: k de N decisões, regra, sinalizadas, pessoa | `contar`, `TL.totalEtapa`, etapa deduzida da frente (`etapaDoEvento`) | `parcial.etapa` de cada evento; etapa pelo campo `etapa` |
| K17 | N arquivos lidos e a barra da leitura | `S.arquivos.length` | `parcial.etapa {k, n}` do evento `arquivo` |
| K18 | 2.463 decisões no mês (recapitulação) | `reg + S.sinal + S.pend.length` | `resumo.decisoes` |
| K19 | "Planilha de taxas: só a aba vigente · 30 de 43" | `abas.reduce(+)` | evento `arquivo`: `linhas` e `linhas_no_arquivo` |
| K20 | "119 linhas do relatório da Orbe" (gaveta do lojista) | regex `: (\d+) linhas` no motivo | total de lojista `n_linhas` |
| K21 | "Soma da comissão de 76 linhas", "228 operações" | `itens.length` (rastro) | nota `n_linhas` |
| K22 | "4 spreads negativos a contestar" | `F.pend.filter(...).length` | `resumo.pendencias_por_tipo.SPREAD_NEGATIVO` |
| K23 | 184 lançamentos, todos por regra | `lanc.length`, `filter(REGRA).length` | `resumo.lancamentos`, `resumo.lancamentos_por_metodo.REGRA` |
| K24 | Lançamentos por conta (22 contas) | `grupos[k].n++` | `resumo.lancamentos_por_conta` |
| K25 | "e mais N" | `total − corte` (5 lugares) | "{mostradas} de {n}" (ex.: "10 de 87 operações"), com `parcial.grupo.n`, `n_linhas` ou `lancamentos_por_conta`; a página diz quantas mostra e não subtrai |

### Percentuais

| # | Na tela | Antes | Agora |
|---|---|---|---|
| P1 | "0,50 ponto", "0,3007 ponto" | `t.apl − t.contr` | divergência `diferenca_pp` |
| P2 | Spread aplicado das linhas da Ponte (mesa e gaveta), 1,5007% | `parseFloat(Spread %) × 100` | `painel.py` entrega o spread em pontos junto da linha (`convertidos["Spread %"]`), exato aos dígitos da célula |
| P3 | Barra de progresso da mesa | contagem da página ÷ total da linha do tempo | `parcial.etapa.k ÷ n`, só como largura da barra |
| P4 | Taxa do contrato na gaveta do lojista; taxas na narração | regex no motivo; linha do CSV | `taxa_contratada_pct` da decisão de comissão; `taxa_contratada_pct` e `taxa_aplicada_pct` da divergência |

### Não numérico

| # | Na tela | Antes | Agora |
|---|---|---|---|
| N1 | Mês e mês seguinte ("setembro", "outubro") | regex na discriminação das notas ou na data da Orbe; `MESES[mes % 12]` | `inicio.competencia` e `competencia_seguinte` (no fim, as do `resumo`) |
| N2 | Datas da Ponte (15/09/2026) | `dataSerial` (serial do Excel na página) | `painel.py` entrega a data em ISO (`convertidos["Data Contratação"]`); a página só formata |
| N3 | Tipo da pendência (também ao vivo) | linha do CSV ou mapa regra → tipo (`TIPO_POR_REGRA`) | `tipo_pendencia` |
| N4 | "crédito previsto para 06/10" | regex de data no motivo | o motivo do motor como vem, no Rastro técnico; o complemento passa a "nota única de remessa" |

Ficou, por decisão do Diretor: o nome do lojista pelo cadastro da planilha (busca, não conta).

## Busca no `painel.html`: o que sobrou de soma, contagem e regex

Comandos, da raiz, só na parte de JS do modelo (o `<script>` começa na linha 691):

```text
F=src/tarvo/vitrine/painel.html
# 1. nomes das contas antigas
grep -cE "brlC|valorC|cents\(|centsTexto|numBR|milC|dataSerial|estimativaAtlas|baseSpread|taxasDivergencia|TIPO_POR_REGRA|grupoDaPendencia|totalEtapa|etapaCont|S\.din|\.rotina\[|contar\(S" $F
# 2. acumulação
awk 'NR>691 && /\+= |\.reduce\(/ {print NR": "$0}' $F
# 3. conversão de escala
awk 'NR>691 && /\* ?100[^0-9]|\/ ?100[^0-9]|100000|Math\.round\(/ {print NR": "$0}' $F
# 4. regex com dígito; 5. exec/match; 6. parse de número
awk 'NR>691 && /\\d|\[0-9\]|\\D/ {print NR": "$0}' $F
awk 'NR>691 && /\.exec\(|\.match\(/ {print NR": "$0}' $F
awk 'NR>691 && /parseFloat\(|parseInt\(|Number\(/ {print NR": "$0}' $F
# 7. o que chega à tela: argumento de cada formatador de número
grep -noE "(inteiro|plural|brl|valor|valorOuVazio|dinheiro|milEl|milTexto)\([^,)]*[,)]" $F
```

Resultado (modelo do commit `cba8856`):

```text
1. nomes das contas antigas ............ 0
2. acumulação .......................... linhas 1337 1468 1484 1490 1493 2328 2467
3. conversão de escala ................. linhas 1355 1358 1401 1405 1491 2838 3049 3051 3058
4. regex com dígito .................... linhas 725 726 1088 1313
5. exec/match .......................... linhas 1019 1022
6. parse de número ..................... linhas 725 726 737 901 950 1950 2024 2541 2558 2965 2978
7. formatador com `.length` no argumento 0 (há 88 `.length` no arquivo; nenhum chega a um formatador)
```

O que cada ocorrência é:

| Linha | O que é | Vai à tela? |
|---|---|---|
| 1337, 1490 | palavras de uma linha, para a pausa de leitura | não (relógio) |
| 1355, 1358, 1401, 1405, 1468, 1484, 1491, 1493 | duração das batidas, atraso de lista, variação com semente fixa | não (relógio) |
| 2328 | relógio da reprodução (`R.ms += dt × velocidade`) | não |
| 2467 | posição do olhar na mesa, em pixels | não (layout) |
| 2838 | largura da barra: `parcial.etapa.k ÷ n` em % | só como largura |
| 3049, 3051, 3058 | ganchos de teste (`auditoriaPausas`, `debugTL`) | não |
| 2978 | gancho de teste que lê a contagem da tela de volta | não |
| 725, 726 | `motorBR`: reescreve em pt-BR, no lugar, os números que o próprio motor escreveu na nota ("4.09%" vira "4,09%") | sim, no Rastro técnico, o mesmo número da nota; ver escolhas |
| 1088 | CNPJ sem pontuação, chave de busca no cadastro | não |
| 1313 | tira os códigos de regra do motivo ("(F2, F58)") | não cria número |
| 1019, 1022 | nome do lojista e do banco no motivo | nome, não número |
| 737 | `celulaNumero`: a célula numérica inteira do arquivo, lida para ser formatada | a própria célula |
| 901 | nome do mês pela `competencia` ("09" vira "setembro") | nome do mês |
| 950, 1950, 2024 | parcelas da célula `qtd_parcelas`, só como condição; o texto mostrado é a célula | a própria célula |
| 2541, 2558 | CSS (altura da linha, borda) | não |
| 2965 | parâmetro `?t=` da URL | não |

O que a busca 7 mostra pelo outro lado: todo número inteiro da tela passa por `inteiro()` ou `plural()`, e todo valor em
reais por `brl()`, `valor()`, `valorOuVazio()`, `dinheiro()`, `milEl()` ou `milTexto()`. Os argumentos são campos do
motor (`resumo.*`, `parcial.*`, `valor`, `base`, `n_linhas`, `estimativa.mil`...), células do arquivo
(`celulaNumero(...)`) ou o corte da própria lista no "{mostradas} de {n}" (`inteiro(max)`, com 10, 8, 6 ou 12). As
contagens que ficaram (`tamanhoFonte`, o índice da linha que fechou, a linha da Ponte depois dos lojistas na mesa das
notas) dizem quantas linhas a mesa desenha e onde está o olhar; nenhuma vai à tela.

## Escolhas para o Diretor

1. **"INTERCÂ".** Não troquei a fonte da coluna "Cliente" da mesa. Duas saídas: (a) manter a célula como chegou (o
   corte é do arquivo e a gaveta já mostra a linha crua); (b) mostrar o nome do cadastro ("Mundo Aberto") na coluna da
   mesa, para todas as linhas da Ponte, e deixar a célula crua só na gaveta. A (b) muda a regra "as fontes do mês, como
   chegaram" para essa coluna, e nomes do cadastro mais longos ("Maple Study Assessoria Educacional Ltda") pedem mais
   linhas na projeção compacta.
2. **Contador animado.** Os contadores (comissão e dinheiro em jogo no impacto, total da gaveta de R$ 32,25 a
   R$ 1.546,28) passam por valores intermediários entre dois valores do motor durante 1 s (`STYLE.md`, "Contador"). O
   quadro assentado e o quadro pausado mostram o valor do motor. Se o Diretor quiser zero número intermediário, a saída é
   o contador andar só pelos valores corridos do motor (`parcial.mes.comissao` de cada lojista), sem interpolação: muda
   um movimento aprovado.
3. **Números da nota do motor no Rastro técnico** saem em pt-BR por `motorBR` (achado 11 da r2). Se a regra for "nenhuma
   regex de número", a alternativa é mostrar a nota como vem ("4.09%"), em formato americano, ou o motor escrever o
   motivo em pt-BR.
4. **Zero do estado vazio.** Antes da primeira decisão de uma etapa, a mesa diz "0" (e "0 de 1.996 decisões"); na
   leitura dos arquivos, regra, sinalizadas e pessoa ficam em 0; antes do primeiro lojista fechar, "(0 de 14 lojistas)".
   O `n` é do motor; o zero é a ausência de decisão, não uma conta.
5. **Lista de pendências.** A 1280 fora da projeção, 10 títulos quebram (tabela acima). Para todos caberem, a coluna da
   direita teria de crescer, e a linha da Rota Global (primeiro clique do pitch) desceria abaixo da dobra; não mexi na
   grade.
6. **Pequenas mudanças de forma:** o título da faixa tira o "Ltda" do nome (como no texto do Diretor), a tabela mantém o
   nome do cadastro; o título da pendência no Resumo passou de 17 px para 15 px, e o ícone de pessoa do começo da linha
   saiu; na gaveta da pendência, o complemento entra com inicial maiúscula e ponto ("Nota única de remessa."); ao vivo,
   antes de o motor rodar, o título é "Fechamento · Tarvo".
7. **Fora do escopo, sem mudança:** o spread da Maple segue "1,501%" na gaveta e "1,5010%" na mesa (achado 10 da r2).
