// Compositions. `Fechamento` is the film; each scene is also registered on its own
// (folder "Cenas") so the studio can open and reuse a scene without the whole film.

import React from 'react';
import {Composition, Folder} from 'remotion';
import {SCENE_DURATIONS as D, TOTAL_FRAMES} from './animation/timeline';
import {Fechamento} from './compositions/Fechamento';
import {FontGate} from './fonts';
import {Scene1Arrival} from './scenes/Scene1Arrival';
import {Scene2Rules} from './scenes/Scene2Rules';
import {Scene3Count} from './scenes/Scene3Count';
import {Scene4Origin} from './scenes/Scene4Origin';
import {Scene5Money} from './scenes/Scene5Money';
import {Scene6People} from './scenes/Scene6People';
import {Scene7Closing} from './scenes/Scene7Closing';
import {style} from './style';

const W = style.frame.width;
const H = style.frame.height;
const FPS = style.fps;

const gated = (Scene: React.FC) => {
  const Gated: React.FC = () => (
    <FontGate>
      <Scene />
    </FontGate>
  );
  return Gated;
};

const Cena1 = gated(Scene1Arrival);
const Cena2 = gated(Scene2Rules);
const Cena3 = gated(Scene3Count);
const Cena4 = gated(Scene4Origin);
const Cena5 = gated(Scene5Money);
const Cena6 = gated(Scene6People);
const Cena7 = gated(Scene7Closing);

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Fechamento" component={Fechamento} durationInFrames={TOTAL_FRAMES} fps={FPS} width={W} height={H} />
    <Folder name="Cenas">
      <Composition id="Cena1-OMesChega" component={Cena1} durationInFrames={D.s1} fps={FPS} width={W} height={H} />
      <Composition id="Cena2-AsRegras" component={Cena2} durationInFrames={D.s2} fps={FPS} width={W} height={H} />
      <Composition id="Cena3-AConta" component={Cena3} durationInFrames={D.s3} fps={FPS} width={W} height={H} />
      <Composition id="Cena4-AteAOrigem" component={Cena4} durationInFrames={D.s4} fps={FPS} width={W} height={H} />
      <Composition id="Cena5-ODinheiro" component={Cena5} durationInFrames={D.s5} fps={FPS} width={W} height={H} />
      <Composition id="Cena6-AsPessoas" component={Cena6} durationInFrames={D.s6} fps={FPS} width={W} height={H} />
      <Composition id="Cena7-Fecho" component={Cena7} durationInFrames={D.s7} fps={FPS} width={W} height={H} />
    </Folder>
  </>
);
