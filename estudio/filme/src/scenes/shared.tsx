// Pieces that more than one scene draws: the scene background, the file cards and the
// scene 1 title stack (which leaves during scene 2).

import React from 'react';
import {AbsoluteFill} from 'remotion';
import {enterTitle} from '../animation/motion';
import {S1} from '../animation/timeline';
import {FileCard} from '../components/FileCard';
import {files} from '../data';
import {S1_TITLE} from '../layout';
import {style, typeStyle} from '../style';

export const Stage: React.FC<{children: React.ReactNode}> = ({children}) => (
  <AbsoluteFill style={{background: style.color.background, overflow: 'hidden', fontFamily: style.font.family}}>
    {children}
  </AbsoluteFill>
);

export type CardPlacement = {x: number; y: number; rotate: number; opacity?: number; translate?: string};

export const FileCards: React.FC<{place: (i: number) => CardPlacement}> = ({place}) => (
  <>
    {files.map((f, i) => {
      const p = place(i);
      return (
        <FileCard
          key={f.label}
          label={f.label}
          kind={f.kind}
          style={{left: p.x, top: p.y, rotate: `${p.rotate}deg`, opacity: p.opacity ?? 1, translate: p.translate}}
        />
      );
    })}
  </>
);

// Scene 1 title, two lines. `t` is the scene 1 local frame used for the entries (scene 2
// passes a settled frame); `opacity` and `rise` let scene 2 take it out.
export const ArrivalTitle: React.FC<{t: number; opacity?: number; rise?: number}> = ({t, opacity = 1, rise = 0}) => {
  const title = typeStyle(style.type.title, {color: style.color.ink, whiteSpace: 'nowrap'});
  return (
    <div
      style={{
        position: 'absolute',
        left: S1_TITLE.x,
        top: S1_TITLE.y,
        width: S1_TITLE.width,
        opacity,
        translate: `0px ${-rise}px`,
      }}
    >
      <div style={{...title, ...enterTitle(t, S1.title1, 1)}}>Sete arquivos.</div>
      <div style={{...title, ...enterTitle(t, S1.title2, 1)}}>
        <span style={{color: style.color.accent}}>Oito dias úteis</span> para fechar.
      </div>
    </div>
  );
};
