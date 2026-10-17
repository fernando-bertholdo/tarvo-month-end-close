# Hipóteses, perguntas e respostas

O que se sabe (resposta do financeiro da Tarvo ou da logística do case, com link) fica separado do que foi assumido. A tabela completa das regras e de como cada uma vira código está em [REGRAS.md](REGRAS.md).

## Perguntas ao financeiro e respostas recebidas

O canal `#tarvo-financeiro` é público: as respostas a qualquer time valem para todos. A coluna "Quem perguntou" diz de onde veio a pergunta.

| Tema | Resposta (regra) | Quem perguntou | Fonte |
|---|---|---|---|
| Base da comissão de checkout | bruto × taxa contratada, não o `valor_taxa` (F1, F30, F106) | organização, no kickoff; reconfirmada a vários times | [S3](https://bartehackathonai.slack.com/archives/C0CA0S5D37B/p1792191952289259?thread_ts=1792191465.288839&cid=C0CA0S5D37B), [S24](https://bartehackathonai.slack.com/archives/C0CA0S5D37B/p1792200888817559?thread_ts=1792200039.150939&cid=C0CA0S5D37B) |
| Estorno | taxa da data da venda original (F3, F66) | outro time, canal público | [S5](https://bartehackathonai.slack.com/archives/C0CA0S5D37B/p1792192019611209?thread_ts=1792191877.776469&cid=C0CA0S5D37B) |
| ECs sem cadastro e Atlas | três ECs apontam para linhas da planilha; Atlas sem contrato não fatura (F6, F7) | outro time, canal público | [S8](https://bartehackathonai.slack.com/archives/C0CA0S5D37B/p1792193059964329?thread_ts=1792192601.377449&cid=C0CA0S5D37B) |
| Notas | uma por lojista; uma só para a Ponte Câmbio (F4, F5, F21) | outro time, canal público | [S9](https://bartehackathonai.slack.com/archives/C0CA0S5D37B/p1792194465573829?thread_ts=1792193219.408319&cid=C0CA0S5D37B) |
| Remessa | 50% do Spread R$; negativo fora; repetida conta uma vez (F12 a F18) | outro time, canal público | [S10](https://bartehackathonai.slack.com/archives/C0CA0S5D37B/p1792194515838639?thread_ts=1792193429.257939&cid=C0CA0S5D37B) |
| Casa do Estudante, Pix sem identificação, transferência | isenção set-dez; Pix não é receita; transferência cai em 01/10 (F9, F25 a F27) | Lucca, outro time | [S12](https://bartehackathonai.slack.com/archives/C0CA0S5D37B/p1792194576391779?thread_ts=1792193803.331999&cid=C0CA0S5D37B) |
| Arredondamento e divergência | meio centavo para cima, linha a linha; truncamento não é divergência (F10, F11) | outro time, canal público | [S16](https://bartehackathonai.slack.com/archives/C0CA0S5D37B/p1792196013836169?thread_ts=1792195651.974369&cid=C0CA0S5D37B) |
| Plano de contas | contrapartida; o que estava provisionado baixa (F23, F24) | outro time, canal público | [S17](https://bartehackathonai.slack.com/archives/C0CA0S5D37B/p1792196067326279?thread_ts=1792195685.607029&cid=C0CA0S5D37B) |
| Arquivo 06 de ajustes | entra no mês do movimento; entrada opcional (F76) | Lucca, outro time | [S74](https://bartehackathonai.slack.com/archives/C0CA0S5D37B/p1792254878645749?thread_ts=1792253999.043339&cid=C0CA0S5D37B) |
| Extratos: IOF, rendimento, seguro, contabilidade, CNPJ | F80 a F89 | time T-800 | [S87](https://bartehackathonai.slack.com/archives/C0CA0S5D37B/p1792262840604889?thread_ts=1792262634.073559&cid=C0CA0S5D37B) |
| Responsáveis das pendências; critério do time | F93 a F102 | time T-800 | [S92](https://bartehackathonai.slack.com/archives/C0CA0S5D37B/p1792264080450909?thread_ts=1792263612.411219&cid=C0CA0S5D37B) |
| Valor da nota da Ponte | pela regra da Tarvo, não pelo número da Ponte (F103) | Dogshow, outro time | [S94](https://bartehackathonai.slack.com/archives/C0CA0S5D37B/p1792266058818399?thread_ts=1792265651.603359&cid=C0CA0S5D37B) |
| `ref_origem` do Aurora | linha física do arquivo, contada a partir de 1 (L16) | Fox AI, outro time; aviso geral da logística | [S101](https://bartehackathonai.slack.com/archives/C0CA0S5D37B/p1792266749019619) |
| Entrega e `PROMPTS/` | e-mails e sessões desde a liberação (L15) | Fernando (Q1 e Q2, 16h43) | aviso de logística das 16h47 |

## Premissas assumidas

| Premissa | Por quê | Status |
|---|---|---|
| **Premissa minha:** Atlas Idiomas fica fora de `comissoes_por_lojista.csv` e das notas, com uma pendência para o Comercial (bruto de R$ 262.138,61) | F67 aceita fora do arquivo ou zerada; fora evita linha com número sem contrato | escolhida pelo Fernando, 17/10 |
| **Premissa minha:** Casa do Estudante só como pendência de devolução (R$ 15.396,77), fora de `divergencias_taxa.csv` | não é divergência de contrato: a Orbe cobrou certo pela planilha dela (F37); listar como divergência arriscaria alarme falso | escolhida pelo Fernando, 17/10 |
| Divergência de spread da Mundo Aberto pela base Spread R$ realizado, menos Valor ME × PTAX × 1,20% | F95 pede escolher um dos dois valores; a diferença é de centavos | recomendação aceita por falta de resposta (financeiro atendeu até 17h45) |
| Devolução de Pix da Mundo Aberto (R$ 12.400) em 2.1.01.001, Repasses a lojistas a pagar | é repasse que voltou e será pago de novo; F98 aceita as duas contas | recomendação aceita por falta de resposta |
| Tolerância de divergência no checkout: qualquer diferença entre a taxa aplicada e a contratada, comparadas em % com duas casas | truncamento da Orbe aparece no `valor_taxa`, não na taxa (F11, F22) | critério do time |
| Tolerância de divergência na remessa: spread % acima do contratado em mais de 0,05 ponto | o Spread % vem com ruído de arredondamento na quarta casa (0,015001); F22 | critério do time |
| Todo spread negativo fica fora da comissão e vira pendência de contestação | F17 fala da trava vencida; o relatório não traz o horário da trava | critério do time |
| Comissão da Casa do Estudante negativa (−R$ 5,50, estornos de vendas de agosto): sem nota e pendência | F5 e F68 | regra |
| Lançamento que nenhuma regra cobre vai para a etapa de IA; sem IA ou abaixo de 0,90 de confiança, vira Decisão humana do Financeiro | o fechamento não para por falta de IA; em setembro todos os 184 lançamentos saem por regra | desenho do Fernando (D35) |
| Pendências de acompanhamento (Pix sem identificação, transferência de R$ 300 mil, conferência do crédito da Ponte) entram em `pendencias.csv` | L6: acompanhamento com motivo e próximo passo não é alarme falso | regra (L6) |
| Ajuste de contestação da Ponte ("AJUSTE REF PC-…", F69) abate 50% do Spread R$ do ajuste na comissão e na nota única do mês em que aparece | a pergunta "inteiro ou participação" (S61) ficou sem resposta; 50% é coerente com a comissão de 50% do spread (F12). Não ocorre em setembro | critério do time |
| Os dados do case vão em `dados/` no repositório | a banca roda do zero numa pasta limpa | decisão do Fernando, 17/10 9h |
| **Premissa minha:** limite de confiança da IA em 0,90 (variável `TARVO_IA_LIMITE_CONFIANCA`) | no teste cego, as 25 respostas acima de 0,90 estavam certas; 0,80 aceitava 4 a mais, também certas. Subi por cautela, sem ajustar o prompt à amostra | escolhida pelo Fernando, 17/10, depois do teste |
