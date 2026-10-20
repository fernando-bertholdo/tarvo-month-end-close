# Momentos que importaram

1. **A ordem dos blocos estava errada, e a correção veio de fora da sessão.** Pedi esqueleto, contrato de eventos e classificação dos extratos antes da comissão, porque a classificação liberava a etapa de IA. Um agente lateral apontou que a comissão de checkout com rastro é o nível mínimo oficial e estava no fim da fila. Mandei a sessão avaliar; ela concordou e fez a comissão primeiro. O plano que eu tinha dado à IA era o que levava ao lugar errado.
2. **Teste cego antes de confiar na IA.** Pedi que a IA classificasse 40 lançamentos que a regra já resolve, sem receber as respostas nem exemplos delas. Ela acertou 29, não errou nenhuma conta e passou 8 casos para uma pessoa. Eu subi o limite de confiança de 0,80 para 0,90, sem ajustar o prompt à amostra.
3. **A IA errou a chamada da API.** O subagente da etapa de IA tentou forçar uma ferramenta e fixar a temperatura, e a API recusou as duas coisas (erro 400). Ele trocou para saída estruturada com esquema, validada no Python, e o cache versionado passou a garantir que a rodada de setembro se repete igual.
4. **Conferência independente dos números.** Um subagente que não viu o código recalculou os totais a partir dos arquivos e das regras do financeiro, antes de ver o `saida/`, e depois comparou. Nenhum total divergiu. Ele apontou que as pendências de cobrança da Orbe diziam "ressarcir o lojista" com o valor da fórmula, quando a F72 manda devolver o que foi descontado de fato (R$ 0,43 a menos). Acrescentei esse valor ao motivo das duas pendências.

## Onde está cada sessão

- `construcao/`: sessões do Claude Code que construíram a solução, exportadas sem edição de conteúdo. Em 20/10, depois da entrega, e-mails, nomes de pessoas de outros times e as instruções pessoais do ambiente foram trocados por marcas (`[e-mail removido]`, `[nome removido]`, `[instruções pessoais removidas]`). A versão avaliada, com o texto original, é a tag `entrega-2026-10-17`.
- `apoio/`: sessões de apoio, fora do Claude Code.
