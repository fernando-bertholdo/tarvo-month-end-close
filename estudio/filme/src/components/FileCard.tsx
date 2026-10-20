// File card (cartão de arquivo): one of the month's source files, as the human calls it,
// with its volume. Same component in the pile (scene 1) and in the column (scenes 2 and 3),
// so the cut keeps size and color; only position and rotation change. Corte r1: label
// only (the volumes left the screen).

import React from 'react';
import type {FileKind} from '../data';
import {style, typeStyle} from '../style';
import {Icon} from './Icon';

export const FILE_CARD = {width: 432, height: 88} as const;

export const FileCard: React.FC<{
  label: string;
  kind: FileKind;
  style?: React.CSSProperties;
}> = ({label, kind, style: extra}) => (
  <div
    style={{
      position: 'absolute',
      width: FILE_CARD.width,
      height: FILE_CARD.height,
      boxSizing: 'border-box',
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      padding: '0 20px',
      background: style.color.surface,
      border: `${style.shape.border}px solid ${style.color.border}`,
      borderRadius: style.shape.cardRadius,
      ...extra,
    }}
  >
    <Icon name={kind} size={40} stroke={3} color={style.color.text2} />
    <div style={typeStyle(style.type.label, {color: style.color.ink, lineHeight: 1.2, whiteSpace: 'nowrap'})}>{label}</div>
  </div>
);
