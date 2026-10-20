# Findings: painel da analista, rodada r2

Crítico, 19/10/2026 00:48 BRT (19/10 03:48Z). Contexto novo; não li o código do painel
(`src/tarvo/vitrine/painel.html`, `painel.py`, `servidor.py`), os scripts do estúdio nem o
`tecnico-painel-r2.md` como prova. O texto de "Mudanças" do `STORYBOARD.md` serviu como especificação.
Não rodei o motor nem o servidor: `relatorio/`, `saida/` e `estudio/dados/` ficaram intactos.
(Gravado pelo Diretor com o texto entregue pelo Crítico: o ambiente do subagente recusa a gravação.
Quadros e scripts do Crítico em `reviews/frames/critico-painel-r2/`.)

Evidência:

- As 59 telas de `out/previews/painel/` (com as da r1 em `out/previews/painel-r1/` para comparar), a
  folha `contact-sheets/painel-r2.png` e o vídeo `reproducao-1x.mp4` (104,97 s; quadros extraídos com
  FFmpeg nos trechos das Notas e dos Extratos).
- O `relatorio/painel.html`, aberto de fora no Chrome (Playwright 1.56.1, `channel: 'chrome'`). Usei um
  amostrador dentro da página, por quadro de animação, que grava cada mudança de texto da mesa, dos
  quatro cartões, da lista, da linha do motor e das etapas:
  - reprodução inteira em 1x: 2.060 mudanças, 1.435 estados de contador;
  - reprodução inteira em 2x: 1.729 mudanças, 1.125 estados.
- 24 pausas: 15 em 1x e 9 em 2x, no fecho do checkout e da remessa, no meio dos contadores e nas Notas.
  Cada estado pausado foi relido 2,5 s depois.
- As 36 entradas clicáveis do Resumo (todas as gavetas, com o texto inteiro e a tela rolada até o
  Rastro técnico) e o Esc.
- O fluxo do pitch a 1440×900, 1280×720 e em projeção nos dois tamanhos.
- A reprodução em projeção a 1440 e a 1280 em 9 momentos, com auditoria de reticências, de rolagem
  lateral e do tamanho de fonte.
- A gaveta da Mundo Aberto em 5 modos, incluindo o escuro.
- O passo a passo com movimento reduzido (24 estados), o tema escuro e o console.

Números conferidos contra `estudio/dados/fechamento.json`, os CSVs de `saida/` e as linhas de origem
em `dados/`: relatório da Orbe; anexo `.xlsx` da Ponte extraído do `.eml`, aba Operações; planilha de
taxas; extrato Aurora.

## 1. Notas

| Critério | Nota | Justificativa |
|---|---|---|
| Composição | 8 | Mesa e impacto ficam lado a lado em todos os modos, inclusive em projeção a 1280×720, e a gaveta de 440 px nunca cobre a linha clicada. Perde por um detalhe: no Resumo, as duas partes de R$ 2.995,11 não se alinham em coluna. |
| Tipografia | 8 | Hierarquia limpa, algarismos tabulares, texto corrido a 17 px e nada abaixo de 13 px. Restam nomes e descrições cortados com reticências na mesa em projeção a 1280 e identificadores quebrados no meio no Rastro técnico. |
| Legibilidade do produto | 8 | O Resumo abre na resposta. Em projeção a 1280×720, a cadeia da Rota Global e a da Mundo Aberto cabem até "Decide: Financeiro" sem rolar. O que ainda pede leitura de perto é o "fechando… (k de N)" em 13 px sob um número de 28 px. |
| Qualidade do movimento | 8 | A contagem da gaveta começa junto com o rótulo, as Notas têm um contador só e o grupo de spreads entra com atraso de lista. Ficam dois tropeços: a aba Meridiano que pisca nos Extratos e um quadro de mesa vazia. |
| Timing | 8 | 100,5 s em 1x e 50,3 s em 2x, e toda pausa medida do assentamento cumpre a regra pelas emendas de contagem. A exceção é a Bridge, na pausa mínima, por decisão do Diretor. |
| Continuidade | 7 | As contagens fecham em todos os 2.560 estados amostrados e o estado pausado é coerente. Mas, nas Notas, a linha do motor fica na Casa do Estudante enquanto o olhar percorre quatro outras linhas. E o cartão de notas mostra parcial sem o qualificador que o cartão da comissão ganhou. |
| Consistência com o `STYLE.md` | 8 | O acento aparece só no olhar e na seleção, cada estado leva ícone e palavra, há U+2212 nos negativos e não há seta nem "≤". Ficam as reticências em texto na projeção e um ponto: o pulso de espera anda junto com a pausa de leitura nas Notas. |

## 2. Exatidão dos números

Tudo bateu. Nenhum número errado em nenhum modo, nem em estado pausado.

| Onde | Na tela | Fonte | Resultado |
|---|---|---|---|
| Cabeçalho e legenda | Fechado em 0,06 s | `duracao_s` 0,06; `execucao.json` 01:19:42Z | bateu |
| Resumo | R$ 243.278,79 = 203.735,34 + 39.543,45; 21 e 14 lojistas | `comissao`; `comissoes_por_lojista.csv` | bateu |
| Resumo | R$ 2.995,11 = 1.576,23 + 1.418,88; R$ 15.396,77; ≈ R$ 7,9 mil, sem soma | `dinheiro_em_jogo` | bateu |
| Resumo | 21 notas, R$ 243.284,29; Casa sem nota (−R$ 5,50) | `notas`; `notas_a_emitir.csv`; PEN-0011 | bateu (diferença de 5,50 confere) |
| Resumo, divergências | 87 · 1.546,28; 23 · 1.418,88; 5 · 29,95; total 115 · 2.995,11 | `divergencias_taxa.csv` | bateu |
| Resumo, pendências | 15 = 12 + 2 + 1, com os 15 valores e as datas dos spreads (15/09, 03/09, 23/09, 14/09) e da repetida (22/09) | `pendencias`; anexo da Ponte, linhas 76, 77, 96, 141, 205 e 228 | bateu |
| Resumo, feito pela regra | 1.900 + 228 + 20 + 184 = 2.332 | `por_peso.rotina` | bateu |
| Gaveta Rota Global | 12/09/2026 · 8 parcelas; R$ 6.449,10; 3,59% / 4,09%; 0,50 ponto; R$ 32,25; 87 = 83 + 4; R$ 1.546,28; linha 727; ressarcimento R$ 1.545,86 | `rastro_um_numero`; linha 727; PEN-0001 | bateu |
| Gaveta Mundo Aberto | R$ 9.830,65 = CAD 2.438,46 × 4,0315; pago R$ 9.978,18; 1,20% / 1,5007%; 0,3007 ponto; R$ 29,56; 23; R$ 1.418,88; linha 10; spread R$ 147,53 | anexo da Ponte, linha 10; DIV-0093; PEN-0010 | bateu. A conta fecha na tela: 9.830,65 × 0,3007% = 29,56; 147,53 − 117,97 = 29,56 |
| Gaveta Bridge | 15/09; R$ 1.124,71; 2,19% / 2,59%; R$ 4,50; 5 vendas; R$ 29,95; linha 938; R$ 29,94 | DIV-0014/22/26/32/37 (5 vendas); PEN-0002 | bateu |
| Gavetas Atlas e Casa | R$ 7.876,05; 57 = 49 + 5 + 2 + 1; R$ 262.138,61, "não receita"; 118 e 119 linhas | Orbe EC 1076801732; PEN-0003/0004/0011 | bateu (respeita o `BRIEF`) |
| Gavetas dos spreads | moeda, PTAX, valor, −spread, −1,5523% / −1,5512% / −1,6493% | anexo da Ponte | bateu, com U+2212 |
| Gavetas Pix, repasse, transferência | 7.350,00; 12.400,00; −300.000,00; saldos e linhas 50, 65 e 92 | extrato Aurora | bateu |
| Gaveta dos lançamentos | 184 em 22 contas, com a contagem por conta | `lancamentos_classificados.csv` | bateu |
| Gavetas de comissão | 21 lojistas somando 1.900 linhas; 14 lojistas somando 228 operações; valores | `comissoes_por_lojista.csv` | bateu |
| Reprodução, arquivos | 1.943; 14; taxas "30 de 43" | `arquivos`; `.xlsx`: 30 + 13 linhas | bateu |
| Reprodução, contagens | decisões = regra + sinalizadas + pessoa em todos os 2.560 estados; fins de etapa 1.996 = 1.900 + 92 + 4; 257 = 228 + 23 + 6; 23 = 20 + 1 + 2; 187 = 184 + 0 + 3; fim 2.463 = 2.332 + 116 + 15 | `por_etapa`; `por_peso` | bateu |
| Reprodução, pendências | cartão cumulativo 4, 10, 12 e 15; donos somam o total em todo estado | `pendencias` | bateu |
| Reprodução, notas | os 22 estados do cartão (1 a 21 notas) são somas exatas das notas em ordem | `notas_a_emitir.csv` | bateu |
| Reprodução, pausada | checkout 23.099,95 (3), 113.486,35 (11), 187.560,58 (19), 64.858,04 (7); remessa 214.140,91 (3), 239.908,27 (12); notas 41.307,74 (4), 128.435,73 (12) | somas acumuladas dos CSVs | bateu: exatas e estáveis |
| Reprodução, Mundo Aberto | "Ponte aplicou 1,5007% sobre R$ 9.830,65; contrato 1,20%. R$ 29,56" | anexo, linha 10 | bateu |

## 3. Os três defeitos mais importantes

Nenhum é de número errado nem de legibilidade da camada principal. São de acabamento.

```text
DEFEITO 01
QUADRO OU MOMENTO: Reprodução, etapa Notas. Tocando, de 73,06 a 76,17 s em 1x (o cartão fica ~1,9 s em "4 notas"); pausado, em qualquer ponto até 76,9 s. Telas pausa-1x-1440-74900ms.png ("R$ 41.307,74 · 4 notas a emitir") e pausa-1x-1440-76500ms.png ("R$ 128.435,73 · 12 notas a emitir"); r1 pausa-101500ms.png mostrava o mesmo.
OBSERVAÇÃO: o cartão "Notas a emitir" mostra a soma das notas já geradas em número de 28 px com a frase "4 notas a emitir", sem qualificador. A etapa ainda está aberta (5 de 23 decisões). O cartão da comissão, no mesmo caso, ganhou "fechando… (k de N lojistas)".
POR QUE IMPORTA: quem pausa ou tira print lê que o mês tem 4 notas e R$ 41 mil a emitir, contra 21 notas e R$ 243.284,29. O valor é exato e a legenda "só entra o que já fechou" o cobre, mas é a mesma situação que a r2 corrigiu na comissão, só que em outro cartão.
MENOR CORREÇÃO ÚTIL: o mesmo tratamento da comissão. Enquanto houver nota da etapa por gerar, a frase do cartão vira "emitindo… (4 de 21 notas)". Na última nota, volta a "21 notas a emitir".
PRESERVAR: um contador só nas Notas (valor e quantidade no mesmo quadro); os parciais exatos; os finais; o passo a passo reduzido, que não tem estado intermediário de notas.
CONFERIR DE NOVO: pausar em 74,9 s e 76,5 s em 1x e em 37,4 s e 38,3 s em 2x; tela do cartão a 1440 e em projeção a 1280.
```

```text
DEFEITO 02
QUADRO OU MOMENTO: Reprodução, etapa Notas, 72,66 a 76,17 s em 1x (vídeo ~74,2 a 77,8 s). Telas video-notas-casa-74a77.png e pausa-1x-1440-74900ms.png.
OBSERVAÇÃO: a linha do motor assenta em "Casa do Estudante sem nota · −R$ 5,50" e fica nela 3,0 s. Durante essa pausa de leitura, o olhar do motor desce quatro linhas (Bem-Vindo, Oxford, Kiwi, Fluente), cada uma carimbada com "Feito pela regra", e o cartão de notas conta de 1 a 4. No fim, a faixa de acento está na Fluente e a linha do motor ainda fala da Casa.
POR QUE IMPORTA: a peça vende um relógio só, em que o painel reage ao que o olhar acabou de decidir. Aqui, o texto que se pede para ler descreve uma linha que o olhar já deixou, e há movimento em duas frentes durante a pausa narrada. É o único trecho da reprodução em que isso acontece; nas outras etapas a varredura cai na legenda da etapa.
MENOR CORREÇÃO ÚTIL: na etapa Notas, a varredura das quatro linhas passa para antes da Casa, durante a legenda "Uma nota por lojista…". Depois o olhar volta à linha da Casa, que é a primeira da mesa, e só então a pendência entra e pausa. A outra saída: a pausa da Casa termina antes de a varredura começar.
PRESERVAR: a ordem dos eventos do motor (a Casa é a decisão 1 das Notas); os 3,0 s parados da Casa; o contador único das notas.
CONFERIR DE NOVO: vídeo de 72 a 78 s em 1x; tela parada no meio da pausa da Casa (o olhar deve estar na linha da Casa).
```

```text
DEFEITO 03
QUADRO OU MOMENTO: Reprodução em modo projeção a 1280×720. Extratos (88 a 96 s) e Remessa (44 a 60 s). Telas rep-proj1280-88s.png, rep-proj1280-94s.png e rep-proj1280-56s.png.
OBSERVAÇÃO: a coluna de texto da mesa corta com reticências justamente na linha que o motor está decidindo: "PIX RECEBID…", "TRANSF ENTRE…", "CARTAO PJ - GOOGLE…", "NOVO HORIZONTE…", "NÓRDICA EDUCAÇÃO…". Os números estão inteiros, que era o pedido do r1; a 1440 em projeção não há reticência.
POR QUE IMPORTA: é o modo da sala. Na transferência, o corte apaga a palavra que explica a pendência ("…P/ BCO MERIDIANO"). A linha do motor em 25 px compensa, mas a mesa deixa de mostrar o arquivo "como chegou" no momento em que ele importa.
MENOR CORREÇÃO ÚTIL: só na projeção compacta, a coluna de texto pode quebrar em até 3 linhas na linha que tem o olhar (a linha cresce), ou a célula mostra o texto inteiro em 2 linhas com a fonte da tabela (19 px). Sem reticência na linha focada.
PRESERVAR: números sem reticência; a mesa e o impacto lado a lado; as 5 linhas da mesa em projeção; o selo em duas linhas.
CONFERIR DE NOVO: projeção a 1280×720 em 86, 89, 92,5 e 55 s; auditoria de reticências na linha com o olhar.
```

## 4. Outros achados

Do mais para o menos grave.

1. **Extratos, aba que pisca.** A aba vai de Aurora para Meridiano em 85,65 s e volta a Aurora em 86,02 s. Num quadro, a mesa fica vazia (só o cabeçalho) enquanto o impacto já mostra "13" e "Pix recebido sem identificação": o painel reage antes de a mesa mostrar a linha (video-meridiano-flash.png). Saída: o lote do Meridiano termina e a mesa volta à Aurora antes de a pendência do Pix entrar no impacto.
2. **Mundo Aberto na reprodução.** A linha da mesa mostra "9.978,18" (coluna "Valor (R$)") e a linha do motor diz "sobre R$ 9.830,65". São dois valores da mesma operação lado a lado, sem dizer o que é o segundo; a gaveta explica, a reprodução não (06d-rep-mundo-aberto.png). Basta "sobre R$ 9.830,65 (CAD à PTAX)" ou "Pago (R$)" no cabeçalho da coluna.
3. **Resumo, Dinheiro em jogo.** "cobrar da Orbe R$ 1.576,23" fica numa linha com o valor à direita; "contestar com a Ponte" quebra e o "R$ 1.418,88" desce para a esquerda. As duas partes de R$ 2.995,11 não formam coluna em nenhum tamanho (01-resumo-1440.png, fluxo-1280-0-resumo.png, fluxo-1280-proj-0-resumo.png).
4. **"Fechando…" pequeno.** No fecho pausado, "checkout fechando… (11 de 21 lojistas)" está em 13 px sob "R$ 113.486,35" em 28 px (pausa-1x-1440-22300ms.png). De longe se lê o número, não o qualificador. Opcional: o título do cartão vira "Comissão fechada até agora" enquanto houver lojista aberto.
5. **Nomes cortados no modo normal.** "MUNDO ABERTO INTERCAM…", "CASA DO ESTUDANTE VIAGE…" e "Maple Study Assessoria Educacional…" aparecem a 1440 (05-rep-primeira-excecao.png, 03-rep-10s.png, 06b-rep-nota-ponte.png).
6. **"Rotina em lote: feito pela regra." pisca.** Aparece assentada por 0,17 s entre a Rota Global e a Bridge (16,64 s), por 0,37 s nas Notas (76,17 s) e por 1 quadro antes da Mundo Aberto (42,02 s). Ninguém lê; o contador já diz que é lote.
7. **Fluxo do pitch, filtro.** A 1280×720 com a gaveta aberta, o filtro "Financeiro 12" fica meio coberto ("Finance…"). Funciona e fecha a gaveta (fluxo-1280-1-rota-global.png). Em projeção, o filtro fica abaixo da dobra e pede rolagem.
8. **Rota Global na borda a 1280×720.** A linha da Rota Global, primeiro clique do pitch, ficou entre y 684 e 720, colada na borda, depois que o texto corrido passou a 17 px (cmp-resumo1280-r1-r2-base.png). Ainda clicável.
9. **Rastro técnico.** Identificadores quebram no meio ("PEN-/0001", "comissoes_/set2026.csv"; g-1440-08-fim.png).
10. **Spread da Maple em duas precisões.** "1,501%" na gaveta e "1,5010%" na mesa: mesmo valor, precisões diferentes.
11. **Passo a passo reduzido.** "‹ Passo" não se desabilita no primeiro estado; o clique não faz nada.

O que está bem e não deve mudar:

- O Resumo abre na resposta.
- Nenhum código do motor na camada principal: a varredura de "TX/PEN/DIV/F" fora do Rastro técnico e de formato americano não achou nada.
- Nenhuma ocorrência de "Para o … decidir".
- A cadeia da Mundo Aberto, que agora fecha a conta na tela.
- A pausa coerente em 1x e 2x.
- O passo a passo reduzido sem parcial: o fecho mostra "nada fechado ainda" e "remessa fechando… (0 de 14)".
- O Esc fecha a gaveta e devolve o foco à linha clicada.
- Rolagem lateral zero em todos os modos.
- O modo ao vivo rodou numa cópia e não regravou `relatorio/`.
- O tema escuro está correto.
- Console limpo em todas as rodadas.

## 5. Conferência item a item do r1

### Defeitos

| Item | Situação | Prova |
|---|---|---|
| 01, parcial vira total ao pausar | corrigido | Pausado no fecho, o cartão diz "checkout fechando… (k de 21 lojistas)" com a soma exata dos k lojistas fechados, estável 2,5 s depois: pausa-1x-1440-21580/21700/22300/23000ms.png. Remessa: pausa-1x-1440-61200/61900ms.png. Em 2x: pausa-2x-1440-10850/11200/30600ms.png. Contador pausado salta ao final (pausa-1x-1440-26300ms.png). A 1280: 22b-rep-fecho-1280.png. Ressalva: DEFEITO 01 (notas). |
| 02, projeção trunca | corrigido | Mesa e impacto lado a lado; nenhuma reticência em número nem em cabeçalho; selo em duas linhas; rolagem lateral zero: rep-proj1440-13s/45s/62s.png, rep-proj1280-13s/56s/88s.png. Ressalva: texto (DEFEITO 03). |
| 03, Mundo Aberto | corrigido | Base R$ 9.830,65 = CAD 2.438,46 à PTAX 4,0315; pago R$ 9.978,18; 1,5007%; 0,3007 ponto; R$ 29,56: ma-1440.png, ma-1280.png, ma-1440-proj.png, ma-1280-proj.png (o dono termina em y 706 de 720). Na reprodução, 42,05 s: rep-proj1440-45s.png. |

### Seção 5, tempo da reprodução

| Recomendação | Situação | Prova |
|---|---|---|
| 1. Pendência em uma linha | corrigido | Selo, título curto e valor ("Decide: Comercial · Devolver à Casa do Estudante · R$ 15.396,77", parado 3,0 s); 06-rep-primeira-pessoa.png. Motivo completo no Resumo e na gaveta. |
| 2. Mesmo tipo em grupo | corrigido | "Cobrar da Orbe", 25,84 a 30,66 s (4,8 s); spreads, 52,60 a 60,36 s (7,8 s; itens a cada ~160 ms; 7,2 s parados contra 6,3 s da regra); 06c-rep-grupo-spreads.png. |
| 3. Nota da Ponte numa batida | corrigido | 77,05 a 81,49 s (4,4 s); Sinalizadas 0 para 1 e Pessoa 1 para 2 no mesmo quadro; 06b-rep-nota-ponte.png. |
| 4. Bridge na pausa mínima | corrigido | 17,31 a 19,36 s, 1,55 s parada. |
| Resultado e preservação | corrigido | 100,5 s em 1x, 50,3 s em 2x (log-1x/log-2x-1440.json). Preservados: leitura 4,7 s; Rota Global 5,6 s; primeiro fecho 5,0 s; recapitulação 4,4 s. Pausas parado-desde-o-assentamento: Casa 3,0; Atlas 3,7; Bagagem 2,7; Mundo Aberto 3,15; Casa sem nota 3,0; Ponte 3,9; Pix 2,6; repasse 2,7; transferência 3,2; recapitulação 3,9 s. Todas cumprem `max(1500, 670 + 270 × palavras)` com a contagem das emendas. |

### Achados 1 a 12

| Achado | Situação | Prova |
|---|---|---|
| 1. Reprodução longa | corrigido | 100,5 s / 50,3 s (seção 5). |
| 2. "Para o Tesouraria decidir" | corrigido | Nenhuma ocorrência no Resumo, nas 36 gavetas nem nas duas reproduções; "Decide: Tesouraria" em 07-rep-fim.png. |
| 3. Total da gaveta sem rótulo | corrigido | O rótulo "a cobrar da Orbe" entra no mesmo quadro em que o total sai de R$ 32,25 e conta 1,0 s até R$ 1.546,28 (gaveta-rota-anim.txt); o dono só depois. |
| 4. Linha sob o cabeçalho a 1280 | corrigido | Sem rolagem; "12 pendências de 15 no mês" a y ≈ 363 (fluxo-1280-2-financeiro.png). Em projeção, rola e para logo abaixo do cabeçalho (fluxo-1280-proj-2-financeiro.png). |
| 5. Nota da Ponte duas vezes | corrigido | Uma batida (seção 5, item 3). |
| 6. "R$ −5,50" | corrigido | Aos 21,56 s, "Comissão apurada fechando…"; nenhum "R$ −" em lugar nenhum. |
| 7. Dois contadores nas Notas | corrigido | Valor e quantidade mudam no mesmo quadro nos 22 estados, todos somas exatas. |
| 8. Texto corrido a 13 px | corrigido | 17 px, peso 500, medido ("São valores…" e "20 lojistas…"). |
| 9. Gaveta Mundo Aberto: quebras e hífen | corrigido | "Contrato" e "A Ponte aplicou" sem quebra; "CAD 2.438,46" inteiro; "−1,5523%" com U+2212 (g-1440-26.png). |
| 10. Selo de dono em duas formas | corrigido | Só "Decide: &lt;área&gt;", em todo lugar. |
| 11. Rastro em formato americano | corrigido | "4,09%", "R$ 1.545,86" e a linha "Ressarcimento ao lojista" (g-1440-08-fim.png). |
| 12. Redação | corrigido | "Por que as notas somam R$ 5,50 a mais que a comissão" (gaveta das notas); "Spread negativo na remessa · Ponte Aérea". |

## 6. Veredito

**PASSA.** Nenhum número errado em modo nenhum, inclusive pausado. Nenhum defeito de legibilidade na
camada principal. Nenhuma nota abaixo de 7. Os três defeitos acima e os achados 1 e 2 são locais e
cabem num acabamento antes da entrega, como o filme teve na r3, sem nova rodada de crítica.
Recomendo, nesta ordem: DEFEITO 01 (qualificador nas notas), DEFEITO 02 (varredura das Notas antes
da pendência da Casa), DEFEITO 03 (texto sem reticência na linha focada em projeção a 1280).
