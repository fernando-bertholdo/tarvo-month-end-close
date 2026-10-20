// Bars: a lane row (scene 3: one front of the closing, with its total) and an owner row
// (scene 6: pendencies by who decides). Both are a label, a track that fills and a number.
// Bars are never accent; their color is passed by the scene.

import React from 'react';
import {style, tabular, typeStyle} from '../style';

export const BarRow: React.FC<{
  label: React.ReactNode;
  value: React.ReactNode;
  fill: number; // 0..1 of the track
  minFill?: number; // px, so a 7-of-2.463 lane is still a visible sliver
  labelWidth: number;
  trackWidth: number;
  valueWidth: number;
  height: number;
  trackHeight?: number;
  color: string;
  gap?: number;
  style?: React.CSSProperties;
}> = ({label, value, fill, minFill = 0, labelWidth, trackWidth, valueWidth, height, trackHeight = 16, color, gap = 24, style: extra}) => {
  const filled = fill <= 0 ? 0 : Math.max(minFill, fill * trackWidth);
  return (
    <div style={{display: 'flex', alignItems: 'center', gap, height, ...extra}}>
      <div style={typeStyle(style.type.label, {width: labelWidth, color: style.color.ink, whiteSpace: 'nowrap'})}>{label}</div>
      <div
        style={{
          position: 'relative',
          width: trackWidth,
          height: trackHeight,
          borderRadius: trackHeight,
          background: style.color.surface2,
          overflow: 'hidden',
        }}
      >
        <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: filled, borderRadius: trackHeight, background: color}} />
      </div>
      <div
        style={typeStyle(style.type.label, {
          width: valueWidth,
          textAlign: 'right',
          fontWeight: 700,
          color: style.color.ink,
          whiteSpace: 'nowrap',
          ...tabular,
        })}
      >
        {value}
      </div>
    </div>
  );
};
