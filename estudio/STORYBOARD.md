# Storyboard

Departamento: Diretor. Lê junto com `BRIEF.md` (o porquê) e `STYLE.md` (como parece e como se move).
Todo valor entre chaves, como `{rastro_um_numero.diferenca_brl}`, vem de `estudio/dados/fechamento.json`
e é formatado no padrão brasileiro na hora de desenhar. Os textos fixos entre aspas são texto de tela
aprovado: o Animador não reescreve; se não couber, avisa.

---

## Parte 1. Filme do fechamento

1920×1080, 30 fps, 1.920 quadros (64 s), quadros 0 a 1919. Composição principal: `Fechamento`.
As durações abaixo já respeitam pausas de leitura generosas. Se o `STYLE.md` pedir mais tempo de
leitura do que uma cena tem, a cena cresce (o filme pode ir até 70 s) e o Animador registra a mudança
no topo deste arquivo, na seção "Mudanças".

Regra de continuidade: o estado final de cada cena é o estado inicial da próxima. Nada some e reaparece
em outro lugar sem um movimento que ligue as duas posições.

### Cena 1. O mês chega (quadros 0 a 209)

| Quadro | Evento |
|---|---|
| 0 | Fundo vazio. |
| 6 a 60 | Os sete arquivos entram, um a um, como cartões, à esquerda (60% da largura). Cada cartão: rótulo humano e volume. Pousam levemente desalinhados (rotação de no máximo ±2°, deslocamentos pequenos): a composição diz "excesso", sem movimento caótico. |
| 60 a 90 | Entra o título, à direita: "Sete arquivos, cada um de um jeito." |
| 110 | Segunda linha: "Oito dias úteis para fechar." ("Oito dias úteis" com o acento). |
| 140 | Terceira linha, menor: "As regras estão na cabeça de quem fecha." |
| 140 a 209 | Pausa de leitura. |

Rótulos dos cartões (texto aprovado; o volume vem de `arquivos[].linhas`):

| Arquivo | Rótulo | Volume |
|---|---|---|
| 01 | "Relatório da Orbe" | "{linhas} linhas" |
| 06 | "Ajustes tardios da Orbe" | "{linhas} linhas" |
| 02 | "Taxas contratadas" | "{linhas} linhas" |
| 03 | "E-mail da Ponte (câmbio)" | "{linhas} linhas" |
| 04 | "Plano de contas" | "{linhas} linhas" |
| 05a | "Extrato Aurora" | "{linhas} lançamentos" |
| 05b | "Extrato Meridiano" | "{linhas} lançamentos" |

Fonte de "oito dias úteis": `BRIEF.md` da raiz, linha "Dor" (vai na nota de produção, não na tela).

### Cena 2. As regras, escritas (quadros 210 a 419)

| Quadro | Evento |
|---|---|
| 210 a 260 | Os mesmos cartões se endireitam e formam uma coluna alinhada à esquerda. O título da cena 1 sai subindo. |
| 250 a 300 | À direita, um contador vai de 0 a `{regras_do_financeiro.valor}` e para. Rótulo: "respostas do financeiro viraram regras escritas, cada uma com a fonte." |
| 300 a 360 | Três regras de exemplo entram, uma por vez (texto aprovado, tirado do `REGRAS.md`): "A comissão sai da taxa do contrato, linha a linha, não do que a Orbe cobrou." · "Casa do Estudante: tarifa zero de setembro a dezembro." · "Lojista sem taxa contratada não é faturado até o comercial confirmar." |
| 360 a 395 | Entra um botão "Rodar o fechamento" (existe de fato no modo ao vivo do painel). |
| 400 a 406 | O botão afunda (escala 0,97) e volta: o clique. |
| 406 a 419 | As três regras recuam e esmaecem; o botão fica. |

### Cena 3. A conta (quadros 420 a 749)

| Quadro | Evento |
|---|---|
| 420 a 450 | O botão vira um contador "0 decisões" (mesma posição: continuidade). |
| 450 a 630 | O contador sobe até `{eventos.decisoes}` com curva que começa rápida e assenta, sem passar do valor. Ao mesmo tempo, da coluna de arquivos saem linhas finas para cinco faixas, cada uma com uma barra que enche e o próprio total: "Checkout", "Remessa", "Extratos", "Notas", "Pendências". Os totais das faixas vêm de `eventos.por_frente` (CHECKOUT, REMESSA, EXTRATOS, NOTAS, PENDENCIAS). |
| 630 a 690 | O contador se divide em três números, lado a lado, cada um com o selo do seu estado (`STYLE.md`, "Estados"): "{por_peso.rotina} feitas pela regra" (feito pelo motor) · "{por_peso.atencao} acima do contrato ou fora da regra" (exceção) · "{por_peso.excecao} para uma pessoa decidir" (para uma pessoa decidir). |
| 690 a 749 | Legenda pequena embaixo: "O motor fez a conta em {duracao_s} s. Aqui, no ritmo de quem lê." No fim, o número das sinalizadas ganha foco (o resto esmaece a 40%): é dele que a próxima cena nasce. |

### Cena 4. Um número, até a origem (quadros 750 a 1229)

A cena mais longa e a que convence. Um ponto focal por vez.

| Quadro | Evento |
|---|---|
| 750 a 790 | O número das sinalizadas se abre num cartão de venda: "{lojista}" / "venda de {data_venda} · {parcelas} parcelas" / "R$ {valor_bruto}". |
| 790 a 870 | Duas taxas entram lado a lado, abaixo do cartão: "Contrato" `{taxa_contratada_pct}`% e "A Orbe cobrou" `{taxa_aplicada_pct}`%. A taxa da Orbe na cor de exceção. Um colchete liga as duas: "{aplicada − contratada} ponto" (0,50 ponto). |
| 870 a 950 | "R$ {diferenca_brl} a mais nesta venda": o valor conta até o fim e confirma com a curva que passa do ponto (o único uso dela nesta cena). |
| 950 a 980 | Pausa de leitura. |
| 980 a 1060 | Recuo: o cartão encolhe e vira um ponto numa grade de `{vendas_com_divergencia}` pontos, que aparecem em sequência rápida. Acima, a soma conta até "R$ {total_a_cobrar_brl} a cobrar da Orbe", com o selo "Decide: {quem_decide}". |
| 1060 a 1170 | De baixo sobe uma faixa com a linha do arquivo da Orbe, como chegou (`linha_origem_texto`, campos em células, na tipografia de origem do `STYLE.md`; é aqui o único mergulho de câmera do filme). Destaque em dois campos: o valor bruto e a taxa aplicada. Legenda: "Relatório da Orbe, linha {fontes.linha_origem.linha}, do jeito que chegou." e, menor: "O número da tela aponta para esta linha." |
| 1170 a 1229 | Pausa de leitura. Estado final: soma em cima, faixa da origem embaixo. |

Nesta cena, e só nela, a linha crua do arquivo aparece com o identificador da transação: é o rastro,
a camada de mergulho. Nenhum outro código do motor (DIV, PEN, F11) aparece no filme.

### Cena 5. O dinheiro que apareceu (quadros 1230 a 1529)

| Quadro | Evento |
|---|---|
| 1230 a 1260 | A soma da Rota Global desliza para a primeira coluna e se junta a ela (ela é parte do valor a cobrar da Orbe). A faixa da origem sai por baixo. |
| 1260 a 1320 | Coluna 1: "R$ {taxa_acima_do_contrato.total}" / "taxa acima do contrato" / "cobrar da Orbe · R$ {cobrar_orbe}" / "contestar com a Ponte · R$ {contestar_ponte}". |
| 1320 a 1380 | Coluna 2: "R$ {devolver_casa_do_estudante.valor}" / "a devolver à Casa do Estudante" / "isenção negociada que não chegou à Orbe". |
| 1380 a 1440 | Coluna 3: "≈ R$ {atlas.taxa_estimada arredondada a 0,1 mil} mil" / "taxa da Atlas Idiomas, sem contrato" / "faturar em outubro, quando o comercial confirmar". Marcar como estimativa ("≈"). |
| 1440 a 1529 | Legenda: "A mesma causa: uma condição negociada que não virou regra." Os três valores nunca aparecem somados. |

### Cena 6. O que sobra para a pessoa (quadros 1530 a 1739)

| Quadro | Evento |
|---|---|
| 1530 a 1570 | As colunas sobem e encolhem. Entra "{pendencias.quantidade} pendências" com a divisão por dono em barras: "Financeiro {n}", "Comercial {n}", "Tesouraria {n}" (de `pendencias.por_dono`). |
| 1570 a 1680 | Quatro exemplos entram em lista, cada um com o que fazer, o valor e o dono (texto aprovado; valores de `pendencias.itens`): "Cobrar da Orbe a taxa acima do contrato · Rota Global" (PEN-0001) · "Devolver a isenção à Casa do Estudante" (PEN-0003) · "Pix recebido sem identificação" (PEN-0013) · "Transferência para o Meridiano, em trânsito" (PEN-0015, valor em módulo). Os identificadores entre parênteses são para o Animador achar o item; não vão para a tela. |
| 1680 a 1739 | Legenda: "Cada uma com motivo, valor e quem decide." Pausa. |

### Cena 7. Fecho (quadros 1740 a 1919)

| Quadro | Evento |
|---|---|
| 1740 a 1800 | Tudo sai. Entram três linhas, uma por vez: "A conta em menos de um segundo." · "Cada número com origem." · "{pendencias.quantidade} decisões para pessoas." |
| 1800 | Título: "Fechamento de setembro · Tarvo". |
| 1830 | Rodapé pequeno: "Dados fictícios do case. O motor decide por regra; a IA não toca em valor." |
| 1830 a 1919 | Quadro final parado (pelo menos 2,5 s). É o pôster do filme. |

### Quadros representativos (Engenheiro de render)

Antes do render completo: stills nos quadros 150, 400, 700, 940, 1150, 1450, 1700 e 1900. Prévia em
movimento primeiro da cena 4 (quadros 720 a 1230), depois do filme inteiro em qualidade baixa.

---

## Parte 2. Painel da analista

Página única gerada pelo comando (`python3 -m src.tarvo dados` grava `relatorio/painel.html` com os
eventos embutidos, a partir do modelo em `src/tarvo/vitrine/painel.html`) e servida ao vivo por
`src/tarvo/servidor.py` (botão "Rodar fechamento", eventos por SSE). As duas formas usam a mesma
página. Telas de 1440×900 e 1280×720, sem rolagem lateral; projetada numa sala clara.

### Prioridade

1. **Obrigatório:** estado Resumo e Mergulho, com todos os números vindos dos eventos e cada número
   abrindo a origem. O modo ao vivo continua funcionando.
2. **Alvo:** a Reprodução em duas frentes.
3. **Se sobrar tempo:** tema escuro.

### Estado A. Resumo (ao abrir)

A página abre na resposta, parada, sem rolar sozinha. No topo: "Fechamento de setembro · Tarvo", o
estado ("Fechado em {duração} s"), os controles ("Tocar o fechamento", "Pular para o que precisa de
uma pessoa") e o selo "dados fictícios do case". Logo abaixo, quatro respostas, nesta ordem:

1. **Comissão apurada:** checkout e remessa.
2. **Dinheiro em jogo:** os três valores da cena 5 do filme, cada um com o que fazer, sem soma.
3. **Notas a emitir:** quantidade e total.
4. **Pendências:** 15, divididas por dono, com filtro por dono ("Financeiro 12", "Comercial 2",
   "Tesouraria 1", "Todas 15").

Embaixo, os grupos: divergências de taxa por lojista e contraparte (tabela com lojista, vendas, valor e
quem decide) e a lista de pendências com motivo em linguagem de financeiro. Nada de mural de cartões
iguais: o que é rotina aparece como total, não como item.

Desde a r4 (pós-entrega): embaixo da tabela, a faixa de origem do primeiro grupo, visível sem clicar
(contrato, o que a contraparte cobrou, a diferença numa venda, operações e total a cobrar); e cada
pendência numa linha só (título curto, valor, dono), com o motivo na gaveta. Todo número vem de um
campo do motor (`src/CONTRATO_EVENTOS.md`): a página formata, não soma nem conta. Ver "Mudanças",
Diretor, 19/10, 22:35 BRT.

### Estado B. Reprodução (botão "Tocar o fechamento")

Pedido do Fernando às 13h26 de 17/10: o agente atuando em duas frentes ao mesmo tempo, com ritmo,
pausas e informação no tempo certo, sem parecer script cego.

- **Mesa de trabalho (esquerda, cerca de 45%):** as fontes do mês em abas. O "olhar do motor" (um
  marcador com rótulo, não um mouse fingindo usar um sistema) vai até a linha examinada, destaca e
  escreve uma linha curta do motivo, em linguagem de financeiro.
- **Impacto (direita):** os indicadores do Resumo enchendo e a lista de decisões que importam. Um
  indicador só mostra dinheiro já fechado: nunca um parcial que contradiz o final.
- **Um relógio só** comanda as duas frentes: o painel só reage ao evento que o olhar acabou de decidir.
- **Ritmo:** seis etapas, uma por vez (ler os arquivos, checkout, remessa, extratos, notas,
  pendências). Rotina passa em lote, como contador que acelera; sinalizadas aparecem agrupadas por
  lojista; cada uma das exceções que vão para uma pessoa entra em câmera lenta (pausa proporcional ao
  peso, motivo escrito, item entra). Variação pequena com semente fixa. Cerca de 75 s em 1x.
- **Controles:** tocar, pausar, 1x e 2x, pular para o que precisa de uma pessoa. No fim, volta ao
  Resumo completo. Com "reduzir movimento" ligado, mostra o Resumo direto.
- **Legenda fixa durante a reprodução:** "O motor fechou o mês em {duração} s. Aqui, no ritmo de quem
  lê. Quem decide é a regra."

### Estado C. Mergulho (clique em qualquer número ou linha)

Uma gaveta lateral abre o caminho até a origem, na mesma ordem da cena 4 do filme. Exemplo, Rota
Global: contrato 3,59%, a Orbe cobrou 4,09%, R$ 32,25 nesta venda, 87 vendas, R$ 1.546,28 a cobrar,
decide o Financeiro, e a linha do arquivo como chegou. (Na tela, sem setas: a fonte embutida não tem
o glifo; a ordem vem do layout.) Identificadores (TX, DIV, PEN), códigos
de regra e nomes de arquivo aparecem aqui, e só aqui, numa seção "Rastro técnico".

### Fluxo do pitch (para ensaiar)

Clique em "Rota Global Intercâmbio" na tabela de divergências: a origem abre e anima. Clique no filtro
"Financeiro 12" das pendências. Volta ao deck. Cerca de 45 s de tela.

### Momentos para o Engenheiro de render capturar

Em 1440×900: Resumo ao abrir; Reprodução em 3 s, 10 s, 25 s, na primeira exceção e no fim; depois de
"Pular para o que precisa de uma pessoa"; filtro "Financeiro 12"; Mergulho da Rota Global aberto. Em
1280×720: Resumo e Mergulho. Com `prefers-reduced-motion`: Resumo. Console sem erro. Vídeo da
Reprodução inteira em 1x.

---

## Revisão de texto do Diretor (corte r1)

O relatório técnico do r0 mostrou que o texto aprovado pedia cerca de 115 s para ser lido. O Diretor
corta palavras em vez de esticar o filme. **Estes textos substituem os da Parte 1 onde forem
diferentes.** Duração-alvo: até 80 s (2.400 quadros), com a emenda da pausa em sequência do `STYLE.md`.
Se ainda não couber, o Animador avisa qual cena estoura; não corta texto por conta própria. Contagem
aproximada: 170 palavras no filme todo.

| Cena | Texto de tela (r1) | O que saiu |
|---|---|---|
| 1 | Cartões só com o rótulo: "Relatório da Orbe", "Ajustes da Orbe", "Taxas contratadas", "E-mail da Ponte", "Plano de contas", "Extrato Aurora", "Extrato Meridiano". Título em duas linhas: "Sete arquivos." / "Oito dias úteis para fechar." ("Oito dias úteis" com o acento). | os volumes dos cartões; "cada um de um jeito"; "As regras estão na cabeça de quem fecha" (o contraste com a cena 2 já diz isso) |
| 2 | "{regras_do_financeiro.valor}" / "respostas do financeiro viraram regras." Uma regra só: "Vale a taxa do contrato, não a da Orbe." Botão "Rodar o fechamento". | "cada uma com a fonte"; as regras da Casa do Estudante e da Atlas (voltam como dinheiro na cena 5) |
| 3 | "{eventos.decisoes} decisões"; "{rotina} feitas pela regra"; "{atencao} sinalizadas"; "{excecao} para uma pessoa decidir"; legenda "O motor levou {duracao_s} s." | "acima do contrato ou fora da regra" (das 116, uma é a nota única da Ponte, que não é divergência: "sinalizadas" é o termo exato); "Aqui, no ritmo de quem lê" |
| 4 | Cartão: "{lojista}" / "venda de {data_venda}" / "R$ {valor_bruto}". Taxas: "Contrato {contratada}%" e "A Orbe cobrou {aplicada}%", colchete "0,50 ponto". "R$ {diferenca_brl} a mais nesta venda" + selo "Acima do contrato". Recuo: "{operacoes_com_divergencia} operações assim" e "R$ {total_a_cobrar_brl} a cobrar da Orbe" + selo "Decide: {quem_decide}". Origem: **uma fileira** de células da linha real, só data, estabelecimento, valor bruto, taxa aplicada e valor da taxa, com uma célula "…" antes e depois para dizer que a linha tem mais campos; legenda "Relatório da Orbe, linha {linha}, como chegou." | "8 parcelas"; "87 vendas" (são 83 vendas e 4 estornos: use `operacoes_com_divergencia`); a linha inteira em três fileiras; "O número da tela aponta para esta linha" |
| 5 | Coluna 1: "R$ {taxa_acima_do_contrato.total}" / "taxa acima do contrato". Coluna 2: "R$ {devolver_casa_do_estudante.valor}" / "a devolver à Casa do Estudante". Coluna 3: "≈ R$ {atlas} mil" / "da Atlas, a faturar em outubro". Legenda: "Mesma causa: o combinado não virou regra." | as partes da coluna 1 (Orbe e Ponte: ficam no painel) e as notas das colunas 2 e 3 |
| 6 | "{pendencias.quantidade} pendências"; barras "Financeiro {n}", "Comercial {n}", "Tesouraria {n}". Três exemplos com valor e selo do dono: "Cobrar a Orbe · Rota Global" (PEN-0001), "Devolver à Casa do Estudante" (PEN-0003), "Transferência em trânsito" (PEN-0015, em módulo). | o Pix sem identificação; a legenda "Cada uma com motivo, valor e quem decide" |
| 7 | "A conta em menos de um segundo." / "Cada número com origem." / "{pendencias.quantidade} decisões para pessoas." Título "Fechamento de setembro · Tarvo". Rodapé: "Dados fictícios do case · todo valor sai de regra". | "a IA não toca em valor" (vira "todo valor sai de regra", mais curto e mais exato) |

Com o texto mais curto, os números da cena 5 voltam ao corpo de 112 px se couberem nas colunas; se não
couberem, 88 px continua valendo.

## Revisão de texto do Diretor (corte r2)

Resposta aos itens do `reviews/findings-filme-r1.md` que dependiam do Diretor. Vale por cima da r1
onde for diferente.

| Cena | Decisão | Por quê |
|---|---|---|
| 3 | **Quatro faixas, por etapa**: "Checkout", "Remessa", "Notas", "Extratos", com os totais de `eventos.por_etapa` (somam `eventos.decisoes`). Sai a faixa "Pendências". As linhas dos cartões convergem num **feixe único** que alimenta as faixas, sem casar cartão e faixa. | A frente "PENDENCIAS" do motor é só a ordem de emissão: são pendências do checkout e dos extratos, e o painel já as conta na etapa de origem. "Pendências 7" contradizia as 15; o feixe não afirma origem que não existe. |
| 4 | Rótulo do total: "a cobrar da Orbe · Rota Global". | Sem o lojista, o valor soa como o total da Orbe (que é R$ 1.576,23, com a Bridge). |
| 4 | Linha de origem: célula "…" estreita em **cada** vão de campos omitidos (antes, entre e depois), legenda igual. | A legenda diz "como chegou"; cada omissão precisa estar marcada. |
| 5 | Coluna 1 ganha uma segunda linha curta: "Orbe e Ponte". | O total nasce da soma da Orbe na transição e parecia todo dela. |
| 6 | Exemplos: "Cobrar da Orbe · Rota Global" (PEN-0001), "Devolver à Casa do Estudante" (PEN-0003), "Pix recebido sem identificação" (PEN-0013). Sai a transferência em trânsito. | R$ 300 mil sem contexto era o maior número do filme e lia como dinheiro perdido; mesma regência da cena 4 ("cobrar da Orbe"). As barras por dono continuam mostrando a Tesouraria. |
| 7 | "Fechamento de setembro · Tarvo" no papel "Destaque" do `STYLE.md` (56 px, 600, `tinta`). | É o quadro que vira pôster e imagem do deck; o nome do produto não pode ser a linha mais fraca. |

**Acabamento depois do Crítico r2 (Diretor).** Legenda da origem, cena 4: "Relatório da Orbe, linha
{linha}: a venda de {data_venda curta, dd/mm}, como chegou." O rastro continua saindo do total, mas a
legenda diz que a linha é a da venda, não a do total.

Tempo: pausas **grupo a grupo**, não um fator único. Use o anexo A do findings como mapa: dê aos grupos
curtos o que falta (3b +44, 4a +37, 4b com o estado completo parado pelo menos 60 quadros) e margem aos
sem folga (5, 6, 7), tirando de onde sobra (cena 1, cena 2, faixas da cena 3) e do movimento que não
comunica. Duração-alvo: até 84 s (2.520 quadros).

## Mudanças

(O Animador registra aqui qualquer mudança de duração ou de texto, com o motivo.)

- **Diretor, 18/10, depois do portão de estilo.** Cores e tipografia seguem o `STYLE.md` onde este
  arquivo dizia outra coisa: na cena 3, as três contagens usam os estados (exceção = `peso: atencao`;
  para uma pessoa decidir = `peso: excecao`), e acento não marca estado; na cena 4, a linha de origem
  não usa fonte monoespaçada. Confirmada a ligação de estados proposta pelo Diretor de arte (pelo
  significado: quem decide). As durações daqui são mínimas: se a regra de pausa de leitura pedir mais,
  a cena cresce, até 70 s no total.

- **Animador, 18/10, primeiro corte (r0, 20:57 BRT).** O filme passou de 1.920 para 2.100 quadros
  (70,0 s, o teto). Os quadros de cada evento estão em `filme/src/animation/timeline.ts`.

  | Cena | Storyboard | Agora | Começa no quadro | Motivo |
  |---|---|---|---|---|
  | 1. O mês chega | 210 | 240 | 0 | título de 20 palavras: a pausa depois da última linha ia de 39 para 82 quadros |
  | 2. As regras, escritas | 210 | 240 | 240 | as três regras (36 palavras) ficam 101 quadros paradas antes de sair |
  | 3. A conta | 330 | 330 | 480 | sem mudança |
  | 4. Um número, até a origem | 480 | 540 | 810 | a cena que convence: cada passo (cartão, taxas, diferença, soma, linha de origem) assenta antes do próximo; as legendas da origem ficam 71 quadros |
  | 5. O dinheiro que apareceu | 300 | 330 | 1350 | três colunas e a legenda; a legenda fica 103 quadros |
  | 6. O que sobra para a pessoa | 210 | 240 | 1680 | quatro pendências com valor e dono; a legenda fica 95 quadros |
  | 7. Fecho | 180 | 180 | 1920 | sem mudança; o pôster fica parado 75 quadros (2,5 s) depois do rodapé |

  **Aviso, não é mudança: o texto aprovado não cabe na regra de pausa do `STYLE.md` em 70 s.** Contando
  como o `STYLE.md` manda, as pausas dos grupos finais somam cerca de 2.700 quadros, mais que o filme
  inteiro; o filme que obedece à regra com este texto teria perto de 115 s. Quatro cenas também passam
  de 40 palavras na tela ao mesmo tempo: cena 1 (47, com os cartões), cena 2 (76), cena 5 (57) e
  cena 6 (52). Não reescrevi texto aprovado. Pausa exigida contra pausa dada, depois do último elemento
  assentado (quadros): cena 1, 180 / 82; cena 2, 404 / 101; cena 3, 252 / 60; cena 4,
  156 / 56 (só as legendas da origem); cena 5, 476 / 88; cena 6, 436 / 80; cena 7, 292 / 75. Para
  cumprir a regra, o Diretor precisa cortar palavras, e os maiores ganhos estão nas três regras da
  cena 2, nas notas das colunas da cena 5 e nos quatro exemplos da cena 6.

  Mudanças de encenação, com o motivo:

  - **Cena 2.** O contador "60" e o rótulo dele saem junto com as regras depois do clique, para o botão
    ficar sozinho e virar o contador da cena 3 no mesmo lugar.
  - **Cena 3.** O contador fica onde estava o botão (embaixo, à direita), como o storyboard pede, e as
    cinco faixas ficam acima dele: as partes em cima, a soma embaixo. As faixas enchem uma depois da
    outra e o contador é a soma corrida delas, então nenhum quadro mostra total menor que as partes.
    Isso contraria "enquanto conta, nada mais se move" do `STYLE.md`; escolhi assim porque o storyboard
    pede contador e faixas juntos e as duas coisas são a mesma quantidade. As três contagens ficam
    **uma embaixo da outra**, não lado a lado: o selo de 36 px com "acima do contrato ou fora da regra"
    não cabe em três colunas de 1.680 px. O texto de cada contagem vai dentro do selo do estado, e o
    total "2.463 decisões" fica como cabeçalho delas. Arquivos e faixas saem antes de o contador subir,
    para ele não passar por cima de texto.
  - **Cena 4.** A curva que passa do ponto vai no selo "Acima do contrato", 6 quadros depois de o
    número parar, não no número (o `STYLE.md` proíbe essa curva em número). "0,50 ponto" é calculado
    das duas taxas do JSON. A grade ganhou o rótulo "87 vendas assim", frase do `BRIEF.md`: sem ele,
    ninguém conta 87 pontos. A soma conta a partir de R$ 32,25, valor que já estava na tela. A grade sai
    quando a faixa da origem sobe, para o estado final ser o que o storyboard pede (soma em cima, faixa
    embaixo). A linha crua quebra em três fileiras (identificação; tipo; valores): os 14 campos a 36 px
    não cabem numa linha dentro de 1.680 px depois do mergulho. O mergulho aproxima 1,25 vez a partir
    da margem esquerda, na altura da faixa, para o alinhamento à esquerda não sair do quadro. O alerta
    da taxa aplicada é um selo pequeno no canto da célula, para não mexer na linha quando acende.
  - **Cena 5.** Os números das colunas têm 88 px, não 112: "R$ 15.396,77" a 112 px precisa de uns
    620 px, e cada coluna tem 544. O total da coluna 1 sobe da soma da Rota Global (R$ 1.546,28) até
    R$ 2.995,11 antes de as duas partes aparecerem. Em "cobrar da Orbe · R$ 1.576,23" e "contestar com a
    Ponte · R$ 1.418,88", rótulo e valor ficam em duas linhas e o "·" vira o próprio layout: a segunda
    frase não cabe em 544 px a 36 px. O "≈" é desenhado em vetor, porque a Manrope embutida não tem o
    glifo U+2248. Uma linha fina separa as colunas: três valores de natureza diferente, nunca somados.
  - **Cena 6.** As colunas da cena 5 sobem um pouco, encolhem e somem em 12 quadros. Na lista, "R$" vai
    no cabeçalho da coluna de valores e as células levam só o número; a transferência ao Meridiano
    aparece em módulo, como pedido.
  - **Stills representativos** (um por cena no momento de leitura, a cena 4 duas vezes): quadros 200,
    436, 766, 1015, 1310, 1650, 1890 e 2090. Prévia da cena 4: quadros 780 a 1365.
- **Animador, 18/10, 21:02 BRT, painel r0.** Mudanças da Parte 2, com o motivo:
  - *Duração da Reprodução: cerca de 90 s em 1x (45 s em 2x), não 75 s.* A regra de pausa do
    `STYLE.md` (`max(1500, 670 + 270 × palavras)` ms) aplicada às 15 pendências e à primeira
    divergência de cada lojista soma uns 50 s sozinha. O que não é leitura foi encurtado: varredura
    de 4 linhas por etapa, rotina em lote com contador que acelera, legendas que ficam na tela
    enquanto os totais fecham, e pausa mínima (1,5 s) para um item do mesmo tipo logo depois de
    outro (os quatro spreads negativos, a segunda divergência da Orbe).
  - *Ordem das etapas:* ler os arquivos, checkout, remessa, **notas, extratos**, pendências. É a
    ordem em que o motor emite os eventos; com um relógio só, a tela não pode inverter notas e
    extratos. "Pendências" é a recapitulação final; cada pendência entra na etapa que a gerou.
  - *Rota Global, "87 vendas":* das 87 operações acima do contrato, 83 são vendas e 4 são estornos
    com a taxa errada (`divergencias_taxa.csv`, causa "estorno de venda com taxa errada"). O painel
    diz "87 operações assim: 83 vendas e 4 estornos", e a tabela de divergências chama a coluna de
    "Operações". O total (R$ 1.546,28) e a venda de exemplo não mudam. Para o Diretor decidir se o
    filme mantém "87 vendas".
  - *Resumo:* "Notas a emitir" fica no topo da coluna da direita, acima das pendências, para a tabela
    de divergências (o primeiro clique do fluxo do pitch) caber na primeira dobra a 1280×720.
  - *Textos de tela novos* (dicionário de tela, fora dos aprovados): título e motivo de cada tipo de
    pendência, legenda de cada etapa, "Voltar ao resumo", "Modo projeção", "Passo" e os rótulos dos
    contadores. Os aprovados entram como estão.

- **Animador, 18/10, corte r1 (21:27 BRT).** Apliquei a revisão de texto do Diretor e a emenda da
  pausa em sequência. O filme tem 2.400 quadros (80,0 s, o alvo). As pausas agora saem de
  `filme/src/animation/timeline.ts`: cada grupo de leitura lista as palavras que conta, a regra do
  `STYLE.md` dá a pausa e um fator único reparte entre os grupos o que sobra do alvo depois do
  movimento. Se o texto encolher mais, o fator chega a 1 sozinho e o filme encurta.

  **Aviso: ainda não cabe.** O filme que cumpre a regra inteira, com este texto e esta encenação, tem
  2.826 quadros (94,2 s), 426 acima do alvo. Dentro de 80 s, cada grupo recebe 74% da pausa da regra.
  Todas as cenas ficam curtas na mesma proporção; o que falta em cada uma (quadros):

  | Cena | r0 | r1 | Começa | Pausa exigida | Pausa dada | Falta | Cena inteira na regra |
  |---|---|---|---|---|---|---|---|
  | 1 | 240 | 221 | 0 | 132 | 98 | 34 | 255 |
  | 2 | 240 | 235 | 221 | 148 | 110 | 38 | 273 |
  | 3 | 330 | 358 | 456 | 116 + 132 | 86 + 98 | 64 | 422 |
  | 4 | 540 | 691 | 814 | 212 + 172 | 157 + 127 | 100 | 791 |
  | 5 | 330 | 339 | 1505 | 260 | 193 | 67 | 406 |
  | 6 | 240 | 277 | 1844 | 244 | 181 | 63 | 340 |
  | 7 | 180 | 279 | 2121 | 244 | 184 | 60 | 339 |

  O excesso não vem mais das palavras: as pausas somam 1.660 quadros, cabem nos 2.400. Vem do
  movimento que o storyboard pede e o `STYLE.md` cronometra, que soma 1.166 quadros: na cena 4, 392
  (cartão, taxas, contagem, recuo, 87 pontos, contagem da soma, faixa, mergulho); na cena 3, 159
  (faixas que enchem e a divisão). Nenhuma cena passa de 40 palavras na tela. Não cortei texto nem
  evento.

  Mudanças de encenação, com o motivo:

  - **Cena 1.** Cartões só com o rótulo, uma linha, 432 px de largura. O título ocupa 8 colunas a
    partir da coluna 4, para "Oito dias úteis para fechar." (28 caracteres) caber numa linha a 72 px.
  - **Cena 2.** Uma regra só. O botão fica embaixo, alinhado ao pé da coluna de arquivos, onde a cena 3
    põe o contador.
  - **Cena 3.** As três contagens voltam a ficar **lado a lado**, como o storyboard pedia: com
    "sinalizadas", os selos cabem em três colunas. Legenda "O motor levou {duracao_s} s.", lida do JSON.
  - **Cena 4.** "{operacoes_com_divergencia} operações assim". A faixa da origem tem uma fileira: "…",
    data, estabelecimento, valor bruto, taxa aplicada, valor da taxa e "…" (células com borda
    tracejada). Cada campo é achado pelo valor no JSON; o valor da taxa é o campo igual a bruto ×
    taxa aplicada, com tolerância de um centavo. Uma observação para o Diretor, sem mudança: entre o
    estabelecimento e o valor bruto a linha tem quatro campos que não aparecem, e não há "…" ali. Com
    uma fileira, a faixa tem cerca de 1.435 px; o mergulho aproxima 1,17× (o máximo que mantém a faixa
    dentro de 1.680 px; o `STYLE.md` diz "até 1,25×").
  - **Cena 5.** Os números voltaram a 112 px: as colunas agora têm a largura do próprio conteúdo
    (rótulos em duas linhas) e sobram cerca de 186 px entre elas. A soma da Rota Global começa a deslizar 8
    quadros depois de o rótulo e o selo da cena 4 começarem a sair, para não passar por cima de texto
    que ainda some; o `STYLE.md` pede que comecem no mesmo quadro.
  - **Cena 6.** Três exemplos, sem a legenda final.
  - **Cena 7.** Rodapé novo. O pôster fica parado 184 quadros (6,1 s) depois do rodapé.
  - **Dado.** O `fechamento.json` foi regenerado de novo às 00:16:17Z, com `duracao_s` 0,07; o motor
    rodou outra vez às 00:18:30Z (0,06 no `relatorio/execucao.json`). O filme mostra o que estiver no
    JSON na hora do render. Antes da entrega, vale congelar o JSON.
  - **Stills representativos** (60% da última pausa de cada cena; a cena 4 duas vezes): quadros 166,
    381, 747, 1065, 1439, 1751, 2033 e 2390. Prévia da cena 4: quadros 784 a 1522.
- **Animador, 18/10, 22:04 BRT, painel r1** (correção local dos `findings-painel-r0.md`, com as
  decisões do Diretor):
  - *Contagem:* o contador da mesa passa a se chamar "Sinalizadas" e conta as 116 decisões com
    `peso: atencao` (115 divergências mais a nota única da Ponte). A linha da nota da Ponte leva o selo
    de exceção "Conferir o repasse", do motivo da pendência que o motor abre em seguida. "115 operações
    acima do contrato" continua onde o assunto é divergência de taxa. Em todo quadro, decisões =
    regra + sinalizadas + pessoa (2.463 = 2.332 + 116 + 15; na etapa Notas, 23 = 20 + 1 + 2).
  - *Duração da Reprodução: 138,7 s em 1x (69 s em 2x), acima dos 100 s.* Agora todo item que pausa
    respeita `max(1500, 670 + 270 × palavras)` ms contados do assentamento, contando todas as
    palavras escritas (selo, linha e complemento), sem atalho para item repetido. Onde vai o tempo
    (auditoria do relógio, `captura.json`): as 15 pendências somam 74,6 s; as três primeiras
    divergências por lojista, 16,1 s; as cinco legendas de etapa, 19,0 s; os dois "Fechando a comissão
    de cada lojista", 10,0 s; a nota da Ponte, 5,8 s; a recapitulação, 4,4 s. Por etapa: checkout 46,0 s,
    remessa 45,6 s, notas 20,8 s, extratos 16,7 s. Nenhum texto foi cortado; fica para o Diretor decidir se corta texto ou aceita
    a duração.
  - *Mergulho:* os seis elos da cadeia (contrato, Orbe, diferença na venda, operações, total, quem
    decide) com número a 28 px (35 em projeção) e rótulo a 20 px (25); o dono virou "Decide:
    Financeiro" a 20 px com ícone; o total conta a partir de R$ 32,25 e "a cobrar da Orbe" e o dono só
    aparecem quando ele para. "Uma venda" deixou de ser rótulo à parte e entrou na frase. Em projeção,
    as duas taxas ficam em linhas e a gaveta fica em 440 px; com a gaveta aberta, o Resumo (coluna
    única em projeção) abre espaço do lado dela para não cobrir a linha clicada.
  - *Resumo:* o que cada número é passa a 20 px; o filtro de dono fecha a gaveta, rola a lista para
    baixo do cabeçalho fixo e o cartão diz quantas são do dono ("12 pendências para o Financeiro
    decidir, de 15 no mês"); a transferência ao Meridiano sai com sinal (−R$ 300.000,00).
  - *Mesa:* "Fechando a comissão de cada lojista" mostra os lojistas fechando, não transações; a
    planilha de taxas aparece como "só a aba vigente, 30 de 43"; os spreads negativos e a operação
    repetida levam o lojista do cadastro e a data da operação; um contador só no fecho da comissão (a
    parte em fechamento diz "fechando…" até o total assentar).
  - *Textos novos:* "Sinalizadas", "Conferir o repasse", "Decide: <dono>", "fechando…", "notas a
    emitir" no impacto, "natureza diferente, um é estimativa: não se somam" no impacto, "Planilha de
    taxas: só a aba vigente".

- **Animador, 18/10, rodada de correção r2 (22:17 BRT).** Corrigidos os defeitos 01 a 03 e os
  achados 2, 3, 6, 7, 8, 9 e 10 de `reviews/findings-filme-r1.md`, com o texto da revisão r2 do
  Diretor. O filme tem **2.520 quadros (84,0 s)**. Cenas, em quadros: 182, 226, 377, 751, 367, 317, 300
  (começam em 0, 182, 408, 785, 1536, 1903, 2220).

  **Tempo grupo a grupo.** Saiu o fator único. Cada grupo de leitura tem em
  `filme/src/animation/timeline.ts` o "precisa" do anexo A (atualizado para o texto r2) e fica parado
  esse tempo mais 2 quadros. Medido sem perda, quadro a quadro, como o Crítico mede: nenhum grupo fica
  curto. A tabela está em `reviews/tecnico-filme-r2.md`. O tempo saiu da cena 1 (título), da cena 2 e
  das faixas da cena 3, e do movimento que não comunicava: cartão vazio, espera em "R$ 0,00", os 87
  pontos (de 46 para cerca de 18 quadros) e o enchimento das faixas (73 para 44).

  Mudanças de encenação, com o motivo:

  - **Cena 2.** O clique afunda a 0,96 e abre um anel de acento (1 a 1,35, some em 22 quadros); o
    efeito começa 6 quadros depois do clique. O "60" só aparece quando começa a contar: antes, o
    rótulo entra sozinho, para nenhum quadro dizer "0 respostas…".
  - **Cena 2 para 3.** O botão encolhe até a caixa do "0" e vira o contador; o rótulo dele sai antes,
    para não aparecer cortado.
  - **Cena 3.** Quatro faixas por etapa (`eventos.por_etapa`): Checkout, Remessa, Notas e Extratos. As
    linhas dos sete cartões convergem num feixe único, que chega às faixas por um barramento, sem casar
    arquivo com faixa. Só o contador principal conta, como soma das barras; o total de cada faixa
    aparece quando a barra dela fica cheia. Nas contagens, "116" e "15" (e "2.332") usam algarismos
    proporcionais, e "feitas pela regra" ficou sem fundo, com cor só no ícone e na palavra.
  - **Cena 3 para 4.** O "116" não apaga mais: o cartão cresce a partir da caixa do número e o leva
    para dentro, até a linha do valor, onde ele dá lugar ao conteúdo do cartão. Nenhum quadro mostra o
    cartão vazio.
  - **Cena 4, diferença.** "a mais nesta venda" entra primeiro; o número aparece quando começa a
    contar e conta 6 quadros depois de o rótulo assentar. Nenhum quadro parado mostra "R$ 0,00".
  - **Cena 4, recuo.** O "R$ 32,25" viaja até o lugar da soma junto com "a mais nesta venda". Depois
    de "87 operações assim" (agora 44 px, tinta), o rótulo troca para "a cobrar da Orbe · Rota Global",
    com 3 quadros de sobreposição, e a soma conta 6 quadros depois. Restam 6 quadros, a espera mínima
    do `STYLE.md` entre rótulo e contagem, em que "R$ 32,25" aparece com o rótulo novo antes de começar
    a subir. O estado completo (soma, rótulo, selo, grade e "87 operações assim") fica parado 63
    quadros. A faixa da origem só sobe depois de a grade sair, para não passar por cima dela.
  - **Cena 4, origem.** Uma célula "…" estreita em cada vão de campos omitidos (antes, entre e
    depois). A faixa ficou mais larga e o mergulho caiu para cerca de 1,11×, o máximo que a mantém
    dentro de 1.680 px.
  - **Cena 5.** A coluna 1 ganhou "Orbe e Ponte" na segunda linha. Ao subir de R$ 1.546,28 para
    R$ 2.995,11, a contagem espera os mesmos 6 quadros depois do rótulo.
  - **Cena 6.** Exemplos novos: "Cobrar da Orbe · Rota Global", "Devolver à Casa do Estudante", "Pix
    recebido sem identificação".
  - **Cena 7.** "Fechamento de setembro · Tarvo" no papel Destaque (56 px, 600, tinta).
  - **Stills representativos** (um por grupo de leitura final de cada cena; a cena 4 três vezes:
    diferença, recuo completo, origem): quadros 150, 331, 700, 1042, 1281, 1479, 1807, 2124 e 2510.
    Prévia da cena 4: quadros 755 a 1551.
  - **Microcorreção r2b (22:22 BRT).** Pela emenda do Diretor ao "Contador" do `STYLE.md`, a soma da
    cena 4 e o total da coluna 1 da cena 5 começam a contar no quadro em que o rótulo novo começa a
    entrar; somem os seis quadros de frase falsa. A cena 4 passa a 730 quadros e o filme a 2.499
    (83,3 s); o tempo parado de cada grupo não mudou. Novos quadros dos stills: 150, 331, 700, 1042,
    1260, 1458, 1786, 2103 e 2489; prévia da cena 4: 755 a 1530.
- **Animador, 18/10, acabamento r3 e entrega (22:59 BRT).** Depois do Crítico r2 (PASSA), só o pedido:
  na transição 2–3, o rótulo do botão some antes de a caixa mudar e o "0" aparece enquanto o
  preenchimento some (bloco vazio por 1 quadro); na 3–4, o cartão só cresce com o "2.332" abaixo de
  20% e o "116" some antes de o nome do lojista entrar; a legenda da origem é a do Diretor ("…: a venda
  de 12/09, como chegou."), e o grupo 4c passa a 164 quadros parados; "a mais nesta venda" fica 6
  quadros sozinho antes de o número contar. Duração final: 2.520 quadros (84,0 s); cenas 182, 226, 369,
  759, 367, 317, 300. Render de entrega em `out/final/` com os dados congelados.
- **Animador, 19/10, painel r2 (00:03 BRT).** Correção local dos `reviews/findings-painel-r1.md` com a
  decisão do Diretor: a seção 5 inteira, os três defeitos pela menor correção do Crítico e os achados 2
  a 12. Evidência em `reviews/tecnico-painel-r2.md`; telas da r1 guardadas em `out/previews/painel-r1/`.

  *Duração da Reprodução: 100,5 s em 1x (50,4 s em 2x, medidos na parede), antes 138,7 s.* Nenhuma
  etapa, evento ou exceção saiu, e toda pausa continua `max(1500, 670 + 270 × palavras)` ms depois de
  assentar, com uma exceção que o Diretor decidiu (a Bridge, abaixo). Por etapa: ler os arquivos 4,7 s;
  checkout 33,2 s (antes 46,0); remessa 30,6 s (45,6); notas 12,6 s (20,8); extratos 14,6 s (16,7);
  recapitulação 4,4 s. Ficaram como estavam: a leitura dos arquivos (4,7 s), a primeira exceção da Rota
  Global (5,6 s), o primeiro "Fechando a comissão de cada lojista" (5,0 s) e a recapitulação (4,4 s).

  | Mudança de duração (seção 5) | Antes | Agora | Motivo |
  |---|---|---|---|
  | Pendência em uma linha: selo do dono, título curto, valor | 4,2 a 6,5 s cada | 3,1 a 4,4 s cada | o motivo completo fica no Resumo e na gaveta |
  | Pendências do mesmo tipo em sequência viram um grupo: atraso de lista de 160 ms e uma pausa, contada do último item, com as palavras do grupo todo | quatro spreads, 18,0 s; Rota Global e Bridge, 12,2 s | spreads, 7,7 s; "Cobrar da Orbe" (Rota Global e Bridge), 4,8 s | a regra vale para qualquer tipo repetido em sequência; além dos spreads, pegou as duas cobranças da Orbe, que vêm uma atrás da outra. A rotina que o motor decide entre dois itens do grupo só conta e cabe no atraso de lista |
  | Nota da Ponte numa batida só | nota sinalizada 5,8 s e pendência 5,2 s, com a mesma frase | 4,4 s, "Conferir o crédito da Ponte contra a nota · R$ 39.543,45" | a nota sinalizada seguida da pendência que ela abre vira uma linha; a nota continua contada em "Sinalizadas" |
  | Bridge na pausa mínima | 5,3 s | 2,0 s (entrada de 0,5 s mais 1,5 s) | repete o padrão da Rota Global; é a única pausa abaixo da regra de palavras, por decisão do Diretor |

  *Textos novos da Reprodução* (dicionário de tela): o título curto de cada pendência ("Cobrar da Orbe ·
  Rota Global", "Devolver à Casa do Estudante", "Confirmar a taxa da Atlas Idiomas", "Operação repetida ·
  Bagagem Livre", "Spread negativo · Ponte Aérea", "Contestar com a Ponte · Mundo Aberto", "Casa do
  Estudante sem nota", "Conferir o crédito da Ponte contra a nota", "Pix recebido sem identificação",
  "Repasse devolvido · Mundo Aberto", "Transferência para o Meridiano, em trânsito"); os cabeçalhos de
  grupo "Cobrar da Orbe" e "Spread negativo na remessa: contestar"; "fechando… (k de N lojistas)".

  Defeitos:
  - *01, parcial vira total ao pausar.* O "fechando…" vem do estado (há lojista da frente ainda aberto),
    não da animação. Pausado no meio do fecho, em 1x ou 2x, o cartão diz "checkout fechando… (6 de 21
    lojistas)" ou "nada fechado ainda". A soma continua subindo pelos lojistas enquanto toca; o passo a
    passo reduzido e os finais não mudaram. Enquanto a soma corrida é zero ou negativa (a Casa do
    Estudante fecha primeiro, −R$ 5,50), o número do cartão diz "fechando…" (achado 6), e um negativo sai
    como −R$, não R$ −.
  - *02, projeção trunca.* Cada coluna da mesa tem a largura do maior valor e do cabeçalho da fonte,
    medidos no navegador no tamanho da tela: nenhuma reticência em número nem em cabeçalho. Em projeção,
    mesa e impacto ficam lado a lado, com 5 linhas na mesa; o selo do motor quebra em duas linhas
    ("Decide: / Financeiro") e o nome da linha também. Em tela baixa (1280×720), a projeção fica compacta
    para caber: a mesa perde a legenda "Mesa de trabalho…" (as abas dizem o que ela é) e usa o nome curto
    das abas ("Ponte", "Plano"); o impacto põe comissão e notas lado a lado e o dinheiro em jogo numa
    linha inteira, e o cartão de donos vai para o cabeçalho de "Decisões que importam" ("4 pendências:
    Financeiro 2 · Comercial 2"). A linha do motor fica com 25 px em projeção, como na r1. A coluna de
    spread da Ponte mostra as quatro casas que o arquivo traz (1,5007%), com a vírgula alinhada.
  - *03, Mundo Aberto.* O número de cima é a base do spread: "R$ 9.830,65", "CAD 2.438,46 à PTAX
    4,0315", e R$ 9.978,18 vem como "Valor pago pelo cliente" (no primeiro passo e na linha do arquivo,
    que dizia "Valor em reais"). As taxas saem na precisão do motor ("A Ponte aplicou 1,5007%", "0,3007
    ponto acima do contrato"), e a conta fecha na tela: 9.830,65 × 0,3007% = 29,56. A base é Valor ME ×
    PTAX Ref. da linha 10 do anexo da Ponte, o mesmo produto da regra F15/F95 do motor. Ela não está no
    `fechamento.json` nem em `saida/`, então a tela a calcula da linha de origem e nunca a digita. Na
    Reprodução, a linha do motor diz "Ponte aplicou 1,5007% sobre R$ 9.830,65; contrato 1,20%." pelo
    mesmo motivo (a mesa mostra os R$ 9.978,18 do arquivo). "Uma remessa contratada em" virou "Uma
    remessa de", para a cadeia caber até o dono sem rolar em projeção a 1280×720.

  Achados:
  - *2 e 10.* Um selo de dono só, "Decide: <área>", em todo lugar (Resumo, Reprodução, mesa, impacto,
    gaveta, filtro). Com filtro, o cartão diz "12 pendências de 15 no mês" com o selo "Decide:
    Financeiro". Acabou "Para o Tesouraria decidir".
  - *3.* O total da gaveta começa a contar no quadro em que o rótulo ("a cobrar da Orbe") começa a
    entrar; só o dono espera a contagem parar.
  - *4.* O filtro só rola a página se a linha "N pendências…" ou o primeiro item estiver fora da tela; se
    rola, para com essa linha logo abaixo do cabeçalho fixo.
  - *5, 6.* Ver a nota da Ponte e o defeito 01, acima.
  - *7.* Nas Notas, valor e quantidade mudam no mesmo quadro: um contador só.
  - *8.* "São valores de natureza diferente…" e a explicação das notas no Resumo a 17 px (texto corrido).
  - *9.* Gaveta Mundo Aberto: os rótulos das taxas são "Contrato" e "A Ponte aplicou", sem quebra, e os
    números alinham embaixo; "CAD 2.438,46" e "PTAX 4,0315" com espaço inseparável; percentual negativo
    com U+2212.
  - *11.* "O motor anotou" e "Pendência", no Rastro técnico, saem em formato brasileiro ("4,09%",
    "R$ 1.545,86"); linha nova "Ressarcimento ao lojista": "R$ 1.545,86: o que a Orbe descontou de fato,
    linha a linha. A cobrança à Orbe sai da fórmula do contrato: R$ 1.546,28." (os dois valores vêm do
    motor). A linha original do arquivo continua como chegou.
  - *12.* "Por que as notas somam R$ 5,50 a mais que a comissão"; o spread negativo virou "Spread
    negativo na remessa · Ponte Aérea", com "contestar com a Ponte Câmbio" no detalhe.
- **Animador, 19/10, painel r3 (acabamento) (01:50 BRT).** Depois do Crítico r2 (PASSA), só o que o
  Diretor pediu: os três defeitos e os achados 1 e 2 de `reviews/findings-painel-r2.md`, pela menor
  correção. Evidência em `reviews/tecnico-painel-r3.md`; telas da r2 guardadas em `out/previews/painel-r2/`.
  O Resumo, as gavetas e o filtro não mudaram (as três telas do deck saem iguais às da r2).

  *Duração da Reprodução: 102,5 s em 1x (51,4 s em 2x, na parede), antes 100,5 s.* Notas 14,2 s (antes
  12,6): a pausa da Casa do Estudante agora termina antes da varredura (defeito 02), e a varredura das quatro
  notas (1,6 s) deixou de correr por baixo dela. Extratos 15,0 s (antes 14,6): a mesa volta à Aurora 0,4 s
  antes do Pix (achado 1). Nenhuma pausa encurtou; a Casa continua 3,0 s parada.

  - *Defeito 01.* Enquanto há nota da etapa por gerar, o cartão "Notas a emitir" diz "emitindo… (k de 21
    notas)" sob a soma exata das k primeiras; na última nota volta a "21 notas a emitir". Um contador só
    (valor e quantidade no mesmo quadro); o passo a passo reduzido não tem estado intermediário de notas e
    não mudou. Ao vivo, sem o total, diz "emitindo…" até a etapa acabar.
  - *Defeito 02.* Das duas saídas do Crítico, a segunda: a pausa da Casa termina antes de a varredura
    começar. A primeira (varredura antes da Casa, durante a legenda) mostraria as decisões 2 a 5 antes da
    decisão 1, e a ordem dos eventos do motor é para preservar. Regra geral: uma linha sobre uma linha da mesa
    (pendência, exceção, sinalizada) segura o olhar nessa linha a pausa inteira; só acontece nas Notas.
  - *Defeito 03.* Na projeção compacta (1280×720), a linha com o olhar mostra o texto inteiro, em até três
    linhas a 19 px, sem "…" e sem palavra quebrada: nome de lojista ou cliente quebra na própria coluna; a
    linha de extrato espalha o texto pela coluna da data, embaixo da data (a coluna "Lançamento" tem 122 px e
    "TRANSF ENTRE CONTAS P/ BCO MERIDIANO AG 0091 CC 90233-5" pede 3 linhas em 233 px). O espaço da linha
    mais alta que o olhar abre em cada arquivo fica reservado embaixo da tabela, para a linha do motor e a
    contagem não pularem enquanto o olhar anda. Para caber, na projeção compacta o cabeçalho da tabela foi de
    36 para 32 px e o espaço entre os blocos da mesa de 8 para 6 px. Números inteiros, mesa e impacto lado a
    lado, 5 linhas e selo em duas linhas preservados.
  - *Achado 1.* Antes de uma linha narrada, se um lote deixou outra aba de arquivo na mesa (o Meridiano antes
    do Pix), o olhar volta à aba e à linha do item (0,4 s, um passo do olhar) e só então o item entra na mesa
    e no impacto. E, em toda linha narrada que move a mesa para outro arquivo ou outra janela, a mesa corta
    sem esmaecer e o olhar salta junto: nenhum quadro mostra a mesa vazia com o impacto já reagindo (na r2
    eram 15 batidas assim; o Crítico viu a do Pix). Os movimentos que não são narrados mantêm o
    esmaecimento.
  - *Achado 2.* Na aba da Ponte, a coluna de valor da mesa se chama "Pago (R$)": é o que o cliente pagou, e a
    linha do motor diz "sobre R$ 9.830,65", a base do spread. Escolhido em vez de "(CAD à PTAX)" na linha do
    motor porque não muda o relógio nem alonga a linha mais longa da projeção compacta.

  *Textos novos* (dicionário de tela): "emitindo… (k de N notas)", "Pago (R$)".

- **Diretor, 19/10, 01:55 BRT, conferência do acabamento r3 do painel.** Conferidos os quadros que o
  Crítico r2 pediu em "CONFERIR DE NOVO": cartão de notas com "emitindo… (4 de 21 notas)"
  (`r3-notas-1x-como-o-critico-a-4-notas-77633ms.png`); pausa da Casa com o olhar na linha dela e
  "nenhuma nota ainda" (`r3-notas-1x-pausa-da-casa-0-notas-74970ms.png`); transferência ao Meridiano
  inteira na linha focada em projeção a 1280 (`r3-proj1280-extratos-transferencia.png`); "Pago (R$)"
  na aba da Ponte (`r3-proj1280-remessa-mundo-aberto.png`). Hashes do congelado: OK, salvo o
  `painel.html`. Aceitas as escolhas do Animador: a pausa da Casa termina antes da varredura (respeita
  a ordem dos eventos do motor; a reprodução vai a 102,5 s em 1x e 51,4 s em 2x); a troca de aba sem
  esmaecer em todas as batidas, não só no Pix; "Pago (R$)" no cabeçalho; cabeçalho de 32 px e espaço
  reservado na projeção compacta. **Resíduo registrado, sem nova rodada:** na Remessa em projeção a
  1280, a linha focada da Mundo Aberto chega ao limite de 3 linhas e corta o nome em "INTERCÂ", sem
  reticência. Fica para o Fernando decidir se vale outra passada. O painel desta versão é o v5 da
  entrega.

- **Diretor, 19/10, 22:35 BRT, painel r4 (refino depois da entrega).** O motor do `refino/motor`
  (PR 1) passou a emitir pronto tudo o que o v5 somava, contava ou tirava do texto: campos e
  `parcial` em `src/CONTRATO_EVENTOS.md`. Quatro mudanças, nesta ordem de prioridade.

  1. **Todo número da tela sai de um campo do motor.** A página formata (R$, vírgula, milhar, o
     "mil" que o motor já arredondou, o nome do mês pela competência) e não soma, não subtrai, não
     multiplica, não conta eventos e não tira número de texto com expressão regular. Mapa, conta a
     conta: comissão e partes em `fim.resumo` e, corridas, no `total` lojista (`parcial.frente`,
     `parcial.mes.comissao`); dinheiro em jogo em `resumo` e, corrido, em
     `pendencia.parcial.mes.em_jogo`; grupo de divergência pela `pendencia` da divergência e por
     `parcial.grupo` (sai a heurística que casava grupo e pendência); base do spread em `base`; Atlas
     em `estimativa`, `n_linhas` e `por_tipo`; ressarcimento ao lojista em `ressarcimento`; linhas e
     operações em `n_linhas`; contagens da mesa e barra de progresso em `parcial.etapa`; "fechando…
     (k de N lojistas)" e "emitindo… (k de N notas)" em `parcial.frente`; pendências e donos corridos
     em `parcial.mes`; "Feito pela regra" em `resumo.decisoes_por_etapa`; lojista sem nota em
     `emite_nota`; "notas somam R$ 5,50 a mais" em `notas_menos_comissao`; tipo da pendência em
     `tipo_pendencia`; mês e mês seguinte em `competencia` e `competencia_seguinte`. Ao vivo, a página
     vive só dos eventos (o `/dados` traz `saida: null` durante a rodada). Número que a tela mostra e
     o motor não emite não é calculado: o Animador tira da tela ou avisa o Diretor, que decide entre
     campo novo no motor (com a diferença declarada na regressão) e texto sem o número.
  2. **Faixa de origem embaixo da tabela de divergências**, empréstimo da versão refinada
     (`retro/telas/fim-3-refinada.jpg`). Visível sem clicar, para o primeiro grupo da tabela (Rota
     Global). Título "Origem · Rota Global Intercâmbio" e quatro elos, da esquerda para a direita:
     "Contrato 3,59%", "A Orbe cobrou 4,09%", "R$ 32,25 a mais nesta venda" com "0,50 ponto", e, em
     destaque, "87 operações · R$ 1.546,28 a cobrar da Orbe" com "Decide: Financeiro". A venda de
     exemplo é a mesma da gaveta. Sem identificador, código de regra ou nome de arquivo (ficam no
     Rastro técnico) e sem glifo de seta: a ordem vem do layout, e um conector, se houver, é desenhado
     em vetor. O clique na faixa abre a gaveta da Rota Global, como a linha da tabela. Fontes: as
     taxas e `diferenca_pp` da divergência de exemplo, o `valor` dela, `parcial.grupo.n` e o `valor`
     da pendência.
  3. **Pendências em uma linha cada no Resumo**, empréstimo da refinada: título curto, valor e selo
     "Decide: <área>" na mesma linha. O motivo e o complemento (operações, data, crédito previsto)
     saem da lista e ficam na gaveta, que abre no clique da linha. Os títulos curtos são os do
     dicionário da Reprodução (r2). Filtro por dono e contagem ficam como estão. Se um título não
     couber numa linha em alguma tela (1440, 1280, projeção), o Animador avisa; nunca corta com "…".
  4. **Resíduo "INTERCÂ"** (conferência do Diretor de 19/10, 01:55): na Remessa em projeção a 1280, a
     linha focada da Mundo Aberto mostra o nome inteiro, sem corte nem reticência, e a linha do motor
     e a contagem não pulam.

  **Restos do inventário, decididos.**
  - "e mais N" (total menos o corte da página) vira "{mostradas} de {n}", por exemplo "10 de 87
    operações", com o `n` do motor (`n_linhas` ou `parcial.grupo.n`): a página diz quantas mostra e não
    subtrai.
  - Spread em % das linhas da Ponte sem divergência e datas seriais do Excel: a conversão sai da
    página e vai para a exportação de origem do `painel.py` (Python, com teste), que passa a entregar,
    junto da linha como chegou, o spread em % (como a planilha o mostra) e a data em ISO. A página só
    formata. As células da linha "como chegou" continuam as do arquivo.
  - Nome do lojista pelo cadastro: é busca, não conta; fica.
  - "crédito previsto para 06/10": a página para de tirar a data do motivo; a gaveta mostra o motivo
    do motor como ele vem.
  - Nenhum outro texto aprovado muda, além dos títulos curtos na lista do Resumo e do "{k} de {n}".

  **Evidência pedida.** Capturas de "Momentos para o Engenheiro de render capturar", mais: Resumo com a
  faixa e a lista em uma linha (1440 e 1280), gaveta de uma pendência aberta pela lista, projeção a
  1280 na Mundo Aberto e o modo ao vivo. Relatório técnico em `reviews/tecnico-painel-r4.md`, com cada
  conta trocada (função antiga e campo novo) e a busca que mostra que não sobrou soma, contagem nem
  expressão regular de número na página. Depois, Crítico r4 em contexto novo.

- **Animador, 19/10, painel r4 (23:26 BRT).** A ordem do Diretor de 22:35, na ordem de prioridade dele. Evidência em
  `reviews/tecnico-painel-r4.md`; telas em `out/previews/painel-r4/`, folha em `reviews/contact-sheets/painel-r4.png`.

  *Duração da Reprodução: 103,8 s em 1x (52,0 s em 2x, na parede), antes 102,5 s e 51,4 s.* As mesmas 22 linhas
  narradas, com as mesmas palavras e na mesma ordem; nenhuma pausa abaixo da regra (a Bridge segue na pausa mínima,
  por decisão do Diretor). O 1,3 s a mais vem do motor refinado: ele lê os sete arquivos na etapa 1 (antes, Aurora e
  Meridiano chegavam na etapa dos extratos), e a leitura dos arquivos foi de 4,7 s para 6,2 s; como a variação com
  semente fixa (até 8% acima da regra) é sorteada na ordem dos eventos, os dois eventos a mais deslocam os sorteios
  seguintes, e cada pausa muda alguns décimos para cima ou para baixo, sempre acima da regra. Por etapa:
  leitura 6,2 s; checkout 33,1 s; remessa 30,8 s; notas 14,1 s; extratos 14,8 s; recapitulação 4,4 s. Os totais de
  frente que o motor agora emite entram no relógio sem duração.

  1. *Todo número da tela sai de um campo do motor.* Resumo, gavetas, mesa, impacto e ao vivo leem o `resumo` do fim,
     os `parcial` por escopo e os campos de cada evento; a página formata. As 45 linhas do inventário foram trocadas
     (tabela no relatório técnico). O grupo de divergência é o da pendência que o motor nomeia (`pendencia`), sem a
     heurística. A conta antiga somava os totais de frente como se fossem lojistas: com os eventos novos, o v5
     mostrava R$ 486.557,58 de comissão. Ao vivo, a mesa passa a dizer "de N decisões" desde a primeira decisão, com o
     `n` do motor. Ficam na página, declaradas no relatório: a animação do contador entre dois valores do motor
     (`STYLE.md`, "Contador"); a reescrita em pt-BR dos números da nota do motor no Rastro técnico (achado 11, r2);
     contas de relógio e de layout, que nunca vão à tela; e o zero do estado vazio.
  2. *Faixa de origem* embaixo da tabela de divergências, para o primeiro grupo (Rota Global): título
     "Origem · Rota Global Intercâmbio" e quatro elos, "Contrato 3,59%", "A Orbe cobrou 4,09%" (com o ícone de
     crítico), "R$ 32,25 a mais nesta venda" com "0,50 ponto" e, em destaque pelo tamanho e pela superfície 2,
     "87 operações · R$ 1.546,28 a cobrar da Orbe" com "Decide: Financeiro". Conector em vetor, sem glifo; sem
     identificador. O clique abre a gaveta da Rota Global e seleciona a linha dela na tabela. O título tira o "Ltda"
     do nome, como no texto do Diretor; a tabela continua com o nome do cadastro.
  3. *Pendências em uma linha cada*: título curto do dicionário da Reprodução, valor e selo "Decide: <área>". A coluna
     do selo tem a largura do maior selo, e os valores terminam na mesma borda; o título fica a 15 px (tabela), e o
     ícone de pessoa do começo da linha saiu (o selo já o traz). O complemento (operações, data, o que conferir) foi
     para a gaveta, embaixo do valor. **Aviso, como o Diretor pediu:** nem todo título cabe numa linha com valor e selo
     na coluna da direita. A 1440, quebram 3: "Contestar com a Ponte · Mundo Aberto", "Conferir o crédito da Ponte
     contra a nota", "Transferência para o Meridiano, em trânsito". A 1280, quebram 10. Em projeção (1440 e 1280),
     nenhum. Quem quebra vai para duas linhas na própria coluna, sem "…", e o nome depois do "·" não se separa.
  4. *Resíduo "INTERCÂ": não é corte da página.* A célula "Cliente" do anexo da Ponte vem com 20 caracteres em todas
     as linhas ("MUNDO ABERTO INTERCÂ", "MAPLE STUDY ASSESSOR", "NÓRDICA EDUCAÇÃO INT"), e a linha focada da projeção
     a 1280 já mostra a célula inteira, em 3 linhas, sem reticência; a contagem fica 5 px acima da legenda, como na r3.
     Não troquei a fonte da coluna. Para o Diretor decidir: manter a célula como chegou, ou mostrar na coluna "Cliente"
     da mesa o nome do cadastro ("Mundo Aberto") e deixar a célula crua na gaveta.
  5. *Restos do inventário.* "{mostradas} de {n}" no lugar de "e mais N" ("10 de 87 operações", "6 de 118 linhas",
     "8 de 119 linhas", "12 de 85 lançamentos"); spread em pontos e datas ISO entregues pelo `painel.py` junto da
     linha como chegou (teste em `tests/test_painel.py`); a gaveta da Ponte mostra o motivo do motor como vem (com o
     "06/10") no Rastro técnico.

  *Textos novos:* "Origem · <lojista>" e os rótulos da faixa ("Contrato", "A Orbe cobrou", "a mais nesta venda",
  "a cobrar da Orbe", "<n> operações"); "{k} de {n} <unidade>"; na gaveta da pendência, o complemento com inicial
  maiúscula ("Nota única de remessa."); ao vivo, antes do motor, o título "Fechamento · Tarvo" (o mês só aparece
  quando o motor diz a competência).
