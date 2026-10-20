// Scene 5. O dinheiro que apareceu. The Rota Global sum slides into column 1 and joins it
// (it is part of the rate above contract): the column total counts up from it. Then the
// other two values. The three are never summed; thin dividers keep them apart.
//
// Columns are as wide as their content. Numbers use the secondary size (112 px) when the
// three columns fit the 1.680 px of useful width with at least 48 px between them, and
// 88 px otherwise (STORYBOARD.md, corte r1).

import React from 'react';
import {useCurrentFrame} from 'remotion';
import {countValue, curves, enter, exitOpacity, lerp, tween} from '../animation/motion';
import {S5} from '../animation/timeline';
import {Approx} from '../components/Approx';
import {Figure, figureWidth} from '../components/Figure';
import {money, trace} from '../data';
import {formatThousandsOneDecimal, NBSP} from '../format';
import {textWidth} from '../measure';
import {DIVE, S5_LAYOUT, s4HeroWidth, zoomed} from '../layout';
import {style, tabular, typeStyle} from '../style';
import {heroAtSum, HeroFigure, OriginBlock, stripZoom, SumContext} from './Scene4Origin';
import {Stage} from './shared';

const ink = style.color.ink;
const text2 = style.color.text2;
const M = style.frame;
const BODY_LINE = style.type.body.size * style.type.body.lineHeight;

// Approved text (STORYBOARD.md, cortes r1 and r2), two lines per label, broken by meaning.
const LABELS: [string, string][] = [
  ['taxa acima do contrato', 'Orbe e Ponte'], // corte r2: the total is Orbe's and Ponte's
  ['a devolver à', 'Casa do Estudante'],
  ['da Atlas, a faturar', 'em outubro'],
];
const LEGEND = 'Mesma causa: o combinado não virou regra.';
const atlasThousands = () => `${formatThousandsOneDecimal(money.atlas.taxa_estimada)} mil`;

const labelWidth = (lines: [string, string]) =>
  Math.max(...lines.map((t) => textWidth({text: t, size: style.type.body.size, weight: 600, tabularNums: false})));

const numberWidths = (n: number) => [
  figureWidth('money', money.taxa_acima_do_contrato.total, n, n / 2),
  figureWidth('money', money.devolver_casa_do_estudante.valor, n, n / 2),
  n * 0.6 + 16 + textWidth({text: `R$${NBSP}`, size: n / 2, weight: 600}) + textWidth({text: atlasThousands(), size: n, weight: 700, trackingEm: -0.02}),
];

// Column geometry: number size, column x, widths and divider positions.
export const moneyLayout = () => {
  const usable = M.width - 2 * M.marginX;
  const fits = (n: number) => {
    const w = numberWidths(n).map((nw, i) => Math.max(nw, labelWidth(LABELS[i])));
    return {w, gap: (usable - w.reduce((a, b) => a + b, 0)) / 2};
  };
  const big = fits(style.type.secondary.size);
  const size = big.gap >= S5_LAYOUT.minGap ? style.type.secondary.size : 88;
  const {w, gap} = size === style.type.secondary.size ? big : fits(88);
  const x = [M.marginX, M.marginX + w[0] + gap, M.width - M.marginX - w[2]];
  return {size, x, w, dividers: [x[0] + w[0] + gap / 2, x[1] + w[1] + gap / 2]};
};

// Column 1 number = the scene 4 hero, drawn at 176 and scaled to the column size.
export const col1Hero = () => {
  const {size} = moneyLayout();
  const box = money.taxa_acima_do_contrato.total;
  const scale = size / 176;
  return {box, scale, right: M.marginX + s4HeroWidth(box) * scale, top: S5_LAYOUT.numberY};
};

// The three columns at rest (scene 6 draws them leaving). Column 1's number is drawn by
// the caller (it is the hero element that came from scene 4).
export const MoneyColumns: React.FC<{frame: number; settled?: boolean}> = ({frame, settled = false}) => {
  const at = (start: number) => (settled ? {} : enter(frame, start, 'rise'));
  const {size, x, dividers} = moneyLayout();
  const y = S5_LAYOUT.numberY;
  const labelY = y + size + S5_LAYOUT.labelGap;
  const label = (i: number, start: number) => (
    <div style={{position: 'absolute', left: x[i], top: labelY, ...typeStyle(style.type.body, {fontWeight: 600, color: ink, whiteSpace: 'nowrap'}), ...at(start)}}>
      {LABELS[i][0]}
      <br />
      {LABELS[i][1]}
    </div>
  );
  return (
    <>
      {label(0, S5.col1Label)}

      <div style={{position: 'absolute', left: x[1], top: y, ...at(S5.col2)}}>
        <Figure kind="money" value={money.devolver_casa_do_estudante.valor} size={size} />
      </div>
      {label(1, S5.col2 + style.delay.list)}

      {/* column 3: an estimate, marked with ≈ */}
      <div
        style={{
          position: 'absolute',
          left: x[2],
          top: y,
          height: size,
          display: 'flex',
          alignItems: 'baseline',
          whiteSpace: 'nowrap',
          lineHeight: 1,
          ...tabular,
          ...at(S5.col3),
        }}
      >
        <Approx size={size} color={ink} style={{marginRight: 16}} />
        <span style={{fontSize: size / 2, fontWeight: 600, color: text2}}>{`R$${NBSP}`}</span>
        <span style={{fontSize: size, fontWeight: 700, letterSpacing: '-0.02em', color: ink}}>{atlasThousands()}</span>
      </div>
      {label(2, S5.col3 + style.delay.list)}

      {/* thin dividers: three values of different nature, side by side, never added */}
      {dividers.map((dx) => (
        <div
          key={dx}
          style={{
            position: 'absolute',
            left: dx - 1,
            top: y,
            width: style.shape.border,
            height: size + S5_LAYOUT.labelGap + 2 * BODY_LINE,
            background: style.color.border,
            ...at(S5.col2),
          }}
        />
      ))}

      <div style={{position: 'absolute', left: x[0], top: S5_LAYOUT.legendY, ...typeStyle(style.type.body, {color: ink, whiteSpace: 'nowrap'}), ...at(S5.legend)}}>
        {LEGEND}
      </div>
    </>
  );
};

export const Scene5Money: React.FC = () => {
  const frame = useCurrentFrame();
  const z = stripZoom();

  // Start: the hero exactly where scene 4 left it. It is drawn inside a container that
  // carries the dive zoom (scale z around the dive origin) and unwinds it to 1 during the
  // slide, so the first frame nests the same transforms as scene 4's last (no 1-px snap).
  const a = heroAtSum();
  const aTopLeft = zoomed(a.right - a.width * a.scale, a.top, z);
  const aScale = a.scale * z;
  const end = col1Hero();
  const slide = tween(frame, S5.slide, style.dur.continuity, 0, 1, curves.settle);
  const containerScale = lerp(z, 1, slide);
  const screenScale = lerp(aScale, end.scale, slide);
  const screenRight = lerp(aTopLeft.x + a.width * aScale, end.right, slide);
  const screenTop = lerp(aTopLeft.y, end.top, slide);
  const toLocal = (v: number, origin: number) => origin + (v - origin) / containerScale;
  const value =
    frame < S5.col1Count
      ? trace.total_a_cobrar_brl
      : countValue(frame, S5.col1Count, style.dur.counter, trace.total_a_cobrar_brl, money.taxa_acima_do_contrato.total, 2);

  const leave = exitOpacity(frame, S5.leave);
  const stripDown = tween(frame, S5.leave, 12, 0, 96, curves.exit);

  return (
    <Stage>
      {/* scene 4 end state, still zoomed, leaving; the strip leaves downward */}
      <div style={{position: 'absolute', inset: 0, transformOrigin: `${DIVE.originX}px ${DIVE.originY}px`, scale: String(z)}}>
        <div style={{opacity: leave}}>
          <SumContext />
          <OriginBlock highlight={1} traceDraw={1} stripStyle={{translate: `0px ${stripDown}px`}} />
        </div>
      </div>

      <div style={{position: 'absolute', inset: 0, transformOrigin: `${DIVE.originX}px ${DIVE.originY}px`, scale: String(containerScale)}}>
        <HeroFigure
          value={value}
          box={end.box}
          right={toLocal(screenRight, DIVE.originX)}
          top={toLocal(screenTop, DIVE.originY)}
          scale={screenScale / containerScale}
        />
      </div>

      <MoneyColumns frame={frame} />
    </Stage>
  );
};
