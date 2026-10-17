# Regras por bloco

Cada regra veio de uma resposta do financeiro (F) ou da logística (L) no canal do case. O link leva à mensagem.

## Checkout

| Regra | O que diz | Fonte | Como vira código |
|---|---|---|---|
| F1, F30 | comissão = valor bruto × taxa contratada da planilha, linha a linha; não o `valor_taxa` da Orbe | [S3](https://bartehackathonai.slack.com/archives/C0CA0S5D37B/p1792191952289259?thread_ts=1792191465.288839&cid=C0CA0S5D37B) | `Close.checkout`: `r2(bruto * contr)` por linha, soma por CNPJ |
| F3, F39, F66 | estorno usa a taxa da data da venda original; a faixa sai da própria linha | [S5](https://bartehackathonai.slack.com/archives/C0CA0S5D37B/p1792192019611209?thread_ts=1792191877.776469&cid=C0CA0S5D37B) | `base_date = data_venda_original` para ESTORNO e REVERSAO |
| F4 | reversão anula só a taxa da antecipação que reverte | [S9](https://bartehackathonai.slack.com/archives/C0CA0S5D37B/p1792194465573829?thread_ts=1792193219.408319&cid=C0CA0S5D37B) | reversão usa a coluna Antecipação, com bruto negativo |
| F6 | EC sem cadastro: Horizonte Intercâmbio, Horizonte Viagens, Kiwi | [S8](https://bartehackathonai.slack.com/archives/C0CA0S5D37B/p1792193059964329?thread_ts=1792192601.377449&cid=C0CA0S5D37B) | `EC_ALIASES` |
| F7, F44, F67 | Atlas sem contrato: não faturar; pendência para o Comercial | [S8](https://bartehackathonai.slack.com/archives/C0CA0S5D37B/p1792193059964329?thread_ts=1792192601.377449&cid=C0CA0S5D37B) | fora de comissões e notas; pendência SEM_CONTRATO |
| F9, F68, F75, F86 | Casa do Estudante: tarifa zero de 01/09 a 31/12 (venda pela data da venda, antecipação pela data dela) | [S12](https://bartehackathonai.slack.com/archives/C0CA0S5D37B/p1792194576391779?thread_ts=1792193803.331999&cid=C0CA0S5D37B) | `exempt` zera a taxa contratada |
| F10 | arredondamento meio centavo para cima, linha a linha, com sinal | [S16](https://bartehackathonai.slack.com/archives/C0CA0S5D37B/p1792196013836169?thread_ts=1792195651.974369&cid=C0CA0S5D37B) | `r2` com ROUND_HALF_UP |
| F11, F36, F63 | divergência = bruto × (aplicada − contratada); truncamento não é divergência | [S16](https://bartehackathonai.slack.com/archives/C0CA0S5D37B/p1792196013836169?thread_ts=1792195651.974369&cid=C0CA0S5D37B) | comparação das taxas em % com 2 casas |
| F37, F70, F72 | Casa: devolução ao lojista do que foi descontado, fora da cobrança da Orbe | [S46](https://bartehackathonai.slack.com/archives/C0CA0S5D37B/p1792245692875969?thread_ts=1792245368.683109&cid=C0CA0S5D37B) | pendência DEVOLUCAO_LOJISTA: soma de `valor_taxa` − comissão contratada |
| F58 | pendência de divergência por contraparte e por lojista | [S46](https://bartehackathonai.slack.com/archives/C0CA0S5D37B/p1792245692875969?thread_ts=1792245368.683109&cid=C0CA0S5D37B) | uma DIVERGENCIA_ORBE por lojista |
| F60 | acima de 12 parcelas é pendência | [S46](https://bartehackathonai.slack.com/archives/C0CA0S5D37B/p1792245692875969?thread_ts=1792245368.683109&cid=C0CA0S5D37B) | checagem `qtd_parcelas > 12` |
| F76, F78 | arquivo 06 é entrada opcional e entra no mês do movimento; id repetido vira pendência | [S74](https://bartehackathonai.slack.com/archives/C0CA0S5D37B/p1792254878645749?thread_ts=1792253999.043339&cid=C0CA0S5D37B) | `find(month, '06_')` opcional; AJUSTE_REPETIDO |

## Remessa

| Regra | O que diz | Fonte | Como vira código |
|---|---|---|---|
| F12, F13 | comissão = 50% do Spread R$ por operação, arredondado | [S10](https://bartehackathonai.slack.com/archives/C0CA0S5D37B/p1792194515838639?thread_ts=1792193429.257939&cid=C0CA0S5D37B) | `r2(spread * 0.5)` |
| F14, F15, F63 | spread acima do contratado é divergência, pelo valor cheio | [S14](https://bartehackathonai.slack.com/archives/C0CA0S5D37B/p1792195101083859?thread_ts=1792194771.073879&cid=C0CA0S5D37B) | Spread R$ − Valor ME × PTAX × spread contratado |
| F16 | spread em branco ou "padrão" = 1,5% sobre a PTAX | [S10](https://bartehackathonai.slack.com/archives/C0CA0S5D37B/p1792194515838639?thread_ts=1792193429.257939&cid=C0CA0S5D37B) | `DEFAULT_SPREAD` |
| F17, F65 | spread negativo fora da comissão e da nota, com os dois valores na pendência | [S10](https://bartehackathonai.slack.com/archives/C0CA0S5D37B/p1792194515838639?thread_ts=1792193429.257939&cid=C0CA0S5D37B) | pendência SPREAD_NEGATIVO |
| F18, F103 | operação repetida conta uma vez | [S94](https://bartehackathonai.slack.com/archives/C0CA0S5D37B/p1792266058818399?thread_ts=1792265651.603359&cid=C0CA0S5D37B) | conjunto `seen` por Nº Operação |
| F21, F84, F103 | uma nota só, tomadora Ponte Câmbio, pela regra da Tarvo, sem retenção | [S94](https://bartehackathonai.slack.com/archives/C0CA0S5D37B/p1792266058818399?thread_ts=1792265651.603359&cid=C0CA0S5D37B) | `notas_fiscais`, linha REMESSA |
| F35, F103 | conferir o crédito de 06/10 contra a nota | [S94](https://bartehackathonai.slack.com/archives/C0CA0S5D37B/p1792266058818399?thread_ts=1792265651.603359&cid=C0CA0S5D37B) | pendência CONFERIR_REPASSE |

## Notas

| Regra | O que diz | Fonte | Como vira código |
|---|---|---|---|
| F4 | uma nota por lojista no valor da comissão contratada do mês, antecipação incluída | [S9](https://bartehackathonai.slack.com/archives/C0CA0S5D37B/p1792194465573829?thread_ts=1792193219.408319&cid=C0CA0S5D37B) | `notas_fiscais` |
| F5 | comissão zero ou negativa: sem nota, pendência | [S9](https://bartehackathonai.slack.com/archives/C0CA0S5D37B/p1792194465573829?thread_ts=1792193219.408319&cid=C0CA0S5D37B) | pendência SALDO_NAO_POSITIVO |
| F82, F83 | nome da planilha com CNPJ; CNPJ com 14 dígitos | [S87](https://bartehackathonai.slack.com/archives/C0CA0S5D37B/p1792262840604889?thread_ts=1792262634.073559&cid=C0CA0S5D37B) | `cnpj14` |

## Extratos

| Regra | O que diz | Fonte | Como vira código |
|---|---|---|---|
| F23, F59 | a conta é a contrapartida; o que já estava registrado baixa a conta onde estava | [S17](https://bartehackathonai.slack.com/archives/C0CA0S5D37B/p1792196067326279?thread_ts=1792195685.607029&cid=C0CA0S5D37B) | tabela `Close.RULES` |
| F24, F46, F91 | folha, ISS, INSS, FGTS e DARFs de agosto estavam provisionados: baixa | [S17](https://bartehackathonai.slack.com/archives/C0CA0S5D37B/p1792196067326279?thread_ts=1792195685.607029&cid=C0CA0S5D37B) | contas 2.1.03 e 2.1.04 |
| F25, F97 | Pix sem identificação não é receita | [S92](https://bartehackathonai.slack.com/archives/C0CA0S5D37B/p1792264080450909?thread_ts=1792263612.411219&cid=C0CA0S5D37B) | 1.1.09.002 e pendência para o Financeiro |
| F26, F45, F98 | devolução de Pix da Mundo Aberto: 2.1.01.001 ou 2.1.01.002, critério do time | [S92](https://bartehackathonai.slack.com/archives/C0CA0S5D37B/p1792264080450909?thread_ts=1792263612.411219&cid=C0CA0S5D37B) | 2.1.01.001 e pendência |
| F27, F99 | transferência de 30/09 cai no Meridiano em 01/10 | [S92](https://bartehackathonai.slack.com/archives/C0CA0S5D37B/p1792264080450909?thread_ts=1792263612.411219&cid=C0CA0S5D37B) | 1.1.09.001 e pendência para a Tesouraria |
| F40, F74, F100 | Pix de lojista no Meridiano é recurso para remessa | [S92](https://bartehackathonai.slack.com/archives/C0CA0S5D37B/p1792264080450909?thread_ts=1792263612.411219&cid=C0CA0S5D37B) | 2.1.02.001 |
| F80 | IOF de R$ 48,21 é de operação de crédito do Meridiano | [S87](https://bartehackathonai.slack.com/archives/C0CA0S5D37B/p1792262840604889?thread_ts=1792262634.073559&cid=C0CA0S5D37B) | 4.3.01 |
| F81, F101 | liquidação à Ponte usa recurso do lojista: passivo | [S92](https://bartehackathonai.slack.com/archives/C0CA0S5D37B/p1792264080450909?thread_ts=1792263612.411219&cid=C0CA0S5D37B) | 2.1.02.001 |
| F88 | único Pix enviado que não é repasse: contabilidade | [S87](https://bartehackathonai.slack.com/archives/C0CA0S5D37B/p1792262840604889?thread_ts=1792262634.073559&cid=C0CA0S5D37B) | 4.2.06 |
| F89 | rendimento é receita; seguro vai na despesa | [S87](https://bartehackathonai.slack.com/archives/C0CA0S5D37B/p1792262840604889?thread_ts=1792262634.073559&cid=C0CA0S5D37B) | 3.2.01 e 4.2.05 |
| F101 | CDB sem efeito no resultado | [S92](https://bartehackathonai.slack.com/archives/C0CA0S5D37B/p1792264080450909?thread_ts=1792263612.411219&cid=C0CA0S5D37B) | 1.1.02.001 |
| L16 | `ref_origem` do Aurora é a linha física do arquivo | [S101](https://bartehackathonai.slack.com/archives/C0CA0S5D37B/p1792266749019619) | `L{n}` contado a partir de 1 |
