// Scene 1. O mês chega. Seven files arrive one by one, slightly out of line, and the
// title states the pain: each file its own way, eight working days, rules in someone's head.

import React from 'react';
import {useCurrentFrame} from 'remotion';
import {enter} from '../animation/motion';
import {S1} from '../animation/timeline';
import {cardPile} from '../layout';
import {ArrivalTitle, FileCards, Stage} from './shared';

export const Scene1Arrival: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Stage>
      <FileCards
        place={(i) => {
          const p = cardPile(i);
          const e = enter(frame, S1.cardsStart + i * S1.cardStagger, 'card');
          return {...p, opacity: e.opacity as number, translate: e.translate as string};
        }}
      />
      <ArrivalTitle t={frame} />
    </Stage>
  );
};
