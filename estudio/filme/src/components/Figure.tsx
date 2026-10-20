// A number on screen (money, integer or percentage), tabular, right-aligned inside a box
// as wide as `boxValue` (STYLE.md, "Contador": the cents stay put, the number grows to the
// left, the "R$" follows the first digit and touches the box edge on the final frame).
// The parent animates `value` with countValue() and positions the box by its left edge;
// figureWidth() gives the box width for layout math.

import React from 'react';
import {formatDecimal, formatMoneyDigits, NBSP} from '../format';
import {textWidth} from '../measure';
import {style, tabular} from '../style';

export type FigureKind = 'money' | 'int' | 'pct';

export const figureDigits = (kind: FigureKind, value: number) =>
  kind === 'money' ? formatMoneyDigits(value) : kind === 'pct' ? `${formatDecimal(value, 2)}%` : formatDecimal(value, 0);

const PREFIX = `R$${NBSP}`;
const DIGIT_WEIGHT = 700;
const DIGIT_TRACKING = -0.02;
const PREFIX_WEIGHT = 600;

export const figureWidth = (kind: FigureKind, boxValue: number, size: number, prefixSize = size / 2, tabularNums = true) => {
  const digits = textWidth({text: figureDigits(kind, boxValue), size, weight: DIGIT_WEIGHT, trackingEm: DIGIT_TRACKING, tabularNums});
  const prefix = kind === 'money' ? textWidth({text: PREFIX, size: prefixSize, weight: PREFIX_WEIGHT}) : 0;
  return digits + prefix;
};

export const Figure: React.FC<{
  kind: FigureKind;
  value: number;
  boxValue?: number; // the final value of the current count (defaults to value)
  size: number;
  prefixSize?: number; // "R$" size; half the number by default (176 -> 88)
  color?: string;
  prefixColor?: string;
  weight?: number;
  proportional?: boolean; // a lone small integer that does not count (tabular "1" leaves a hole)
  style?: React.CSSProperties;
}> = ({kind, value, boxValue, size, prefixSize, color = style.color.ink, prefixColor = style.color.text2, weight = DIGIT_WEIGHT, proportional = false, style: extra}) => {
  const pSize = prefixSize ?? size / 2;
  const width = figureWidth(kind, boxValue ?? value, size, pSize, !proportional);
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'baseline',
        width,
        whiteSpace: 'nowrap',
        fontFamily: style.font.family,
        lineHeight: 1,
        ...(proportional ? {fontVariantNumeric: 'proportional-nums lining-nums'} : tabular),
        ...extra,
      }}
    >
      {kind === 'money' ? (
        <span style={{fontSize: pSize, fontWeight: PREFIX_WEIGHT, color: prefixColor}}>{PREFIX}</span>
      ) : null}
      <span style={{fontSize: size, fontWeight: weight, letterSpacing: `${DIGIT_TRACKING}em`, color}}>
        {figureDigits(kind, value)}
      </span>
    </div>
  );
};
