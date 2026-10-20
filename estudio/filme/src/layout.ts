// Shared geometry. An element that crosses a cut reads its position from here in both
// scenes, so the last frame of scene N and the first of N+1 match by construction
// (STYLE.md, "Continuidade verificável"). Every y is a multiple of 8 where the design
// sets it; x follows the 12-column grid (col/span).
//
// Functions that call figureWidth() measure text and must run below <FontGate>.

import {FILE_CARD} from './components/FileCard';
import {figureWidth} from './components/Figure';
import {col, span, style} from './style';

const M = style.frame;

// Scene 1-3: file cards. The column is the "aligned" state; the pile is the same column
// with small offsets and at most ±2° of rotation ("excess", not chaos). Corte r1: the
// cards carry only the label, so they are one line tall and leave 8 columns for the title.
const CARD_PITCH = FILE_CARD.height + 16;
const CARD_TOP = M.marginY + (M.height - 2 * M.marginY - (7 * FILE_CARD.height + 6 * 16)) / 2; // 184
export const cardColumn = (i: number) => ({x: M.marginX, y: CARD_TOP + i * CARD_PITCH, rotate: 0});
const PILE = [
  {dx: 40, dy: 8, r: -1.6},
  {dx: 96, dy: -8, r: 1.4},
  {dx: 8, dy: 0, r: 0.9},
  {dx: 80, dy: -8, r: -1.8},
  {dx: 40, dy: 8, r: 1.9},
  {dx: 96, dy: 0, r: -1.0},
  {dx: 16, dy: -8, r: 1.3},
];
export const cardPile = (i: number) => {
  const c = cardColumn(i);
  return {x: c.x + PILE[i].dx, y: c.y + PILE[i].dy, rotate: PILE[i].r};
};
export const CARD_COLUMN_RIGHT = M.marginX + FILE_CARD.width; // 552
export const CARD_COLUMN_BOTTOM = CARD_TOP + 6 * CARD_PITCH + FILE_CARD.height; // 896

// Scene 1: the title on the right, 8 columns (a 28-character line at 72 px needs them).
export const S1_TITLE = {x: col(4), y: 96, width: span(8)};

// Scene 2-3: the right zone, from column 4 to the right margin.
export const RIGHT = {x: col(4), width: M.width - M.marginX - col(4)}; // 688, 1112 wide

export const S2_LAYOUT = {
  counter: {x: RIGHT.x, y: 216, size: style.type.secondary.size},
  label: {x: RIGHT.x, y: 352},
  rule: {x: RIGHT.x, y: 472},
  // bottom-aligned with the file column, where scene 3 puts the counter
  button: {x: RIGHT.x, y: CARD_COLUMN_BOTTOM - 88, height: 88, paddingX: 40},
};

// Scene 3: the decision counter (hero) where the button was, the five lanes above it.
export const S3_COUNTER = {x: RIGHT.x, top: CARD_COLUMN_BOTTOM - style.type.hero.size, size: style.type.hero.size, labelGap: 24};
export const S3_LANES = {
  x: RIGHT.x,
  y: 264,
  pitch: 96,
  height: 72,
  labelWidth: 240,
  valueWidth: 180,
  lineStart: CARD_COLUMN_RIGHT + 16,
  lineEnd: RIGHT.x - 24,
};
export const s3LaneTrackWidth = () => RIGHT.width - S3_LANES.labelWidth - S3_LANES.valueWidth - 2 * 24;

// Scene 3 split: the counter becomes the header; three counts side by side (corte r1: the
// shorter seals fit the storyboard's "lado a lado").
export const S3_SPLIT = {headerY: 96, columnsX: [col(0), col(4), col(8)], numberY: 312, sealY: 448, numberSize: style.type.secondary.size};
export const s3HeaderScale = () => S3_SPLIT.numberSize / S3_COUNTER.size;

// Scene 4: the sale card, the two rates, the difference (hero), then the sum and origin.
export const S4_CARD = {x: M.marginX, y: 200, width: span(5), height: 272, padding: 40};
export const S4_RATES = {labelY: 536, numberY: 592, size: style.type.secondary.size, contractX: M.marginX, chargedX: col(3)};
export const S4_BRACKET = {y: 728, labelY: 752};
export const S4_HERO = {x: col(7), y: 360, size: style.type.hero.size, prefix: style.type.heroPrefix.size};
export const S4_SUM = {x: M.marginX, y: 296, scale: style.type.secondary.size / style.type.hero.size, contextY: 432};
export const S4_GRID = {x: M.marginX, y: 600, columns: 29, pitch: 40, dot: 24, labelY: 728};
export const S4_STRIP = {x: M.marginX, y: 600, legendY: 740, traceX: M.marginX + 22};
// The dive (mergulho): toward the strip, around the left margin at the strip's centre,
// up to 1.25x; less when the one-row strip is too wide for 1.680 px once zoomed.
export const diveScale = (stripWidth: number) => Math.min(style.dist.diveScale, (M.width - 2 * M.marginX) / stripWidth);
export const DIVE = {originX: M.marginX, originY: S4_STRIP.y + 58};
export const zoomed = (x: number, y: number, z: number) => ({
  x: DIVE.originX + (x - DIVE.originX) * z,
  y: DIVE.originY + (y - DIVE.originY) * z,
});

// Hero box widths (the box is as wide as the value being counted to).
export const s4HeroWidth = (value: number) => figureWidth('money', value, S4_HERO.size, S4_HERO.prefix);

// Scene 5: three columns sized to their content (scene5 computes x), numbers at 112 when
// they fit, 88 otherwise.
export const S5_LAYOUT = {numberY: 344, labelGap: 24, legendY: 672, minGap: 48};

// Scene 6.
export const S6_LAYOUT = {
  hero: {x: M.marginX, y: 96},
  owners: {x: col(7), y: 104, pitch: 64, height: 56, labelWidth: 230, trackWidth: 300, valueWidth: 60},
  table: {x: M.marginX, headerY: 352, y: 400, textWidth: 1116, valueRight: 1484, ownerX: 1508},
};

// Scene 7.
export const S7_LAYOUT = {linesY: [280, 384, 488], titleY: 640, footerY: 936};
