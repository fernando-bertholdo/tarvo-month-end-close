# Tarvo: fechamento mensal com rastro

Fecha o mês da Tarvo Pagamentos a partir dos arquivos como eles chegam (Orbe, planilha de taxas, e-mail da Ponte Câmbio, extratos Aurora e Meridiano, plano de contas) e entrega comissões, divergências, notas, lançamentos classificados e pendências. Todo número aponta para a linha de origem.

**O número nunca passa pela IA.** Todo valor em reais sai de regra escrita a partir das respostas do financeiro.

## Resultado de setembro/2026

Em preenchimento.

## Como rodar

Pré-requisito: Python 3.10 ou mais novo. Nada a instalar (só biblioteca padrão).

```bash
python3 -m src.tarvo dados
```

O comando lê a pasta do mês (`dados/`), mostra o resumo no terminal e grava os seis arquivos em `saida/`, mais o registro da execução e os eventos em `relatorio/`.

## O que sai

Em preenchimento.

## Estrutura

Em preenchimento.

## Hipóteses e perguntas ao financeiro

Ver [HIPOTESES.md](HIPOTESES.md) e [REGRAS.md](REGRAS.md).

## Limitações conhecidas

Em preenchimento.

## Uso de IA

Ver [PROMPTS/](PROMPTS/) e [PROMPTS/MOMENTOS.md](PROMPTS/MOMENTOS.md). Fluxo de trabalho próprio (template pessoal de condução de case), sem código pronto do case; as regras de como a IA foi dirigida estão em [CLAUDE.md](CLAUDE.md).
