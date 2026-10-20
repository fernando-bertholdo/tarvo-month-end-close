// Stroke icons, rounded joins, no fill (except the dot of the warning sign), as in
// STYLE.md "Textura". State icons copy the symbols of referencias/proposta-estilo.html.
// Drawn on a 24-unit grid; `stroke` is given in px at the rendered size.

import React from 'react';
import type {FileKind} from '../data';

export type IconName = 'done' | 'exception' | 'person' | FileKind;

const PATHS: Record<IconName, React.ReactNode> = {
  // Feito pelo motor: check in a circle.
  done: (
    <>
      <circle cx="12" cy="12" r="9.5" />
      <path d="M7.5 12.4l3 3 6-6.4" />
    </>
  ),
  // Exceção: triangle with "!".
  exception: (
    <>
      <path d="M12 3.2L22 20.5H2z" />
      <path d="M12 9.5v5" />
      <circle cx="12" cy="17.4" r="1.3" fill="currentColor" stroke="none" />
    </>
  ),
  // Para uma pessoa decidir: head and shoulders.
  person: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c.8-4.2 4-6.5 8-6.5s7.2 2.3 8 6.5" />
    </>
  ),
  // File kinds (scene 1): each file arrives its own way.
  report: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="2" />
      <path d="M3.5 9h17M3.5 14.5h17M9.5 9v11.5" />
    </>
  ),
  adjustments: (
    <>
      <path d="M6 3.5h8.5l4 4v13H6z" />
      <path d="M14.5 3.5v4h4M9 12.5h6.5M9 16.5h4" />
    </>
  ),
  rates: (
    <>
      <rect x="3.5" y="4.5" width="17" height="15" rx="2" />
      <path d="M3.5 9.5h17M9 9.5v10M14.5 9.5v10" />
    </>
  ),
  email: (
    <>
      <rect x="3" y="5.5" width="18" height="13" rx="2" />
      <path d="M3.5 7l8.5 6.2L20.5 7" />
    </>
  ),
  chart: (
    <>
      <path d="M5 5.5h14M9 10.5h10M9 15h10M5 19.5h14" />
      <circle cx="5.5" cy="12.8" r="1.2" fill="currentColor" stroke="none" />
    </>
  ),
  statement: (
    <>
      <path d="M6 3.5h12v17l-2-1.4-2 1.4-2-1.4-2 1.4-2-1.4-2 1.4z" />
      <path d="M9 8.5h6M9 12h6M9 15.5h3.5" />
    </>
  ),
};

export const Icon: React.FC<{
  name: IconName;
  size: number;
  stroke?: number;
  color?: string;
  style?: React.CSSProperties;
}> = ({name, size, stroke = 3, color = 'currentColor', style}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={(stroke * 24) / size}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{flex: 'none', color, ...style}}
  >
    {PATHS[name]}
  </svg>
);
