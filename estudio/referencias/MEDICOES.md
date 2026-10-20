# Medições das referências

Diretor de arte, 18/10/2026. Gravações feitas entre 19:32 e 19:41 BRT (22:32Z e 22:41Z), em Chrome do sistema via Playwright, viewport 1440×900.

Cada referência tem um papel só:

| Referência | Papel no `STYLE.md` | Pasta |
|---|---|---|
| barte.com/ai-services, cena "Uma política, de ponta a ponta" | movimento e transição | `ai-services/` |
| Cases Buser e Comp | ritmo e composição de demo | `buser/`, `comp/` |
| Paleta Ameixa + Manrope, vitrine `design-system-barte/preview.html` | tipografia e cor | (sem gravação; valores no `STYLE.md`) |

## Onde as coisas estão

- `mktbarte.github.io/cases` responde 404 hoje. Os cases agora abrem em `barte.com/cases/buser` e `barte.com/cases/comp`, que carregam por iframe as páginas `mktbarte.github.io/cases/case-buser.html` e `case-comp.html`. Gravei direto essas URLs, sem o cabeçalho do site por cima.
- A cena "Uma política, de ponta a ponta" fica no cartão à direita do hero de ai-services, com três cenários em abas (Caixa, Provisão, Receita).

## Como medi

1. `estudio/scripts/gravar_referencias.mjs` grava cada cena com `recordVideo` e salva `gravacao.webm` e `contexto.json` (caixas dos elementos lidas do DOM, marcas de tempo, textos e, no Buser e no Comp, as animações e transições que o navegador declara para cada elemento).
2. `estudio/scripts/medir_referencias.py` recorta uma região por elemento e conta, quadro a quadro, quantos pixels mudaram mais de 24 níveis de cinza. Quadro com 6 pixels ou mais mudados é movimento; até 2 quadros parados não quebram uma rajada. De cada rajada saem início, fim (assentamento total) e `t90`, o quadro em que 90% da mudança acumulada já aconteceu (assentamento percebido). Saída: `energia-<regiao>.csv` e `medicoes.json` em cada pasta. No Buser, `cursor.csv` traz a ponta do cursor falso por quadro.
3. `estudio/scripts/folhas_referencias.sh` gera as folhas de contato e os quadros-chave em `<ref>/quadros/`.
4. Cruzei cada número do vídeo com o CSS da própria página (lido do navegador). Quando os dois existem, o CSS é o valor exato e o vídeo diz quanto do movimento o olho de fato vê.

Limites da medição, que valem para todas as tabelas:

- O Playwright grava a 25 qps. Um quadro da gravação dura 40 ms; toda duração medida no vídeo tem ±40 ms.
- O relógio da gravação estica até 8% depois de uns 20 s gravando (o screencast do Chrome atrasa). Intervalos longos medidos no fim da gravação saem até 8% maiores que o CSS. Para intervalos, vale o CSS.
- O VP8 grava um quadro-chave a cada 128 quadros (5,12 s); a troca de qualidade nesses quadros foi descartada como ruído.
- Conversão para o filme: quadros a 30 qps = ms × 0,03, arredondado.

## 1. ai-services: "Uma política, de ponta a ponta" (movimento e transição)

A cena roda uma linha do tempo de 13 s por cenário, disparada quando o cenário entra. Ela toca uma vez e segura o estado final: numa primeira gravação (substituída por esta, que clica nas abas) ficou 45 s parada no último quadro, sem recomeçar. Os outros cenários entram pelo clique na aba, com troca seca (1 quadro) e a montagem recomeça do zero.

### Cronologia declarada no CSS (cenário Caixa)

| t (s) | O que acontece | Duração e curva |
|---|---|---|
| 0,10 | passo 01 sobe 10 px | 500 ms, `cubic-bezier(0.2, 0.7, 0.2, 1)` |
| 0,40 a 0,85 | chips de fonte sobem, um a cada 150 ms | 400 ms, `ease` |
| 1,05 | seta aparece | 350 ms, `ease` (só opacidade) |
| 1,35 | chip de regra "pula" (escala 0,8 → 1,06 → 1) | 500 ms, `cubic-bezier(0.2, 1.3, 0.4, 1)` |
| 2,20 | passo 02 sobe | 500 ms |
| 2,55 a 4,35 | carregando aparece (250 ms), gira (0,8 s por volta), some (250 ms) | |
| 4,25 | selo "baixado" entra de escala 1,35 para 1 | 400 ms, `cubic-bezier(0.2, 1.3, 0.4, 1)` |
| 4,70 | passo 03 sobe | 500 ms |
| 5,10 / 5,70 | regra nova pula; depois a linha brilha (anel de 4 px, pico em 40%) | 500 ms; brilho 1,8 s |
| 6,50 | passo 04 sobe (escalada para uma pessoa) | 500 ms |
| 7,20 | pedido "Aprovar a baixa?" sobe | 450 ms, `ease` |
| 7,60 em diante | pulso âmbar (anel de 4 px a 20%) | 2,6 s, `ease-in-out`, infinito |
| 0 a 7,6 | faísca desce pela espinha e para em cada passo (14%, 40%, 66%, 100% da altura) | 13 s, linear, com paradas nos tempos dos passos |
| sempre | ponto "ao vivo" | anel 0 → 7 px, 2 s, `ease-out`, infinito |

O carregando começa a sair (4,10 s) antes de o selo entrar (4,25 s): 100 ms de sobreposição, 3 quadros a 30 qps. Um elemento entrega a vez ao outro sem buraco.

### O que o vídeo mostra

Zero do cenário Caixa = 1,66 s do vídeo. Cenários Provisão e Receita contados a partir do quadro da troca de aba (21,60 s e 37,72 s).

| Elemento | Medido no vídeo (Caixa / Provisão / Receita) | Declarado | A 30 qps |
|---|---|---|---|
| Entrada do passo 02 (após o zero) | 2,14 / 2,32 / 2,40 s | 2,20 s | 66 q |
| Entrada do passo 03 | 4,62 / 4,96 / 5,08 s | 4,70 s | 141 q |
| Entrada do passo 04 | 6,54 / 6,84 / 7,04 s | 6,50 s | 195 q |
| Passo sobe: mudança visível | 400 ms típico (280 a 440 em 9 amostras, passos 02 a 04 nos 3 cenários) | 500 ms | 12 q visíveis de 15 |
| Passo sobe: 90% assentado | 280 a 320 ms (8 de 9 amostras; uma deu 200) | | 9 q |
| Linha "Acme Logística" sobe: 90% | 200 a 280 ms | 500 ms | 7 a 8 q |
| Selo "baixado": mudança visível | 160 a 200 ms | 400 ms | 5 a 6 q |
| Selo "baixado": 90% assentado | 120 a 160 ms | | 4 a 5 q |
| Pedido de aprovação: visível / 90% | 320 a 400 ms / 240 a 280 ms | 450 ms | 12 q / 8 q |
| Carregando, atividade total | 1,96 a 2,00 s | 1,80 s | 54 a 60 q |
| Intervalo entre passos | 2,48 / 1,92 s (Caixa) | 2,50 / 1,80 s | 75 / 54 q |
| Montagem completa | 7,65 s até o último elemento parar | 7,65 s | 230 q |

Leitura: com a curva que pousa macio, um terço final da duração declarada quase não aparece. Um movimento de 500 ms parece pronto em 300 ms. O selo com a curva que passa do ponto parece instantâneo (5 quadros), e por isso funciona como carimbo.

Folhas: `quadros/folha-passo2-sobe-40ms.png` (passo 02 quadro a quadro), `quadros/folha-carimbo-40ms.png` (selo passando do ponto), `quadros/folha-pedido-40ms.png`, `quadros/folha-cena-caixa-0500ms.png` (a montagem inteira a cada 500 ms) e os quadros-chave `quadro-00` a `quadro-05`.

Não deu para medir no vídeo o pulo do chip de regra: depois de entrar, os chips de regra e de fonte mudam em todo quadro (um brilho contínuo da página), e a rajada do pulo se funde com ele. O valor do pulo fica o do CSS (500 ms). A faísca da espinha é fina e clara demais para o limiar; os 7,6 s dela também saem do CSS.

### Tipografia da cena (computada no navegador)

| Elemento | Tamanho | Peso | Observação |
|---|---|---|---|
| Título do hero | 64 px | 300 | tracking −0,96 px (−0,015 em) |
| Título do cartão | 26 px | 300 | tracking −0,52 px |
| Verbo do passo | 16,5 px | 600 | |
| Linha de transação | 13 px | 400 | |
| Chip de regra | 10,5 px | 700 | |
| Selo | 8,5 px | 700 | caixa alta, +0,07 em |
| Pedido | 11 px | 400 | balão escuro, raio 10/10/10/3 px |

Palavras visíveis no estado final: 36 (Caixa), 28 (Provisão), 29 (Receita). Por batida: 8, 6, 7 e 7 palavras.

## 2. Buser: "sem agente" e "com agente" (ritmo de demo)

Seção `#fluxos`. Um interruptor troca a tela de quem concilia na mão (ciclo de 12 s) pela tela com o agente (ciclo de 8 s). Tudo é SVG com `@keyframes` em CSS; o cursor anda por `offset-path`.

### Sem agente: cursor falso, ciclo de 12 s (CSS)

| Trecho | t (s) | Duração | O que a tela faz |
|---|---|---|---|
| cursor parado | 0 a 1,2 | 1,2 s (36 q) | uma linha da planilha Totalbus acende de 0,36 a 1,92 s ("lendo") |
| anda 1 | 1,2 a 3,36 | 2,16 s (65 q) | até o extrato do banco |
| anda 2 | 3,36 a 5,52 | 2,16 s (65 q) | faixa desce o extrato 4 linhas, 480 ms por linha (14 q) |
| anda 3 | 5,52 a 6,48 | 0,96 s (29 q) | até a célula de conciliação; a célula ganha contorno |
| digita | 6,48 a 9,12 | 2,64 s | cursor de texto pisca a cada 240 ms; o texto se revela em 2,16 s |
| segura | 9,12 a 10,56 | 1,44 s (43 q) | célula preenchida, parada |
| some | 10,56 a 11,28 | 0,72 s | cursor apaga |

Cada trecho do cursor usa `cubic-bezier(0.2, 0.8, 0.2, 1)`. No vídeo, a parte em que o cursor anda mais de 1 px por quadro dura 1,48 s, 1,48 s e 0,92 a 0,96 s: a cauda do pouso (os últimos 30% do tempo) fica abaixo de 1 px por quadro e o olho lê como parada.

### Com agente: clique e resultados, ciclo de 8 s

| Evento | Declarado | Medido no vídeo | A 30 qps |
|---|---|---|---|
| Botão afunda (escala 0,96) e volta | 160 ms descendo, 240 ms voltando | 440 a 480 ms visíveis, 90% em 360 ms | 5 q + 7 q |
| Anel do clique (escala 1 → 1,35, some) | 720 ms | dentro da rajada do botão | 22 q |
| Linha de status "agente rodando · cascata de parâmetros…" | entra em 0,48 s, 240 ms | 440 ms (soma com o anel) | 7 q |
| Resultado por linha | um a cada 720 ms | 744 e 768 ms (média de 2 ciclos) | 22 q |
| Entrada de cada resultado (sobe 4 px + opacidade) | 240 ms | 160 a 240 ms, 90% em 120 a 160 ms | 7 q |
| Pontinhos de carregando antes do resultado | 0,55 s + 720 ms por linha | fracos demais para o limiar | |
| Tabela completa + "concluído em segundos · 6 de 6 linhas" | 2,4 a 2,6 s parados | 2,5 s | 75 q |

Cada linha roda o próprio ciclo de 8 s, defasado 720 ms da anterior. A tabela nunca fica vazia: uma linha sai, mostra o carregando e volta. O botão pisca a cada 8,32 s no vídeo (8 s no CSS).

Folhas: `quadros/folha-sem-agente-0500ms.png`, `quadros/folha-com-agente-0400ms.png`, `quadros/folha-botao-afunda-40ms.png`, `quadros/folha-resultado-entra-40ms.png` e quadros-chave.

## 3. Comp: o P&L que se monta (composição de demo)

Palco preso na tela (`position: sticky`) dentro de um trilho de 480vh. A rolagem divide o trilho em 4 atos; cada ato liga uma classe e as transições CSS fazem o resto. A rolagem só escolhe o ato; o tempo de cada entrada é fixo. Como o salto de rolagem faz o screencast perder quadros, gravei cada ato rearmado com a rolagem parada, pela lógica da própria página.

| Ato | Legenda (1 frase) | Entrada declarada | Medido no vídeo |
|---|---|---|---|
| 1 | "Quatro agentes trabalhando em paralelo, o dia inteiro." | grupo vem 72 px da esquerda; opacidade 0,7 s, posição 0,85 s; 120 ms entre agentes | 1,24 s do primeiro ao último parado; 90% em 840 ms |
| 2 | "Um orquestrador reúne o que cada um produziu." | escala 0,86 → 1 em 0,75 s; fios se desenham | 920 ms; 90% em 480 ms |
| 3 | "Tudo desemboca na mesma base de dados." | painel vem 72 px da direita; 0,7 / 0,85 s | 1,04 s; 90% em 240 ms |
| 4 | "O resultado do mês se monta linha a linha, em tempo real." | 7 linhas vêm 14 px da esquerda, 160 ms entre elas; opacidade 0,5 s, posição 0,6 s; linha de resultado entra 1,3 s depois, 0,6 s | uma linha a cada 153 ms em média (80 a 200); cada linha 360 a 680 ms visíveis, 90% em 280 a 360 ms; resultado 1,28 s depois da primeira |

Todas as curvas do palco são `cubic-bezier(0.2, 0.8, 0.2, 1)`. A legenda troca por opacidade em 500 ms (240 a 320 ms visíveis), com frases de 8 a 11 palavras em 17 a 23 px, peso 300.

Folhas: `quadros/folha-ato1-agentes-80ms.png`, `quadros/folha-ato3-painel-80ms.png`, `quadros/folha-ato4-linhas-80ms.png` e um quadro final por ato.

## 4. O que tirei para o estilo

- Uma curva de pouso só, `cubic-bezier(0.2, 0.8, 0.2, 1)`, para quase tudo; a variante `(0.2, 0.7, 0.2, 1)` para passos que sobem. Passar do ponto só em selo e confirmação.
- Entrada visível de 300 a 400 ms (9 a 12 quadros) para elementos de linha; de 1,0 a 1,2 s para blocos grandes que deslizam 72 px.
- Intervalo entre linhas de uma lista: 120 a 160 ms (4 a 5 quadros). Intervalo entre itens que "o agente processa": 720 ms (22 quadros).
- Batidas de uma sequência narrada a cada 1,8 a 2,5 s, com 6 a 8 palavras por batida: cerca de 3,8 palavras por segundo, numa cena que a pessoa pode rever no loop.
- Estado completo parado antes de recomeçar: 2,5 s (Buser) ou indefinido (ai-services).
- Um elemento passa a vez ao outro com sobreposição de 100 ms (carregando sai, selo entra).
- Movimento de cursor de 0,96 a 2,16 s por trecho, com parada de 1,2 s antes e de 1,4 s depois de agir.
