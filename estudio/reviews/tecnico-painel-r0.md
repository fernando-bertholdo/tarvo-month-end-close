# Relatório técnico: painel da analista, rodada r0

Engenheiro de render, 18/10/2026, 21:19 BRT (19/10 00:19Z). Evidência para o Crítico; não é prova de
qualidade. O Crítico avalia as telas e o vídeo, não este texto.

## O que foi gerado

| Item | Onde |
|---|---|
| Página (modelo) | `src/tarvo/vitrine/painel.html` (204 KB, Manrope embutida em base64) |
| Página gerada pelo comando | `relatorio/painel.html` (cerca de 1,6 MB: página, 2.507 eventos, saídas do motor e linhas de origem) |
| Telas | `estudio/out/previews/painel/*.png` (31 telas) |
| Vídeo da Reprodução inteira em 1x | `estudio/out/previews/painel/reproducao-1x.mp4` (1440×900, 30 qps, 94,4 s) |
| Relatório da captura (máquina) | `estudio/out/previews/painel/captura.json` |
| Folha de contato | `estudio/reviews/contact-sheets/painel-r0.png` (30 telas; a página inteira do Resumo fica de fora por não caber na caixa) |
| Quadros do vídeo | `estudio/reviews/frames/painel-r0/` (um quadro a cada 6 s; olhar chegando na primeira exceção, a cada 100 ms) |
| Scripts | `estudio/scripts/capturar_painel.mjs`, `estudio/scripts/folha_painel.py` |

Como reproduzir, da raiz: `python3 -m src.tarvo dados`, `python3 estudio/scripts/extrair_dados.py`,
`node estudio/scripts/capturar_painel.mjs` (cerca de 4 min: telas, vídeo em tempo real, modo ao vivo),
`python3 estudio/scripts/folha_painel.py r0`.

## Telas capturadas (momentos do storyboard)

1440×900, tema claro: Resumo ao abrir (`01`, e a página inteira em `01b`); Reprodução em 3 s, 10 s,
25 s (`02` a `04`), na primeira exceção (`05`, relógio 11.479 ms), na primeira pendência (`06`) e no fim
(`07`, recapitulação); depois de "Pular para o que precisa de uma pessoa" na Reprodução (`08`) e no
Resumo (`09`); filtro "Financeiro 12" (`10`); Mergulho da Rota Global aberto, com o contador
assentado (`11`) e rolado até a linha de origem e o Rastro técnico (`12`). Extras: Mergulho da Atlas
(`13`), de uma pendência de extrato (`14`), da comissão (`15`) e de um lojista (`16`); modo projeção
(`17`).

1280×720: Resumo (`20`), Mergulho da Rota Global (`21`), Reprodução em 25 s (`22`).

`prefers-reduced-motion`: Resumo (`30`); "Tocar o fechamento" abre no estado final, parado, com
passo a passo (`31`); dois passos para trás (`32`).

Tema escuro por `prefers-color-scheme`: Resumo, Mergulho e Reprodução (`40` a `42`).

Modo ao vivo: `50` a `53` (abaixo).

As telas da Reprodução saem de um `seek` no relógio único: o mesmo tempo dá sempre o mesmo estado
(semente fixa 20260930). Elas mostram o estado assentado; o movimento está no vídeo.

## Técnico

- **Console:** sem erros nem avisos em todos os contextos (1440, 1280, movimento reduzido, tema
  escuro, vídeo, ao vivo).
- **Rolagem lateral:** nenhuma em nenhuma das 31 telas (`scrollWidth` ≤ largura da janela), inclusive
  no modo projeção e com a gaveta aberta.
- **Fonte:** Manrope carregada em todas as telas (`document.fonts.check('700 20px Manrope')`),
  embutida como data URI. A página não carrega nada de fora: nenhuma URL externa; os três `fetch` só
  existem no modo ao vivo, para `/rodar` e `/dados` do próprio servidor.
- **Reprodução:** 90,1 s de relógio em 1x (45 s em 2x). Primeira exceção aos 9,9 s, primeira
  pendência aos 20,9 s. No vídeo, a reprodução levou 90,3 s de parede para 90,1 s de relógio: o 1x
  bate com o tempo real.
- **Vídeo:** feito de capturas de tela da reprodução real, em 1x (2.385 quadros, 25,3 por segundo,
  maior intervalo 95 ms), cada quadro com sua duração real, montado a 30 qps pelo FFmpeg. O
  `recordVideo` do Playwright foi descartado: no Mac ele grava só a janela headless, que o Chrome
  limita à área útil da tela, e os 88 px de baixo saem cinza (as gravações de referência em
  `estudio/referencias/` têm a mesma faixa). O vídeo começa no Resumo, clica em "Tocar o fechamento"
  aos 1,6 s e termina 2,5 s depois de voltar ao Resumo.
- **Movimento reduzido:** a página abre no Resumo; "Tocar o fechamento" abre a Reprodução parada no
  estado final (etapa 6), com "Passo" para trás e para frente; troca só por opacidade (120 ms).
- **Acessibilidade básica:** todo controle é `button`; foco visível em acento; a gaveta é um
  `dialog` não modal que recebe o foco, fecha com Esc e devolve o foco a quem a abriu; a região de
  anúncio (`role="status"`) fala só na troca de etapa, em cada pendência e nos filtros, nunca a cada
  evento.

## Modo ao vivo

`python3 -m src.tarvo.servidor dados --porta 8771 --sem-navegador`, subido e derrubado pelo próprio
script. `GET /` agora entrega a página sem eventos; `GET /dados` (novo) entrega as linhas de origem e,
depois da rodada, as saídas conferidas contra os eventos dessa rodada.

- `50`: antes de rodar, nenhum número na tela.
- Clique em "Rodar fechamento" pelo Playwright; `51` aos 9 s: eventos chegando por SSE, mesa e
  impacto reagindo (indicadores só com dinheiro fechado).
- A rodada levou 60,8 s com o ritmo de apresentação do servidor; log: "rodada concluída em 0.1 s,
  2507 eventos". `52`: Resumo montado com os eventos recebidos. `53`: Mergulho da Rota Global com os
  dados de `/dados`.
- Os números do Resumo e do Mergulho ao vivo conferem com o `fechamento.json` (abaixo). Servidor
  encerrado; porta 8771 livre ao final.

## Números conferidos na tela contra o motor

A captura lê o texto da camada principal (sem o Rastro técnico) e procura cada valor formatado a partir
de `estudio/dados/fechamento.json`. **73 de 73 conferem** (Resumo a 1440 e a 1280, Mergulhos da Rota
Global e da Atlas, filtro, ao vivo).

| Valor | Na tela |
|---|---|
| Comissão de checkout e de remessa | R$ 203.735,34 e R$ 39.543,45; total R$ 243.278,79 |
| Taxa acima do contrato | R$ 2.995,11 = cobrar da Orbe R$ 1.576,23 + contestar com a Ponte R$ 1.418,88 |
| A devolver à Casa do Estudante | R$ 15.396,77 |
| Atlas | ≈ R$ 7,9 mil, marcado como estimativa (soma da taxa da Orbe nas 57 linhas: R$ 7.876,05). O bruto de R$ 262.138,61 só aparece no Mergulho, como "57 lançamentos (49 vendas, 5 antecipações, 2 reversões de antecipação e 1 estorno)" e "não receita da Tarvo" |
| Notas a emitir | 21 notas, R$ 243.284,29 |
| Pendências | 15: Financeiro 12, Comercial 2, Tesouraria 1 (o filtro mostra 12 itens) |
| Rota Global | venda de 12/09/2026, 8 parcelas, R$ 6.449,10; contrato 3,59%, a Orbe cobrou 4,09%; R$ 32,25 nesta venda; 87 operações; R$ 1.546,28 a cobrar; para o Financeiro decidir; relatório da Orbe, linha 727 (a linha crua bate com `linha_origem_texto`) |

Conferência do final da Reprodução contra o resumo do evento `fim` do motor
(`window.__painel.conferencia()`): comissão de checkout e de remessa, divergência Orbe e Ponte,
devolução da Casa, bruto da Atlas, total e quantidade de notas, quantidade de pendências; tudo igual,
centavo a centavo. Linguagem do motor (F11, TX, PEN, DIV, NF, LAN, nome de arquivo, seta, "≤", formato
americano, "262 mil") na camada principal: nenhuma ocorrência.

## Integridade do motor

Os seis CSVs de `saida/` saíram idênticos aos de antes (shasum) depois de todas as rodadas, inclusive a
do modo ao vivo. `relatorio/eventos.jsonl` é igual ao do commit 44a6536 fora de `ts` e `duracao_s`.
`src/tarvo/engine.py` não foi tocado.

## Fora da prioridade ou não resolvido

- **"≈" na fonte do sistema.** O glifo não existe na Manrope servida; cai na fonte de sistema. A seta
  existe no arquivo, mas fora da faixa declarada, e não é usada.
- **Duração do motor varia por rodada** (0,06 a 0,08 s): cada tela mostra a da rodada que a gerou. A
  rodada do modo ao vivo regravou `relatorio/painel.html` por último.
- **Olhar na troca de janela:** quando a mesa pula para a linha de uma exceção, a janela aparece com
  fade de 250 ms e o selo carimba junto, não depois de o olhar assentar.
- **Tema escuro:** existe pelos tokens do `STYLE.md` e por `prefers-color-scheme`, com botão
  "Tema escuro" no rodapé do Resumo; não houve revisão fina de contraste além dos tokens aprovados.
- **Projeção:** o modo existe (× 1,25, coluna única no Resumo); a Reprodução em projeção a 1280×720
  rola na vertical.
- **Ao vivo:** durante a rodada, os grupos de divergência mostram o nome do lojista como veio no
  arquivo (em caixa alta); o nome do cadastro entra quando a rodada termina e as saídas chegam.
