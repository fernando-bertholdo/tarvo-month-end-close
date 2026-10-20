// Origin strip (faixa da linha de origem): fields of one raw line of a source file, as
// they arrived, one per cell, in one row (STYLE.md: Manrope 500 tabular at 36 px, the
// fields that matter at 44 px, no monospace). A narrow "…" cell with a dashed border marks
// every gap of fields the strip leaves out.
// `highlight` (0..1) lights the fields that matter: the gross value in ink on surface 2,
// the applied rate in the exception color with a warning badge on its corner (color never
// alone; the badge sits outside the flow, so lighting it moves nothing).

import React from 'react';
import {interpolateColors} from 'remotion';
import {textWidth} from '../measure';
import {style, tabular, typeStyle} from '../style';
import {Icon} from './Icon';

export const STRIP = {cellHeight: 64, gap: 8, padding: 24, radius: 16, cellPadding: 14} as const;

export type StripCell = {text: string; mark?: 'value' | 'exception'; ellipsis?: boolean};

const cellType = (c: StripCell) =>
  c.mark ? {size: style.type.body.size, weight: 600} : {size: style.type.label.size, weight: 500};
const cellPadding = (c: StripCell) => (c.ellipsis ? 8 : STRIP.cellPadding);
const cellMin = (c: StripCell) => (c.ellipsis ? 36 : 48);

// Width of the strip, measured with the real font (call below <FontGate>).
export const originStripWidth = (cells: StripCell[]) => {
  const b = style.shape.border;
  const inner = cells.reduce((sum, c) => {
    const t = cellType(c);
    const w = textWidth({text: c.text, size: t.size, weight: t.weight}) + 2 * cellPadding(c) + 2 * b;
    return sum + Math.max(cellMin(c), w);
  }, 0);
  return inner + (cells.length - 1) * STRIP.gap + 2 * STRIP.padding + 2 * b;
};
export const ORIGIN_STRIP_HEIGHT = STRIP.cellHeight + 2 * STRIP.padding + 2 * style.shape.border;

const Cell: React.FC<{cell: StripCell; highlight: number}> = ({cell, highlight}) => {
  const isValue = cell.mark === 'value';
  const isException = cell.mark === 'exception';
  const t = cellType(cell);
  const bg = isException
    ? interpolateColors(highlight, [0, 1], [style.color.surface, style.color.criticalTintOnSurface])
    : isValue
      ? interpolateColors(highlight, [0, 1], [style.color.surface, style.color.surface2])
      : style.color.surface;
  const border = cell.mark
    ? interpolateColors(highlight, [0, 1], [style.color.border, isException ? style.color.critical : style.color.ink])
    : style.color.border;
  const color = isException
    ? interpolateColors(highlight, [0, 1], [style.color.ink, style.color.critical])
    : cell.ellipsis
      ? style.color.text2
      : style.color.ink;
  return (
    <div
      style={{
        position: 'relative',
        height: STRIP.cellHeight,
        minWidth: cellMin(cell),
        boxSizing: 'border-box',
        padding: `0 ${cellPadding(cell)}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: bg,
        border: `${style.shape.border}px ${cell.ellipsis ? 'dashed' : 'solid'} ${border}`,
        borderRadius: 10,
        color,
        whiteSpace: 'pre',
        ...typeStyle({size: t.size, weight: t.weight, lineHeight: 1, tracking: 0}),
        ...tabular,
      }}
    >
      {isException ? (
        <div
          style={{
            position: 'absolute',
            left: -14,
            top: -17,
            width: 34,
            height: 34,
            borderRadius: 34,
            boxSizing: 'border-box',
            background: style.color.surface,
            border: `${style.shape.border}px solid ${style.color.critical}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: highlight,
            scale: String(0.8 + 0.2 * highlight),
          }}
        >
          <Icon name="exception" size={22} stroke={2} color={style.color.critical} />
        </div>
      ) : null}
      {cell.text}
    </div>
  );
};

export const OriginStrip: React.FC<{cells: StripCell[]; highlight: number; style?: React.CSSProperties}> = ({
  cells,
  highlight,
  style: extra,
}) => (
  <div
    style={{
      width: originStripWidth(cells),
      boxSizing: 'border-box',
      padding: STRIP.padding,
      display: 'flex',
      gap: STRIP.gap,
      background: style.color.surface,
      border: `${style.shape.border}px solid ${style.color.border}`,
      borderRadius: STRIP.radius,
      boxShadow: style.color.floatShadow,
      ...extra,
    }}
  >
    {cells.map((c, i) => (
      <Cell key={i} cell={c} highlight={highlight} />
    ))}
  </div>
);
