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
| `linhas` | int | `arquivo` | linhas lidas do arquivo |

Evento `fim` traz `resumo`: objeto com os totais do mês (`comissao_checkout`, `comissao_remessa`, `divergencias_brl`, `notas_brl`, `pendencias`, `lancamentos`, `duracao_s`).

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
