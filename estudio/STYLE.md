# STYLE

Diretor de arte, 18/10/2026. Direção visual única para as duas peças do case Tarvo: o filme do produto (Remotion, 1920×1080, 30 qps, cerca de 60 s) e o painel da analista (HTML gerado pelo motor, 1280×720 a 1440×900). Status: **aprovado no portão de estilo** (18/10). Paleta e fonte: escolha do Fernando em 17/10. O restante (pesos, tamanhos mínimos, uso do acento, estados, pausa de leitura): decisão do Diretor na simulação, vendo `referencias/proposta-estilo.html`, para o Fernando vetar.

Decisões do dono que este arquivo não muda: paleta Ameixa com Manrope (aprovada em 17/10), tema claro como principal, nada da identidade da Barte, movimento na linguagem medida da Barte.

## Referências e o papel de cada uma

| Referência | Papel | O que entra aqui |
|---|---|---|
| barte.com/ai-services, cena "Uma política, de ponta a ponta" | movimento e transição | curvas, durações, selo que passa do ponto, troca com sobreposição de 3 quadros |
| Cases Buser e Comp (`mktbarte.github.io/cases/case-*.html`) | ritmo e composição de demo | cursor falso e clique, resultado por linha a cada 22 quadros, palco que se monta em atos com uma frase por ato |
| Paleta Ameixa + Manrope (`pesquisa/barte-npm-e-paleta.md`, seção 4) e a vitrine `design-system-barte/preview.html` | tipografia e cor | valores de cor e contraste, acento raro, superfícies planas, borda no lugar de sombra, número tabular |

As medições, o método e as folhas de contato estão em `referencias/MEDICOES.md`. Quando um valor abaixo diz "medido", ele vem de lá.

## Condição de projeção

Todo tamanho mínimo deste arquivo parte desta conta, para a pessoa na última fileira:

- Imagem projetada de 100 polegadas (2,21 × 1,25 m), última fileira a 6 m, sala clara.
- Filme a 1080p: 1 px = 1,16 mm = 0,66 minuto de arco a 6 m.
- Painel a 1280 px de largura na mesma tela: 1 px = 1,73 mm = 0,99 minuto de arco a 6 m.
- Leitura confortável pede letra maiúscula com 20 a 22 minutos de arco; o mínimo legível é 16 (faixas usuais de ergonomia de tela, HFES 100 e ISO 9241-303).
- Manrope, medida no navegador: altura de x 0,54 em, maiúscula 0,72 em, algarismo tabular 0,62 em, vírgula e ponto 0,30 em.

## Tipografia

Uma família só: **Manrope** (SIL OFL 1.1), eixo de peso 400 a 800. Caráter: geométrica, aberta, altura de x grande, algarismos com largura fixa quando pedidos. Arquivos em `estudio/ferramentas/fontes/` (subconjuntos latin e latin-ext do Google Fonts, mais `OFL.txt`). A fonte vai embutida no filme e no painel; nada depende de rede na hora da projeção.

Glifos fora do subconjunto latin: a seta (U+2192) e o "menor ou igual" (U+2264) não existem na Manrope servida. Escreva "até", "para", "acima de". O sinal de menos (U+2212) existe e é o que vai nos valores negativos.

### Filme (px a 1080p)

| Papel | Tamanho | Peso | Entrelinha | Tracking | Maiúscula a 6 m |
|---|---|---|---|---|---|
| Número herói (1 por cena, no máximo) | 176 | 700 | 1,0 | −0,02 em | 84′ |
| Prefixo "R$" do número herói | 88 | 600 | 1,0 | 0 | 42′ |
| Número secundário | 112 | 700 | 1,0 | −0,02 em | 53′ |
| Título da cena (a afirmação) | 72 | 600 | 1,1 | −0,02 em | 34′ |
| Destaque, linha de tabela em foco | 56 | 600 | 1,15 | −0,01 em | 27′ |
| Corpo, contexto do número, valores de cartão | 44 | 500 | 1,3 | 0 | 21′ |
| Rótulo, rodapé de fonte (**mínimo absoluto**) | 36 | 600 | 1,3 | +0,01 em | 17′ |

- Nada no filme abaixo de 36 px. Texto em `texto-2` só a partir de 36 px e peso 500.
- Título: até 2 linhas, até 28 caracteres por linha (cabe em 8 colunas, 1.112 px). Passou disso, o título está longo demais; corte palavras.
- Peso de título é 600, não o 300 da Barte. Traço fino lava no projetor de sala clara.
- Caixa alta só em rótulo de até 3 palavras, a 36 px, com +0,06 em. Frase em caixa alta, nunca.
- Linha de origem crua (o "mergulho" no relatório da Orbe): Manrope 500 tabular a 36 px, campos separados em células, o campo que importa em 44 px. Sem fonte monoespaçada.

### Painel (px CSS, de 1280 a 1440 de largura)

| Papel | Tamanho | Peso | Entrelinha |
|---|---|---|---|
| Número herói da tela (1 por tela) | 40 | 700 | 1,0 |
| Título da tela, número de cartão | 28 | 700 | 1,1 |
| Título de cartão e de gaveta | 20 | 600 | 1,25 |
| Texto corrido (motivo de pendência, explicação) | 17 | 500 | 1,5 |
| Tabela e interface | 15 | 500 | 1,4 |
| Meta: hora, "linha 727", rótulo de coluna (**mínimo**) | 13 | 600 | 1,3 |

- 12 px ou menos: proibido.
- O que precisa ser lido do fundo da sala tem 28 px ou mais (20′ a 6 m). A tabela a 15 px se lê até uns 4 m; é para quem está na frente e para o avaliador técnico.
- Modo projeção (`html[data-projecao]`): tudo × 1,25 (tabela 19 px, linha de 48 px). O clique para ver a origem abre a gaveta já nesse tamanho.

### Números, nos dois

- `font-variant-numeric: tabular-nums lining-nums` em todo número que se compara em coluna, que conta ou que muda no lugar. Colunas de valor alinhadas à direita, duas casas fixas, vírgula alinhada.
- Em frase corrida, algarismos proporcionais: o "1" tabular tem a largura do "0" e abre buraco ("1 2 vendas").
- Formato brasileiro: R$ 1.546,28, 4,09%, 12/09/2026. Espaço inseguro (U+00A0) entre "R$" e o número. Negativo com U+2212: −R$ 190,00.
- "R$" em tamanho menor e cor `texto-2` só no número herói e no número de cartão. Em tabela, "R$" vai no cabeçalho da coluna e as células levam só o número.
- O texto que aparece na tela é a string formatada a partir de `estudio/dados/fechamento.json`. O código nunca digita número.

## Composição

### Filme

- Quadro 1920×1080. Margens: 120 px nas laterais, 96 px em cima e embaixo. Área útil: 1.680 × 888 (x 120 a 1800, y 96 a 984). A área segura de título de TV (5%) fica por dentro.
- Grade de 12 colunas de 118 px com calha de 24 px. Linha de base de 8 px: todo y é múltiplo de 8.
- Zonas fixas: título começa em (120, 96) e ocupa até 8 colunas; o objeto principal começa em y 312 ou abaixo; rodapé de fonte em y 948, à esquerda.
- Escala de espaço: 8, 16, 24, 32, 48, 64, 96, 128. Título até o objeto: 96 a 128. Número até o contexto: 24. Entre cartões: 48.
- Até 3 níveis de texto por quadro (título, objeto, apoio). Até 1 número herói. Até 40 palavras visíveis ao mesmo tempo, rótulos incluídos.
- **Um ponto focal por cena.** Ele tem o maior tamanho ou é o único elemento em movimento naquele instante, e é o último a assentar antes da pausa. Enquanto ele entra, o resto fica parado.
- Pelo menos 55% do quadro fica em fundo vazio.
- Alinhamento à esquerda. Centrado só no quadro de abertura e no de fecho. Números à direita.
- Cartão de origem: 5 colunas (686 px), respiro interno de 40 px, linhas de 72 px, até 4 linhas de dado. Se não couber em 4, a cena está explicando demais.

### Painel

- Margem externa de 24 px até 1366 de largura e 32 px a partir de 1440. Grade de 12 colunas, calha de 16 px.
- Escala de espaço: 4, 8, 12, 16, 24, 32, 48.
- Cabeçalho de 56 px. Linha de tabela de 40 px (48 no modo projeção). Respiro de cartão de 20 px (24 a partir de 1440).
- A 1280×720, a primeira dobra mostra o cabeçalho e até 12 linhas de tabela.
- No máximo 2 colunas de conteúdo lado a lado. A origem de um número abre numa gaveta lateral de 440 px, sem cobrir a linha clicada; ela tem sombra porque flutua.
- Um número herói por tela; o resto dos números em cartões de 28 px ou em tabela.

## Cor

Tema claro é o do filme (só ele) e o padrão do painel. O escuro existe só no painel, por `prefers-color-scheme` ou `data-tema="escuro"`.

### Papéis

| Papel | Claro | Escuro | Contraste do texto |
|---|---|---|---|
| fundo | #F9F5FA | #1A121B | |
| superfície (cartão, tabela) | #FFFFFF | #231B24 | |
| superfície 2 (cabeçalho de tabela, faixa técnica) | #F0ECF1 | #2B242C | |
| borda do painel (1 px) | #E3DEE4 | #302830 | decorativa |
| borda do filme (2 px) | #DAD5DB | | decorativa |
| tinta, texto principal | #1B121D | #F1EDF2 | 16,92 / 15,82 no fundo |
| texto 2 | #635665 | #B2A6B5 | 6,38 / 7,86 no fundo |
| acento | #AB1D72 | #EB77B6 | 6,18 / 6,85 no fundo |
| acento suave (controle selecionado: aba, filtro, item de menu) | #FFE4F0 | #471D33 | acento sobre ele 5,59 / 5,26 |
| linha selecionada de tabela (acento a 6% / 10%) | #FAF1F7 | #372433 | tinta 16,50 / 12,40; crítico 5,88 / 5,17 |
| sobre acento | #FFFFFF | #1A121B | 6,67 / 6,85 |
| bom | #206B38 | #75C77F | 6,04 / 8,93 |
| alerta | #805C09 | #C9A15B | 5,64 / 7,62 |
| crítico | #A83538 | #FE6D5F | 6,03 / 6,60 |

Fundos tingidos (12% do estado; calculados, porque o Remotion recebe hex):

| Estado | Sobre o fundo | Sobre a superfície | Escuro, sobre o fundo | Texto do estado sobre o tingido |
|---|---|---|---|---|
| bom | #DFE4E3 | #E4EDE7 | #252827 | 5,07 / 5,45 / 7,25 |
| alerta | #EAE3DD | #F0EBE1 | #2F2323 | 4,79 / 5,12 / 6,30 |
| crítico | #EFDEE3 | #F5E7E7 | #351D23 | 5,02 / 5,41 / 5,60 |

### Estados

Três estados na tela, cada um ligado a um campo do evento que o motor grava. Estado sempre com ícone e palavra; cor sozinha não diz nada (daltonismo, projetor ruim).

| Estado (nome do estúdio) | Quando (evento em `relatorio/eventos.jsonl`) | Cor | Ícone | Palavra na tela |
|---|---|---|---|---|
| Feito pelo motor | `peso: rotina`, `metodo: REGRA` | bom, só no ícone e na palavra | visto (check) | "Feito pela regra" |
| Exceção | `peso: atencao`, `metodo: REGRA` (divergência: taxa ou spread fora do contrato) | crítico | triângulo com ! | "Acima do contrato" ou o motivo curto |
| Para uma pessoa decidir | `peso: excecao`, `metodo: HUMANO` (pendência com `quem_decide`) | alerta | pessoa (cabeça e ombros) | "Para o Financeiro decidir" (a área vem do campo) |

Cuidado com os nomes: o `peso: excecao` do motor é o estado "para uma pessoa decidir" na tela, e o estado "exceção" da tela é o `peso: atencao`. A ligação segue o significado (quem decide); confirmar com o Diretor no storyboard.

- Selo no padrão claro: fundo tingido a 12%, texto e ícone na cor do estado, formato pílula. Filme: 36 px peso 600, altura 64, respiro 12/24, ícone de 32. Painel: 13 px peso 600, altura 22, respiro 3/8, ícone de 14.
- "Feito pelo motor" é o estado de milhares de linhas. Ele nunca pinta linha, cartão ou fundo; aparece como contagem (o número vem do `fechamento.json`) e como visto pequeno.

### Acento

O acento marca **para onde o motor está olhando agora** e o que a pessoa selecionou. Ele não é estado.

Pode:
- o olhar do motor (a faixa que percorre linhas) e o anel do clique da analista;
- foco e item selecionado no painel: controle selecionado com fundo `acento suave`; linha de tabela selecionada com fundo `linha selecionada` e barra de 3 px de acento à esquerda (a linha pode levar um selo crítico, e crítico sobre `acento suave` vira a mistura que a regra abaixo proíbe);
- o link "ver origem" no painel;
- uma expressão de até 3 palavras num título do filme, em cena sem crítico.

Não pode:
- estado, contagem, número herói, barra de gráfico por padrão, cabeçalho de tabela, navegação, faixa decorativa, fundo de área grande;
- mais de 1 elemento com acento por cena no filme; mais de 2 por tela no painel (foco e selecionado);
- mais de 2% da área do quadro.

**Acento e crítico têm contraste de luminância de 1,03:1 entre si.** No projetor e para quem tem daltonismo vermelho-verde são a mesma cor. Então nunca dividem a mesma cena no filme: na cena da exceção, o rastro (a linha que liga o número à origem) é `texto-2`, e o olhar do motor, se houver, apaga em 6 quadros enquanto o selo crítico carimba. No painel podem coexistir, sempre separados por forma: crítico sempre com ícone e palavra; acento sempre como contorno ou sublinhado, nunca como selo.

### Regras de contraste

- Texto: 4,5:1 sobre o fundo real, tingido incluído. Todos os pares das tabelas acima passam.
- Filme: texto em `tinta` a partir de 36 px; `texto-2` a partir de 36 px e peso 500; texto em cor de estado só dentro do selo ou no valor que mudou, a partir de 36 px e peso 600.
- Nunca `texto-2` sobre fundo tingido.
- Ícones, pontos e barras: 3:1 (todos os tons passam).
- Borda é decorativa e não entra na conta; no filme ela tem 2 px para sobreviver ao projetor.

## Movimento

Base medida na Barte (`referencias/MEDICOES.md`): uma curva de pouso para quase tudo, entrada de 500 ms que parece pronta em 300 ms, selo que passa do ponto e parece instantâneo, batidas a cada 1,8 a 2,5 s. No filme, tudo é função do número do quadro; no painel, de um relógio único com semente fixa.

### Curvas

| Nome | Bézier | Uso | Origem |
|---|---|---|---|
| pousa | (0.2, 0.8, 0.2, 1) | entrada de bloco, mudança de posição, continuidade, cursor, contador | curva padrão dos cases e do palco Comp |
| sobe | (0.2, 0.7, 0.2, 1) | passos e linhas que sobem | passos da cena ai-services |
| texto | (0.25, 0.46, 0.45, 0.94) | só o título da cena | entrada do título do hero ai-services |
| confirma (passa do ponto) | (0.2, 1.3, 0.4, 1) | selo que confirma um resultado, 1 vez por cena | selo "baixado" e chip de regra |
| barra | (0.4, 0, 0.2, 1) | barra que enche | barra de progresso da Barte |
| sai | (0.4, 0, 1, 1) | saída, só opacidade | nossa (saída acelera e some) |
| pulso | (0.45, 0, 0.55, 1) | anel de espera | pulso âmbar ai-services (`ease-in-out`) |

### Durações e atrasos

| Token | Filme (quadros a 30 qps) | Painel (ms) | Medido na referência |
|---|---|---|---|
| micro (cor, hover) | 6 | 150 | 150 a 250 ms |
| selo | 12 (visível em 5) | 400 | 400 ms; visível 160 a 200 ms |
| sobe (passo, linha) | 15 (pronto aos olhos no 9) | 500 | 500 ms; 90% da mudança visível em 280 a 320 ms |
| cartão (desliza) | 24 de posição, 21 de opacidade | 850 / 700 | palco Comp 0,85 / 0,7 s; visível 1,04 s |
| título | 24, mais 4 por linha | 800 | 0,95 s com 0,12 s por linha |
| saída | 10 | 250 | ~0,4 s no fim do loop; saída é mais curta que entrada |
| continuidade entre cenas | 24 | 600 | |
| contador | 30 (inteiros: 24) | 1000 | |
| mergulho (aproximação) | 36 | | |
| abertura e fecho (do e para o fundo) | 15 | | |
| atraso entre linhas de uma lista | 5 | 160 | P&L Comp 160 ms; passos 150 ms |
| atraso entre linhas de título | 4 | 120 | 0,12 s |
| atraso entre itens que o motor processa | 22 | 720 | resultado por linha no Buser, 720 ms |
| sobreposição na troca de elemento | 3 | 100 | carregando sai 100 ms antes de o selo entrar |

Distâncias. Filme: sobe 20 px; linha desliza 32 px na horizontal; cartão desliza 64 px; título sobe 24 px saindo de desfoque de 8 px. Painel: sobe 10 px; linha 14 px; cartão 18 px. A distância no filme é proporcional ao corpo do texto: a Barte move 0,6 em (10 px num texto de 16,5 px), e 20 px é 0,45 em do corpo de 44.

### Entrada

- Opacidade termina em 70% da duração do movimento (15 quadros de posição, 10 de opacidade). Ninguém lê texto translúcido em movimento.
- Desfoque só no título (8 px para 0 nos primeiros 60% da duração). Nunca em número.
- O próximo elemento pode começar quando o anterior está pronto aos olhos (quadro 9 de 15: 90% da mudança visível, medido na Barte; a posição sozinha chega a 90% no quadro 7), nunca antes da metade, exceto em lista com atraso fixo.

### Assentamento

- Um elemento está assentado no último quadro da duração, não em 90%. A pausa de leitura conta a partir daí.
- Nada vibra, flutua ou respira depois de assentar. Parado é parado.

### Pausa de leitura

A regra, para o filme:

```
pausa (quadros) = max(45, 20 + 8 × palavras)
```

- 8 quadros por palavra são 3,75 palavras por segundo, o ritmo das batidas da Barte (cerca de 3,8). Os 20 quadros fixos (0,67 s) são o tempo de achar o texto: o filme passa uma vez, de longe, e a plateia pode estar olhando para quem apresenta. O loop da Barte se revê; o filme, não.
- Como contar: palavra é o que fica entre espaços. Número com unidade (R$ 1.546,28, 4,09%) conta 2. Data conta 1. Selo e rótulo de até 3 palavras contam 1 cada.
- Grupo que entra em sequência: some as palavras do grupo todo e conte a pausa a partir do assentamento do último elemento.
  - **Emenda do Diretor (18/10, corte r1).** Quando cada item do grupo só entra depois de o anterior ter ficado parado a própria pausa (`max(45, 20 + 8 × palavras do item)`), a leitura dos anteriores já aconteceu: a pausa final cobre só o último item. É o ritmo de batidas da Barte (um passo a cada 1,8 a 2,5 s). Itens que entram juntos ou com atraso de lista continuam somando as palavras.
- Número que conta: a pausa começa no quadro em que o contador para.
- Texto que continua na cena seguinte não pausa de novo.
- Fim de cena: pausa + 15 quadros antes da transição.
  - **Emenda do Diretor (18/10, depois do Crítico r2).** A margem de 15 quadros vale para corte seco. Na transição por continuidade, o elemento compartilhado segue na tela e a leitura continua nele: a margem não se aplica.
- **Como contar, na prática (emenda do Diretor, 18/10, depois do Crítico r2).** São as regras que o estúdio usou para medir e que o Crítico validou contra a leitura real:
  - rótulo que acompanha o próprio valor (faixa e total, número e unidade) conta 1;
  - texto que ficou parado e legível antes do último elemento do grupo, enquanto só outro elemento se mexia, já conta como lido;
  - valor que já apareceu numa cena anterior conta 1;
  - a medida é o tempo parado de verdade (luma igual entre quadros, render sem perda), não o tempo previsto na linha do tempo.
- Painel, nas pausas narradas do modo reprodução: `max(1500, 670 + 270 × palavras)` ms. Eventos de rotina não pausam; viram contagem.

| Palavras | Quadros | Segundos |
|---|---|---|
| 3 ou menos | 45 | 1,5 |
| 8 | 84 | 2,8 |
| 12 | 116 | 3,9 |
| 20 | 180 | 6,0 |

Se o título (8 palavras) e o número com contexto (13) entram como um grupo só, a pausa é de 188 quadros, 6,3 s. Num filme de 1.800 quadros, a regra obriga a cortar palavras, e é para isso que ela existe.

### Contador

- Sobe de 0 ou do valor anterior já mostrado na cena; nunca de um número inventado.
- Começa 6 quadros depois de o rótulo do número estar assentado, para a plateia saber o que está contando.
  - **Emenda do Diretor (18/10, corte r2).** A espera de 6 quadros vale quando o número aparece pela primeira vez. Quando o contador parte de um valor que já está na tela e só o rótulo muda, ele começa no mesmo quadro em que o rótulo novo começa a entrar: o rótulo assenta enquanto o número sobe, e nenhum quadro mostra o valor antigo sob o rótulo novo (frase falsa).
- 30 quadros, curva `pousa`: chega a 90% do valor em cerca de 12 quadros e passa os outros 18 mexendo só nos últimos algarismos.
- Cada quadro mostra `final × curva(t)` arredondado ao centavo (ou ao inteiro) e formatado em pt-BR. Sobe sem nunca descer e **nunca passa do valor final** (nada de curva `confirma` em número). Cada valor intermediário dura 1 quadro.
- O último quadro mostra a string exata do `fechamento.json`, não um float recalculado.
- Algarismos tabulares, alinhado à direita pela vírgula: os centavos ficam parados, o número cresce para a esquerda e o "R$" acompanha o primeiro algarismo. No quadro final, o "R$" encosta na margem da grade (a caixa do número tem a largura do valor final desde o primeiro quadro).
- Enquanto conta, nada mais se move na cena.
- Inteiros acima de 20 contam em 24 quadros. Inteiros até 20 não contam: entram com `sobe`.
- Total e partes: as partes assentam primeiro, o total conta depois. Nenhum quadro mostra um total menor que a soma das partes já visíveis.
- Depois de parar, pode vir 1 selo `confirma`, 6 quadros depois.

### Cursor da analista e olhar do motor

Dois dispositivos diferentes, porque o motor não é uma pessoa clicando.

**Cursor da analista** (só quando o filme mostra o painel e o clique para ver a origem):
- Seta em `tinta` com contorno branco de 2 px, 40 px de altura a 1080p.
- Trajeto reto ou com arco de até 4% da distância. Duração `max(18, min(36, 12 + distância/40))` quadros, curva `pousa`. A Barte usa 0,96 a 2,16 s por trecho; aqui é mais curto porque o filme tem 60 s.
- Para 9 quadros antes de clicar. Clique: o alvo afunda para escala 0,96 em 5 quadros e volta em 7; anel de acento de 2 px vai de 1 a 1,35 e some em 22.
- O efeito do clique aparece 6 quadros depois do clique, para causa e efeito ficarem legíveis.
- O cursor não anda enquanto entra texto que a plateia precisa ler. Sai apagando em 12 quadros.

**Olhar do motor** (quando o motor lê linhas):
- Faixa da altura da linha: contorno de acento de 4 px (2 px no painel) e preenchimento de acento a 6%.
- Pula de linha em linha em 6 quadros com `pousa` e fica 6 quadros em cada uma (a Barte desce 1 linha a cada 480 ms; aqui são 400 ms).
- No máximo 6 linhas percorridas; volume grande vira contagem, nunca rolagem de 2.000 linhas.
- Ao achar a linha que importa, segura pela regra de pausa. Se a linha for exceção, a faixa apaga em 6 quadros enquanto o selo crítico carimba (troca com sobreposição de 3 quadros).

### Curva que passa do ponto

- Só em selo que confirma um resultado ("Feito pela regra", "Acima do contrato", "Para o Financeiro decidir"). Uma vez por cena.
- Duas formas medidas: carimbo, de escala 1,35 para 1 em 12 quadros; ou pulo, de 0,8 a 1,06 a 1 em 15 quadros.
- Nunca em número, bloco de texto, cartão, cursor ou mudança de layout.

### Pulso de espera

- Para uma pendência ("para uma pessoa decidir") chamar atenção: anel de 6 px (3 px no painel) em alerta a 25%, 2 ciclos de 48 quadros (1,6 s), curva `pulso`, e para. Na Barte o pulso é infinito; aqui ele termina para não competir com a cena seguinte.

### Transição entre cenas

1. **Continuidade por elemento (padrão).** O ponto focal do último quadro da cena N continua e se transforma (posição, escala até 0,5, cor) no seu papel na cena N+1, em 24 quadros com `pousa`. Os outros elementos de N saem em 10 quadros com `sai` (só opacidade), começando no mesmo quadro. Os elementos novos de N+1 entram depois que o compartilhado passa de 90% (quadro 15 dos 24), com atraso de lista.
2. **Corte seco.** Quando não há elemento em comum, corta depois da pausa completa. A cena nova começa com o fundo já presente e o primeiro elemento entra entre os quadros 0 e 3. Fundo vazio dura no máximo 6 quadros.
3. Nunca dissolver um quadro cheio em outro quadro cheio: texto sobre texto não se lê.
4. Abertura e fecho: do fundo e para o fundo, 15 quadros.
5. **Mergulho, uma vez no filme**: no rastro do número, o palco aproxima até 1,25× na direção da linha de origem, em 36 quadros com `pousa`, e nada mais se move durante a aproximação. Fora isso, a câmera fica parada.

Continuidade verificável: todo elemento presente no último quadro de uma cena e no primeiro da seguinte tem a mesma posição, tamanho e cor nos dois quadros. O Engenheiro de render exporta esse par de quadros para cada corte.

### Painel e `prefers-reduced-motion`

- Com a preferência ligada, o modo reprodução não toca sozinho: abre no estado final, com os botões de reproduzir e de passo a passo.
- Passo a passo troca de estado sem deslocamento nem escala; só opacidade, até 120 ms.
- Contador mostra o valor final direto. Carregando vira o texto "processando…". O olhar do motor vira contorno parado na linha atual. Pulso e brilho: desligados.
- O relógio continua sendo um só e determinístico; a preferência só pula de estado em estado.
- Hover e foco continuam com 150 ms de cor, sem movimento.

## Textura

- Superfícies planas: fundo, cartões brancos, borda. Sem degradê.
- Sem grão, no filme e no painel. A Barte põe ruído de 5% no cartão do hero; num H.264 projetado, ruído vira bloco, o fundo ferve e o arquivo engorda.
- Sombra só no que flutua: o cartão de origem e a gaveta lateral (e menus no painel).
  - Filme: `0 2px 4px rgba(27,18,29,.06), 0 16px 40px -12px rgba(27,18,29,.22)`.
  - Painel: `0 1px 2px rgba(27,18,29,.06), 0 8px 24px -8px rgba(27,18,29,.18)`.
- Bordas: painel 1 px `#E3DEE4`; filme 2 px `#DAD5DB`. Divisória de tabela com a mesma espessura.
- Raios. Painel: 6 px em controle, 10 px em cartão, 12 px em tabela, pílula em selo. Filme: 12 px em controle, 16 px em cartão, pílula em selo.
- Ícones de traço, cantos arredondados, sem preenchimento (exceto dentro do selo): 1,75 px de traço a 20 px no painel; 3 px a 40 px no filme.

## O que evitar neste projeto

Além das restrições do manual:

- Acento em estado, em número ou em mais de um lugar por cena. Acento e crítico na mesma cena do filme.
- Linha, cartão ou tabela pintados de verde para "feito". O feito é o normal; ele fica quieto.
- Fundo escuro no filme. O palco preto do case Comp vira cinza lavado num projetor de sala clara.
- Títulos em peso 300 a 400 e rótulos minúsculos em caixa alta com tracking largo (a assinatura da Barte que não sobrevive a 6 m).
- Fonte monoespaçada para valores (o Buser usa nas células). Aqui é Manrope tabular.
- Barras cinza no lugar de números (o P&L do Comp usa). Número que não veio do motor não aparece, nem como esqueleto.
- Robô, mascote ou rosto para o motor. Ele aparece pelo que faz: o olhar que percorre linhas e o selo que carimba.
- Painel deitado que se levanta em perspectiva (`bt-plane-in` da Barte), zoom sem motivo, câmera flutuando.
- Pulso e ponto "ao vivo" em loop infinito no filme. Loop é recurso de página web.
- Logo inventado para Orbe, Ponte Câmbio, Aurora ou Meridiano. Nome em texto, só.
- Contador que passa do valor, para num valor intermediário ou mostra total menor que as partes.
- Quadro com mais de 40 palavras, ou título com mais de 2 linhas.
- Linguagem do motor na camada principal: TX88423890, PEN-0001, F11, nome de arquivo. Isso fica no mergulho, em 36 px, e só quando a cena é sobre a origem.
- Seta (→) e "≤" no texto: não existem na fonte embutida.

## Tokens prontos para código

### CSS (painel e páginas do estúdio)

```css
:root {
  /* cor, tema claro (principal) */
  --cor-fundo: #F9F5FA;
  --cor-superficie: #FFFFFF;
  --cor-superficie-2: #F0ECF1;
  --cor-borda: #E3DEE4;
  --cor-borda-filme: #DAD5DB;
  --cor-tinta: #1B121D;
  --cor-texto-2: #635665;
  --cor-acento: #AB1D72;
  --cor-acento-suave: #FFE4F0;
  --cor-linha-sel: #FAF1F7;
  --cor-sobre-acento: #FFFFFF;
  --cor-bom: #206B38;
  --cor-bom-fundo: #DFE4E3;
  --cor-alerta: #805C09;
  --cor-alerta-fundo: #EAE3DD;
  --cor-critico: #A83538;
  --cor-critico-fundo: #EFDEE3;
  --sombra-flutua: 0 1px 2px rgba(27,18,29,.06), 0 8px 24px -8px rgba(27,18,29,.18);

  /* tipo */
  --fonte: "Manrope", system-ui, -apple-system, "Segoe UI", sans-serif;
  --numeros: tabular-nums lining-nums;
  --tam-heroi: 40px;   --peso-heroi: 700;
  --tam-titulo: 28px;  --peso-titulo: 700;
  --tam-cartao: 20px;  --peso-cartao: 600;
  --tam-texto: 17px;
  --tam-tabela: 15px;  --peso-corpo: 500;
  --tam-meta: 13px;    --peso-meta: 600;

  /* espaço e forma */
  --esp-1: 4px; --esp-2: 8px; --esp-3: 12px; --esp-4: 16px;
  --esp-5: 24px; --esp-6: 32px; --esp-7: 48px;
  --margem: 24px; --calha: 16px;
  --linha-tabela: 40px; --cabecalho: 56px; --gaveta: 440px;
  --raio-controle: 6px; --raio-cartao: 10px; --raio-tabela: 12px; --raio-selo: 999px;
  --borda: 1px;

  /* movimento */
  --curva-pousa: cubic-bezier(0.2, 0.8, 0.2, 1);
  --curva-sobe: cubic-bezier(0.2, 0.7, 0.2, 1);
  --curva-texto: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  --curva-confirma: cubic-bezier(0.2, 1.3, 0.4, 1);
  --curva-barra: cubic-bezier(0.4, 0, 0.2, 1);
  --curva-sai: cubic-bezier(0.4, 0, 1, 1);
  --curva-pulso: cubic-bezier(0.45, 0, 0.55, 1);
  --dur-micro: 150ms;
  --dur-selo: 400ms;
  --dur-sobe: 500ms;
  --dur-cartao: 850ms;  --dur-cartao-opacidade: 700ms;
  --dur-titulo: 800ms;
  --dur-saida: 250ms;
  --dur-contador: 1000ms;
  --dur-pulso: 1600ms;  --pulso-ciclos: 2;
  --atraso-lista: 160ms;
  --atraso-processamento: 720ms;
  --sobreposicao-troca: 100ms;
  --dist-sobe: 10px; --dist-linha: 14px; --dist-cartao: 18px;
}

@media (min-width: 1440px) { :root { --margem: 32px; } }

html[data-projecao] {
  --tam-heroi: 50px; --tam-titulo: 35px; --tam-cartao: 25px;
  --tam-texto: 21px; --tam-tabela: 19px; --tam-meta: 16px;
  --linha-tabela: 48px;
}

@media (prefers-color-scheme: dark) {
  :root:not([data-tema="claro"]) {
    --cor-fundo: #1A121B; --cor-superficie: #231B24; --cor-superficie-2: #2B242C;
    --cor-borda: #302830; --cor-tinta: #F1EDF2; --cor-texto-2: #B2A6B5;
    --cor-acento: #EB77B6; --cor-acento-suave: #471D33; --cor-linha-sel: #372433; --cor-sobre-acento: #1A121B;
    --cor-bom: #75C77F; --cor-bom-fundo: #252827;
    --cor-alerta: #C9A15B; --cor-alerta-fundo: #2F2323;
    --cor-critico: #FE6D5F; --cor-critico-fundo: #351D23;
    --sombra-flutua: 0 1px 2px rgba(0,0,0,.3), 0 8px 24px -8px rgba(0,0,0,.5);
  }
}
:root[data-tema="escuro"] {
  --cor-fundo: #1A121B; --cor-superficie: #231B24; --cor-superficie-2: #2B242C;
  --cor-borda: #302830; --cor-tinta: #F1EDF2; --cor-texto-2: #B2A6B5;
  --cor-acento: #EB77B6; --cor-acento-suave: #471D33; --cor-linha-sel: #372433; --cor-sobre-acento: #1A121B;
  --cor-bom: #75C77F; --cor-bom-fundo: #252827;
  --cor-alerta: #C9A15B; --cor-alerta-fundo: #2F2323;
  --cor-critico: #FE6D5F; --cor-critico-fundo: #351D23;
  --sombra-flutua: 0 1px 2px rgba(0,0,0,.3), 0 8px 24px -8px rgba(0,0,0,.5);
}

@media (prefers-reduced-motion: reduce) {
  :root {
    --dur-selo: 0ms; --dur-sobe: 0ms; --dur-cartao: 0ms; --dur-titulo: 0ms;
    --dur-contador: 0ms; --dur-pulso: 0ms; --pulso-ciclos: 0;
    --dur-cartao-opacidade: 120ms; --dur-saida: 120ms;
    --atraso-lista: 0ms; --atraso-processamento: 0ms;
    --dist-sobe: 0px; --dist-linha: 0px; --dist-cartao: 0px;
  }
}

body { font-family: var(--fonte); font-weight: var(--peso-corpo); background: var(--cor-fundo); color: var(--cor-tinta); }
.numero, td.valor { font-variant-numeric: var(--numeros); }
```

### TypeScript (Remotion)

```ts
// Valores do STYLE.md para o filme. Curvas para Easing.bezier(...style.curva.pousa);
// durações e atrasos em quadros a 30 qps; medidas em px a 1080p.
export const style = {
  fps: 30,
  quadro: { largura: 1920, altura: 1080, margemX: 120, margemY: 96, colunas: 12, coluna: 118, calha: 24, base: 8 },
  cor: {
    fundo: '#F9F5FA', superficie: '#FFFFFF', superficie2: '#F0ECF1', borda: '#DAD5DB',
    tinta: '#1B121D', texto2: '#635665',
    acento: '#AB1D72', acentoSuave: '#FFE4F0', sobreAcento: '#FFFFFF',
    bom: '#206B38', bomFundo: '#DFE4E3',
    alerta: '#805C09', alertaFundo: '#EAE3DD',
    critico: '#A83538', criticoFundo: '#EFDEE3',
    sombraFlutua: '0 2px 4px rgba(27,18,29,.06), 0 16px 40px -12px rgba(27,18,29,.22)',
  },
  fonte: { familia: 'Manrope', numeros: 'tabular-nums lining-nums' },
  tipo: {
    heroi:      { tamanho: 176, peso: 700, entrelinha: 1.0, tracking: -0.02 },
    heroiPrefixo: { tamanho: 88, peso: 600, entrelinha: 1.0, tracking: 0 },
    secundario: { tamanho: 112, peso: 700, entrelinha: 1.0, tracking: -0.02 },
    titulo:     { tamanho: 72, peso: 600, entrelinha: 1.1, tracking: -0.02, maxLinhas: 2, maxCaracteres: 28 },
    destaque:   { tamanho: 56, peso: 600, entrelinha: 1.15, tracking: -0.01 },
    corpo:      { tamanho: 44, peso: 500, entrelinha: 1.3, tracking: 0 },
    rotulo:     { tamanho: 36, peso: 600, entrelinha: 1.3, tracking: 0.01 },
  },
  espaco: [0, 8, 16, 24, 32, 48, 64, 96, 128],
  forma: { borda: 2, raioControle: 12, raioCartao: 16, raioSelo: 999, iconeTraco: 3, icone: 40, seloAltura: 64 },
  curva: {
    pousa:    [0.2, 0.8, 0.2, 1],
    sobe:     [0.2, 0.7, 0.2, 1],
    texto:    [0.25, 0.46, 0.45, 0.94],
    confirma: [0.2, 1.3, 0.4, 1],
    barra:    [0.4, 0, 0.2, 1],
    sai:      [0.4, 0, 1, 1],
    pulso:    [0.45, 0, 0.55, 1],
  },
  dur: {
    micro: 6, selo: 12, sobe: 15, linha: 15,
    cartao: 24, cartaoOpacidade: 21,
    titulo: 24, saida: 10, continuidade: 24,
    contador: 30, contadorInteiro: 24,
    mergulho: 36, abertura: 15,
    cliqueDesce: 5, cliqueVolta: 7, anelClique: 22,
    pulso: 48, pulsoCiclos: 2,
  },
  atraso: {
    lista: 5, tituloLinha: 4, processamento: 22, trocaSobreposta: 3,
    contadorAposRotulo: 6, seloAposContador: 6, efeitoAposClique: 6,
    proximoAposAnterior: 9, // começa quando o anterior chega a 90% (de 15)
  },
  dist: { sobe: 20, linha: 32, cartao: 64, titulo: 24, desfoqueTitulo: 8, mergulhoEscala: 1.25 },
  opacidadeTerminaEm: 0.7, // fração da duração do movimento
  pausa: { base: 20, porPalavra: 8, minima: 45, fimDeCena: 15 },
  cursor: { altura: 40, contorno: 2, min: 18, max: 36, base: 12, pxPorQuadro: 40, esperaAntesDoClique: 9, some: 12, arcoMax: 0.04 },
  olhar: { pulo: 6, segura: 6, maxLinhas: 6, contorno: 4, preenchimento: 0.06 },
  limites: { palavrasNoQuadro: 40, niveisDeTexto: 3, acentoPorCena: 1, confirmaPorCena: 1, fundoVazioMin: 0.55 },
} as const;

export const pausaDeLeitura = (palavras: number) =>
  Math.max(style.pausa.minima, style.pausa.base + style.pausa.porPalavra * palavras);

export const duracaoCursor = (distanciaPx: number) =>
  Math.max(style.cursor.min, Math.min(style.cursor.max, Math.round(style.cursor.base + distanciaPx / style.cursor.pxPorQuadro)));
```
