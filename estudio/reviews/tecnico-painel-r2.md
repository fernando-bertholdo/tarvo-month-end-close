# Relatório técnico: painel da analista, rodada r2

Engenheiro de render, 19/10/2026, 00:04 BRT (19/10 03:04Z). Correção local dos
`findings-painel-r1.md` com a decisão do Diretor: seção 5 inteira, defeitos 01 a 03 pela menor correção
do Crítico, achados 2 a 12. Evidência para o Crítico; não é prova de qualidade. O Animador não aprova o
próprio trabalho.

## O que foi gerado

| Item | Onde |
|---|---|
| Página (modelo, fonte editável) | `src/tarvo/vitrine/painel.html` (236 KB, Manrope embutida) |
| Página gerada pelo comando | `relatorio/painel.html` (1,7 MB), de `python3 -m src.tarvo.painel relatorio/eventos.jsonl relatorio/painel.html` |
| Telas r2 | `estudio/out/previews/painel/*.png`: 56 da captura e 4 do modo ao vivo (`50` a `53`) |
| Telas r1, para comparar | `estudio/out/previews/painel-r1/` (as 42 peças da r1, movidas antes de a r2 gravar) |
| Vídeo da Reprodução inteira em 1x | `estudio/out/previews/painel/reproducao-1x.mp4` |
| Relatórios da captura (máquina) | `estudio/out/previews/painel/captura.json` e `captura-vivo.json` |
| Folha de contato | `estudio/reviews/contact-sheets/painel-r2.png` (59 telas; a página inteira do Resumo, `01b`, fica de fora por não caber na caixa) |
| Quadros do vídeo | `estudio/reviews/frames/painel-r2/`: um quadro a cada 5 s; o fecho do checkout a cada 250 ms |
| Scripts | `estudio/scripts/capturar_painel.mjs` (ajustado para a r2), `estudio/scripts/folha_painel.py` |

Como reproduzir, da raiz do repositório:

```text
python3 -m src.tarvo.painel relatorio/eventos.jsonl relatorio/painel.html
node estudio/scripts/capturar_painel.mjs --sem-vivo          # cerca de 8 min: telas, 1x em vídeo, 2x cronometrado
PAINEL_RAIZ_VIVO=<cópia do repositório> node estudio/scripts/capturar_painel.mjs --so-vivo
python3 estudio/scripts/folha_painel.py r2
```

O motor não rodou no repositório nesta rodada. `engine.py` e `saida/` não foram tocados.

## Hashes conferidos

`shasum -a 256 -c estudio/out/final/congelado/SHA256SUMS`, da raiz, depois da última geração do painel e
do modo ao vivo:

```text
relatorio/eventos.jsonl: OK
relatorio/execucao.json: OK
relatorio/painel.html: FAILED
estudio/dados/fechamento.json: OK
saida/comissoes_por_lojista.csv: OK
saida/divergencias_taxa.csv: OK
saida/lancamentos_classificados.csv: OK
saida/notas_a_emitir.csv: OK
saida/pendencias.csv: OK
saida/rastro.csv: OK
```

Só o `relatorio/painel.html` muda, como esperado: é a página r2. SHA-256 da página entregue:
`e20157a205359cb5bfcd7b6bd575663d4a5f48867584d9be07258cc2691d395d`. Todas as telas e o vídeo saíram
dessa página.

## Duração

| Medida | Valor |
|---|---|
| Relógio da Reprodução | **100,5 s** (100.491 ms); r1: 138,7 s |
| 1x, na parede (vídeo, do clique à volta ao Resumo) | 100,8 s |
| 2x, na parede (cronometrado na captura) | **50,4 s** |
| Arquivo de vídeo | 1440×900, H.264, 30 qps, 105,0 s (1,6 s antes do clique e 2,5 s depois da volta ao Resumo) |
| Captura dos quadros do vídeo | 2.123 capturas de tela durante a reprodução real, 20,2 por segundo, maior intervalo 116 ms; cada uma dura o tempo real até a seguinte |

Por etapa (relógio): ler os arquivos 4,7 s (r1 4,7); checkout 33,2 s (46,0); remessa 30,6 s (45,6);
notas 12,6 s (20,8); extratos 14,6 s (16,7); recapitulação 4,4 s (4,4). Primeira exceção aos 11,1 s;
primeira pendência aos 25,8 s (r1 29,1 s).

## Auditoria do relógio, item a item

Cada linha que pausa fica na tela pelo menos `entrada (500 ms) + max(1500, 670 + 270 × palavras)` ms,
com variação de até 8% para cima, por semente fixa. Num grupo, o relógio conta do último item e soma as
palavras do grupo todo. "Parado" é o tempo com o texto completo assentado. Fonte: `captura.json` →
`pausas`.

| Relógio | Item | Palavras | Regra (ms) | Na tela (ms) | Parado (ms) |
|---|---|---|---|---|---|
| 0,4 s | Etapa 1, "Lendo os arquivos do mês, como chegaram." | 7 | 2.560 | 4.719 | 4.219 |
| 5,1 s | Etapa 2, "Conferindo cada venda contra a taxa do contrato." | 8 | 2.830 | 3.568 | 3.068 |
| 11,1 s | Primeira exceção, Rota Global | 16 | 4.990 | 5.560 | 5.060 |
| 17,3 s | Exceção da Bridge, **pausa mínima por decisão do Diretor** | 15 | 1.500 | 2.049 | 1.549 |
| 20,9 s | "Fechando a comissão de cada lojista." (checkout) | 13 | 4.180 | 4.985 | 4.485 |
| 25,8 s | Grupo "Cobrar da Orbe": Rota Global e Bridge Idiomas | 12 | 3.910 | 4.821 | 4.161 |
| 30,7 s | Devolver à Casa do Estudante | 8 | 2.830 | 3.537 | 3.037 |
| 34,2 s | Confirmar a taxa da Atlas Idiomas | 10 | 3.370 | 4.160 | 3.660 |
| 38,4 s | Etapa 3, remessa | 9 | 3.100 | 3.674 | 3.174 |
| 42,1 s | Primeira exceção da remessa, Mundo Aberto | 18 | 5.530 | 6.103 | 5.603 |
| 49,2 s | Operação repetida · Bagagem Livre | 7 | 2.560 | 3.215 | 2.715 |
| 52,6 s | Grupo dos quatro spreads negativos (atraso de lista de 160 ms) | 21 | 6.340 | 7.741 | 6.761 |
| 60,4 s | "Fechando a comissão de cada lojista." (remessa) | 13 | 4.180 | 4.877 | 4.377 |
| 65,3 s | Contestar com a Ponte · Mundo Aberto | 9 | 3.100 | 3.671 | 3.171 |
| 68,9 s | Etapa 4, notas | 9 | 3.100 | 3.726 | 3.226 |
| 72,7 s | Casa do Estudante sem nota | 8 | 2.830 | 3.521 | 3.021 |
| 77,0 s | Conferir o crédito da Ponte contra a nota (nota da Ponte, uma batida) | 11 | 3.640 | 4.434 | 3.934 |
| 81,5 s | Etapa 5, extratos | 7 | 2.560 | 3.326 | 2.826 |
| 86,0 s | Pix recebido sem identificação | 7 | 2.560 | 3.095 | 2.595 |
| 89,1 s | Repasse devolvido · Mundo Aberto | 7 | 2.560 | 3.217 | 2.717 |
| 92,3 s | Transferência para o Meridiano, em trânsito | 9 | 3.100 | 3.747 | 3.247 |
| 96,1 s | Recapitulação, "15 decisões para pessoas." | 12 | 3.910 | 4.410 | 3.910 |

22 itens; nenhum fica menos que o exigido (menor sobra 0 ms). O único abaixo da regra de palavras é a
Bridge (1.549 ms parados para 15 palavras), como o Diretor decidiu. Tempo por tipo: etapas 19,0 s;
exceções 13,7 s (r1 16,1); fechos 9,9 s (10,0); pendências 45,2 s (r1 74,6, mais 5,8 da nota da Ponte);
recapitulação 4,4 s.

## Contagens

- **Em todo quadro:** a captura varreu o relógio inteiro a cada 250 ms (402 amostras): decisões = regra
  + sinalizadas + pessoa em todas (a etapa 1 conta arquivos). Fonte: `captura.json` → `varredura`.
- Nos momentos capturados: 3 s (3 arquivos), 10 s (129 = 129 + 0 + 0), 25 s (1.992 = 1.900 + 92 + 0),
  primeira exceção (723 = 722 + 1 + 0), primeira pendência (1.994 = 1.900 + 92 + 2), Mundo Aberto
  (6 = 5 + 1 + 0), spreads (245 = 218 + 22 + 5), nota da Ponte (23 = 20 + 1 + 2), fim e movimento
  reduzido (2.463 = 2.332 + 116 + 15).
- Final da Reprodução contra o resumo do motor (`conferencia`): comissão de checkout e de remessa,
  divergências da Orbe e da Ponte, devolução da Casa, bruto da Atlas, valor e número de notas,
  pendências. Igual centavo a centavo.

## Item a item

| Item | O que mudou | Onde conferir |
|---|---|---|
| **Defeito 01**, parcial vira total ao pausar | "fechando…" depende do estado (lojista da frente ainda aberto), não da animação. Pausado, o cartão diz "checkout fechando… (6 de 21 lojistas)"; antes do primeiro lojista, "nada fechado ainda". A soma continua subindo pelos lojistas enquanto toca. Com a soma corrida em zero ou negativa, o número dá lugar a "fechando…". Passo a passo reduzido e finais iguais. | `pausa-1x-checkout-a`, `-checkout-b`, `-remessa` e os mesmos em `pausa-2x-*` (reprodução real, pausada e fotografada 2 s depois; 10 leituras do cartão por pausa, todas com "fechando…"); `22b-rep-fecho-1280` (o antigo `22-rep-25s-1280`); varredura sem nenhum parcial sem "fechando…"; `frames/painel-r2/painel-r2-fecho-checkout-250ms.png` |
| **Defeito 02**, projeção trunca | Colunas da mesa com a largura do maior valor e do cabeçalho de cada fonte, medidos no navegador; nenhuma reticência em número nem em cabeçalho. Em projeção: mesa e impacto lado a lado, 5 linhas na mesa, selo em duas linhas ("Decide: / Financeiro", "Acima do / contrato"), nome em até duas linhas. A 1280×720 a projeção fica compacta: sem a legenda da mesa, abas curtas, comissão e notas lado a lado, dinheiro em jogo numa linha, donos no cabeçalho de "Decisões que importam". A linha do motor fica com 25 px em projeção. | `rep-proj1440-13s`, `-30s`, `-56s`, `-108s` e `rep-proj1280-*`. Momentos equivalentes aos antigos: 13 s, primeira exceção da Rota Global (relógio 13,1 s); 30 s, primeira pendência, grupo "Cobrar da Orbe" (27,8 s); 56 s, primeira exceção da remessa, Mundo Aberto (44,1 s); 108 s, nota única da Ponte (78,6 s). Nas 8: lado a lado, 5 linhas, contagem e primeira decisão acima da legenda, nenhuma célula nem selo cortado (`captura.json` → `projecao_rep`) |
| **Defeito 03**, Mundo Aberto | O número de cima é a base do spread: "R$ 9.830,65", "CAD 2.438,46 à PTAX 4,0315"; "Valor pago pelo cliente: R$ 9.978,18". Taxas na precisão do motor: 1,20% e 1,5007%, "0,3007 ponto acima do contrato"; R$ 29,56, 23 operações, R$ 1.418,88 e a ordem dos elos preservados. Origem: a base é Valor ME × PTAX Ref. da linha 10 do anexo da Ponte (o produto da regra F15/F95); não existe em `fechamento.json` nem em `saida/`, e a tela a calcula dessa linha. 1,5007% vem de `divergencias_taxa.csv`. Na Reprodução: "Ponte aplicou 1,5007% sobre R$ 9.830,65; contrato 1,20%." | `g-mundo-aberto-1440`, `-1280`, `-projecao-1280`, `-projecao-1440`. Nas quatro, a captura lê a tela e confere 2.438,46 × 4,0315 = 9.830,65 e 9.830,65 × (1,5007 − 1,20)% = 29,56, e o dono à vista sem rolar (`mundo_aberto`). Legenda da Reprodução: `06d-rep-mundo-aberto`, `rep-proj*-56s` |
| **Seção 5.1**, pendência em uma linha | Mesa: "Motor", selo "Decide: <área>", título curto · valor. Impacto: ícone, título curto, valor, selo. | `06-rep-primeira-pessoa`, `07-rep-fim`, `08-rep-depois-de-pular`; auditoria acima |
| **Seção 5.2**, mesmo tipo em sequência vira grupo | Cabeçalho do grupo e itens com atraso de lista (160 ms); uma pausa, contada do último item, com as palavras do grupo todo. Valeu para os quatro spreads e para as duas cobranças da Orbe. | `06c-rep-grupo-spreads`, `06-rep-primeira-pessoa`, `rep-proj*-30s` |
| **Seção 5.3**, nota da Ponte numa batida | A nota sinalizada seguida da pendência que ela abre vira uma linha: "Conferir o crédito da Ponte contra a nota · R$ 39.543,45". A nota continua contada em "Sinalizadas" (23 = 20 + 1 + 2). | `06b-rep-nota-ponte`, `rep-proj*-108s` |
| **Seção 5.4**, Bridge na pausa mínima | Entrada mais 1,5 s (2.049 ms na tela). | auditoria acima, linha de 17,3 s |
| **Achado 2**, "Para o Tesouraria decidir" | Selo "Decide: <área>" em todo lugar; o filtro diz "12 pendências de 15 no mês" com o selo. Leitor de tela: "… Decide: Tesouraria." | `07-rep-fim`, `fluxo-*-2-financeiro`, `13-mergulho-atlas`; a captura procura "Para o … decidir" em toda a camada principal: nenhuma ocorrência |
| **Achado 3**, total sem rótulo na gaveta | O total começa a contar no quadro em que "a cobrar da Orbe" começa a entrar; o dono espera a contagem parar. | `11-mergulho-rota-global`; `captura.json` → `contagem_rota`: 147 amostras por quadro, nenhum quadro com "R$ 32,25" e o rótulo visível; a contagem começa aos 485 ms (o atraso de lista do passo) e o dono aparece aos 1.717 ms |
| **Achado 4**, filtro esconde a contagem a 1280 | O filtro só rola se a linha "N pendências…" ou o primeiro item estiver fora da tela; se rola, para com essa linha logo abaixo do cabeçalho fixo. | `fluxo-1280-2-financeiro` (não rolou; linha e itens à vista), `fluxo-projecao-*-2-financeiro` (rolou; linha abaixo do cabeçalho) |
| **Achado 5**, nota da Ponte duas vezes | Ver seção 5.3. | `06b-rep-nota-ponte` |
| **Achado 6**, "R$ −5,50" no primeiro instante | Soma corrida em zero ou negativa: o número dá lugar a "fechando…", com "(1 de 21 lojistas)" embaixo; negativo como −R$. | `frames/painel-r2/painel-r2-fecho-checkout-250ms.png` (quadros 2 e 3) |
| **Achado 7**, dois contadores nas Notas | Valor e quantidade mudam no mesmo quadro. | `06b-rep-nota-ponte`, vídeo de cerca de 70 s a 80 s |
| **Achado 8**, texto corrido em 13 px | "São valores de natureza diferente…" e a explicação das notas a 17 px (21 em projeção). | `01-resumo-1440`, `20-resumo-1280`, `fluxo-projecao-*` |
| **Achado 9**, gaveta Mundo Aberto | Rótulos "Contrato" e "A Ponte aplicou", sem quebra, números alinhados embaixo; "CAD 2.438,46" e "PTAX 4,0315" com espaço inseparável; percentual negativo com U+2212 (a captura procura hífen antes de algarismo: nenhum). | `g-mundo-aberto-*` |
| **Achado 10**, duas formas de selo | Uma forma só (achado 2). | idem |
| **Achado 11**, rastro em formato americano | "O motor anotou" e "Pendência" em pt-BR; linha "Ressarcimento ao lojista: R$ 1.545,86: o que a Orbe descontou de fato, linha a linha. A cobrança à Orbe sai da fórmula do contrato: R$ 1.546,28." A linha original do arquivo continua como chegou. | `12-mergulho-rota-global-rastro` |
| **Achado 12**, redação | "Por que as notas somam R$ 5,50 a mais que a comissão"; "Spread negativo na remessa · Ponte Aérea", com "contestar com a Ponte Câmbio" no detalhe. | gaveta das Notas (clique em "Notas a emitir"), `fluxo-*-2-financeiro` |

Preservado e conferido: Resumo abre na resposta (`01`); nenhum código do motor na camada principal
(a captura procura códigos de regra, ids, nomes de arquivo, formato americano, seta: 0 ocorrências em
todas as telas); gaveta assentada em 1,8 s a 1,9 s e sem cobrir a linha clicada nos quatro modos;
filtro fecha a gaveta; Esc; passo a passo reduzido sem parcial (`31`, `32`); relógio único (o vídeo e
as pausas reais seguem o mesmo relógio que o `seek`).

## Técnico

- **Dimensões:** 1440×900 e 1280×720, `deviceScaleFactor` 1; vídeo 1440×900 a 30 qps.
- **Fontes:** Manrope embutida; `document.fonts.check('700 20px Manrope')` verdadeiro nas 60 telas.
- **Console:** nenhum erro ou aviso, em nenhum contexto (captura e modo ao vivo).
- **Rolagem lateral:** nenhuma, nas 60 telas.
- **Números:** 116 de 116 conferidos nas telas e 25 de 25 no modo ao vivo, contra `fechamento.json`,
  `saida/divergencias_taxa.csv` e a conta da Mundo Aberto.
- **Fluxo do pitch:** cadeia assentada em 1,8 s a 1,9 s; com a leitura pela regra, 25,5 s nos quatro
  modos (cabe nos ~45 s do storyboard).

## Modo ao vivo

Testado numa cópia do repositório (`src/`, `dados/`, `relatorio/`, `saida/`; sem `estudio/` nem
`.git`), na pasta temporária da sessão, com `PAINEL_RAIZ_VIVO` apontando para ela: o servidor real
(`python3 -m src.tarvo.servidor dados --porta 8771`) subiu nessa cópia, serviu a página r2 e rodou o
motor por SSE (2.507 eventos, rodada de 61,1 s no ritmo de apresentação). Telas `50` (antes de rodar,
nenhum número), `51` (rodando), `52` (Resumo montado com os eventos recebidos) e `53` (Mergulho da Rota
Global com `/dados` depois da rodada); 25 de 25 números batem. A rodada reescreveu `relatorio/` e
`saida/` da cópia (os CSVs saíram idênticos aos congelados); o repositório não foi tocado, e não houve
nada a restaurar. Servidor encerrado e porta livre.

## Escolhas para o Diretor ver

1. **Grupo além dos spreads.** A regra "mesmo tipo em sequência" também juntou as duas cobranças da Orbe
   (Rota Global e Bridge) num grupo "Cobrar da Orbe". Restringir aos spreads é trocar uma condição, e a
   reprodução passa a cerca de 102 a 103 s (as duas cobranças voltam a pausar uma de cada vez, cerca de
   3,3 s cada, em vez de 4,8 s juntas).
2. **Duração.** 100,5 s, meio segundo acima do teto de "~95 a 100 s".
3. **Precisão do spread.** Para a conta fechar na tela, a Ponte aparece com as quatro casas do motor
   (1,5007% e 0,3007 ponto, não 1,50% e 0,30), na gaveta, na linha do motor e na coluna da mesa
   (1,2500%, 1,5007%: quatro casas fixas, vírgula alinhada). A Orbe continua com duas, como no arquivo.
4. **Projeção compacta a 1280×720.** Para manter 5 linhas na mesa e a decisão mais nova à vista, a
   legenda "Mesa de trabalho…" sai, as abas ficam curtas e o cartão "Para uma pessoa decidir" vira o
   cabeçalho da lista ("4 pendências: Financeiro 2 · Comercial 2"). A 1440×900 a projeção mostra tudo.
5. **"Legenda do motor a 35 px".** Nenhum texto da Reprodução da r1 tinha 35 px em projeção; a linha do
   motor tinha 25 px (`--tam-cartao` × 1,25), e foi esse tamanho que ficou.
6. **Parcial no cartão.** Durante o fecho, o número grande sobe com a soma, e o "fechando… (k de N
   lojistas)" fica na linha de baixo, a 13 px (16 px em projeção), como o Crítico sugeriu. Se o Diretor
   quiser mais força, o rótulo do cartão também pode dizer "fechando…".
7. **Texto encurtado.** "Uma remessa contratada em" virou "Uma remessa de", para a cadeia da Mundo
   Aberto caber até o dono sem rolar em projeção a 1280×720.
