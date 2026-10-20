// Text width measured in the DOM with the real font. Call only below <FontGate>, which
// guarantees Manrope is loaded before anything renders. Results are cached per style.

import {style} from './style';

type MeasureInput = {
  text: string;
  size: number;
  weight: number;
  trackingEm?: number;
  tabularNums?: boolean;
};

const cache = new Map<string, number>();

export const textWidth = ({text, size, weight, trackingEm = 0, tabularNums = true}: MeasureInput): number => {
  const key = [text, size, weight, trackingEm, tabularNums].join('|');
  const hit = cache.get(key);
  if (hit !== undefined) return hit;
  const el = document.createElement('span');
  Object.assign(el.style, {
    position: 'absolute',
    left: '-20000px',
    top: '0',
    visibility: 'hidden',
    whiteSpace: 'pre',
    fontFamily: style.font.family,
    fontSize: `${size}px`,
    fontWeight: String(weight),
    letterSpacing: `${trackingEm}em`,
    fontVariantNumeric: tabularNums ? style.font.numbers : 'normal',
  });
  el.textContent = text;
  document.body.appendChild(el);
  const width = el.getBoundingClientRect().width;
  document.body.removeChild(el);
  cache.set(key, width);
  return width;
};
