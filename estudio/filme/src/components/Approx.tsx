// "≈" drawn as a vector. U+2248 is not in the embedded Manrope subset; typing it would
// fall back to a system font. Use it inline in a baseline-aligned row: the SVG bottom sits
// on the baseline and the two waves are centred on the math axis (about 0.3 em up), with a
// stroke close to Manrope 700.

import React from 'react';

export const Approx: React.FC<{size: number; color: string; style?: React.CSSProperties}> = ({size, color, style}) => {
  const w = size * 0.6;
  const h = size * 0.62;
  const stroke = size * 0.078;
  const axis = h - size * 0.31; // y of the math axis inside the SVG
  const gap = size * 0.1; // half distance between the two waves
  const a = size * 0.07; // wave amplitude
  const x0 = stroke / 2 + size * 0.02;
  const x1 = w - stroke / 2 - size * 0.02;
  const span = x1 - x0;
  const wave = (c: number) =>
    `M ${x0} ${c + 0.35 * a} C ${x0 + 0.14 * span} ${c - a}, ${x0 + 0.34 * span} ${c - a}, ${x0 + 0.5 * span} ${c} ` +
    `S ${x0 + 0.86 * span} ${c + a}, ${x1} ${c - 0.35 * a}`;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{flex: 'none', overflow: 'visible', ...style}}>
      <path d={wave(axis - gap)} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" />
      <path d={wave(axis + gap)} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" />
    </svg>
  );
};
