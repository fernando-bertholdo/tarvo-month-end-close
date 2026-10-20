# Findings: painel da analista, rodada r1

Crítico, 18/10/2026 23:01 BRT (19/10 02:01Z). Contexto novo; não leu o código do painel nem os
relatórios técnicos. (Gravado pelo Diretor, condensado do texto entregue pelo Crítico: o ambiente do
subagente recusou a gravação. Telas e quadros do Crítico em `reviews/frames/critico-painel-r1/`.)

Evidência: 38 telas de `out/previews/painel/`, folha `contact-sheets/painel-r1.png`, vídeo
`reproducao-1x.mp4` (143,2 s), e o `relatorio/painel.html` aberto de fora no Chrome: reprodução em 1x e
2x com o texto lido a cada 150 ms (900 e 450 amostras), todas as gavetas, fluxo do pitch cronometrado a
1440×900, 1280×720 e em projeção, reprodução em projeção, pausa no fecho da comissão, passo a passo
com movimento reduzido.

## 1. Notas

Composição 7 · tipografia 8 · legibilidade 7 · movimento 7 · **timing 6** · continuidade 7 ·
consistência com o `STYLE.md` 7.

## 2. Exatidão

Dinheiro e contagens finais: tudo bateu, inclusive gavetas (Rota Global, Bridge, Atlas, Casa, Pix,
repasse, transferência, spreads com datas conferidas no anexo da Ponte, 184 lançamentos em 22 contas).
Duração 0,06 s igual ao `fechamento.json`. Contagens fecham em todas as 1.350 amostras. Furos: o
estado pausado (defeito 01) e a conta da Mundo Aberto (defeito 03).

## 3. Defeitos

```text
DEFEITO 01
QUADRO OU MOMENTO: reprodução pausada no "Fechando a comissão de cada lojista" (checkout ~24,9 a 27,5 s; remessa ~85,9 a 88,0 s); telas pausa-25200ms.png, pausa-26000ms.png, pausa-86500ms.png; na evidência do Engenheiro, 22-rep-25s-1280.png
OBSERVAÇÃO: tocando, o cartão diz "checkout fechando…"; pausado, o "fechando…" some e o parcial vira valor ("checkout R$ 53.178,61 · remessa ainda em aberto"; "remessa R$ 26.065,98").
POR QUE IMPORTA: número parcial que contradiz o final; pausar é o gesto de quem olha com calma ou tira print.
MENOR CORREÇÃO ÚTIL: o "fechando…" depende do estado (há lojista aberto), não da animação: pausado, "checkout fechando… (6 de 21 lojistas)" ou "nada fechado ainda".
PRESERVAR: a soma subindo pelos lojistas enquanto toca; o passo a passo reduzido; os finais.
CONFERIR DE NOVO: pausar em 25,2 s, 26 s e 86,5 s em 1x e equivalentes em 2x; refazer 22-rep-25s-1280.png.
```

```text
DEFEITO 02
QUADRO OU MOMENTO: reprodução com "Modo projeção" a 1440×900 e 1280×720 (rep-proj1440-13s.png, rep-proj1440-56s.png, rep-proj1280-30s.png, rep-proj1280-108s.png)
OBSERVAÇÃO: valores truncados ("6.449,…", "17.717,…"), selos cortados ("Acima do contrat"), cabeçalho "Comissão (R…"; o impacto começa em y 893 (1440) e 701 (1280), fora da tela.
POR QUE IMPORTA: é o modo da sala; a venda que convence sai cortada e as duas frentes somem.
MENOR CORREÇÃO ÚTIL: coluna de valor com a largura do maior valor (sem reticências em número); selo quebra em duas linhas ou vira ícone + dono; mesa e impacto lado a lado também em projeção (mesa com 5 linhas), ou aviso de que a reprodução pede o modo normal.
PRESERVAR: legenda do motor a 35 px em projeção; relógio único; a mesa como os arquivos chegaram.
CONFERIR DE NOVO: projeção a 1440 e 1280 nos segundos 13, 30, 56 e 108; nenhuma célula numérica com reticências.
```

```text
DEFEITO 03
QUADRO OU MOMENTO: gaveta "Mundo Aberto" (g-13.png); legenda da reprodução ~54,9 s
OBSERVAÇÃO: mostra R$ 9.978,18, contrato 1,20%, Ponte 1,50%, "0,30 ponto", "R$ 29,56 a mais"; mas 9.978,18 × 0,30% = 29,93. O spread é sobre CAD 2.438,46 × PTAX 4,0315 = R$ 9.830,65 (aplicada 1,5007%). "Spread R$ 147,53" com 1,50% também não bate com 9.978,18.
POR QUE IMPORTA: o avaliador que fizer a conta acha R$ 0,37 e passa a duvidar da Rota Global.
MENOR CORREÇÃO ÚTIL: número de cima vira a base do spread: "R$ 9.830,65 · CAD 2.438,46 à PTAX 4,0315", com R$ 9.978,18 como "valor pago pelo cliente"; ou cadeia por spread: "cobrado R$ 147,53; pelo contrato R$ 117,97; a mais R$ 29,56".
PRESERVAR: R$ 29,56, 23 operações, R$ 1.418,88; a ordem dos elos.
CONFERIR DE NOVO: gaveta Mundo Aberto a 1440, 1280 e projeção; legenda ~54,9 s.
```

## 4. Outros achados

1. Reprodução de 138,8 s em 1x (69,6 s em 2x) cansa (seção 5).
2. "Para o Tesouraria decidir" (concordância) no Resumo, na reprodução (129,6 s) e na gaveta. Usar "Decide: Tesouraria" em todo selo de dono (resolve também o 10).
3. Gaveta da Rota Global: o total conta 1,9 s sem rótulo, com dois "R$ 32,25" na tela; contador começa no quadro em que o rótulo novo começa a entrar (emenda do `STYLE.md`).
4. A 1280×720, depois do filtro "Financeiro 12", a linha "12 pendências para o Financeiro decidir, de 15 no mês" fica sob o cabeçalho fixo; a lista já estava visível, não precisava rolar.
5. Nota da Ponte duas vezes seguidas (106,7 a 117,6 s), mesma frase em 11 s.
6. "Comissão apurada R$ −5,50" no primeiro instante do fecho (Casa do Estudante primeiro).
7. Dois contadores juntos nas Notas (100,5 a 103,2 s; 105,9 a 107,6 s), valor atrasado em relação à quantidade.
8. Texto corrido em 13 px (16 em projeção): "São valores de natureza diferente…" e a explicação da nota; corrido pede 17 px.
9. Gaveta Mundo Aberto: "Spread do contrato" quebra e desalinha; "CAD / 2.438,46" quebra no valor; "-1,55%" com hífen em vez de U+2212.
10. Selo de dono em duas formas ("Decide: Financeiro" e "Para o Financeiro decidir").
11. Rastro técnico com formato americano do motor ("4.09%", "R$ 1545.86"); explicar que o ressarcimento de R$ 1.545,86 é o descontado de fato.
12. Redação: "Por que as notas somam R$ 5,50 a mais que a comissão"; "Spread negativo da Ponte: contestar · Ponte Aérea" gagueja.

O que está bem: Resumo abre na resposta; nenhum código do motor na camada principal; formato
brasileiro; gaveta abre em 2,4 s e não cobre a linha clicada em nenhum modo; filtro fecha a gaveta;
Esc; passo a passo reduzido sem parcial; console limpo.

## 5. Tempo da reprodução: recomendação do Crítico

Cansa: depois de ~30 s a reprodução lê em fila a lista que o Resumo mostra de uma vez; os quatro
spreads seguidos tomam 18 s. A reprodução precisa mostrar de cada pendência que saiu da rotina, quanto
vale e quem decide; o motivo completo fica no Resumo e na gaveta. Por ordem de ganho:
1. pendência em uma linha (selo de dono, título curto, valor): ~−20 s;
2. pendências do mesmo tipo em sequência como um grupo, com atraso de lista e uma pausa (os quatro spreads): ~−10 s;
3. uma batida só para a nota da Ponte: ~−5 s;
4. Bridge na pausa mínima (repete o padrão da Rota Global): ~−4 s.
Resultado: ~95 a 100 s em 1x (~50 s em 2x), sem cortar etapa, evento nem exceção e sem pausa abaixo
da regra. Preservar: leitura dos arquivos, primeira exceção da Rota Global (5,5 s), primeiro fecho da
comissão e a recapitulação.

## 6. Corrigido do r0

Os três defeitos e os 14 achados do r0 foram corrigidos. Problemas novos criados pelas correções: os
achados 3, 4 e 5 acima, e o padrão de dois contadores, que migrou da remessa para as Notas.

## 7. Veredito

**NÃO PASSA.** Parcial mostrado como total na pausa (severidade máxima), valores truncados na
reprodução em projeção e timing 6. A conta da Mundo Aberto vai junto. Todas as correções são locais;
a da seção 5 depende de o Diretor aceitar agrupar e encurtar as pendências na reprodução.
