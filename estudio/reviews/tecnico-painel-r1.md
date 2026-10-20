# Relatório técnico: painel da analista, rodada r1

Engenheiro de render, 18/10/2026, 22:26 BRT (19/10 01:26Z). Correção local dos
`findings-painel-r0.md` com as decisões do Diretor. Evidência para o Crítico; não é prova de
qualidade.

## Ordem da rodada (achado 1)

1. Modo ao vivo contra o servidor real (`node estudio/scripts/capturar_painel.mjs --so-vivo`): telas
   `50` a `53`, relatório `captura-vivo.json`. Essa rodada regrava `relatorio/`.
2. `python3 -m src.tarvo dados` e depois `python3 estudio/scripts/extrair_dados.py`.
3. Telas e vídeo a partir desse `relatorio/painel.html` (`--sem-vivo`; o vídeo refeito com
   `--so-video` sobre o mesmo arquivo, porque a primeira gravação pegou uma travada de 2,8 s da
   máquina).

O `relatorio/painel.html` entregue, o `estudio/dados/fechamento.json` e todas as telas e o vídeo
mostram a mesma duração do motor: **0,06 s**. A captura confere "Fechado em 0,06 s" no cabeçalho contra
o `fechamento.json`. As telas do modo ao vivo mostram a duração da rodada ao vivo (também 0,06 s
nesta rodada), que é outra execução.

## Defeito, o que mudou, onde conferir

| Defeito | O que mudou | Onde conferir |
|---|---|---|
| **01** Contagem que não fecha | Contador "Sinalizadas" conta toda decisão com `peso: atencao` (116 = 115 divergências + nota única da Ponte). Cada decisão cai em um balde só: regra, sinalizada ou pessoa. A linha da nota da Ponte leva o selo de exceção "Conferir o repasse" e o motor escreve "Sinalizada: conferir o crédito da Ponte contra a nota". "115 operações acima do contrato" continua em "Decisões que importam" e na tabela. | `06b-rep-nota-ponte` (22 = 20 + 1 + 1); `07-rep-fim` e `31-reduzido-reproducao` (2.463 = 2.332 + 116 + 15); vídeo de ~107 s a 117 s; `captura.json` → `contagens` (8 quadros, todos fecham) |
| **02** Gaveta ilegível de longe | Os seis elos em 28 px (35 em projeção): 3,59%, 4,09%, R$ 32,25, 87, R$ 1.546,28. Rótulos e "Decide: Financeiro" em 20 px (25), com ícone. "R$ 32,25 a mais nesta venda" e "87 operações assim" viraram número de cartão com apoio. No Resumo, o que cada número é passou a 20 px (partes da comissão, rótulos do dinheiro em jogo, "notas", "pendências", rotina). A cadeia cabe sem rolar até o dono em 1440×900, 1280×720 e projeção. | `11`, `21`, `fluxo-*-1-rota-global`; `captura.json` → `fluxo`: `menor_numero_px` 28 (35), `menor_rotulo_px` 20 (25), `dono_visivel_sem_rolar` true nos quatro |
| **03** Fluxo do pitch | O filtro de dono fecha a gaveta, mantém o foco no filtro e rola a lista para logo abaixo do cabeçalho fixo (só se ela não estiver à vista). Em projeção a gaveta fica em 440 px e só o conteúdo cresce; com a gaveta aberta, o Resumo (coluna única em projeção) abre espaço do lado dela e a linha clicada fica inteira à vista. | `fluxo-1440-*`, `fluxo-1280-*`, `fluxo-projecao-1280-*`, `fluxo-projecao-1440-*`; `captura.json` → `fluxo` (`gaveta_px` 440, `cobre_linha` false, filtro com 12 itens) |
| Achado 1 Duração do arquivo | Ordem da rodada acima. | cabeçalho de qualquer tela; `fechamento.json` → `duracao_s` |
| Achado 2 "notas emitidas" | "21 notas a emitir". | `07-rep-fim` |
| Achado 3 Pausas abaixo do piso | Todo item que pausa fica na tela `max(1500, 670 + 270 × palavras)` ms depois de assentar (entrada de 500 ms), contando selo, linha e complemento; sem atalho para item repetido. Um pós-processamento do relógio estica o passo anterior à troca até cumprir a regra. | `captura.json` → `pausas`: 27 itens, menor sobra 0 ms (lista com exigido e tempo na tela) |
| Achado 4 Dois contadores juntos | No fecho da comissão só o total conta; a parte em fechamento mostra "fechando…" e o valor quando o total assenta. Nenhum quadro mostra total menor que as partes à vista. | `reviews/frames/painel-r1/painel-r1-fecho-remessa-250ms.png` (vídeo de ~87 s a 91 s) |
| Achado 5 Filtro sem contagem | O cartão segue o filtro: "12 pendências para o Financeiro decidir, de 15 no mês". | `fluxo-*-2-financeiro` |
| Achado 6 Planilha "30 linhas" | Na mesa: "Planilha de taxas: só a aba vigente · 30 de 43" (a aba antiga, 13 linhas, fica fora; total igual ao `fechamento.json`). | `02-rep-03s` |
| Achado 7 Mesa fora de sincronia | "Fechando a comissão de cada lojista" mostra os lojistas fechando, com "Fechada", e não transações. A legenda por arquivo saiu (era a que dizia Meridiano com a aba Aurora). | `04-rep-25s`, `22-rep-25s-1280` |
| Achado 8 Contador do zero | O total da gaveta conta a partir de R$ 32,25 (o valor já na tela); "a cobrar da Orbe" e o dono entram logo depois de o contador parar. | `11` (assentado); abrir a gaveta da Rota Global |
| Achado 9 Sinal | A transferência ao Meridiano sai como −R$ 300.000,00 ("saída do Aurora"). | `07-rep-fim`, `01b-resumo-1440-inteira` |
| Achado 10 Ícone e nomes no ao vivo | Status do motor com ícone de relógio (neutro); grupos com o nome do cadastro da planilha ("Rota Global Intercâmbio Ltda", "Bridge Idiomas (NOVA)") já durante a rodada. | `51-vivo-rodando` |
| Achado 11 "Pular" esconde o título | `scroll-margin-top` igual ao cabeçalho fixo. | `09-resumo-depois-de-pular` |
| Achado 12 Spreads iguais (opcional, feito) | Título e meta levam o lojista do cadastro e a data da operação ("· Canguru", "contratada em 03/09/2026"); a operação repetida também. Nenhum código do motor. | `fluxo-*-2-financeiro` |
| Achado 13 Dinheiro em jogo como soma | No impacto, as três linhas ficam separadas por filete, com "natureza diferente, um é estimativa: não se somam". | `07-rep-fim`, `06b-rep-nota-ponte` |
| Achado 14 Evidência repetida | O quadro dos 10 s é outro momento (rotina em lote, antes da primeira exceção aos 11,1 s); a captura confere que os arquivos são diferentes. | `03-rep-10s` × `05-rep-primeira-excecao` |

## Duração da Reprodução (decisão 7)

**138,7 s em 1x (69,4 s em 2x)**, 38,7 s acima dos 100 s. Nenhum texto foi cortado. Onde vai o tempo,
pela auditoria do relógio (`captura.json` → `pausas`):

| Item que pausa | Tempo na tela |
|---|---|
| 15 pendências | 74,6 s |
| 5 legendas de etapa | 19,0 s |
| primeira divergência de cada lojista (Rota Global, Bridge, Mundo Aberto) | 16,1 s |
| 2 × "Fechando a comissão de cada lojista" | 10,0 s |
| nota única da Ponte | 5,8 s |
| recapitulação | 4,4 s |

Por etapa: ler os arquivos 4,7 s, checkout 46,0 s, remessa 45,6 s, notas 20,8 s, extratos 16,7 s,
pendências 4,4 s. A primeira exceção cai aos 11,1 s e a primeira pendência aos 29,1 s.

## Fluxo do pitch, cronometrado

Clique em "Rota Global Intercâmbio Ltda" na tabela, gaveta assentada, clique em "Financeiro 12". A
leitura usa a mesma regra de pausa sobre o texto que está na tela.

| Tela | Cadeia assenta | Leitura da cadeia | Filtro responde | Leitura da lista | Total |
|---|---|---|---|---|---|
| 1440×900 | 2,3 s | 12,3 s | 1,0 s | 10,9 s | 26,6 s |
| 1280×720 | 2,3 s | 12,3 s | 1,0 s | 10,9 s | 26,5 s |
| projeção, 1280×720 | 2,4 s | 12,3 s | 1,0 s | 10,9 s | 26,6 s |
| projeção, 1440×900 | 2,4 s | 12,3 s | 1,0 s | 10,9 s | 26,6 s |

Cabe nos ~45 s do storyboard com folga para a fala.

## Técnico

- **Números:** 66 de 66 nas telas e 25 de 25 no modo ao vivo, contra o `fechamento.json` (Resumo a
  1440 e a 1280, Mergulhos da Rota Global e da Atlas, rastro, cabeçalho, filtro, fluxo, fim da
  reprodução). Conferência do final da reprodução contra o resumo do motor: igual centavo a centavo.
- **Console:** sem erros nem avisos em todos os contextos. **Rolagem lateral:** nenhuma em 39 telas.
  **Linguagem do motor na camada principal:** nenhuma ocorrência.
- **Vídeo:** `out/previews/painel/reproducao-1x.mp4`, 1440×900, 30 qps, 143,2 s; quadros por captura
  de tela da reprodução real (20,3 por segundo, maior intervalo 236 ms); a reprodução levou 139,0 s de
  parede para 138,7 s de relógio. O clique em "Tocar o fechamento" é aos 1,6 s.
- **Modo ao vivo:** servidor na porta 8771, rodada de 60,3 s com o ritmo do servidor, 2.507 eventos;
  Resumo e Mergulho com `/dados` depois da rodada; servidor encerrado, porta livre.
- **Integridade:** os seis CSVs de `saida/` idênticos aos de antes (shasum) depois de todas as
  rodadas; `engine.py` intocado.
- **Quadros do vídeo para o Crítico:** `reviews/frames/painel-r1/` (um a cada 7 s; fecho da remessa a
  cada 250 ms; olhar na primeira exceção a cada 100 ms; nota da Ponte).
- **Folha de contato:** `reviews/contact-sheets/painel-r1.png` (38 telas: as 35 da captura menos a
  página inteira, mais as 4 do ao vivo).

## Não resolvido

- **Duração de 138,7 s:** é a regra de pausa aplicada a todo o texto escrito; cortar texto é decisão do
  Diretor.
- **"≈" na fonte do sistema:** o glifo não existe na Manrope servida.
- **Olhar na troca de janela:** quando a mesa pula para a linha de uma exceção, a janela entra com fade
  de 250 ms e o selo carimba junto, não depois de o olhar assentar (vem do r0; o Crítico não apontou).
- **Projeção com a gaveta aberta a 1280:** para a tabela de divergências caber ao lado da gaveta, a
  coluna "ver origem" some enquanto a gaveta está aberta (o nome do lojista continua clicável).
