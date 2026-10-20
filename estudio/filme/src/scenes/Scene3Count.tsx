// Scene 3. A conta. The button shrinks onto the counter's "0" and becomes it. The file
// lines converge into one bundle that feeds four lanes, one per stage; the bars fill one
// after another and only the main counter counts (each lane's total appears when its bar
// is full), so the total is never smaller than the parts on screen. Then the total becomes
// the header of three counts by state, side by side, and the flagged count takes the
// focus: scene 4 opens from it.

import React from 'react';
import {useCurrentFrame} from 'remotion';
import {curves, draw, enter, exitOpacity, fade, fadeTo, lerp, tween} from '../animation/motion';
import {S3} from '../animation/timeline';
import {BarRow} from '../components/Bars';
import {Figure, figureWidth} from '../components/Figure';
import {RunButton, runButtonWidth} from '../components/RunButton';
import {Seal} from '../components/Seal';
import {byWeight, decisions, files, lanes, runSeconds} from '../data';
import {formatInt, formatSeconds} from '../format';
import {
  CARD_COLUMN_RIGHT,
  cardColumn,
  S2_LAYOUT,
  S3_COUNTER,
  S3_LANES,
  S3_SPLIT,
  s3HeaderScale,
  s3LaneTrackWidth,
} from '../layout';
import {FILE_CARD} from '../components/FileCard';
import {style, typeStyle} from '../style';
import {FileCards, Stage} from './shared';

// Approved text (STORYBOARD.md, corte r1). "sinalizadas" is exact: one of the 116 is the
// Ponte's single invoice, not a rate divergence.
export const S3_COUNTS = [
  {value: byWeight.rotina, state: 'done' as const, text: 'feitas pela regra'},
  {value: byWeight.atencao, state: 'exception' as const, text: 'sinalizadas'},
  {value: byWeight.excecao, state: 'decide' as const, text: 'para uma pessoa decidir'},
];
export const FOCUS = 1;
export const DIM = 0.4;
export const S3_LEGEND_Y = 936;

// ---------- end-state pieces, reused by scene 4 for its first frames ----------

// The decision counter ("2.463 decisões"), drawn at hero size and scaled from its top-left.
export const CountHeader: React.FC<{
  value: number;
  x: number;
  y: number;
  scale: number;
  opacity?: number;
  numberOpacity?: number;
  labelOpacity?: number;
}> = ({value, x, y, scale, opacity = 1, numberOpacity = 1, labelOpacity = 1}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      display: 'flex',
      alignItems: 'baseline',
      gap: S3_COUNTER.labelGap,
      transformOrigin: '0 0',
      scale: String(scale),
      opacity,
    }}
  >
    <Figure kind="int" value={value} boxValue={decisions} size={S3_COUNTER.size} style={{opacity: numberOpacity}} />
    <span style={typeStyle(style.type.title, {color: style.color.ink, whiteSpace: 'nowrap', opacity: labelOpacity})}>decisões</span>
  </div>
);

// One count by state: the number (proportional digits: it neither counts nor sits in a
// column of numbers), its seal below. "Feito" carries no tint.
export const countNumberWidth = (i: number) => figureWidth('int', S3_COUNTS[i].value, S3_SPLIT.numberSize, undefined, false);
export const CountColumn: React.FC<{i: number; style?: React.CSSProperties; numberOpacity?: number; sealOpacity?: number}> = ({
  i,
  style: extra,
  numberOpacity = 1,
  sealOpacity = 1,
}) => {
  const c = S3_COUNTS[i];
  return (
    <div style={{position: 'absolute', left: S3_SPLIT.columnsX[i], top: S3_SPLIT.numberY, ...extra}}>
      <Figure kind="int" value={c.value} size={S3_SPLIT.numberSize} proportional style={{opacity: numberOpacity}} />
      <div style={{position: 'absolute', left: 0, top: S3_SPLIT.sealY - S3_SPLIT.numberY, opacity: sealOpacity}}>
        <Seal state={c.state} plain={c.state === 'done'}>
          {c.text}
        </Seal>
      </div>
    </div>
  );
};

export const CountLegend: React.FC<{style?: React.CSSProperties}> = ({style: extra}) => (
  <div
    style={{
      position: 'absolute',
      left: style.frame.marginX,
      top: S3_LEGEND_Y,
      ...typeStyle(style.type.label, {fontWeight: 500, color: style.color.text2, whiteSpace: 'nowrap'}),
      ...extra,
    }}
  >
    O motor levou {formatSeconds(runSeconds)}.
  </div>
);

// One bundle: every file line converges to one point, a short trunk runs to a vertical bus
// and short stubs feed each lane. It never pairs a file with a lane.
const laneMidY = (j: number) => S3_LANES.y + j * S3_LANES.pitch + S3_LANES.height / 2;
const Bundle: React.FC<{frame: number; opacity: number}> = ({frame, opacity}) => {
  const join = {x: CARD_COLUMN_RIGHT + 88, y: (laneMidY(0) + laneMidY(lanes.length - 1)) / 2};
  const busX = S3_LANES.lineEnd;
  const inDraw = draw(frame, S3.lanesIn, style.dur.rise);
  const outDraw = draw(frame, S3.lanesIn + 10, style.dur.rise);
  const stroke = {fill: 'none', stroke: style.color.border, strokeWidth: 2, strokeLinecap: 'round' as const, pathLength: 1, strokeDasharray: 1};
  return (
    <svg style={{position: 'absolute', left: 0, top: 0, opacity}} width={style.frame.width} height={style.frame.height}>
      {files.map((_, i) => {
        const y = cardColumn(i).y + FILE_CARD.height / 2;
        const x0 = CARD_COLUMN_RIGHT;
        const mx = (x0 + join.x) / 2;
        return <path key={i} d={`M ${x0} ${y} C ${mx} ${y}, ${mx} ${join.y}, ${join.x} ${join.y}`} {...stroke} strokeDashoffset={1 - inDraw} />;
      })}
      <path d={`M ${join.x} ${join.y} H ${busX}`} {...stroke} strokeDashoffset={1 - outDraw} />
      <path d={`M ${busX} ${laneMidY(0)} V ${laneMidY(lanes.length - 1)}`} {...stroke} strokeDashoffset={1 - outDraw} />
      {lanes.map((l, j) => (
        <path key={l.label} d={`M ${busX} ${laneMidY(j)} H ${busX + 12}`} {...stroke} strokeDashoffset={1 - outDraw} />
      ))}
    </svg>
  );
};

// Bar progress (0..1) of lane i; its total shows when the bar is full.
const barProgress = (frame: number, i: number) => tween(frame, S3.laneFill + i * S3.laneStagger, S3.barDuration, 0, 1, curves.bar);

// The button's box at the start and the number's box (as wide as "2.463") at the end.
const buttonBox = () => ({x: S2_LAYOUT.button.x, y: S2_LAYOUT.button.y, w: runButtonWidth(S2_LAYOUT.button.paddingX), h: S2_LAYOUT.button.height});
const numberBox = () => ({x: S3_COUNTER.x, y: S3_COUNTER.top, w: figureWidth('int', decisions, S3_COUNTER.size), h: S3_COUNTER.size});

// ------------------------------------- scene -------------------------------------

export const Scene3Count: React.FC = () => {
  const frame = useCurrentFrame();

  // Button -> counter (corte r3): the label reaches 0 with the button still; then the button
  // becomes the number's box while its dark fill fades and the ink "0" emerges at the same
  // rate (inside the box and around it), so no frame holds an empty dark block for long.
  const morph = tween(frame, S3.boxMorph, 16, 0, 1, curves.settle);
  const a = buttonBox();
  const b = numberBox();
  const fillOpacity = tween(frame, S3.fillFade, 6, 1, 0, curves.linear);
  const zeroOpacity = frame < S3.fillFade ? 0 : 1 - fillOpacity;
  const decisionsOpacity = tween(frame, S3.labelIn, 9, 0, 1, curves.linear);
  const runningSum = lanes.reduce((s, l, i) => s + Math.round(l.total * barProgress(frame, i)), 0);

  // Split: files, bundle and lanes leave first; then the counter becomes the header.
  const split = tween(frame, S3.headerMove, style.dur.continuity, 0, 1, curves.settle);
  const leave = exitOpacity(frame, S3.split);
  const dim = fadeTo(frame, S3.focus, 1, DIM, S3.focusDuration);

  return (
    <Stage>
      <FileCards place={(i) => ({...cardColumn(i), opacity: leave})} />

      {fillOpacity > 0 ? (
        <RunButton
          x={lerp(a.x, b.x, morph)}
          y={lerp(a.y, b.y, morph)}
          width={lerp(a.w, b.w, morph)}
          height={lerp(a.h, b.h, morph)}
          radius={lerp(style.shape.controlRadius, style.shape.cardRadius, morph)}
          paddingX={S2_LAYOUT.button.paddingX}
          labelOpacity={tween(frame, S3.morph, 4, 1, 0, curves.exit)}
          fillOpacity={fillOpacity}
        />
      ) : null}

      <Bundle frame={frame} opacity={leave} />

      {lanes.map((lane, i) => {
        const y = S3_LANES.y + i * S3_LANES.pitch;
        const rowIn = enter(frame, S3.lanesIn + i * style.delay.list, 'rise');
        const full = S3.laneFill + i * S3.laneStagger + S3.barDuration;
        return (
          <BarRow
            key={lane.label}
            label={lane.label}
            value={<span style={{opacity: tween(frame, full, style.dur.micro, 0, 1, curves.linear)}}>{formatInt(lane.total)}</span>}
            fill={(lane.total / decisions) * barProgress(frame, i)}
            minFill={6}
            labelWidth={S3_LANES.labelWidth}
            trackWidth={s3LaneTrackWidth()}
            valueWidth={S3_LANES.valueWidth}
            height={S3_LANES.height}
            color={style.color.text2}
            style={{position: 'absolute', left: S3_LANES.x, top: y, ...fade(rowIn, leave)}}
          />
        );
      })}

      <CountHeader
        value={Math.min(runningSum, decisions)}
        x={S3_COUNTER.x + (style.frame.marginX - S3_COUNTER.x) * split}
        y={S3_COUNTER.top + (S3_SPLIT.headerY - S3_COUNTER.top) * split}
        scale={1 + (s3HeaderScale() - 1) * split}
        opacity={dim}
        numberOpacity={zeroOpacity}
        labelOpacity={decisionsOpacity}
      />

      {S3_COUNTS.map((c, i) => (
        <CountColumn key={c.text} i={i} style={fade(enter(frame, S3.columns + i * style.delay.list, 'rise'), i === FOCUS ? 1 : dim)} />
      ))}

      <CountLegend style={fade(enter(frame, S3.legend, 'rise'), dim)} />
    </Stage>
  );
};
