// Frame-driven motion helpers built on the STYLE.md curves. Everything here is a pure
// function of the frame number: the film is deterministic by construction.

import {Easing, interpolate} from 'remotion';
import {style} from '../style';

type Curve = (t: number) => number;
const bezier = (c: readonly number[]): Curve => Easing.bezier(c[0], c[1], c[2], c[3]);

export const curves = {
  settle: bezier(style.curve.settle), // pousa
  rise: bezier(style.curve.rise), // sobe
  text: bezier(style.curve.text), // texto
  confirm: bezier(style.curve.confirm), // confirma
  bar: bezier(style.curve.bar), // barra
  exit: bezier(style.curve.exit), // sai
  pulse: bezier(style.curve.pulse), // pulso
  linear: (t: number) => t,
};

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// 0..1 progress of [start, start + duration).
export const progress = (frame: number, start: number, duration: number) =>
  interpolate(frame, [start, start + duration], [0, 1], CLAMP);

// Value from `from` to `to` over [start, start + duration) with a curve.
export const tween = (
  frame: number,
  start: number,
  duration: number,
  from: number,
  to: number,
  curve: Curve = curves.settle,
) => interpolate(frame, [start, start + duration], [from, to], {...CLAMP, easing: curve});

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// Entry: opacity finishes at 70% of the movement; position travels `distance` px up.
// `kind` picks the STYLE.md duration and curve. Returns CSS for the moving element.
export type EnterKind = 'rise' | 'card' | 'line';
export const enter = (
  frame: number,
  start: number,
  kind: EnterKind = 'rise',
  axis: 'y' | 'x' = 'y',
): React.CSSProperties => {
  const duration = kind === 'card' ? style.dur.card : style.dur.rise;
  const opacityDuration = kind === 'card' ? style.dur.cardOpacity : Math.round(duration * style.opacityEndsAt);
  const distance = kind === 'card' ? style.dist.card : kind === 'line' ? style.dist.line : style.dist.rise;
  const curve = kind === 'card' ? curves.settle : curves.rise;
  const offset = tween(frame, start, duration, distance, 0, curve);
  return {
    opacity: tween(frame, start, opacityDuration, 0, 1, curves.linear),
    translate: axis === 'y' ? `0px ${offset}px` : `${-offset}px 0px`,
  };
};

// Title entry: rises 24 px out of an 8 px blur (blur over the first 60%), `texto` curve.
export const enterTitle = (frame: number, start: number, lines: number): React.CSSProperties => {
  const duration = style.dur.title + style.delay.titleLine * lines;
  return {
    opacity: tween(frame, start, Math.round(duration * style.opacityEndsAt), 0, 1, curves.linear),
    translate: `0px ${tween(frame, start, duration, style.dist.title, 0, curves.text)}px`,
    filter: `blur(${tween(frame, start, Math.round(duration * 0.6), style.dist.titleBlur, 0, curves.linear)}px)`,
  };
};

// Multiplies an entry style's opacity by a factor (an exit, a dim), so the two compose
// instead of one overriding the other.
export const fade = (css: React.CSSProperties, factor: number): React.CSSProperties => ({
  ...css,
  opacity: (css.opacity === undefined ? 1 : Number(css.opacity)) * factor,
});

// Exit: opacity only, 10 frames, `sai` curve. Returns the multiplier.
export const exitOpacity = (frame: number, start: number, duration: number = style.dur.exit) =>
  tween(frame, start, duration, 1, 0, curves.exit);

// Plain fade to a target opacity (used to dim to 40%).
export const fadeTo = (frame: number, start: number, from: number, to: number, duration = style.dur.micro * 2) =>
  tween(frame, start, duration, from, to, curves.settle);

// Counter value: from -> to with `pousa`, rounded to the unit, never above the target,
// never going back, exact on the last frame (the caller formats the JSON value).
export const countValue = (
  frame: number,
  start: number,
  duration: number,
  from: number,
  to: number,
  decimals: number,
) => {
  const t = progress(frame, start, duration);
  if (t >= 1) return to;
  if (t <= 0) return from;
  const unit = 10 ** decimals;
  const v = Math.round((from + (to - from) * curves.settle(t)) * unit) / unit;
  return Math.min(to, Math.max(from, v));
};

// Seal stamp (carimbo): scale 1.35 -> 1 over 12 frames with `confirma`, visible by frame 5.
export const stamp = (frame: number, start: number): React.CSSProperties => ({
  opacity: tween(frame, start, 5, 0, 1, curves.linear),
  scale: String(tween(frame, start, style.dur.seal, 1.35, 1, curves.confirm)),
});

// Seal plain entry (no overshoot): used where the scene's single `confirma` is spent.
export const sealEnter = (frame: number, start: number): React.CSSProperties => enter(frame, start, 'rise');

// Click on a control: sinks to `depth` in 5 frames and comes back in 7.
export const clickScale = (frame: number, start: number, depth = 0.97) => {
  if (frame < start + style.dur.clickDown) return tween(frame, start, style.dur.clickDown, 1, depth, curves.settle);
  return tween(frame, start + style.dur.clickDown, style.dur.clickBack, depth, 1, curves.settle);
};

// Stroke reveal 0..1 (lines and brackets that draw).
export const draw = (frame: number, start: number, duration = style.dur.rise) =>
  tween(frame, start, duration, 0, 1, curves.rise);
