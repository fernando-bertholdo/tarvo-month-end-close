# Relatório técnico: painel da analista, rodada r3 (acabamento)

Engenheiro de render, 19/10/2026, 01:48 BRT (19/10 04:48Z). Acabamento depois do Crítico r2 (PASSA), com a
decisão do Diretor: os defeitos 01 a 03 e os achados 1 e 2 de `findings-painel-r2.md`, pela menor correção.
Os achados 3 a 11 ficaram fora. Evidência para o Diretor conferir; não é prova de qualidade. O Animador não
aprova o próprio trabalho.

## O que foi gerado

| Item | Onde |
|---|---|
| Página (modelo, fonte editável) | `src/tarvo/vitrine/painel.html` (247 KB) |
| Página gerada pelo comando | `relatorio/painel.html` (1,7 MB), de `python3 -m src.tarvo.painel relatorio/eventos.jsonl relatorio/painel.html` |
| Telas r3 | `estudio/out/previews/painel/*.png`: 75 da captura (as 56 da r2 mais 19 novas, todas com prefixo `r3-`), 4 do modo ao vivo (`50` a `53`) e 2 tiras do vídeo (`r3-video-notas.png`, `r3-video-extratos.png`) |
| Telas r2, para comparar | `estudio/out/previews/painel-r2/` (as 63 peças da r2, movidas antes de a r3 gravar); as da r1 seguem em `painel-r1/` |
| Vídeo da Reprodução inteira em 1x | `estudio/out/previews/painel/reproducao-1x.mp4` |
| Relatórios da captura (máquina) | `estudio/out/previews/painel/captura.json` e `captura-vivo.json` |
| Folha de contato | `estudio/reviews/contact-sheets/painel-r3.png` (80 telas, com as duas tiras; a página inteira do Resumo, `01b`, fica de fora por não caber na caixa) |
| Quadros do vídeo | `estudio/reviews/frames/painel-r3/`: as Notas de 72 a 78,5 s do relógio a cada 250 ms e a volta à Aurora antes do Pix a cada 100 ms, cada quadro com o relógio no nome (`tiras.json` lista relógio e segundo do vídeo); em `deck/`, o teste de repetição da tela do deck (abaixo) |
| Scripts | `estudio/scripts/capturar_painel.mjs` (ajustado para a r3), `estudio/scripts/folha_painel.py` (agora monta as tiras) |

Como reproduzir, da raiz do repositório:

```text
python3 -m src.tarvo.painel relatorio/eventos.jsonl relatorio/painel.html
node estudio/scripts/capturar_painel.mjs --sem-vivo          # cerca de 15 min: telas, pausas reais, 1x em vídeo, 2x cronometrado
node estudio/scripts/capturar_painel.mjs --so-video          # só o vídeo, se a máquina engasgar na captura
PAINEL_RAIZ_VIVO=<cópia do repositório> node estudio/scripts/capturar_painel.mjs --so-vivo
python3 estudio/scripts/folha_painel.py r3
```

O motor não rodou no repositório. `engine.py`, `saida/`, `relatorio/eventos.jsonl` e `relatorio/execucao.json`
não foram tocados.

## Hashes conferidos

`shasum -a 256 -c estudio/out/final/congelado/SHA256SUMS`, da raiz, depois da última geração do painel e do
modo ao vivo:

```text
relatorio/eventos.jsonl: OK
relatorio/execucao.json: OK
relatorio/painel.html: FAILED
estudio/dados/fechamento.json: OK
saida/comissoes_por_lojista.csv: OK
saida/divergencias_taxa.csv: OK
saida/lancamentos_classificados.csv: OK
saida/notas_a_emitir.csv: OK
saida/pendencias.csv: OK
saida/rastro.csv: OK
```

Só o `relatorio/painel.html` muda, como esperado: é a página r3. Todas as telas e o vídeo saíram dela.

| Arquivo | SHA-256 |
|---|---|
| `relatorio/painel.html` (r3) | `bb8a7e57ace19f1ddf11829caf739475e301c0083564137cc996c1efd1de7918` |
| `src/tarvo/vitrine/painel.html` (r3) | `d8c1625c349a22c86ac6543447f61b34586381515fd8a7b94773b3989bc190b1` |
| `relatorio/painel.html` (r2, para comparar) | `e20157a205359cb5bfcd7b6bd575663d4a5f48867584d9be07258cc2691d395d` |
| `estudio/out/previews/painel/reproducao-1x.mp4` | `13ea466b517744da48ed3e2ad9324c1d4fefc570b8f9e58dcb23c5f9b82ae1bf` |
| `estudio/reviews/contact-sheets/painel-r3.png` | `3f777302f81fe00b553b697426f25931e8e7ea5ac73d0021fb11ca2a54bfcd7a` |

## As três telas do deck

Saem da página r3 iguais às da r2. Comparação contra `out/previews/painel-r2/`, em bytes e em pixels RGB:

| Tela | SHA-256 r2 | SHA-256 r3 | Pixels diferentes |
|---|---|---|---|
| `01-resumo-1440.png` | `4824dee5524020c39fbac4120aa806c240bdc761434d2610de98145cb1d78550` | igual | 0 (bytes iguais) |
| `fluxo-1440-1-rota-global.png` | `f755e01bd2d5c39c2bca5db039a2901dfbbcd101bc73aff2df863b5bca88da53` | `dec600353dc5be9be9e5900058e3b23d08af54d631ab5f0c2ea50d7c614360a6` | 1, no ponto (250, 709), de 4 níveis em 255 |
| `fluxo-1440-2-financeiro.png` | `45d1139aa4b614575c9ac554e0a59fc61dc447cee18a077ed28cf62a724198f9` | igual | 0 (bytes iguais) |

O pixel da segunda tela fica no fundo da linha selecionada (Rota Global), embaixo do sublinhado. É ruído da
captura, não mudança da página: capturei a mesma tela, pelo mesmo fluxo, 5 vezes da página r2 (a cópia
guardada antes da r3) e 5 vezes da página r3. As duas páginas alternam entre as mesmas duas variantes,
`f755e01b…` e `dec60035…`, que só diferem nesse pixel; a primeira captura da r3 é igual ao arquivo do deck
byte a byte. Arquivos em `reviews/frames/painel-r3/deck/`; hashes em `captura.json` → `deck_repeticao`. O
código do Resumo, das gavetas e do filtro não mudou (o diff do modelo só toca funções da Reprodução).

## Duração

| Medida | Valor |
|---|---|
| Relógio da Reprodução | **102,5 s** (102.491 ms); r2: 100,5 s |
| 1x, na parede (vídeo, do clique à volta ao Resumo) | **102,6 s** |
| 2x, na parede (cronometrado) | **51,4 s** (51.370 ms); r2: 50,4 s |
| Arquivo de vídeo | 1440×900, H.264, 30 qps, 107,2 s (1,6 s antes do clique e 2,5 s depois da volta ao Resumo) |
| Captura dos quadros do vídeo | 2.546 capturas de tela durante a reprodução real, 23,9 por segundo; maior intervalo 273 ms, aos 69,5 s, com a legenda das Notas parada |

Por etapa (relógio): ler os arquivos 4,7 s; checkout 33,2 s; remessa 30,6 s; **notas 14,2 s** (r2 12,6);
**extratos 15,0 s** (r2 14,6); recapitulação 4,4 s. De onde vêm os 2,0 s a mais: 1,6 s porque a varredura das
quatro primeiras notas deixou de correr por baixo da pausa da Casa do Estudante (defeito 02), e 0,4 s porque a
mesa volta à Aurora antes do Pix (achado 1). Nenhuma pausa encurtou. Antes das Notas o relógio é o mesmo da r2:
primeira exceção aos 11,1 s, primeira pendência aos 25,8 s, Mundo Aberto aos 42,1 s, spreads aos 52,6 s.

## Auditoria do relógio, item a item

Cada linha que pausa fica na tela pelo menos `entrada (500 ms) + max(1500, 670 + 270 × palavras)` ms, com
variação de até 8% para cima, por semente fixa. Fonte: `captura.json` → `pausas`.

| Relógio | Item | Palavras | Regra (ms) | Exigido (ms) | Na tela (ms) | Parado (ms) |
|---|---|---|---|---|---|---|
| 0,4 s | Etapa 1, "Lendo os arquivos do mês, como chegaram." | 7 | 2.560 | 3.235 | 4.719 | 4.219 |
| 5,1 s | Etapa 2 | 8 | 2.830 | 3.568 | 3.568 | 3.068 |
| 11,1 s | Primeira exceção, Rota Global | 16 | 4.990 | 5.560 | 5.560 | 5.060 |
| 17,3 s | Bridge, pausa mínima por decisão do Diretor | 15 | 1.500 | 2.049 | 2.049 | 1.549 |
| 20,9 s | "Fechando a comissão de cada lojista." (checkout) | 13 | 4.180 | 4.985 | 4.985 | 4.485 |
| 25,8 s | Grupo "Cobrar da Orbe" | 12 | 3.910 | 4.821 | 4.821 | 4.161 |
| 30,7 s | Devolver à Casa do Estudante | 8 | 2.830 | 3.537 | 3.537 | 3.037 |
| 34,2 s | Confirmar a taxa da Atlas Idiomas | 10 | 3.370 | 4.160 | 4.160 | 3.660 |
| 38,4 s | Etapa 3 | 9 | 3.100 | 3.674 | 3.674 | 3.174 |
| 42,1 s | Primeira exceção da remessa, Mundo Aberto | 18 | 5.530 | 6.103 | 6.103 | 5.603 |
| 49,2 s | Operação repetida · Bagagem Livre | 7 | 2.560 | 3.215 | 3.215 | 2.715 |
| 52,6 s | Grupo dos quatro spreads negativos | 21 | 6.340 | 7.741 | 7.741 | 6.761 |
| 60,4 s | "Fechando a comissão de cada lojista." (remessa) | 13 | 4.180 | 4.877 | 4.877 | 4.377 |
| 65,3 s | Contestar com a Ponte · Mundo Aberto | 9 | 3.100 | 3.671 | 3.671 | 3.171 |
| 68,9 s | Etapa 4, notas | 9 | 3.100 | 3.726 | 3.726 | 3.226 |
| 72,7 s | **Casa do Estudante sem nota** | 8 | 2.830 | 3.521 | 5.121 | **3.021 com o olhar na Casa**, depois 1.600 de varredura |
| 78,7 s | Conferir o crédito da Ponte contra a nota | 11 | 3.640 | 4.434 | 4.434 | 3.934 |
| 83,1 s | Etapa 5, extratos | 7 | 2.560 | 3.177 | 3.326 | 2.826 |
| 88,0 s | Pix recebido sem identificação | 7 | 2.560 | 3.095 | 3.095 | 2.595 |
| 91,1 s | Repasse devolvido · Mundo Aberto | 7 | 2.560 | 3.217 | 3.217 | 2.717 |
| 94,3 s | Transferência para o Meridiano, em trânsito | 9 | 3.100 | 3.747 | 3.747 | 3.247 |
| 98,1 s | Recapitulação, "15 decisões para pessoas." | 12 | 3.910 | 4.410 | 4.410 | 3.910 |

22 itens; nenhum fica menos que o exigido (menor sobra 0 ms). Na linha da Casa, "Na tela" vai até a linha ser
trocada e inclui a varredura que vem depois da pausa; o tempo parado com o olhar na linha da Casa é o da r2,
3,0 s (de 73,16 s a 76,18 s; a varredura começa aos 76,18 s). A Bridge continua na pausa mínima, por decisão
do Diretor.

## Contagens

- **Em todo quadro, na reprodução real.** Um amostrador dentro da página, por quadro de animação, conferiu
  durante o vídeo em 1x (6.140 quadros) e durante a 2x (3.078 quadros): decisões = regra + sinalizadas +
  pessoa em todos; nenhum parcial da comissão sem "fechando…"; nenhum parcial das notas sem "emitindo…";
  nenhum quadro de mesa quase vazia (corpo da tabela abaixo de 50% de opacidade) com o impacto mudando.
  Fonte: `captura.json` → `amostra_1x`, `amostra_2x`.
- **A cada 250 ms do relógio** (410 amostras, por `seek`): as mesmas contas, mais o valor do cartão das notas
  contra a soma exata das k primeiras notas, na ordem do motor (tiradas de `relatorio/eventos.jsonl`): nenhuma
  diferença. Fonte: `captura.json` → `varredura`.
- Nos momentos capturados: 3 s (3 arquivos), 10 s (129 = 129 + 0 + 0), 25 s (1.992 = 1.900 + 92 + 0),
  primeira exceção (723 = 722 + 1 + 0), primeira pendência (1.994 = 1.900 + 92 + 2), Mundo Aberto (6 = 5 + 1
  + 0), spreads (245 = 218 + 22 + 5), nota da Ponte (23 = 20 + 1 + 2), fim e movimento reduzido (2.463 =
  2.332 + 116 + 15); nas pausas das Notas, 1 = 0 + 0 + 1, 2 = 1 + 0 + 1, 5 = 4 + 0 + 1, 14 = 13 + 0 + 1.
- Final da Reprodução contra o resumo do motor (`conferencia`): igual centavo a centavo.

## Item a item

| Item | O que mudou | Tela que prova |
|---|---|---|
| **Defeito 01**, qualificador nas notas | Enquanto há nota da etapa por gerar, o cartão diz "emitindo… (k de 21 notas)" sob a soma exata das k primeiras; na última nota volta a "21 notas a emitir". O "emitindo…" vem do estado (k menor que o total de notas do relógio), não da animação. Um contador só: valor e quantidade no mesmo quadro. O passo a passo reduzido não tem estado intermediário de notas e não mudou. Ao vivo, sem o total, o cartão diz "emitindo…" até a etapa acabar. | Pausa real, relida 10 vezes em 2 s, estável: `r3-notas-1x-varredura-1-notas-76535ms` ("R$ 9.259,74 · emitindo… (1 de 21 notas)"), `r3-notas-1x-como-o-critico-a-4-notas-77633ms` ("R$ 41.307,74 · emitindo… (4 de 21 notas)", o estado que o Crítico viu a 74,9 s), `r3-notas-1x-como-o-critico-b-13-notas-78214ms` ("R$ 132.255,08 · emitindo… (13 de 21 notas)"; o estado de 12 notas dura cerca de 50 ms no lote, e a pausa real pegou 13 em 1x e 14 em 2x) e os mesmos quatro em `r3-notas-2x-*`. Projeção a 1280: `r3-proj1280-notas-emitindo`. Final: `06b-rep-nota-ponte` ("21 notas a emitir"). |
| **Defeito 02**, varredura durante a pausa da Casa | Das duas saídas do Crítico, a segunda: a pausa da Casa termina antes de a varredura começar. Regra geral no relógio: uma linha sobre uma linha da mesa (pendência, exceção, sinalizada) segura o olhar nessa linha a pausa inteira; se o olhar for varrer outras linhas antes da próxima linha do motor, a espera vem antes da varredura. Só acontece nas Notas. A ordem dos eventos do motor não mudou (a Casa é a decisão 1); a Casa fica os mesmos 3,0 s parada; o contador das notas é um só. | Pausa no meio da pausa da Casa, com o olhar na linha da Casa e o cartão em "nenhuma nota ainda": `r3-notas-1x-pausa-da-casa-0-notas-74970ms` e `r3-notas-2x-pausa-da-casa-0-notas-75022ms`. Vídeo de 72 a 78,5 s, quadro a quadro: `r3-video-notas.png` (a faixa de acento fica na Casa até 76,0 s; a primeira nota entra aos 76,19 s). |
| **Defeito 03**, reticência na linha com o olhar em projeção a 1280×720 | Só na projeção compacta. A linha com o olhar mostra o texto inteiro, em até três linhas, a 19 px, sem "…" e sem palavra quebrada no meio: nome de lojista ou cliente quebra na própria coluna; a linha de extrato espalha o texto pela coluna da data, embaixo da data (a coluna "Lançamento" tem 122 px, e as linhas do Pix, da TED da Orbe e da transferência pedem 3 linhas em 233 px). A célula aberta tem 4 px de respiro em cima e embaixo, para o texto não encostar na borda do olhar. O olhar mede a altura da linha (antes supunha linhas iguais). O espaço da linha mais alta que o olhar abre em cada arquivo, medido na largura atual das colunas, fica reservado embaixo da tabela: a linha do motor e a contagem não pulam enquanto o olhar anda. Para caber, o cabeçalho da tabela foi de 36 para 32 px e o espaço entre os blocos da mesa de 8 para 6 px, só na projeção compacta. | `r3-proj1280-remessa-varredura` (NÓRDICA EDUCAÇÃO INT, 2 linhas), `-remessa-mundo-aberto` (MUNDO ABERTO INTERCÂ, 3), `-remessa-spreads` (NOVO HORIZONTE INTER, 3), `-extratos-varredura` (TED RECEBIDA 99.876.669/0001-09 ORBE ADQUIRENCIA SA, 3), `-extratos-volta-a-aurora` e `-extratos-pix` (PIX RECEBIDO 38686002000180 SEM IDENTIFICACAO, 3), `-extratos-repasse` (DEVOLUCAO PIX - MUNDO ABERTO INTERC, 2), `-extratos-transferencia` (TRANSF ENTRE CONTAS P/ BCO MERIDIANO AG 0091 CC 90233-5, 3). Nas 8: números inteiros, mesa e impacto lado a lado, 5 linhas, selo (quando a linha já tem um) em duas linhas e inteiro, contagem acima da legenda. No relógio inteiro, a cada 50 ms (2.050 amostras, 1.438 com o olhar na mesa, 30 linhas diferentes): nenhuma linha com o olhar cortada, no máximo 3 linhas, folga mínima de 5 px entre a contagem e a legenda (aos 42,1 s, Mundo Aberto; na r2 eram 15 px), nenhum pulo da linha do motor com a mesma linha, aba e janela. Fonte: `captura.json` → `projecao_r3`, `projecao_r3_relogio`. |
| **Achado 1**, aba que pisca e mesa vazia | Antes de uma linha narrada, se um lote deixou outra aba de arquivo na mesa (o lote do Meridiano antes do Pix), o olhar volta à aba e à linha do item em 400 ms (um passo do olhar), com a tabela esmaecendo para a Aurora, e só então o item entra na mesa e no impacto. Além disso, em toda linha narrada que move a mesa para outro arquivo ou outra janela, a mesa corta sem esmaecer e o olhar salta junto, em vez de deslizar sobre linhas que já não estão ali. Na r2, eram 15 batidas com um quadro de mesa quase vazia e o impacto já reagindo (11,1; 17,3; 25,8; 26,0; 30,7; 34,2; 49,2; 52,6 a 53,1; 65,3; 86,0; 89,1 e 92,3 s); o Crítico viu a do Pix. Os movimentos que não são narrados (troca de etapa, lote, a volta à Aurora) mantêm o esmaecimento. | `r3-extratos-1-volta-a-aurora` (87,9 s: Aurora, olhar na linha do Pix, impacto ainda em 12), `r3-extratos-2-pix` (88,6 s: 13, Pix no topo da lista), `r3-video-extratos.png` (quadros de 87,1 a 88,7 s: Meridiano até 87,46 s, Aurora esmaecendo aos 87,61 s com o impacto parado, Pix a partir de 88,0 s), `r3-proj1280-extratos-volta-a-aurora`. Amostrador por quadro em 1x e 2x: nenhum quadro de mesa vazia com o impacto reagindo. |
| **Achado 2**, dois valores da Mundo Aberto | Na aba da Ponte, a coluna de valor da mesa se chama "Pago (R$)": é o que o cliente pagou (a gaveta já dizia "Valor pago pelo cliente"). A linha do motor continua "Ponte aplicou 1,5007% sobre R$ 9.830,65; contrato 1,20%.", a base do spread. | `06d-rep-mundo-aberto`, `rep-proj1440-56s`, `rep-proj1280-56s`, `r3-proj1280-remessa-mundo-aberto` |

Preservado e conferido: Resumo, gavetas e filtro sem mudança (as três telas do deck, acima); fluxo do pitch
com a cadeia assentada em 1,8 s a 1,9 s e 25,5 s nos quatro modos; pausa coerente no fecho da comissão em 1x e
2x (`pausa-*`); nenhum código do motor nem formato americano na camada principal (0 ocorrências em todas as
telas); passo a passo reduzido (`31`, `32`); tema escuro (`40` a `42`); gaveta da Mundo Aberto com a conta
fechando nos quatro modos (`g-mundo-aberto-*`).

## Técnico

- **Dimensões:** 1440×900 e 1280×720, `deviceScaleFactor` 1; vídeo 1440×900 a 30 qps.
- **Fontes:** Manrope embutida; `document.fonts.check('700 20px Manrope')` verdadeiro em todas as telas.
- **Console:** nenhum erro ou aviso, em nenhum contexto (captura, vídeo, 2x e modo ao vivo).
- **Rolagem lateral:** nenhuma, nas 79 telas.
- **Números:** 147 de 148 verificações na captura e 25 de 25 no modo ao vivo. A que não passa é a regra
  estrita "bytes ou pixels iguais" na `fluxo-1440-1-rota-global.png`, explicada acima; a verificação da
  repetição (mesmas variantes da r2, uma captura igual ao deck byte a byte) passa.
- **Pausa no fecho em 2x:** nesta rodada a pausa da remessa em 2x caiu aos 62,9 s, depois de o fecho acabar
  (62,1 s), e `pausa-2x-remessa` mostra o total, não o parcial. É item da r2 e não mudou; o parcial pausado da
  remessa está em `pausa-1x-remessa` e a varredura de 250 ms cobre os 16 estados de fecho aberto.

## Modo ao vivo

Testado numa cópia do repositório (`src/`, `dados/`, `relatorio/`, `saida/`; sem `estudio/` nem `.git`), na
pasta temporária da sessão, com `PAINEL_RAIZ_VIVO` apontando para ela: o servidor real
(`python3 -m src.tarvo.servidor dados --porta 8771`) subiu nessa cópia com o modelo r3, rodou o motor por SSE
(2.507 eventos, rodada de 60,3 s no ritmo de apresentação) e montou o Resumo com os eventos recebidos. Telas
`50` (antes de rodar, nenhum número), `51` (rodando), `52` (Resumo montado) e `53` (Mergulho da Rota Global com
`/dados` depois da rodada); 25 de 25 números batem; console limpo. A rodada reescreveu `relatorio/` e `saida/`
da cópia, e os seis CSVs saíram idênticos aos congelados. Os hashes de `relatorio/` e `saida/` do repositório
são os mesmos antes e depois. Servidor encerrado e porta livre.

## Escolhas para o Diretor ver

1. **Defeito 02, a segunda saída.** A primeira (varredura antes da Casa, durante a legenda) mostraria as
   decisões 2 a 5 antes da decisão 1, contra "preservar a ordem dos eventos do motor". A segunda custa 1,6 s,
   porque a varredura deixa de correr por baixo da pausa. Durante a varredura, a linha do motor ainda diz "Casa
   do Estudante sem nota", já fora da pausa de leitura, como o Crítico propôs.
2. **Duração.** 102,5 s em 1x, 2,5 s acima do teto de "~95 a 100 s".
3. **Achado 1, além do Pix.** O corte sem esmaecer vale para toda linha narrada que move a mesa (14 batidas
   além do Pix), porque o mesmo quadro de mesa quase vazia com o impacto reagindo estava nelas. Custo de
   tempo zero. Restringir aos Extratos é uma condição; as outras 12 batidas voltam a ter esse quadro.
4. **Achado 2, "Pago (R$)" no cabeçalho** em vez de "(CAD à PTAX)" na linha do motor: não muda o relógio
   (três palavras a mais esticariam a pausa da Mundo Aberto em 0,8 s) e não alonga a linha mais longa da
   projeção compacta, que é justamente a da Mundo Aberto, onde a folga ficou em 5 px.
5. **Projeção compacta.** Cabeçalho da tabela de 36 para 32 px e espaço entre os blocos da mesa de 8 para
   6 px. A linha aberta usa entrelinha 1,05 (as outras, 1,15). Na linha de extrato aberta, a data fica sozinha
   na primeira linha e o texto embaixo, nas colunas da data e do lançamento. A reserva embaixo da tabela deixa
   uma faixa vazia quando nenhuma linha está aberta: 41 px nos Extratos (durante o lote, por exemplo) e 21 px
   na Orbe e na Ponte.
6. **Meridiano.** A aba do Meridiano continua aparecendo por 0,37 s durante o lote dele (é o arquivo que o
   motor está lendo); a mudança é que a mesa volta à Aurora 0,4 s antes do Pix, e não no mesmo quadro.
