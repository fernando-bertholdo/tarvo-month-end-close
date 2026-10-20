# Manual do estúdio

Regras de produção visual que valem para todo case. Este arquivo é a parte permanente do estúdio; o
que muda de um case para outro fica em `BRIEF.md`, `STYLE.md` e `STORYBOARD.md`. Método adaptado de
"Motion Engineering: One Bot, Five Departments, an Entire Studio" (@0xjmori, 18/10/2026).

## Os cinco departamentos

| Departamento | Responde por | Entrega | Critério de aceite |
|---|---|---|---|
| Diretor | o que a peça comunica, para quem, em que ordem | `BRIEF.md`, `STORYBOARD.md` | cada cena tem um motivo escrito; nenhuma afirmação sem fonte |
| Diretor de arte | tipografia, cor, composição, movimento, o que evitar | `STYLE.md` | cada regra tem valor numérico ou exemplo; cada referência tem um papel |
| Animador | código do movimento | fonte editável (`filme/`, `src/tarvo/vitrine/`) | segue storyboard e estilo; todo evento tem quadro ou tempo exato |
| Engenheiro de render | exportar e checar o técnico | stills, prévias, MP4, relatório técnico | dimensões, fps, fontes, ativos e console conferidos |
| Crítico | qualidade do que foi renderizado | `reviews/findings-*.md` | notas de 1 a 10 e três defeitos com quadro, causa, correção e o que preservar |

Os departamentos são etapas com instruções e arquivos próprios, não necessariamente agentes
diferentes. Duas exceções: o Crítico roda sempre em contexto novo, sem ver o código nem a conversa
do Animador; e o Animador nunca aprova o próprio trabalho.

## Regras de operação

1. Nenhum código antes de o storyboard estar aprovado.
2. Só ativos aprovados. Todo número na tela sai do motor (`saida/`, `relatorio/`) pelo
   `estudio/dados/fechamento.json`, gerado por `estudio/scripts/extrair_dados.py`, ou dos eventos que
   o comando embute no painel. Número digitado à mão no código é defeito.
3. Nunca inventar tela, métrica, depoimento ou capacidade do produto. Se falta uma tela ou um dado
   essencial, peça; não desenhe um falso convincente.
4. Toda animação é determinística: no filme, dirigida pelo número do quadro; no painel, por um relógio
   único com semente fixa, para o ensaio repetir igual.
5. Uma direção visual só, a do `STYLE.md`.
6. Nada se move sem propósito de comunicação.
7. Stills representativos antes do render completo.
8. Revisar o que foi renderizado, não o código.
9. Corrigir localmente: um defeito no quadro 210 não reescreve o storyboard, a menos que o conceito
   esteja quebrado.
10. Preservar toda fonte editável.

## Restrições criativas

Evitar:
- fundo em degradê genérico, partículas brilhando, câmera que se move sem motivo;
- quique em excesso (a curva que passa do ponto é só para confirmação, uma vez por cena);
- texto que não dá para ler no tempo em que fica na tela;
- painel de produto falso;
- linguagem do motor na camada principal: código de regra (F11), identificador (TX, DIV, PEN, NF,
  LAN), nome de arquivo e campo cru ficam no mergulho ou no rastro técnico;
- formato americano: é R$ 1.546,28, 4,09% e 12/09/2026;
- número parcial que contradiz o final.

## Portões de aprovação

- Depois do `BRIEF.md` e do `STORYBOARD.md`: o Fernando aprova a história.
- Depois do `STYLE.md`: o Fernando aprova a direção visual, vendo a proposta renderizada.
- Antes de publicar ou de mandar para fora: o Fernando aprova.

## Política de correção

Para cada defeito: ler a evidência do Crítico, achar a menor mudança, preservar o que já foi aprovado,
corrigir a fonte, renderizar de novo os quadros afetados, olhar as bordas das cenas vizinhas e devolver
a evidência nova. No máximo duas rodadas por defeito. Se o mesmo problema continuar depois de duas,
parar, explicar o bloqueio e pedir direção. Nunca tirar uma exigência de verificação para a revisão
passar.

## Regra de produção

Uma peça não está pronta porque o MP4 existe ou porque a página abre. Está pronta quando o brief e as
verificações foram atendidos e o Crítico passou o que foi renderizado.

## Mapa do estúdio

```text
estudio/
├── CLAUDE.md          este manual (permanente)
├── BRIEF.md           Diretor: o que comunicar, para quem
├── STYLE.md           Diretor de arte: como parece e como se move
├── STORYBOARD.md      Diretor: cenas do filme e estados do painel, com quadros
├── SIMULACAO.md       em que momento do case real cada peça teria nascido
├── referencias/       quadros e medições das referências
├── dados/             fechamento.json (gerado, nunca editado à mão)
├── scripts/           extração de dados, captura de telas, folhas de contato
├── filme/             projeto Remotion do filme
├── reviews/           quadros, folhas de contato e findings de cada rodada
└── out/               prévias e entregas finais
```
