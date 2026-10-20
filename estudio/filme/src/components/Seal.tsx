// State seal (selo de estado): pill, 12% tint, icon and word in the state color.
// Film size from STYLE.md: 36 px / 600, height 64, padding 12/24, icon 32.
// "Feito pelo motor" is the state of thousands of lines and never paints a background:
// pass `plain` and only the icon and the word carry the color.
// The three states map to engine fields (STYLE.md, "Estados"):
//   done      -> peso: rotina,  metodo: REGRA   (bom)
//   exception -> peso: atencao, metodo: REGRA   (crítico)
//   decide    -> peso: excecao, metodo: HUMANO  (alerta)

import React from 'react';
import {style, typeStyle} from '../style';
import {Icon} from './Icon';

export type SealState = 'done' | 'exception' | 'decide';

const STATE = {
  done: {color: style.color.good, tint: style.color.goodTint, icon: 'done'},
  exception: {color: style.color.critical, tint: style.color.criticalTint, icon: 'exception'},
  decide: {color: style.color.alert, tint: style.color.alertTint, icon: 'person'},
} as const;

export const sealColors = (state: SealState) => STATE[state];

export const Seal: React.FC<{
  state: SealState;
  children: React.ReactNode;
  onSurface?: boolean; // white card behind: use the tint computed over the surface
  plain?: boolean; // no tint, color only in the icon and the word (STYLE.md: "feito" stays quiet)
  style?: React.CSSProperties;
}> = ({state, children, onSurface = false, plain = false, style: extra}) => {
  const s = STATE[state];
  const tint =
    !onSurface
      ? s.tint
      : state === 'done'
        ? style.color.goodTintOnSurface
        : state === 'exception'
          ? style.color.criticalTintOnSurface
          : style.color.alertTintOnSurface;
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 12,
        height: style.shape.sealHeight,
        padding: plain ? 0 : '0 28px 0 22px',
        borderRadius: style.shape.sealRadius,
        background: plain ? 'transparent' : tint,
        color: s.color,
        whiteSpace: 'nowrap',
        transformOrigin: '30% 50%',
        ...typeStyle(style.type.label),
        ...extra,
      }}
    >
      <Icon name={s.icon} size={32} stroke={2.7} />
      {children}
    </div>
  );
};
