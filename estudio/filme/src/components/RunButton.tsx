// "Rodar o fechamento": the one button the film shows, because it exists in the panel's
// live mode. Ink fill, white label, control radius 12.

import React from 'react';
import {textWidth} from '../measure';
import {style, typeStyle} from '../style';

export const RUN_LABEL = 'Rodar o fechamento';
const LABEL = {size: style.type.body.size, weight: 600};

export const runButtonWidth = (paddingX: number) =>
  Math.ceil(textWidth({text: RUN_LABEL, size: LABEL.size, weight: LABEL.weight, tabularNums: false})) + 2 * paddingX;

export const RunButton: React.FC<{
  x: number;
  y: number;
  height: number;
  paddingX: number;
  width?: number; // to morph the button into another box (scene 3)
  radius?: number;
  labelOpacity?: number;
  fillOpacity?: number;
  style?: React.CSSProperties;
}> = ({x, y, height, paddingX, width, radius = style.shape.controlRadius, labelOpacity = 1, fillOpacity = 1, style: extra}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: width ?? runButtonWidth(paddingX),
      height,
      boxSizing: 'border-box',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      borderRadius: radius,
      background: `rgba(27, 18, 29, ${fillOpacity})`,
      color: style.color.onAccent,
      whiteSpace: 'nowrap',
      ...typeStyle(style.type.body, {fontWeight: LABEL.weight, lineHeight: 1}),
      ...extra,
    }}
  >
    <span style={{opacity: labelOpacity}}>{RUN_LABEL}</span>
  </div>
);

// Click ring (STYLE.md, cursor and click): a 2 px accent outline around the target that
// grows from 1 to 1.35 and fades out in 22 frames. Accent marks what the analyst clicked.
export const ClickRing: React.FC<{x: number; y: number; width: number; height: number; progress: number}> = ({
  x,
  y,
  width,
  height,
  progress,
}) =>
  progress <= 0 || progress >= 1 ? null : (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width,
        height,
        boxSizing: 'border-box',
        border: `2px solid ${style.color.accent}`,
        borderRadius: style.shape.controlRadius,
        scale: String(1 + 0.35 * progress),
        opacity: 1 - progress,
      }}
    />
  );
