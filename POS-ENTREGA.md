# Depois da entrega

A versão avaliada é a tag [`entrega-2026-10-17`](https://github.com/fernando-bertholdo/tarvo-month-end-close/tree/entrega-2026-10-17): commit `44a6536`, 17/10/2026, 18:24 BRT, antes do prazo das 18:30 BRT. Tudo o que veio depois está descrito aqui, com data, e entrou por pull request. Nenhum commit anterior foi reescrito.

## Linha do tempo

| Quando | O quê |
|---|---|
| 17/10, 18:24 BRT | Entrega (tag `entrega-2026-10-17`). |
| 17/10, 18:33 BRT | Teste depois da entrega: sem o relatório da Orbe (01), o ajuste tardio (06) entrava sozinho e a comissão de checkout saía negativa (−R$ 3.304,39). Dito no pitch como "a corrigir". |
| 18/10 | Retrospectiva e estúdio: filme do fechamento e painel v5, com um crítico em contexto novo a cada rodada (`estudio/`). |
| 19/10 | Refino do motor ([#1](https://github.com/fernando-bertholdo/tarvo-month-end-close/pull/1)), do painel ([#2](https://github.com/fernando-bertholdo/tarvo-month-end-close/pull/2)) e esta documentação ([#3](https://github.com/fernando-bertholdo/tarvo-month-end-close/pull/3)). |
| 20/10 | Limpeza de dados de terceiros nas sessões de `PROMPTS/` ([#4](https://github.com/fernando-bertholdo/tarvo-month-end-close/pull/4)). |

## O que mudou, por quê e quem achou

| Mudança | Por quê | Quem achou | Onde |
|---|---|---|---|
| Dependência declarada entre arquivos: sem o 01, o 06 não roda sozinho e vira uma pendência para o Financeiro | comissão de checkout negativa sem o 01 | teste do Fernando, 17/10 18:33 BRT | #1 |
| O motor emite os totais parciais com escopo (lojista, frente, mês) e a página só exibe | o indicador que caía de R$ 93.099,50 para R$ 7.703,98 no meio da rodada era soma feita pela página | retrospectiva, 18/10 | #1 e #2 |
| A base do spread vai para o evento e para `divergencias_taxa.csv` (`base_brl`) | o painel calculava a base da Mundo Aberto (R$ 9.830,65) a partir da linha do anexo da Ponte | agente lateral, 19/10 | #1 |
| O mês do fechamento sai dos arquivos | "competência 09/2026" e os meses dos motivos estavam escritos no código | refino, 19/10 | #1 |
| O comando e o servidor rodam de qualquer pasta | fora da raiz, o comando dava erro de import | refino, 19/10 | #1 |
| Testes do motor e reconciliação versionada | não havia teste automatizado nem a reconciliação que `verificacao/` pedia | refino, 19/10 | #1 |
| Treze correções de casos de borda (arquivo ausente, data inexistente, planilha sem contrato) | revisão do #1 em contexto novo, com cada correção testada antes | revisor em contexto novo, 19/10 | #1 |
| Painel v5 lendo só o motor, com a origem da divergência visível e as pendências em uma linha | a página somava e contava eventos; com os totais novos do motor, a conta antiga mostraria R$ 486.557,58 de comissão | estúdio, 18 e 19/10 | #2 |
| E-mails, nomes de pessoas de outros times e instruções pessoais do ambiente trocados por marcas nas sessões de `PROMPTS/` | o repositório é público, e as sessões exportadas traziam dados de terceiros | auditoria da exportação das sessões, 19/10 | [#4](https://github.com/fernando-bertholdo/tarvo-month-end-close/pull/4); a tag mantém o original |

Os valores de setembro não mudaram: os cinco CSVs de comissão, notas, lançamentos, pendências e rastro são idênticos aos da tag, byte a byte, e `divergencias_taxa.csv` ganha só a coluna `base_brl` no fim. O teste `tests/test_regressao.py` compara cada rodada com as saídas da tag.

Para conferir:

```bash
python3 -m unittest discover -s tests -t .   # 89 testes; rodados em Python 3.8 e 3.14
python3 verificacao/reconcilia.py            # recalcula os totais da fonte; exit 0 se tudo bate
```

## Quatro números da apresentação que o estúdio corrigiu

O motor estava certo nos quatro; o erro estava na leitura dos números para o pitch.

- **Atlas Idiomas.** Não são "57 vendas": são 57 lançamentos (49 vendas, 5 antecipações, 2 reversões de antecipação e 1 estorno). E a Atlas não "vendeu R$ 262 mil": R$ 262.138,61 é o bruto das 57 linhas; as vendas somam R$ 135.428,90. A taxa em jogo continua ≈ R$ 7,9 mil. Achado do Diretor do estúdio ao montar os dados, 18/10.
- **Rota Global.** As "87 vendas" acima do contrato são 87 operações: 83 vendas e 4 estornos com a taxa errada. O total a cobrar, R$ 1.546,28, não muda. Achado do Animador do painel, 18/10.
- **Frente "PENDENCIAS".** No log do motor, é a ordem em que as pendências são emitidas, não uma etapa. Por etapa, as decisões são 1.996 (checkout), 257 (remessa), 23 (notas) e 187 (extratos). Achado pelos críticos do filme e do painel, 18/10.
- **Mundo Aberto.** O spread da Ponte incide sobre CAD 2.438,46 × PTAX 4,0315 = R$ 9.830,65, não sobre os R$ 9.978,18 pagos pelo cliente. O total a contestar (R$ 1.418,88) e a diferença da operação (R$ 29,56) não mudam. Achado pelo crítico do painel (rodada r1), 18/10.

## O filme e o painel

O `estudio/` é um método de produção visual em cinco etapas (Diretor, Diretor de arte, Animador, Engenheiro de render e Crítico), descrito em [`estudio/CLAUDE.md`](estudio/CLAUDE.md). O Crítico roda sempre em contexto novo: confere cada número da tela contra as saídas do motor, olha só o que foi renderizado e não lê o código. Número digitado à mão ou calculado pela página é defeito.

- **Filme do fechamento**, 84 s em 1920×1080, sem áudio, em sete cenas: o mês chega, as regras escritas, a conta, um número até a linha de origem, o dinheiro que apareceu, o que sobra para uma pessoa e o fecho. Fonte em `estudio/filme/` (Remotion), números em `estudio/dados/fechamento.json`, extraídos das saídas do motor da entrega. O Crítico reprovou a rodada r1 e aprovou a r2. Os vídeos ficam fora do Git, na Release [`filme-2026-10-18`](https://github.com/fernando-bertholdo/tarvo-month-end-close/releases/tag/filme-2026-10-18), com o SHA-256 de cada um.
- **Painel v5**, que substitui o da entrega (`src/tarvo/vitrine/painel.html`, gerado em `relatorio/painel.html`). Rodadas r0 e r1 reprovadas, r2 aprovada, r3 de acabamento conferida pelo Diretor e r4 depois da entrega, com o motor refinado: o Crítico a aprovou sem nenhum número errado, em modo nenhum, e os três defeitos locais que ele apontou (a faixa de origem abaixo da dobra, a hierarquia da faixa e uma linha de texto atrasada nas Notas) foram corrigidos no acabamento r5, conferido pelo Diretor. Registro de cada rodada em `estudio/STORYBOARD.md` ("Mudanças") e os findings do Crítico em `estudio/reviews/`.

Ficam fora do Git, por tamanho: `node_modules`, as capturas de cada rodada (`estudio/out/`), os quadros e as folhas de contato das revisões e as gravações das referências. Os scripts de captura e de folha de contato estão em `estudio/scripts/`, e `npm ci` em `estudio/filme/` e em `estudio/ferramentas/` reinstala as dependências pelos `package-lock.json` versionados.
