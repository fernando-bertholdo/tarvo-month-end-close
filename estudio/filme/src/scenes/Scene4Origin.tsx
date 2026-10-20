// Scene 4. Um número, até a origem. The flagged count opens into one sale; contract rate
// against the rate the Orbe charged; R$ 32,25 more on this sale (the scene's only
// overshoot is the seal after the count). The card shrinks into one dot of 87 operations;
// the difference, with its label, becomes the sum to claim from the Orbe for Rota Global;
// the complete state holds still; fields of the raw Orbe line rise in one row (an "…" in
// every gap) and the stage dives toward it, up to 1.25x (the film's only camera move).
//
// This scene has the exception color, so it has no accent; the trace line is text-2.

import React from 'react';
import {interpolateColors, useCurrentFrame} from 'remotion';
import {countValue, curves, draw, enter, exitOpacity, fade, lerp, stamp, tween} from '../animation/motion';
import {S4} from '../animation/timeline';
import {DotGrid} from '../components/DotGrid';
import {Figure, figureWidth} from '../components/Figure';
import {Icon} from '../components/Icon';
import {ORIGIN_STRIP_HEIGHT, OriginStrip, originStripWidth} from '../components/OriginStrip';
import {Seal} from '../components/Seal';
import {decisions, flaggedOperations, originCells, originLine, ratePoints, trace} from '../data';
import {formatPoints} from '../format';
import {textWidth} from '../measure';
import {
  DIVE,
  diveScale,
  S3_SPLIT,
  S4_BRACKET,
  S4_CARD,
  S4_GRID,
  S4_HERO,
  S4_RATES,
  S4_STRIP,
  S4_SUM,
  s3HeaderScale,
  s4HeroWidth,
} from '../layout';
import {style, tabular, typeStyle} from '../style';
import {CountColumn, CountHeader, CountLegend, countNumberWidth, DIM, FOCUS, S3_COUNTS} from './Scene3Count';
import {Stage} from './shared';

const ink = style.color.ink;
const text2 = style.color.text2;

// ---------- pieces reused by scene 5 (its first frame is this scene's last) ----------

// The sum block: hero figure at the sum place, its context and the decider seal.
export const SUM_LABEL = 'a cobrar da Orbe · Rota Global'; // approved text, corte r2
export const sumSealX = () =>
  S4_SUM.x + textWidth({text: SUM_LABEL, size: style.type.body.size, weight: style.type.body.weight, tabularNums: false}) + 24;

export const SumContext: React.FC<{labelStyle?: React.CSSProperties; sealStyle?: React.CSSProperties}> = ({labelStyle, sealStyle}) => (
  <>
    <div
      style={{
        position: 'absolute',
        left: S4_SUM.x,
        top: S4_SUM.contextY,
        height: style.shape.sealHeight,
        display: 'flex',
        alignItems: 'center',
        ...typeStyle(style.type.body, {color: ink, whiteSpace: 'nowrap'}),
        ...labelStyle,
      }}
    >
      {SUM_LABEL}
    </div>
    <div style={{position: 'absolute', left: sumSealX(), top: S4_SUM.contextY, ...sealStyle}}>
      <Seal state="decide">Decide: {trace.quem_decide}</Seal>
    </div>
  </>
);

// The origin block: trace line, the strip with five fields of the raw line, the legend
// (corte r3: it names the sale the line belongs to, dd/mm from data_venda).
export const stripZoom = () => diveScale(originStripWidth(originCells));
export const OriginBlock: React.FC<{
  stripStyle?: React.CSSProperties;
  highlight: number;
  traceDraw: number;
  legendStyle?: React.CSSProperties;
}> = ({stripStyle, highlight, traceDraw, legendStyle}) => {
  const traceTop = S4_SUM.contextY + style.shape.sealHeight + 8;
  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: S4_STRIP.traceX - 1.5,
          top: traceTop,
          width: 3,
          height: (S4_STRIP.y - traceTop) * traceDraw,
          background: text2,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: S4_STRIP.traceX - 7,
          top: traceTop - 7,
          width: 14,
          height: 14,
          borderRadius: 14,
          background: text2,
          opacity: traceDraw > 0 ? 1 : 0,
        }}
      />
      <OriginStrip cells={originCells} highlight={highlight} style={{position: 'absolute', left: S4_STRIP.x, top: S4_STRIP.y, ...stripStyle}} />
      <div
        style={{
          position: 'absolute',
          left: S4_STRIP.x,
          top: S4_STRIP.y + ORIGIN_STRIP_HEIGHT + 24,
          ...typeStyle(style.type.body, {fontWeight: 600, color: ink, whiteSpace: 'nowrap'}),
          ...legendStyle,
        }}
      >
        Relatório da Orbe, linha {originLine}: a venda de {trace.data_venda.slice(0, 5)}, como chegou.
      </div>
    </>
  );
};

// Hero figure placement: anchored by its right edge (cents stay put) so switching the box
// from R$ 32,25 to R$ 1.546,28 never makes the number jump.
export const heroAtSum = () => {
  const box = trace.total_a_cobrar_brl;
  const w = s4HeroWidth(box);
  return {right: S4_SUM.x + w * S4_SUM.scale, top: S4_SUM.y, scale: S4_SUM.scale, box, width: w};
};

export const HeroFigure: React.FC<{value: number; box: number; right: number; top: number; scale: number; opacity?: number}> = ({
  value,
  box,
  right,
  top,
  scale,
  opacity = 1,
}) => {
  const w = s4HeroWidth(box);
  return (
    <div style={{position: 'absolute', left: right - w * scale, top, transformOrigin: '0 0', scale: String(scale), opacity}}>
      <Figure kind="money" value={value} boxValue={box} size={S4_HERO.size} prefixSize={S4_HERO.prefix} />
    </div>
  );
};

// ------------------------------------- scene -------------------------------------

const DIFF_LABEL = 'a mais nesta venda';
// The label row sits in a 64 px box (the seal's height), text centred, as in SumContext.
const heroLabelTop = () => S4_HERO.y + S4_HERO.size + 24 - (style.shape.sealHeight - style.type.body.size * style.type.body.lineHeight) / 2;

export const Scene4Origin: React.FC = () => {
  const frame = useCurrentFrame();
  const leave3 = exitOpacity(frame, S4.open);

  // A. The flagged "116" opens into the sale card: the card grows out of the number's box
  // and carries the number inside (to the card's value line), so the card is never empty.
  const w116 = countNumberWidth(FOCUS);
  const from = {x: S3_SPLIT.columnsX[FOCUS], y: S3_SPLIT.numberY, w: w116, h: S3_SPLIT.numberSize};
  const open = tween(frame, S4.cardGrow, style.dur.continuity, 0, 1, curves.settle);

  // E. The empty card (its text already gone) becomes dot #0 of the grid.
  const shrink = tween(frame, S4.cardShrink, style.dur.continuity, 0, 1, curves.settle);
  const dot = {x: S4_GRID.x, y: S4_GRID.y, w: S4_GRID.dot, h: S4_GRID.dot};
  const cardRect =
    frame < S4.cardShrink
      ? {x: lerp(from.x, S4_CARD.x, open), y: lerp(from.y, S4_CARD.y, open), w: lerp(from.w, S4_CARD.width, open), h: lerp(from.h, S4_CARD.height, open)}
      : {x: lerp(S4_CARD.x, dot.x, shrink), y: lerp(S4_CARD.y, dot.y, shrink), w: lerp(S4_CARD.width, dot.w, shrink), h: lerp(S4_CARD.height, dot.h, shrink)};
  const cardFill = interpolateColors(shrink, [0, 0.6, 1], [style.color.surface, style.color.surface, style.color.critical]);
  const cardBorder = tween(frame, S4.cardShrink, 12, 1, 0, curves.exit);
  const cardFrameOpacity = tween(frame, S4.cardGrow, style.dur.exit, 0, 1, curves.linear); // in step with the leftovers leaving
  const leaveE = exitOpacity(frame, S4.clear);

  // The "116" riding in the card: bottom-left inner corner, shrinking to the value line size.
  const rideScale = lerp(1, 0.5, open);
  const ride = {
    x: cardRect.x + S4_CARD.padding * open,
    y: cardRect.y + cardRect.h - S4_CARD.padding * open - S3_SPLIT.numberSize * rideScale,
    opacity: tween(frame, S4.numberFade, style.dur.micro, 1, 0, curves.exit),
  };

  // C/E. Hero: the label first, then the number appears and counts to R$ 32,25; later the
  // number and its label move to the sum place, the label is swapped with 3 frames of
  // overlap, and 6 frames after the new label lands the number counts to R$ 1.546,28.
  const heroA = {right: S4_HERO.x + s4HeroWidth(trace.diferenca_brl), top: S4_HERO.y, scale: 1};
  const heroB = heroAtSum();
  const move = tween(frame, S4.heroMove, style.dur.continuity, 0, 1, curves.settle);
  const heroValue =
    frame < S4.sumCount
      ? countValue(frame, S4.heroCount, style.dur.counter, 0, trace.diferenca_brl, 2)
      : countValue(frame, S4.sumCount, style.dur.counter, trace.diferenca_brl, trace.total_a_cobrar_brl, 2);
  const heroBox = frame < S4.heroMove ? trace.diferenca_brl : trace.total_a_cobrar_brl;
  const heroOpacity = tween(frame, S4.heroCount, 3, 0, 1, curves.linear);
  const diffLabelIn = enter(frame, S4.heroLabel, 'rise');
  const diffLabelOut = exitOpacity(frame, S4.labelOut);

  // F. The dive, sized so the one-row strip still fits the margins once zoomed.
  const zoom = tween(frame, S4.dive, style.dur.dive, 1, stripZoom(), curves.settle);
  const stripIn = enter(frame, S4.stripRise, 'card');
  const gridLeave = exitOpacity(frame, S4.stripIn);

  // Rates geometry.
  const contractW = figureWidth('pct', trace.taxa_contratada_pct, S4_RATES.size);
  const chargedIcon = 64;
  const chargedW = figureWidth('pct', trace.taxa_aplicada_pct, S4_RATES.size);
  const x1 = S4_RATES.contractX + contractW / 2;
  const x2 = S4_RATES.chargedX + chargedIcon + 16 + chargedW / 2;
  const bracket = draw(frame, S4.bracket);
  const pointsLabel = `${formatPoints(ratePoints)} ponto`;
  const pointsW = textWidth({text: pointsLabel, size: style.type.body.size, weight: 600, tabularNums: false});

  return (
    <Stage>
      {/* scene 3 leftovers leave while the flagged number opens into the card */}
      <CountHeader value={decisions} x={style.frame.marginX} y={S3_SPLIT.headerY} scale={s3HeaderScale()} opacity={DIM * leave3} />
      {S3_COUNTS.map((c, i) =>
        i === FOCUS ? (
          <CountColumn key={c.text} i={i} numberOpacity={0} sealOpacity={leave3} />
        ) : (
          <CountColumn key={c.text} i={i} style={{opacity: DIM * leave3}} />
        ),
      )}
      <CountLegend style={{opacity: DIM * leave3}} />

      <div style={{position: 'absolute', inset: 0, transformOrigin: `${DIVE.originX}px ${DIVE.originY}px`, scale: String(zoom)}}>
        {/* the sale card (and later dot #0) */}
        <div
          style={{
            position: 'absolute',
            left: cardRect.x,
            top: cardRect.y,
            width: cardRect.w,
            height: cardRect.h,
            boxSizing: 'border-box',
            background: cardFill,
            border: `${style.shape.border}px solid rgba(218, 213, 219, ${cardBorder})`,
            borderRadius: lerp(style.shape.cardRadius, S4_GRID.dot / 2, shrink),
            boxShadow: frame < S4.cardShrink ? style.color.floatShadow : 'none',
            opacity: cardFrameOpacity * gridLeave,
          }}
        />
        {ride.opacity > 0 ? (
          <div style={{position: 'absolute', left: ride.x, top: ride.y, transformOrigin: '0 0', scale: String(rideScale), opacity: ride.opacity}}>
            <Figure kind="int" value={S3_COUNTS[FOCUS].value} size={S3_SPLIT.numberSize} proportional />
          </div>
        ) : null}
        <div style={{position: 'absolute', left: S4_CARD.x + S4_CARD.padding, top: S4_CARD.y + S4_CARD.padding - 8, opacity: leaveE}}>
          <div style={{...typeStyle(style.type.body, {fontWeight: 600, color: ink, whiteSpace: 'nowrap'}), ...enter(frame, S4.cardContent, 'rise')}}>
            {trace.lojista}
          </div>
          <div
            style={{
              ...typeStyle(style.type.label, {fontWeight: 500, color: text2, whiteSpace: 'nowrap'}),
              marginTop: 4,
              ...enter(frame, S4.cardContent + style.delay.list, 'rise'),
            }}
          >
            venda de {trace.data_venda}
          </div>
          <div style={{marginTop: 24, ...enter(frame, S4.cardContent + 2 * style.delay.list, 'rise')}}>
            <Figure kind="money" value={trace.valor_bruto} size={style.type.highlight.size} prefixSize={style.type.label.size} />
          </div>
        </div>

        {/* B. contract rate against the rate the Orbe charged */}
        <div style={{position: 'absolute', left: S4_RATES.contractX, top: S4_RATES.labelY, ...fade(enter(frame, S4.rates, 'rise'), leaveE)}}>
          <div style={typeStyle(style.type.label, {color: text2})}>Contrato</div>
          <Figure kind="pct" value={trace.taxa_contratada_pct} size={S4_RATES.size} style={{marginTop: 8}} />
        </div>
        <div style={{position: 'absolute', left: S4_RATES.chargedX, top: S4_RATES.labelY, ...fade(enter(frame, S4.rates + style.delay.list, 'rise'), leaveE)}}>
          <div style={typeStyle(style.type.label, {color: text2})}>A Orbe cobrou</div>
          <div style={{display: 'flex', alignItems: 'center', gap: 16, marginTop: 8}}>
            <Icon name="exception" size={chargedIcon} stroke={5} color={style.color.critical} />
            <Figure kind="pct" value={trace.taxa_aplicada_pct} size={S4_RATES.size} color={style.color.critical} />
          </div>
        </div>
        <svg style={{position: 'absolute', left: 0, top: 0, opacity: leaveE}} width={style.frame.width} height={style.frame.height}>
          <path
            d={`M ${x1} ${S4_BRACKET.y - 16} V ${S4_BRACKET.y} H ${x2} V ${S4_BRACKET.y - 16}`}
            fill="none"
            stroke={text2}
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - bracket}
          />
        </svg>
        <div
          style={{
            position: 'absolute',
            left: (x1 + x2) / 2 - pointsW / 2,
            top: S4_BRACKET.labelY,
            ...typeStyle(style.type.body, {fontWeight: 600, color: ink, whiteSpace: 'nowrap'}),
            ...fade(enter(frame, S4.points, 'rise'), leaveE),
          }}
        >
          {pointsLabel}
        </div>

        {/* C. the difference on this sale; E. it travels with its label to the sum place */}
        <HeroFigure
          value={heroValue}
          box={heroBox}
          right={lerp(heroA.right, heroB.right, move)}
          top={lerp(heroA.top, heroB.top, move)}
          scale={lerp(heroA.scale, heroB.scale, move)}
          opacity={heroOpacity}
        />
        <div
          style={{
            position: 'absolute',
            left: lerp(S4_HERO.x, S4_SUM.x, move),
            top: lerp(heroLabelTop(), S4_SUM.contextY, move),
            height: style.shape.sealHeight,
            display: 'flex',
            alignItems: 'center',
            ...typeStyle(style.type.body, {color: text2, whiteSpace: 'nowrap'}),
            ...fade(diffLabelIn, diffLabelOut),
          }}
        >
          {DIFF_LABEL}
        </div>
        {frame >= S4.heroSeal ? (
          <div style={{position: 'absolute', left: S4_HERO.x, top: 648, opacity: leaveE}}>
            <Seal state="exception" style={stamp(frame, S4.heroSeal)}>
              Acima do contrato
            </Seal>
          </div>
        ) : null}

        {/* E. 87 operations like this one */}
        <div style={{opacity: gridLeave}}>
          <DotGrid
            count={flaggedOperations}
            columns={S4_GRID.columns}
            pitch={S4_GRID.pitch}
            dot={S4_GRID.dot}
            color={style.color.critical}
            frame={frame}
            start={S4.dots}
            duration={S4.dotsDuration}
            style={{left: S4_GRID.x, top: S4_GRID.y}}
          />
          <div
            style={{
              position: 'absolute',
              left: S4_GRID.x,
              top: S4_GRID.labelY,
              ...typeStyle(style.type.body, {color: ink, whiteSpace: 'nowrap'}),
              ...enter(frame, S4.gridLabel, 'rise'),
            }}
          >
            <span style={tabular}>{flaggedOperations}</span> operações assim
          </div>
        </div>

        <SumContext labelStyle={enter(frame, S4.labelIn, 'rise')} sealStyle={enter(frame, S4.sumSeal, 'rise')} />

        {/* F. fields of the raw line of the Orbe report */}
        {frame >= S4.stripIn ? (
          <OriginBlock
            stripStyle={stripIn}
            highlight={tween(frame, S4.highlight, style.dur.seal, 0, 1, curves.settle)}
            traceDraw={draw(frame, S4.highlight)}
            legendStyle={enter(frame, S4.legend, 'rise')}
          />
        ) : null}
      </div>
    </Stage>
  );
};
