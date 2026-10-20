# Brief: fechamento de setembro da Tarvo

Departamento: Diretor. Base: instruções oficiais do case (`material-case/01_instrucoes_participantes.md`),
`BRIEF.md` da raiz, o roteiro do pitch e as escolhas do Fernando registradas em 17/10. Números:
`estudio/dados/fechamento.json`, gerado de `saida/` e `relatorio/` do commit 44a6536.

## Projeto

Duas peças visuais para o mesmo produto, o motor que fecha o mês da Tarvo:

1. **Filme do fechamento.** Cerca de 60 s, 16:9 (1920×1080, 30 fps), sem narração obrigatória: se
   entende sem ninguém falar por cima. Abre a parte da solução no pitch, logo depois do slide do
   problema, e é a reserva se a tela ao vivo falhar. Os quadros dele viram as imagens do deck.
2. **Painel da analista.** A tela que o comando gera (`relatorio/painel.html`) e que o servidor serve
   ao vivo. É a demo clicável do slide do rastro e o que a banca abre quando roda a solução.

## Mensagem central

A frase de abertura que o Fernando escolheu (roteiro, atualização das 19h15 de 17/10):

> Oito dias úteis para fechar. Aqui a conta sai em menos de um segundo, cada número volta à linha de
> origem, e para a pessoa sobra só o que precisa de decisão: 15 pendências.

As duas peças existem para tornar essa frase visível, nessa ordem: a conta, a origem, a decisão.

## Público

O time financeiro e o CFO da Tarvo, "não engenheiros" (instruções oficiais, "Pitch"). Na sala também
estão avaliadores técnicos da Barte. Plateia mista: a camada principal fala de dinheiro e de decisão;
o detalhe técnico fica um clique abaixo (no painel) ou numa legenda pequena (no filme).

## A relação visual central

**Antes e depois.** Antes: sete arquivos que chegam cada um de um jeito, oito dias úteis, regras na
cabeça de quem fecha. Depois: o mês fechado, cada número com origem e 15 decisões com dono. Tudo o
mais apoia essa relação.

**O momento que convence** (escolha do Fernando, roteiro, observação 2): seguir um número só até a
linha do arquivo. Uma venda da Rota Global de 12/09/2026, R$ 6.449,10. Contrato 3,59%, a Orbe cobrou
4,09%: R$ 32,25 a mais nessa venda; 87 vendas assim; R$ 1.546,28 a cobrar da Orbe, decide o
Financeiro.

## Restrições de conteúdo

| Restrição | Origem |
|---|---|
| Todo número sai de `fechamento.json` ou dos eventos do motor | manual do estúdio, regra 2; kickoff: "maquete não é solução" |
| Nunca dizer "R$ 262 mil de receita" da Atlas. A taxa em jogo é ≈ R$ 7,9 mil, estimativa, faturada em outubro | roteiro, observação 1, e deck das 18h52 |
| Atlas: são 57 lançamentos (49 vendas, mais antecipações e estornos). Não dizer "57 vendas" nem "vendeu R$ 262 mil" | achado do Diretor ao montar os dados (18/10): o bruto de R$ 262.138,61 soma as 57 linhas; vendas somam R$ 135.428,90 |
| Não somar os três valores em jogo (≈ R$ 26,3 mil): são de natureza diferente e um é estimativa | roteiro, atualização das 19h15 |
| Quem trabalha na tela é o motor, por regra; o ritmo é de apresentação, e a tela diz isso | D35 B; desenho da demo (D38) |
| A IA não toca em nenhum valor em reais; em setembro, os 184 lançamentos saíram por regra | roteiro, observação 4; `fechamento.json` |
| "Menos de um segundo" é a conta, não o fechamento: as 15 pendências ainda pedem uma pessoa | roteiro, slide 1, "Cuidado" |
| Sem logo da Barte; o nome Tarvo em texto; selo "dados fictícios do case" | D21; desenho da demo |

## Ativos

- Os sete arquivos do mês em `dados/` (as linhas de origem aparecem como chegaram).
- `estudio/dados/fechamento.json` (números, cada um com a fonte) e `relatorio/eventos.jsonl`
  (2.507 eventos, para o painel).
- Paleta Ameixa e fonte Manrope (aprovadas pelo Fernando em 17/10, depois da prévia das 16h15).
- Não há logo da Tarvo nem tela de ERP. O filme não desenha interface que o produto não tem: mostra
  dados, arquivos e decisões como tipografia e diagrama. O único "botão" que aparece, "Rodar o
  fechamento", existe de fato no modo ao vivo.

## O que falta

Nada que bloqueie. Uma premissa do Diretor, para o Fernando confirmar: o filme abre a parte da
solução no pitch, depois do slide do problema, e a demo ao vivo continua no slide do rastro.

## A história do filme, cena a cena

Detalhe de quadros em `STORYBOARD.md`. Aqui, o porquê de cada cena.

1. **O mês chega.** Os sete arquivos, cada um de um jeito, e "oito dias úteis". O CFO reconhece o
   problema dele antes de qualquer solução.
2. **As regras, escritas.** Os mesmos arquivos se alinham e 60 respostas do financeiro viram regras.
   É o mecanismo: a demora nunca foi a conta, era saber a regra.
3. **A conta.** 2.463 decisões, e o que é rotina passa em lote enquanto o que precisa de alguém se
   separa. A velocidade não é o ponto; o ponto é a separação.
4. **Um número, até a origem.** A Rota Global, da venda até a linha do arquivo da Orbe. É a cena que
   gera confiança, e a mais longa.
5. **O dinheiro que apareceu.** Os três valores, cada um com o que fazer, sem somar. Item 3 do pitch.
6. **O que sobra para a pessoa.** 15 pendências por dono, com o motivo. Item 4 do pitch.
7. **Fecho.** A frase de abertura em três partes, com o selo e a regra da IA.

## O painel, em uma frase

A analista abre a tela e vê primeiro a resposta (quanto, o que fazer, quem decide); se quiser, assiste
ao fechamento acontecendo em duas frentes, a mesa de trabalho com o olhar do motor e o impacto no
painel (pedido do Fernando às 13h26 de 17/10); e qualquer número abre o caminho até a linha de origem.

## Portão

Aprovação reconstruída das escolhas registradas do Fernando (ver `SIMULACAO.md`). O que é premissa do
Diretor, e não escolha dele, está marcado como premissa.
