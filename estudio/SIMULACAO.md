# Simulação: o estúdio desde sempre no case Tarvo

Diretor, 18/10/2026. Pergunta do Fernando: e se o estúdio do artigo "Motion Engineering: One Bot, Five
Departments, an Entire Studio" (@0xjmori) existisse desde a preparação do case? Este arquivo põe cada
peça do estúdio no momento do case real em que ela teria nascido, com o tempo que ela levou de fato
quando o estúdio rodou em 18/10, e reconstrói os portões de aprovação a partir das escolhas que o
Fernando fez em 17/10.

Fontes: linha do tempo de `desafio-barte/retro-desafio-template.md` (seção 3); escolhas e horários de
`desafio-barte/decisoes-pendentes.md` e do roteiro do pitch; tempos do estúdio medidos na sessão de
18/10 (relógio de Brasília, começo às ~18h45); decisões D44 a D47 do Fernando (18/10, de manhã).

## A premissa que sustenta a simulação

O estúdio não acelera o motor; ele acelera o olhar. A simulação só fecha se o motor rodar de ponta a
ponta cedo, como pede a **D44 A** (construtor aberto na liberação, com esqueleto, contrato de eventos e
uma tela com dados de exemplo) e como o relógio do template já dizia (núcleo rodando às 12h30). No dia
real o motor entrou às 17h59. Com ele às 17h59, o estúdio inteiro não cabe antes da entrega das 18h30:
sobram 31 minutos para um render final, e nenhum Crítico confere os números. A seção "Se o motor
tivesse saído às 17h59" diz o que daria para salvar.

## Linha do tempo simulada

| Momento do case real | Peça do estúdio | Departamento | Tempo medido em 18/10 | Portão ou dado de que depende |
|---|---|---|---|---|
| Preparação (10 a 16/10) | `CLAUDE.md` do estúdio e `reviews/CRITICO.md` | permanentes, vêm do template | já existem | nenhum |
| Preparação (10 a 16/10) | `STYLE.md`, com `referencias/` medidas e `proposta-estilo.html` | Diretor de arte | 51 min | **portão de estilo** |
| Liberação, 16/10 19h39 | `BRIEF.md` e `STORYBOARD.md` | Diretor | ~25 min | instruções oficiais; **portão de história** |
| Liberação, 16/10 19h39 | `scripts/extrair_dados.py`, escrito contra os nomes de campo do contrato | Diretor | dentro dos ~25 min | contrato de eventos (D44 A) |
| 17/10, manhã (motor de ponta a ponta) | primeiro `dados/fechamento.json` | script, segundos | 0,06 s de motor | o motor rodando |
| 17/10, ~13h30 | filme r0 e painel r0, em paralelo | Animador e Engenheiro de render | 52 min e 70 min | contrato de eventos e `fechamento.json` |
| 17/10, ~14h25 a 16h10 | filme: revisão de texto r1, Crítico r1, r2, Crítico r2 (PASSA) | Diretor, Animador, Crítico | 23 + 19 + 32 + 20 min | rodadas |
| 17/10, ~14h40 a ~18h00 | painel: Crítico r0, r1, Crítico r1, r2, Crítico r2 (PASSA) | Animador, Crítico | 20 + 45 + 36 + 58 + 43 min | rodadas |
| 17/10, ~16h10 | pôsteres do filme no deck | Diretor | minutos | filme aprovado |
| 17/10, 17h30 (congelamento interno) | render final do filme e painel regenerado com os dados congelados | Engenheiro de render | 15 min (filme); segundos (painel) | motor congelado; hashes |
| 17/10, 18h30 | entrega | | | **portão de publicação** |
| 17/10, 18h33 a 18h57 no real | deck dos pôsteres, já montado desde o gate do meio-dia (D50 A) | Diretor | ver "Deck" | pôsteres e telas aprovadas |

A soma do caminho do filme (r0 até o render final) é 161 min: começando às 13h30, o filme fica pronto
por volta das 16h10, antes do congelamento. **O painel não cabe.** O caminho dele, do r0 ao Crítico r2
que passou, é 272 min: começando às 13h30, o Crítico aprova por volta das 18h00, meia hora depois do
congelamento interno, e o acabamento (59 min) só termina perto das 19h00, depois da entrega das 18h30. O painel é o
caminho mais longo do estúdio, porque é a peça com mais estados para olhar (Resumo, reprodução em
duas velocidades, pausa, projeção, gavetas). Na simulação, ele precisa começar de manhã, contra os
eventos de exemplo do contrato que a D44 A põe no ar na liberação (ver "Painel, rodada r2").

## Cada peça no seu momento

### Preparação: o `STYLE.md`

O estilo é a única peça que não depende do case. Ele mede referências (a cena "Uma política, de ponta
a ponta" do barte.com/ai-services e os cases Buser e Comp), fixa a paleta e a fonte e transforma
"parecer Barte sem copiar a Barte" em números: tamanho mínimo para a última fileira a 6 m, pausa de
leitura por palavra, curvas e durações. No real, a pesquisa da paleta saiu em 17/10 às 15h15, a
prévia num canvas às 16h15 e a aprovação às 16h30, uma hora e meia antes do primeiro commit. Na
simulação, as três coisas vão para a preparação, junto com a vitrine `design-system-barte/`, que já
existia desde 10 e 12/10.

**Portão de estilo**, reconstruído: "gostei de como ficou a prévia" (17/10, 16h30), paleta Ameixa com
Manrope, tema claro como principal, nada da identidade da Barte. O restante do `STYLE.md` (pesos,
tamanhos, estados, pausa de leitura) foi decisão do Diretor para o Fernando vetar.

### Liberação: `BRIEF.md`, `STORYBOARD.md` e o extrator de dados

O brief e o storyboard não precisam dos números: o storyboard chama cada valor pelo nome do campo
(`{duracao_s}`, `{operacoes_com_divergencia}`, `{total_a_cobrar_brl}`), e o extrator gera o
`fechamento.json` do que o motor gravar. Com o contrato de eventos da D44 A, os dois nascem na noite
da liberação. No real, nessa noite o Fernando pediu para a IA esperar o OK dele até ler o case
(16/10, 23h44); às 17h04 do dia seguinte ele ainda não tinha lido os materiais oficiais.

**Portão de história**, reconstruído das escolhas de 17/10: a demo em duas frentes, com ritmo
intencional (13h26); "≈ R$ 7,9 mil em taxa da Atlas" em vez do bruto (18h52); a abertura do pitch,
não somar os R$ 26,3 mil e o pedido final (19h15). No real, a última delas saiu 15 minutos antes do
pitch. O estúdio obriga o contrário: o `BRIEF.md` não fecha sem a mensagem central, então essas
escolhas sobem para a manhã de 17/10. O custo é real: o portão de história pede que o dono tenha lido
o case até lá.

O extrator é onde nasce o primeiro achado de número. Ao montar o `extrair_dados.py`, o Diretor viu que
"57 vendas da Atlas" eram 57 lançamentos (49 vendas, mais antecipações, reversões e estorno) e que
"a Atlas vendeu R$ 262 mil" estava errado (as vendas somam R$ 135.428,90). Na simulação, isso aparece
na primeira rodada do motor, de manhã, antes de o roteiro do pitch ser escrito (18h a 19h no real).

### Começo da tarde: os Animadores

O filme e o painel começam juntos, contra o contrato de eventos e o primeiro `fechamento.json`.
Medido em 18/10: filme r0 em 52 min, painel r0 em 70 min. Dois achados saem desse trabalho, e os dois
teriam chegado antes do pitch:

- **"87 vendas" da Rota Global** são 83 vendas e 4 estornos com a taxa errada (o total de
  R$ 1.546,28 não muda). Achado pelo Animador do painel ao ligar a tela aos CSVs.
- **A frente "PENDENCIAS" do motor** é ordem de emissão, não categoria; o `fechamento.json` passou a
  ter `por_etapa` (1.996 · 257 · 23 · 187). Achado pelos dois Críticos.

O indicador que caía de R$ 93.099,50 para R$ 7.703,98 no meio da rodada do dia real (contrato sem o
escopo do total, causa 5 do retro) é o tipo de defeito que a regra "número parcial que contradiz o
final" e o Crítico r0 pegam na primeira olhada.

### A tarde: o Crítico em loop

Cada rodada é um Crítico em contexto novo, que não lê o código e olha só o que foi renderizado, com
notas de 1 a 10 e três defeitos com quadro, menor correção e o que preservar. Rodadas medidas:

| Peça | Rodada | Tempo | Veredito |
|---|---|---|---|
| Filme | r0 (Animador) | 52 min | |
| Filme | revisão de texto r1 e corte r1 | 23 min | |
| Filme | Crítico r1 | 19 min | NÃO PASSA |
| Filme | r2 e r2b | 28 + 4 min | |
| Filme | Crítico r2 | 20 min | PASSA, notas 7 a 9 |
| Filme | r3 (acabamento) e render final | 15 min | conferido pelo Diretor |
| Painel | r0 (Animador) | 70 min | |
| Painel | Crítico r0 | 20 min | NÃO PASSA |
| Painel | r1 | 45 min | |
| Painel | Crítico r1 | 36 min | NÃO PASSA (timing 6) |
| Painel | r2 | 58 min | |
| Painel | Crítico r2 | 43 min | PASSA, notas 7 a 8 |
| Painel | r3 (acabamento) | 59 min | conferido pelo Diretor |

O quarto achado de número sai daqui: o Crítico r1 do painel refez a conta da Mundo Aberto e viu que o
spread da Ponte incide sobre CAD × PTAX (R$ 9.830,65), não sobre o valor pago pelo cliente
(R$ 9.978,18). O total a contestar (R$ 1.418,88) não muda; muda o que a gaveta mostra, para a conta
fechar de cabeça.

No real, a tela entregue não teve nenhum olhar antes da entrega: o primeiro teste num navegador foi
às 18h40. Na simulação, o painel teria passado por três Críticos independentes antes da entrega, e o
filme por dois.

### Congelamento: render final com os dados do motor

Os números da entrega saem de uma rodada só do motor, congelada com hashes
(`out/final/congelado/SHA256SUMS`). O filme é renderizado de novo com esse `fechamento.json` (15 min
medidos), e o painel é regenerado com `python3 -m src.tarvo.painel relatorio/eventos.jsonl
relatorio/painel.html` em segundos. Nada é redigitado: o número da tela é o mesmo do CSV porque os
dois saem do mesmo evento.

**Portão de publicação**, reconstruído: a entrega das 18h30 e o link do pitch por e-mail às 19h. É o
único portão que o dia real teve, e o único que o estúdio não antecipa.

### Deck dos pôsteres

No real, o deck foi feito das 18h33 às 18h57, só com cartões de texto e nenhuma imagem do produto. Na
simulação, ele segue a D50 A: esqueleto com os itens do pitch a partir do gate do meio-dia, os
pôsteres entram quando o filme passa (~16h10) e as telas do painel quando o painel passa. O deck da
versão estúdio (https://claude.ai/artifact/HDUya1mrCCW4HUrnwCbQNf) tem o filme no slide 3 e quadros
dele nos slides do problema e do rastro. Tempo medido: ver "Deck".

## Se o motor tivesse saído às 17h59

Sem a D44 A, o estúdio ainda teria salvado três coisas, todas sem depender do motor: o `STYLE.md`
(estilo aprovado antes do código), o `BRIEF.md` com a mensagem central decidida de manhã, e o
`STORYBOARD.md` com os nomes de campo. Com o motor às 17h59, o Animador do painel trabalharia contra
eventos de exemplo e só um render final caberia antes das 18h30, sem Crítico. Os quatro achados de
número não teriam aparecido antes do pitch. A lição para o template é a mesma da D44: o estúdio
depende de o construtor começar na liberação.

## Painel, rodada r2

Medido em 18 e 19/10: o Animador aplicou a seção 5 do findings r1, os três defeitos e os achados 2 a
12 em 58 min (23h08 a 00h06 BRT). A reprodução caiu de 138,7 s para 100,5 s em 1x (50,3 s em 2x), sem
cortar etapa, evento nem exceção. O Crítico r2, em contexto novo, levou 43 min e deu PASSA: notas 8,
8, 8, 8, 8, 7 e 8, nenhum número errado em nenhum modo, inclusive pausado, e os 12 achados do r1
corrigidos. Ele apontou três defeitos de acabamento (qualificador no cartão de notas, varredura das
Notas durante a pausa da Casa, texto cortado na mesa em projeção a 1280), que foram para um
acabamento r3 conferido pelo Diretor, como o filme teve. O acabamento levou 59 min (00h52 a 01h51
BRT); a reprodução ficou em 102,5 s em 1x e 51,4 s em 2x. Resíduo registrado: em projeção a 1280, o
nome da Mundo Aberto corta em "INTERCÂ" na linha focada.

O que isso diz da simulação: com quatro rodadas (r0, r1, r2 e acabamento), o painel custa 5h31 de
relógio. Duas saídas, que se somam:

- **Começar mais cedo.** A D44 A põe no ar, na noite da liberação, o contrato de eventos e uma tela
  com dados de exemplo. O Animador do painel pode trabalhar contra esses eventos desde a manhã de
  17/10, e o render final troca os eventos de exemplo pela rodada congelada.
- **Menos rodadas.** Parte dos defeitos das rodadas virou emenda do `STYLE.md` (pausa em sequência,
  contador que parte de um valor já na tela, como contar palavras). Outro já era restrição do manual
  ("número parcial que contradiz o final") e mesmo assim passou pelo r0 e pelo r1, até aparecer na
  pausa. Num próximo case, as emendas entram no primeiro corte e a pausa no meio de cada contador vira
  item fixo da evidência do Engenheiro de render.

## Deck

O deck da versão estúdio tem os 11 slides da ordem do pitch de 17/10. Os de texto (IA, onde falha,
mais um mês e o pedido) levaram menos de 10 minutos, porque o conteúdo já estava no roteiro do pitch e
os números já estavam conferidos no `fechamento.json`. As telas do painel entraram em 3 minutos, assim
que o Crítico r2 passou. O que o deck do dia real não teve, e este tem, não depende de tempo de deck:
depende de existir filme e painel aprovados antes. Na simulação, esse ponto chega por volta das 16h10
para o filme e cerca de 5h30 depois de o painel começar.

## Custo

Tempo de agente medido em 18 e 19/10: 568 min (9h28). Filme: 122 min de Animador e render, 39 min
de Crítico. Painel: 232 min de Animador (r0, r1, r2 e acabamento), 99 min de Crítico. Diretor e
Diretor de arte: 76 min. Relógio: 4h21 na primeira sessão (18h45 a 23h06) e cerca de 2h50 na segunda
(23h07 a ~02h), com até dois departamentos trabalhando ao mesmo tempo.
