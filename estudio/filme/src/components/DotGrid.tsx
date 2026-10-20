// Dot grid (grade de pontos): one dot per item, appearing in quick sequence. Volume
// becomes a count you can see, never a list you have to scroll (STYLE.md).

import React from 'react';
import {curves, tween} from '../animation/motion';

export const DotGrid: React.FC<{
  count: number;
  columns: number;
  pitch: number;
  dot: number;
  color: string;
  frame: number;
  start: number; // frame at which dot #1 appears (dot #0 is placed by the caller)
  duration: number; // frames to reveal all the remaining dots
  skipFirst?: boolean; // dot #0 is the element that shrank into the grid
  style?: React.CSSProperties;
}> = ({count, columns, pitch, dot, color, frame, start, duration, skipFirst = true, style: extra}) => {
  const rows = Math.ceil(count / columns);
  const reveal = Math.max(1, count - 1);
  return (
    <div style={{position: 'absolute', width: (columns - 1) * pitch + dot, height: (rows - 1) * pitch + dot, ...extra}}>
      {Array.from({length: count}, (_, i) => {
        if (i === 0 && skipFirst) return null;
        const at = start + ((i - 1) / reveal) * duration;
        const t = tween(frame, at, 6, 0, 1, curves.settle);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: (i % columns) * pitch,
              top: Math.floor(i / columns) * pitch,
              width: dot,
              height: dot,
              borderRadius: dot,
              background: color,
              opacity: t,
              scale: String(0.6 + 0.4 * t),
            }}
          />
        );
      })}
    </div>
  );
};

export const dotPosition = (i: number, columns: number, pitch: number) => ({
  x: (i % columns) * pitch,
  y: Math.floor(i / columns) * pitch,
});
