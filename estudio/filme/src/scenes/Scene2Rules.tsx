// Scene 2. As regras, escritas. The same cards straighten into a column; 60 answers from
// the finance team became rules; one example; the run button and its click.

import React from 'react';
import {useCurrentFrame} from 'remotion';
import {clickScale, countValue, curves, enter, exitOpacity, fade, tween} from '../animation/motion';
import {S2, SCENE_DURATIONS} from '../animation/timeline';
import {Figure} from '../components/Figure';
import {ClickRing, RunButton, runButtonWidth} from '../components/RunButton';
import {financeRules} from '../data';
import {cardColumn, cardPile, S2_LAYOUT} from '../layout';
import {style, typeStyle} from '../style';
import {ArrivalTitle, FileCards, Stage} from './shared';

// Approved text (STORYBOARD.md, corte r1): one rule only.
export const RULE_TEXT = 'Vale a taxa do contrato, não a da Orbe.';

export const Scene2Rules: React.FC = () => {
  const frame = useCurrentFrame();
  const settle = tween(frame, S2.straighten, style.dur.continuity, 0, 1, curves.settle);

  // 6 frames after the click (the button's lowest point) the rule and the counter recede
  // and fade; the button stays.
  const recede = tween(frame, S2.rulesOut, style.dur.exit, 0, 1, curves.exit);
  const receding: React.CSSProperties = {opacity: 1 - recede, scale: String(1 - 0.04 * recede), transformOrigin: '0% 50%'};

  const counterIn = enter(frame, S2.counterIn, 'rise');
  const buttonIn = enter(frame, S2.buttonIn, 'rise');

  return (
    <Stage>
      <FileCards
        place={(i) => {
          const a = cardPile(i);
          const b = cardColumn(i);
          return {x: a.x + (b.x - a.x) * settle, y: a.y + (b.y - a.y) * settle, rotate: a.rotate * (1 - settle)};
        }}
      />

      <ArrivalTitle
        t={SCENE_DURATIONS.s1}
        opacity={exitOpacity(frame, S2.titleOut)}
        rise={tween(frame, S2.titleOut, style.dur.exit, 0, style.dist.rise, curves.exit)}
      />

      {/* 60 answers became rules: the label first; the number appears as it starts counting */}
      <div style={{position: 'absolute', left: S2_LAYOUT.counter.x, top: S2_LAYOUT.counter.y, ...receding}}>
        <div style={counterIn}>
          <Figure
            kind="int"
            value={countValue(frame, S2.counterCount, style.dur.counterInt, 0, financeRules, 0)}
            boxValue={financeRules}
            size={S2_LAYOUT.counter.size}
            style={{opacity: tween(frame, S2.counterCount, 3, 0, 1, curves.linear)}}
          />
          <div style={{...typeStyle(style.type.body, {color: style.color.ink, whiteSpace: 'nowrap'}), marginTop: 24}}>
            respostas do financeiro viraram regras.
          </div>
        </div>
      </div>

      {/* the one example rule */}
      <div
        style={{
          position: 'absolute',
          left: S2_LAYOUT.rule.x,
          top: S2_LAYOUT.rule.y,
          ...typeStyle(style.type.body, {color: style.color.ink, whiteSpace: 'nowrap'}),
          borderLeft: `4px solid ${style.color.border}`,
          paddingLeft: 28,
          ...receding,
          ...fade(enter(frame, S2.rule, 'rise'), 1 - recede),
        }}
      >
        {RULE_TEXT}
      </div>

      <RunButton
        x={S2_LAYOUT.button.x}
        y={S2_LAYOUT.button.y}
        height={S2_LAYOUT.button.height}
        paddingX={S2_LAYOUT.button.paddingX}
        style={{...buttonIn, scale: String(clickScale(frame, S2.press, 0.96))}}
      />
      <ClickRing
        x={S2_LAYOUT.button.x}
        y={S2_LAYOUT.button.y}
        width={runButtonWidth(S2_LAYOUT.button.paddingX)}
        height={S2_LAYOUT.button.height}
        progress={tween(frame, S2.click, style.dur.clickRing, 0, 1, curves.settle)}
      />
    </Stage>
  );
};
