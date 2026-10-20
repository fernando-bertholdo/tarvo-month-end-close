// Every event of STORYBOARD.md as a named frame. Scene frames are LOCAL (0 = first frame
// of the scene, as seen by useCurrentFrame() inside its <Sequence>). Scene starts are
// cumulative, so changing one duration moves everything after it.
//
// Corte r2. Reading time is set group by group (STORYBOARD.md, "Revisão de texto do
// Diretor (corte r2)"), against the yardstick of the Critic's annex A in
// reviews/findings-filme-r1.md: a group is "parado e legível" from the frame its last
// element stops moving to the first frame anything moves again; for a group that closes a
// scene, the 15 end-of-scene frames are part of that stillness. NEED is that annex's
// "precisa" column, updated for the r2 text; HOLD adds a small safety margin.

import {style, titleDuration} from '../style';

const D = style.dur;
export const TARGET_FRAMES = 2520; // 84 s, the Director's ceiling for r2
const HOLD = 2; // frames of margin on top of every NEED

// Frames each reading group needs to stay still (annex A, "precisa"), with the words behind it.
export const READING = {
  g1: {need: 76, text: 'título "Sete arquivos." + "Oito dias úteis para fechar." (7 palavras; os cartões entram antes)'},
  g2: {need: 100, text: '"60", "respostas do financeiro viraram regras.", a regra e o botão'},
  g3a: {need: 76, text: '4 faixas com totais e "2.463 decisões"'},
  g3b: {need: 148, text: '3 contagens com selo e "O motor levou 0,07 s." (16 palavras)'},
  g4a: {need: 196, text: 'cartão, taxas, "0,50 ponto", "R$ 32,25 a mais nesta venda", selo (22 palavras)'},
  g4b: {need: 60, text: 'estado completo do recuo: "87 operações assim", "R$ 1.546,28 a cobrar da Orbe · Rota Global", selo (pedido: 60 parados)'},
  g4c: {need: 164, text: 'origem: células e "Relatório da Orbe, linha 727: a venda de 12/09, como chegou." (18 palavras; corte r3: +3)'},
  g5: {need: 236, text: 'três colunas, "Orbe e Ponte" e a legenda (26 + 1 rótulo curto)'},
  g6: {need: 236, text: '"15 pendências", donos, três exemplos com valor e dono (27 palavras)'},
  g7: {need: 236, text: 'três linhas, título e rodapé, contado da terceira linha (27 palavras)'},
} as const;
export type Group = keyof typeof READING;
export const GIVE: Record<Group, number> = Object.fromEntries(
  Object.entries(READING).map(([k, v]) => [k, v.need + HOLD]),
) as Record<Group, number>;

// Scene 1. O mês chega.
export const S1 = {
  cardsStart: 5, // first card starts at 5 and is visible from 6: empty background lasts 6 frames (0-5)
  cardStagger: style.delay.list, // one card every 5 frames; the 7th starts at 35 and lands at 59
  title1: 50, // "Sete arquivos."
  title2: 76, // "Oito dias úteis para fechar." once the first line is ready to the eye
  settle: 76 + titleDuration(1), // 104
} as const;

// Scene 2. As regras, escritas.
const s2Settle = 73 + D.rise; // 88: the button lands
const s2Press = s2Settle + GIVE.g2;
export const S2 = {
  straighten: 0, // cards rotate to 0 and align into one column (24 frames, pousa)
  titleOut: 0, // scene 1 title leaves rising (10 frames)
  counterIn: 16, // "60" label rises in after the cards pass 90%
  counterCount: 16 + D.rise + style.delay.counterAfterLabel, // 37: counts 0 -> 60 in 24 frames
  rule: 64, // "Vale a taxa do contrato, não a da Orbe."
  buttonIn: 73, // "Rodar o fechamento", once the rule is ready to the eye
  settle: s2Settle,
  press: s2Press, // the button sinks to 0.96 in 5 frames and comes back in 7
  click: s2Press + D.clickDown, // the click itself: the accent ring opens (1 -> 1.35, gone in 22)
  rulesOut: s2Press + D.clickDown + style.delay.effectAfterClick, // effect 6 frames later: rule and counter recede
} as const;

// Scene 3. A conta.
const s3BarEnd = 16 + 8 * 3 + 20; // 60: the last bar is full, the running sum stops
const s3LanesSettle = s3BarEnd + D.micro; // 74: the last lane total has faded in
const s3Split = s3LanesSettle + GIVE.g3a;
const s3Columns = s3Split + 8 + 15; // after the header passes 90% of its travel
const s3Settle = s3Columns + 12 + D.rise; // the legend lands
export const S3 = {
  morph: 0, // corte r3: the button's label fades out first, with the button still (4 frames)...
  boxMorph: 4, // ...then the button becomes the number's box (16 frames)
  fillFade: 4, // ...while its dark fill fades in 6 frames and the ink "0" emerges at the same rate
  labelIn: 10, // "decisões" fades in next to the number
  lanesIn: 8, // four lane rows, list delay 5; the file lines converge into one bundle
  laneFill: 16, // first bar starts filling: the counter counts from here
  laneStagger: 8, // each bar fills in 20 frames, 8 after the previous one; its total fades in at the end
  barDuration: 20,
  countEnd: s3BarEnd,
  lanesSettle: s3LanesSettle,
  split: s3Split, // files, bundle and lanes leave (10 frames)
  headerMove: s3Split + 8, // then the counter travels up and becomes the header (24 frames)
  columns: s3Columns, // three counts side by side, list delay 5
  legend: s3Columns + 12, // "O motor levou 0,07 s."
  settle: s3Settle,
  focus: s3Settle + GIVE.g3b, // everything but the flagged count dims to 40% (10 frames)
  focusDuration: 10,
} as const;

// Scene 4. Um número, até a origem.
const s4SettleA = 132 + D.seal; // 144: the "Acima do contrato" seal has stamped
const s4Clear = s4SettleA + GIVE.g4a;
const s4LabelIn = s4Clear + 50;
// STYLE.md, "Contador", Director's amendment (corte r2): the value is already on screen and
// only its label changes, so the count starts the frame the new label starts entering.
const s4SumCount = s4LabelIn;
const s4SumSeal = s4SumCount + D.counter + style.delay.sealAfterCounter;
const s4SettleB = s4SumSeal + D.rise; // the "Decide: Financeiro" seal lands
const s4Strip = s4SettleB + GIVE.g4b;
export const S4 = {
  open: 0, // scene 3 leftovers leave (10 frames)
  cardGrow: 8, // corte r3: the card grows out of the "116" once "2.332" is below 20% (24 frames)
  numberFade: 22, // the "116", carried inside the card, fades out (6 frames)...
  cardContent: 28, // ...before the merchant's name comes in; card lines rise, list delay 5
  rates: 54, // "Contrato" and "A Orbe cobrou", list delay 5
  bracket: 64, // bracket draws between the two rates
  points: 70, // "0,50 ponto"
  heroLabel: 80, // "a mais nesta venda" first, alone...
  heroCount: 80 + 16, // 96: ...legible alone 6 frames (opacity done at +10, landed at +15), then the number appears and counts
  heroSeal: 96 + D.counter + style.delay.sealAfterCounter, // 132: "Acima do contrato" stamps (only confirma)
  settleDifference: s4SettleA,
  clear: s4Clear, // card text, rates, bracket and seal leave (10 frames); "a mais nesta venda" stays
  cardShrink: s4Clear + 6, // the empty card becomes dot #0 of the grid (24 frames)
  heroMove: s4Clear + 10, // the hero and its label move to the sum place (24 frames)
  dots: s4Clear + 22, // the other 86 dots, in quick sequence
  dotsDuration: 12,
  gridLabel: s4Clear + 31, // "87 operações assim", 44 px, as the last dots land
  labelOut: s4Clear + 43, // "a mais nesta venda" leaves (10 frames), once "87 operações assim" is ready to the eye...
  labelIn: s4LabelIn, // ...and "a cobrar da Orbe · Rota Global" enters with 3 frames of overlap
  sumCount: s4SumCount, // 32,25 -> 1.546,28 in 30, while the new label lands
  sumSeal: s4SumSeal, // "Decide: Financeiro"
  settleRecoil: s4SettleB, // complete state: sum, label, seal, grid and its label, all still
  stripIn: s4Strip, // the grid and its label leave (10 frames)...
  stripRise: s4Strip + 10, // ...then the origin strip rises into the empty place, its legend after
  legend: s4Strip + 18,
  dive: s4Strip + 37, // the stage zooms toward the strip (36 frames), nothing else moves
  highlight: s4Strip + 73, // the two fields that matter light up; the trace draws with them
  settleOrigin: s4Strip + 73 + D.rise,
} as const;

// Scene 5. O dinheiro que apareceu.
export const S5 = {
  leave: 0, // scene 4 context, trace, strip and legend leave (10 frames; the strip slides down)
  slide: 8, // then the Rota Global sum slides into column 1 (24 frames), once the labels are gone
  col1Label: 23, // "taxa acima do contrato" / "Orbe e Ponte"
  col1Count: 23, // 1.546,28 -> 2.995,11 in 30, from the frame its new label starts entering (amendment, corte r2)
  col2: 78, // number, then label, list delay 5
  col3: 90,
  legend: 114, // "Mesma causa: o combinado não virou regra."
  settle: 114 + D.rise,
} as const;

// Scene 6. O que sobra para a pessoa.
export const S6 = {
  columnsOut: 0, // columns rise, shrink and fade (12 frames)
  heroIn: 12, // "15 pendências" (integers up to 20 do not count)
  owners: 22, // three owner rows, list delay 5; bars fill 3 frames after each row
  examples: [48, 56, 64], // three pendencies, the "R$" header with the first
  settle: 64 + D.rise,
} as const;

// Scene 7. Fecho.
export const S7 = {
  allOut: 0, // everything leaves (10 frames)
  lines: [10, 22, 34], // the three closing lines
  linesSettle: 34 + titleDuration(1), // 62
  title: 64, // "Fechamento de setembro · Tarvo" (Destaque, 56 px)
  footer: 80, // "Dados fictícios do case · todo valor sai de regra"
  settle: 80 + D.rise, // 95: from here the poster stays still to the last frame
} as const;

const durations = {
  s1: S1.settle + GIVE.g1, // the group closes the scene: its stillness includes the 15 end frames
  s2: S2.rulesOut + D.exit + style.pause.endOfScene,
  s3: S3.focus + S3.focusDuration + style.pause.endOfScene,
  s4: S4.settleOrigin + GIVE.g4c,
  s5: S5.settle + GIVE.g5,
  s6: S6.settle + GIVE.g6,
  s7: S7.linesSettle + GIVE.g7,
};

export const SCENE_DURATIONS = durations as Readonly<typeof durations>;
type SceneId = keyof typeof SCENE_DURATIONS;
const ORDER: SceneId[] = ['s1', 's2', 's3', 's4', 's5', 's6', 's7'];

export const SCENE_START = ORDER.reduce(
  (acc, id, i) => {
    acc[id] = i === 0 ? 0 : acc[ORDER[i - 1]] + SCENE_DURATIONS[ORDER[i - 1]];
    return acc;
  },
  {} as Record<SceneId, number>,
);

export const TOTAL_FRAMES = ORDER.reduce((s, id) => s + SCENE_DURATIONS[id], 0);

// Where each group's stillness starts and must last, in absolute frames (for the report).
export const GROUP_WINDOWS: {group: Group; from: number; need: number}[] = [
  {group: 'g1', from: SCENE_START.s1 + S1.settle, need: READING.g1.need},
  {group: 'g2', from: SCENE_START.s2 + S2.settle, need: READING.g2.need},
  {group: 'g3a', from: SCENE_START.s3 + S3.lanesSettle, need: READING.g3a.need},
  {group: 'g3b', from: SCENE_START.s3 + S3.settle, need: READING.g3b.need},
  {group: 'g4a', from: SCENE_START.s4 + S4.settleDifference, need: READING.g4a.need},
  {group: 'g4b', from: SCENE_START.s4 + S4.settleRecoil, need: READING.g4b.need},
  {group: 'g4c', from: SCENE_START.s4 + S4.settleOrigin, need: READING.g4c.need},
  {group: 'g5', from: SCENE_START.s5 + S5.settle, need: READING.g5.need},
  {group: 'g6', from: SCENE_START.s6 + S6.settle, need: READING.g6.need},
  // The annex counts the closing from the third line (title and footer still enter after
  // it); still frames are measured from the footer, so the need is what is left of 236.
  {group: 'g7', from: SCENE_START.s7 + S7.settle, need: READING.g7.need - (S7.settle - S7.linesSettle)},
];

// Representative stills: one per scene at its reading moment (scene 4 three times now:
// the difference, the complete recoil and the origin), 60% into the group's stillness.
const at = (start: number, settle: number, give: number) => start + settle + Math.floor(give * 0.6);
export const REPRESENTATIVE_FRAMES = {
  s1: at(SCENE_START.s1, S1.settle, GIVE.g1),
  s2: at(SCENE_START.s2, S2.settle, GIVE.g2),
  s3: at(SCENE_START.s3, S3.settle, GIVE.g3b),
  s4a: at(SCENE_START.s4, S4.settleDifference, GIVE.g4a),
  s4r: at(SCENE_START.s4, S4.settleRecoil, GIVE.g4b),
  s4b: at(SCENE_START.s4, S4.settleOrigin, GIVE.g4c),
  s5: at(SCENE_START.s5, S5.settle, GIVE.g5),
  s6: at(SCENE_START.s6, S6.settle, GIVE.g6),
  s7: SCENE_START.s7 + SCENE_DURATIONS.s7 - 10,
} as const;
