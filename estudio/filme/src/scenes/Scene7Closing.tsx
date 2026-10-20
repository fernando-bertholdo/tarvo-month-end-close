// Scene 7. Fecho. Everything leaves; the opening sentence comes back in three parts, then
// the title and the footer with the case seal and the AI rule. The last frame is the
// film's poster and stays still (at least 2,5 s). Centered: allowed in the closing frame.

import React from 'react';
import {useCurrentFrame} from 'remotion';
import {enter, enterTitle, exitOpacity} from '../animation/motion';
import {S7} from '../animation/timeline';
import {pendingCount} from '../data';
import {S7_LAYOUT} from '../layout';
import {style, typeStyle} from '../style';
import {PeopleState} from './Scene6People';
import {Stage} from './shared';

const centered: React.CSSProperties = {position: 'absolute', left: 0, width: style.frame.width, textAlign: 'center'};

export const CLOSING_LINES = ['A conta em menos de um segundo.', 'Cada número com origem.', `${pendingCount} decisões para pessoas.`];

export const Scene7Closing: React.FC = () => {
  const frame = useCurrentFrame();
  const leave = exitOpacity(frame, S7.allOut);
  return (
    <Stage>
      {leave > 0 ? (
        <div style={{position: 'absolute', inset: 0, opacity: leave}}>
          <PeopleState frame={frame} settled />
        </div>
      ) : null}

      {CLOSING_LINES.map((line, i) => (
        <div
          key={line}
          style={{
            ...centered,
            top: S7_LAYOUT.linesY[i],
            ...typeStyle(style.type.title, {color: style.color.ink}),
            ...enterTitle(frame, S7.lines[i], 1),
          }}
        >
          {line}
        </div>
      ))}

      {/* corte r2: the product name is the poster's Destaque (56 px, 600, ink) */}
      <div style={{...centered, top: S7_LAYOUT.titleY, ...typeStyle(style.type.highlight, {color: style.color.ink}), ...enter(frame, S7.title, 'rise')}}>
        Fechamento de setembro · Tarvo
      </div>

      <div style={{...centered, top: S7_LAYOUT.footerY, ...typeStyle(style.type.label, {fontWeight: 500, color: style.color.text2}), ...enter(frame, S7.footer, 'rise')}}>
        Dados fictícios do case · todo valor sai de regra
      </div>
    </Stage>
  );
};
