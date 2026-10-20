// The film: seven scenes back to back. Each scene gets its local frame from its
// <Sequence>; the timeline module owns every start and duration.

import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {SCENE_DURATIONS as D, SCENE_START as S} from '../animation/timeline';
import {FontGate} from '../fonts';
import {Scene1Arrival} from '../scenes/Scene1Arrival';
import {Scene2Rules} from '../scenes/Scene2Rules';
import {Scene3Count} from '../scenes/Scene3Count';
import {Scene4Origin} from '../scenes/Scene4Origin';
import {Scene5Money} from '../scenes/Scene5Money';
import {Scene6People} from '../scenes/Scene6People';
import {Scene7Closing} from '../scenes/Scene7Closing';
import {style} from '../style';

export const Fechamento: React.FC = () => (
  <FontGate>
    <AbsoluteFill style={{background: style.color.background}}>
      <Sequence name="1 O mês chega" from={S.s1} durationInFrames={D.s1}>
        <Scene1Arrival />
      </Sequence>
      <Sequence name="2 As regras, escritas" from={S.s2} durationInFrames={D.s2}>
        <Scene2Rules />
      </Sequence>
      <Sequence name="3 A conta" from={S.s3} durationInFrames={D.s3}>
        <Scene3Count />
      </Sequence>
      <Sequence name="4 Um número, até a origem" from={S.s4} durationInFrames={D.s4}>
        <Scene4Origin />
      </Sequence>
      <Sequence name="5 O dinheiro que apareceu" from={S.s5} durationInFrames={D.s5}>
        <Scene5Money />
      </Sequence>
      <Sequence name="6 O que sobra para a pessoa" from={S.s6} durationInFrames={D.s6}>
        <Scene6People />
      </Sequence>
      <Sequence name="7 Fecho" from={S.s7} durationInFrames={D.s7}>
        <Scene7Closing />
      </Sequence>
    </AbsoluteFill>
  </FontGate>
);
