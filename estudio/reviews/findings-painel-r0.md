# Findings: painel da analista, rodada r0

Crítico, 18/10/2026 21:38 BRT (19/10 00:38Z). Contexto novo; não li o código do painel
(`src/tarvo/vitrine/painel.html`, `painel.py`, `servidor.py`), a conversa do Animador nem os relatórios
técnicos como prova. (Arquivo gravado pelo Diretor com o texto entregue pelo Crítico: o ambiente do
subagente recusou a gravação.)

Evidência usada: as 31 telas de `estudio/out/previews/painel/` (com `captura.json` só como índice), a
folha `estudio/reviews/contact-sheets/painel-r0.png`, o vídeo `reproducao-1x.mp4` inteiro (quadros a 1 e
2 qps, mais detecção de trechos parados a 10 qps) e o `relatorio/painel.html` aberto no Chrome pelo
Playwright, de fora: fluxo do pitch a 1440×900, 1280×720 e em modo projeção, medição do tamanho de
fonte do texto visível e varredura do texto visível atrás de código do motor e formato americano.
Telas do Crítico em `estudio/reviews/frames/critico-painel-r0/`. Números conferidos contra
`estudio/dados/fechamento.json`, os CSVs de `saida/`, `relatorio/eventos.jsonl` e as linhas de origem
em `dados/`.

## 1. Notas

| Critério | Nota | Justificativa |
|---|---|---|
| Composição | 8 | O Resumo abre na resposta, em duas colunas, com a rotina reduzida a um total; a gaveta de 440 px abre sem cobrir a linha clicada; a Reprodução separa bem mesa e impacto. |
| Tipografia | 7 | Manrope com algarismos tabulares e vírgula alinhada, hierarquia limpa; mas o texto que explica cada número fica em 13 a 17 px, e só 9 das cerca de 350 palavras da primeira dobra têm 28 px ou mais. |
| Legibilidade do produto (de longe, sala clara) | 5 | Do fundo da sala se leem os números, não o que eles são nem quem decide: na gaveta da Rota Global, "R$ 32,25 a mais nesta venda" e "Para o Financeiro decidir" ficam entre 10′ e 15′ mesmo no modo projeção, abaixo dos 16′ mínimos. |
| Qualidade do movimento | 7 | O olhar do motor percorre linhas reais do arquivo, para na exceção e o selo carimba; mas no fecho da remessa dois contadores andam juntos, e o total da gaveta sobe de "R$ 0,00 a cobrar" em vez de partir de R$ 32,25. |
| Timing | 6 | O ritmo tem intenção (exceção em câmera lenta, rotina em lote), mas quatro pendências ficam paradas só 1,1 a 1,3 s depois de assentar, abaixo do piso de 1,5 s do `STYLE.md`, e a primeira exceção fica 4,2 s contra os 5,5 s da regra. |
| Continuidade | 6 | Um relógio só, mesa e painel andam juntos e os parciais de dinheiro nunca contradizem o final; mas na etapa Notas uma decisão some dos contadores e o total para de bater com as partes até o fim. |
| Consistência com o `STYLE.md` | 7 | Acento só no olhar e na seleção, estados com ícone e palavra; mas uma decisão sinalizada recebe "Feito pela regra", o modo ao vivo usa o ícone de pessoa como status do motor e, no modo projeção, a gaveta de 550 px cobre parte da linha clicada. |

## 2. Exatidão dos números

Dinheiro: tudo bateu. As contagens têm um furo (a nota única da Ponte) e o arquivo entregue hoje não
mostra a mesma duração que o `fechamento.json`.

| Onde | Número na tela | Fonte | Resultado |
|---|---|---|---|
| Resumo | R$ 243.278,79 (comissão apurada) | 203.735,34 + 39.543,45 (`comissao`) | bateu |
| Resumo | Checkout R$ 203.735,34 · 21 lojistas; Remessa R$ 39.543,45 · 14 lojistas | `comissao`; `comissoes_por_lojista.csv` | bateu |
| Resumo | 21 notas, R$ 243.284,29; Casa do Estudante sem nota (−R$ 5,50) | `notas`; `notas_a_emitir.csv`; PEN-0011 | bateu |
| Resumo | R$ 2.995,11 = R$ 1.576,23 + R$ 1.418,88; R$ 15.396,77; ≈ R$ 7,9 mil (estimativa) | `dinheiro_em_jogo` | bateu; não soma os três |
| Resumo, divergências | 87 · 1.546,28; 23 · 1.418,88; 5 · 29,95; total 115 · 2.995,11 | `divergencias_taxa.csv` agregado | bateu |
| Resumo, pendências | 15; Financeiro 12, Comercial 2, Tesouraria 1; os 15 valores | `pendencias` | bateu (transferência em módulo; ver achado 9) |
| Resumo, feito pela regra | 1.900 + 228 + 20 + 184 = 2.332 | `eventos.por_peso.rotina` | bateu |
| Cabeçalho e legenda | "Fechado em 0,07 s" nas telas e no vídeo r0 | `duracao_s` = 0,07 | bateu nos renders |
| Cabeçalho, arquivo atual | "Fechado em 0,06 s" no `relatorio/painel.html` aberto agora | `duracao_s` = 0,07 | **não bate**: regravado às 21:18 BRT por outra rodada; achado 1 |
| Mergulho Rota Global | 12/09/2026 · 8 parcelas; R$ 6.449,10; 3,59%; 4,09%; 0,50 ponto; R$ 32,25; 87 = 83 vendas + 4 estornos; R$ 1.546,28; Financeiro; linha 727 | `rastro_um_numero`; linha 727 conferida | bateu |
| Mergulho Atlas | R$ 7.876,05; 57 = 49 vendas + 5 antecipações + 2 reversões + 1 estorno; R$ 262.138,61 | `atlas` | bateu |
| Mergulho Pix | R$ 7.350,00; 16/09/2026; linha 50 | PEN-0013; extrato Aurora | bateu |
| Mergulho comissão Mundo Aberto | R$ 18.508,09; 169 linhas; 1.331,35 × 2,49% = 33,15 | `comissoes_por_lojista.csv` | bateu |
| Reprodução, arquivos | Orbe 1.943; ajustes 14; Ponte 233; plano 52; Aurora 84; Meridiano 100 | `arquivos` | bateu |
| Reprodução, arquivos | Taxas contratadas: **30** linhas | `arquivos`: 43 | **não bate**: a tela não diz que leu só a aba vigente (achado 6) |
| Reprodução, checkout | 723 de 1.996 até 1.996 | 1.992 decisões + 4 pendências | bateu |
| Reprodução, remessa | 257 de 257 = 228 + 23 + 6, e parciais | eventos 2024 a 2294 | bateu |
| Reprodução, notas | **22 de 23: 20 + 0 + 1 = 21**; **23 de 23: 20 + 0 + 2 = 22** | decisão 22 é a nota da Ponte, `peso: atencao` | **não fecha** (defeito 01) |
| Reprodução, extratos | 187 = 184 + 3 | eventos 2320 a 2506 | bateu |
| Reprodução, fim | **2.463 decisões = 2.332 + 115 + 15 = 2.462** | `por_peso`: 2.332 + 116 + 15 | **não fecha** (defeito 01) |
| Reprodução, valores das exceções | Orbe 4,09%/3,59%, R$ 32,25; Bridge R$ 4,50; Mundo Aberto R$ 29,56; repetida R$ 821,88; spreads | DIV e PEN correspondentes | bateu |
| Reprodução, dinheiro parcial | 1.546,28, depois 1.576,23, depois 2.995,11 | eventos | bateu: só dinheiro fechado |

## 3. Os três defeitos mais importantes

```text
DEFEITO 01
QUADRO OU MOMENTO: Reprodução, etapa 4 Notas, a partir de "Nota única da Ponte Câmbio: R$ 39.543,45" (vídeo, ~68,5 s) até o fim; telas 07-rep-fim.png e 31-reduzido-reproducao.png
OBSERVAÇÃO: a nota única da Ponte é uma decisão sinalizada (peso: atencao). A linha ganha o selo "Feito pela regra", mas o contador "Feito pela regra" não sai de 20 e nenhum outro sobe. Daí: "22 de 23" com 20 + 0 + 1 = 21; "23 de 23" com 20 + 0 + 2 = 22; no fim, "2.463 decisões" com 2.332 + 115 + 15 = 2.462.
POR QUE IMPORTA: a peça vende que todo número volta à origem; o avaliador que somar acha uma decisão perdida e a linha com o estado errado. É contagem parcial que contradiz o final.
MENOR CORREÇÃO ÚTIL: rótulo do contador "Sinalizadas" (116 = 115 divergências + a nota da Ponte), e a linha da Ponte com o selo de exceção e motivo curto. Com isso 2.332 + 116 + 15 = 2.463 e 20 + 1 + 1 = 22.
PRESERVAR: parciais que já fecham (1.996, 257, 187); "115 operações acima do contrato" e o total 115 da tabela; o relógio único.
CONFERIR DE NOVO: reprodução de 67 s a 74 s; quadro final; modo reduzido no último passo; modo ao vivo no fim.
```

```text
DEFEITO 02
QUADRO OU MOMENTO: Mergulho da Rota Global (telas 11, 21, 53), o "momento que convence" e o primeiro clique do pitch
OBSERVAÇÃO: dos seis elos (contrato 3,59%, Orbe 4,09%, R$ 32,25, 87 operações, R$ 1.546,28, decide o Financeiro), só três têm 28 px. "R$ 32,25 a mais nesta venda" e "87 operações assim" têm 17 px; "Para o Financeiro decidir", 13 px; "Contrato" e "A Orbe cobrou", 13 px. Pela conta do STYLE.md, 17 px dá 12′ e 13 px dá 9′; no modo projeção, 15′ e 11′, abaixo de 16′. No Resumo, o que cada número é fica em 15 a 20 px.
POR QUE IMPORTA: do fundo, o CFO vê 3,59%, 4,09% e um R$ 1.546,28 solto, sem a diferença, sem quantas vendas, sem quem decide.
MENOR CORREÇÃO ÚTIL: na gaveta, "R$ 32,25" e "87" no papel de número de cartão (28 px, 700; 35 em projeção), apoio em 20 px; "Decide: Financeiro" em 20 px com ícone; rótulos das taxas em 20 px.
PRESERVAR: a ordem da gaveta; 440 px no modo normal; a linha de origem a 15 px; o número herói do Resumo.
CONFERIR DE NOVO: gaveta a 1440×900, 1280×720 e projeção; tudo cabe sem rolar até o dono.
```

```text
DEFEITO 03
QUADRO OU MOMENTO: fluxo do pitch (Rota Global, depois "Financeiro 12")
OBSERVAÇÃO: com a gaveta aberta, a 1440×900 o filtro se aplica atrás dela; a 1280×720 a gaveta corta o botão ("Financ"). No modo projeção o filtro fica abaixo da primeira dobra e a gaveta de 550 px cobre Valor, Quem decide e "ver origem" da linha clicada.
POR QUE IMPORTA: são os 45 s de tela do pitch; um clique sem efeito visível parece falha.
MENOR CORREÇÃO ÚTIL: clicar num filtro de dono fecha a gaveta e rola a lista para a vista, abaixo do cabeçalho fixo; em projeção, gaveta em 440 px (só o conteúdo cresce).
PRESERVAR: filtro selecionado com acento suave; Esc fecha; gavetas que abrem à esquerda quando o item está à direita.
CONFERIR DE NOVO: fluxo completo a 1440×900, 1280×720 e projeção, cronometrado (~45 s).
```

## 4. Outros achados

Do mais para o menos grave.

1. **A duração do arquivo entregue não é a dos renders** (0,06 s no `relatorio/painel.html` atual, 0,07 s no `fechamento.json` e nos renders). A captura ao vivo regravou `relatorio/`. Filme e painel precisam sair da mesma rodada.
2. **"21 notas emitidas"** na Reprodução: o motor lista notas a emitir; não emite nota. Trocar por "a emitir".
3. **Pausas abaixo do piso:** PEN-0002 ~1,2 s; três últimos spreads 1,1 a 1,2 s; nota da Ponte ~1 s. Primeira exceção 4,2 s contra 5,5 s; primeira pendência 3,4 s contra 5,3 s.
4. **Dois contadores ao mesmo tempo** no fecho da remessa (56 s a 58 s).
5. **Filtro sem contagem:** com "Financeiro 12", o cartão segue dizendo "15 pendências".
6. **"Taxas contratadas: 30 linhas lidas"** contra 43: dizer que leu só a aba vigente e ignorou a antiga (é acerto do motor).
7. **Mesa e legenda fora de sincronia:** "Fechando a comissão de cada lojista" com transações na mesa; legenda do Meridiano com a aba Aurora aberta.
8. **Contador começando do nada:** a gaveta mostra "R$ 0,00 a cobrar" antes de subir; partir de R$ 32,25. Subtítulo de afirmação enquanto o número conta.
9. **Sinal da transferência:** no painel, R$ 300.000,00 sem sinal, enquanto as outras saídas têm sinal.
10. **Ícone de pessoa como status do motor** no ao vivo; nomes crus do arquivo em "Decisões que importam" no ao vivo.
11. **"Pular para o que precisa de uma pessoa"** no Resumo esconde o título sob o cabeçalho fixo.
12. **Quatro linhas iguais** de spread negativo; um identificador de leitura ajudaria.
13. **"Dinheiro em jogo" no fim da Reprodução** empilha os três valores como parcelas de soma, sem o "não se somam".
14. Evidência redundante: `03-rep-10s.png` e `05-rep-primeira-excecao.png` são idênticos.

O que está bem e não deve mudar: nenhum código do motor na camada principal; formato brasileiro; a
mesa mostra as linhas vizinhas reais do arquivo; o impacto só mostra dinheiro fechado; o Atlas como
estimativa; console sem erro.

## Mudanças do Animador: os motivos se sustentam?

- Reprodução de ~90 s: em parte; várias pausas ficaram abaixo da própria regra (achado 3).
- Notas antes de extratos: sim, é a ordem dos eventos.
- "87 operações assim: 83 vendas e 4 estornos": sim.
- "Notas a emitir" no topo da coluna direita: sim.
- Textos de tela novos: em geral sim, exceto "notas emitidas".

## 5. Veredito

**NÃO PASSA.** Contagem que não fecha (defeito 01), legibilidade da camada principal no momento que
convence (defeito 02) e três notas abaixo de 7. O dinheiro está certo; a correção é local.
