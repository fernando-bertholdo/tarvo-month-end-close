# Contrato de eventos (`relatorio/eventos.jsonl`)

Uma linha JSON por evento, em UTF-8, na ordem em que o motor decide. A página e o servidor leem só isto.

## Campos

| Campo | Tipo | Quando | O que é |
|---|---|---|---|
| `seq` | int | sempre | ordem do evento, a partir de 1 |
| `ts` | texto ISO UTC (`Z`) | sempre | quando o motor emitiu |
| `tipo` | `inicio`, `arquivo`, `decisao`, `total`, `aviso`, `fim` | sempre | natureza do evento |
| `frente` | `CHECKOUT`, `REMESSA`, `NOTAS`, `EXTRATOS`, `PENDENCIAS` ou vazio | `decisao`, `total` | qual bloco do fechamento |
| `fonte` | objeto `{arquivo, ref}` | `arquivo`, `decisao` | arquivo de origem e `ref_origem` (id_transacao, Nº Operação, `L10`, FITID) |
| `regra` | texto | `decisao` | código da regra (ex.: `F36`) ou nome curto da regra |
| `resultado` | texto | `decisao`, `total` | o que foi decidido (ex.: `divergencia`, `conta 4.2.01`, `pendencia`) |
| `valor` | número ou null | `decisao`, `total` | valor em reais, ponto decimal |
| `motivo` | texto | `decisao`, `aviso` | uma frase curta, em português |
| `metodo` | `REGRA`, `IA` ou `HUMANO` | `decisao` | quem decidiu; `HUMANO` = fica para uma pessoa |
| `quem_decide` | `Financeiro`, `Comercial`, `Tesouraria` ou vazio | `metodo` = `HUMANO` | área que decide |
| `peso` | `rotina`, `atencao`, `excecao` | `decisao` | dá o ritmo da apresentação |
| `id_saida` | texto ou vazio | `decisao`, `total` | liga ao `id_saida` dos CSVs de `saida/` |
| `confianca` | número 0 a 1 | `metodo` = `IA` | declarada pelo modelo |
| `modelo`, `porta` | texto | `metodo` = `IA` | modelo e porta (`api`, `claude-code`, `cache`) |
| `linhas` | int | `arquivo` | linhas lidas do arquivo; na planilha de taxas, só a aba vigente |
| `linhas_no_arquivo` | int | `arquivo` da planilha | linhas de todas as abas |
| `competencia`, `competencia_seguinte` | `MM/AAAA` | `inicio` | mês do fechamento (o mais comum nas datas da Orbe e da Ponte) e o seguinte |
| `etapa` | `LEITURA`, `CHECKOUT`, `REMESSA`, `NOTAS`, `EXTRATOS` | todos, menos `fim` | etapa que emitiu o evento; pendência leva a etapa que a abriu |
| `escopo` | `lojista` ou `frente` | `total` | `lojista`: comissão de um lojista; `frente`: total da frente fechada. Uma `decisao` é um item; o `fim` é o mês |
| `parcial` | objeto | ver abaixo | valores corridos, prontos para a tela, por escopo |
| `n_linhas` | int | `total`, nota, pendência | linhas de origem que o número soma |
| `emite_nota` | bool | `total` lojista do checkout | falso quando a comissão é zero ou negativa (F5) |
| `base` | número | divergência | valor sobre o qual a diferença de taxa incide: bruto da linha (checkout, F11) ou Valor ME × PTAX Ref. (remessa, F15/F95); também `base_brl` em `divergencias_taxa.csv` |
| `taxa_contratada_pct`, `taxa_aplicada_pct`, `diferenca_pp` | número, em % | divergência; `taxa_contratada_pct` também na comissão do checkout | as duas taxas e a diferença em pontos |
| `pendencia` | texto | divergência | `id_saida` da pendência que cobra o grupo |
| `tipo_pendencia` | texto | pendência | o `tipo` de `pendencias.csv` |
| `por_tipo` | objeto | pendência da Orbe | linhas por `tipo_lancamento` (ex.: `{"VENDA": 83, "ESTORNO": 4}`) |
| `ressarcimento` | número | `DIVERGENCIA_ORBE` | o que a Orbe descontou a mais de fato, a devolver ao lojista (F72) |
| `estimativa` | `{valor, mil}` | `SEM_CONTRATO` | taxa que a Orbe descontou; referência, nunca faturada (F7) |

### `parcial`

Cada chave é o escopo em que o valor corre. A página exibe; não soma nem conta.

| Chave | Em | Campos |
|---|---|---|
| `etapa` | toda `decisao`; `arquivo` | `k` de `n` decisões da etapa, e `regra`, `sinalizadas`, `pessoa` (por `peso`: `rotina`, `atencao`, `excecao`), sempre com `k` = a soma dos três; no `arquivo`, `k` de `n` arquivos |
| `grupo` | divergência | `k` de `n` divergências da mesma pendência e a soma corrida `valor` |
| `frente` | `total` lojista; nota | `k` de `n` lojistas (ou notas) da frente e a soma corrida `valor` |
| `mes` | `total` lojista | `comissao`: checkout e remessa corridos |
| `mes` | divergência | `divergencias`: contagem corrida do mês |
| `mes` | pendência | `pendencias` (contagem corrida), `por_dono` e `em_jogo` (`acima_do_contrato`, `orbe`, `ponte`, `devolver_casa`, `atlas_estimativa`), corridos |

O motor segura os eventos de cada etapa até ela terminar (milissegundos), para que todo evento já saiba o `n`. Ao vivo, os eventos chegam por etapa.

Evento `fim` traz `resumo`, o escopo do mês: `comissao_checkout`, `comissao_remessa`, `comissao_total`, `divergencias_brl`, `divergencia_orbe`, `divergencia_ponte`, `devolucao_casa`, `atlas_bruto_sem_faturar`, `atlas_estimativa`, `notas_brl`, `notas`, `notas_por_linha`, `notas_menos_comissao`, `pendencias`, `pendencias_por_dono`, `pendencias_por_tipo`, `lancamentos`, `lancamentos_por_metodo`, `lancamentos_por_conta`, `lojistas`, `divergencias_operacoes`, `decisoes` (`total`, `regra`, `sinalizadas`, `pessoa`), `decisoes_por_etapa`, `competencia`, `competencia_seguinte`, `duracao_s`.

## Exemplo (três linhas)

```json
{"seq":1,"ts":"2026-10-17T21:10:00Z","tipo":"arquivo","fonte":{"arquivo":"01_orbe_relatorio_comissoes_set2026.csv","ref":""},"linhas":1943,"motivo":"relatório da Orbe lido"}
{"seq":2,"ts":"2026-10-17T21:10:00Z","tipo":"decisao","frente":"CHECKOUT","fonte":{"arquivo":"01_orbe_relatorio_comissoes_set2026.csv","ref":"TX88410932"},"regra":"F36","resultado":"divergencia","valor":1.23,"motivo":"taxa aplicada 2,69% acima da contratada 2,49%","metodo":"REGRA","quem_decide":"","peso":"atencao","id_saida":"DIV-0001"}
{"seq":3,"ts":"2026-10-17T21:10:01Z","tipo":"decisao","frente":"EXTRATOS","fonte":{"arquivo":"05a_extrato_banco_aurora_cc4471_set2026.csv","ref":"L20"},"regra":"sem regra","resultado":"pendencia","valor":-7350.0,"motivo":"Pix sem identificação do pagador","metodo":"HUMANO","quem_decide":"Financeiro","peso":"excecao","id_saida":"PEN-0003"}
```

## Interfaces Python

- Motor: `src/tarvo/engine.py`, `run_close(month_dir, out_dir="saida", report_dir="relatorio", emit=None) -> dict`. `emit(evento: dict)` é chamado a cada evento, na hora em que acontece; o motor também grava o arquivo.
- Painel: `src/tarvo/painel.py`, `build_panel(events: list[dict], dest: Path) -> Path`. Lê o modelo `src/tarvo/vitrine/painel.html` e grava `relatorio/painel.html` com os eventos embutidos.
- Servidor: `python3 -m src.tarvo.servidor dados [--porta 8765] [--vitrine padrao|refinada]`.
- De qualquer pasta: `python3 <repo>/src/tarvo dados` e `python3 <repo>/src/tarvo/servidor.py dados`; os caminhos são relativos à pasta onde se digita.
