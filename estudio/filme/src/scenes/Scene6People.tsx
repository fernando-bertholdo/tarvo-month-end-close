// Scene 6. O que sobra para a pessoa. 15 pendencies split by who decides and three
// examples with what to do, the value and the owner (corte r1: no closing legend).

import React from 'react';
import {useCurrentFrame} from 'remotion';
import {curves, enter, tween} from '../animation/motion';
import {S6} from '../animation/timeline';
import {BarRow} from '../components/Bars';
import {Figure} from '../components/Figure';
import {Seal} from '../components/Seal';
import {money, owners, pendingCount, pendingExamples} from '../data';
import {formatInt, formatMoneyDigits} from '../format';
import {S6_LAYOUT} from '../layout';
import {style, tabular, typeStyle} from '../style';
import {col1Hero, MoneyColumns} from './Scene5Money';
import {HeroFigure} from './Scene4Origin';
import {Stage} from './shared';

const ink = style.color.ink;
const text2 = style.color.text2;
const T = S6_LAYOUT.table;
const ROW_PAD = 20;

// The scene's end state, also drawn by scene 7 while it leaves.
export const PeopleState: React.FC<{frame: number; settled?: boolean}> = ({frame, settled = false}) => {
  const at = (start: number) => (settled ? {} : enter(frame, start, 'rise'));
  const bar = (start: number) => (settled ? 1 : tween(frame, start, style.dur.rise, 0, 1, curves.bar));
  const O = S6_LAYOUT.owners;
  return (
    <>
      {/* 15 pendencies (integers up to 20 do not count: they rise in) */}
      <div
        style={{
          position: 'absolute',
          left: S6_LAYOUT.hero.x,
          top: S6_LAYOUT.hero.y,
          display: 'flex',
          alignItems: 'baseline',
          gap: 24,
          ...at(S6.heroIn),
        }}
      >
        <Figure kind="int" value={pendingCount} size={style.type.hero.size} proportional />
        <span style={typeStyle(style.type.title, {color: ink, whiteSpace: 'nowrap'})}>pendências</span>
      </div>

      {/* by owner */}
      {owners.map((o, i) => (
        <BarRow
          key={o.owner}
          label={o.owner}
          value={formatInt(o.count)}
          fill={(o.count / pendingCount) * bar(S6.owners + i * style.delay.list + 3)}
          labelWidth={O.labelWidth}
          trackWidth={O.trackWidth}
          valueWidth={O.valueWidth}
          height={O.height}
          color={style.color.alert}
          style={{position: 'absolute', left: O.x, top: O.y + i * O.pitch, ...at(S6.owners + i * style.delay.list)}}
        />
      ))}

      {/* three examples: what to do, value, who decides */}
      <div
        style={{
          position: 'absolute',
          left: T.valueRight - 200,
          width: 200,
          top: T.headerY,
          textAlign: 'right',
          ...typeStyle(style.type.label, {color: text2}),
          ...at(S6.examples[0]),
        }}
      >
        R$
      </div>
      <div style={{position: 'absolute', left: T.x, top: T.y, width: style.frame.width - 2 * style.frame.marginX}}>
        {pendingExamples.map((p, i) => (
          <div
            key={p.text}
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              padding: `${ROW_PAD}px 0`,
              borderTop: `${style.shape.border}px solid ${style.color.border}`,
              ...at(S6.examples[i]),
            }}
          >
            <div style={{width: T.textWidth, ...typeStyle(style.type.body, {color: ink})}}>{p.text}</div>
            <div
              style={{
                position: 'absolute',
                right: style.frame.width - 2 * style.frame.marginX - (T.valueRight - T.x),
                top: '50%',
                translate: '0 -50%',
                ...typeStyle(style.type.body, {fontWeight: 600, color: ink, whiteSpace: 'nowrap'}),
                ...tabular,
              }}
            >
              {formatMoneyDigits(p.value)}
            </div>
            <div style={{position: 'absolute', left: T.ownerX - T.x, top: '50%', translate: '0 -50%'}}>
              <Seal state="decide">{p.owner}</Seal>
            </div>
          </div>
        ))}
      </div>

    </>
  );
};

export const Scene6People: React.FC = () => {
  const frame = useCurrentFrame();
  // Scene 5 columns rise, shrink and fade (the storyboard's "sobem e encolhem").
  const out = tween(frame, S6.columnsOut, 12, 0, 1, curves.exit);
  const hero = col1Hero();
  return (
    <Stage>
      {out < 1 ? (
        <div style={{position: 'absolute', inset: 0, opacity: 1 - out, translate: `0px ${-24 * out}px`, scale: String(1 - 0.04 * out), transformOrigin: '50% 0%'}}>
          <HeroFigure value={money.taxa_acima_do_contrato.total} box={hero.box} right={hero.right} top={hero.top} scale={hero.scale} />
          <MoneyColumns frame={frame} settled />
        </div>
      ) : null}
      <PeopleState frame={frame} />
    </Stage>
  );
};
