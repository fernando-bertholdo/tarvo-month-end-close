# Como a IA trabalha neste repositório

Regras com que o Fernando dirige o Claude Code no case Tarvo.

- O construtor segue sozinho no que é mecânico e nas regras que vêm de uma resposta do financeiro (F) ou da logística (L), com o link no código e no rastro. A tabela de cada bloco (regra, fonte, como vira código) fica em `REGRAS.md`.
- A substância é do Fernando: premissa sem fonte, escolha entre opções, mudança de direção. O construtor pergunta com contexto, opções e recomendação, e registra a escolha em `HIPOTESES.md` como premissa dele.
- Todo número de dinheiro sai de regra. A IA só escolhe uma conta do plano de contas para lançamento que a regra não cobre, com confiança e motivo, ou passa o caso para uma pessoa.
- Números de outros times no Slack não são fonte.
- A cada bloco pronto, três linhas em linguagem de financeiro: o que entrou, por quê e de qual fonte.
- Commits pequenos, em português, a cada passo que roda. Histórico nunca reescrito.
- Prosa em português; código, docstrings e comentários em inglês; nomes do case como estão nos arquivos.
- Nenhuma chave no repositório. A chave fica no `.env`, em `TARVO_ANTHROPIC_API_KEY`.
