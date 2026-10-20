// Prints the frames the render script needs, read from the film's timeline, so the
// evidence never drifts from the code. Bundled and run by render_filme.sh (esbuild).
import {GROUP_WINDOWS, REPRESENTATIVE_FRAMES as R, S4, SCENE_DURATIONS as D, SCENE_START as S, TOTAL_FRAMES} from '../filme/src/animation/timeline';

const names: [keyof typeof R, number, string][] = [
  ['s1', 1, 'o-mes-chega'],
  ['s2', 2, 'as-regras'],
  ['s3', 3, 'a-conta'],
  ['s4a', 4, 'a-diferenca'],
  ['s4r', 4, 'o-recuo'],
  ['s4b', 4, 'a-origem'],
  ['s5', 5, 'o-dinheiro'],
  ['s6', 6, 'as-pessoas'],
  ['s7', 7, 'fecho'],
];
const order = ['s1', 's2', 's3', 's4', 's5', 's6', 's7'] as const;
const cuts = order.slice(1).map((id) => `${S[id] - 1}:${S[id]}`);
console.log(`REPRESENTATIVE="${names.map(([k, scene, n]) => `${scene}:${R[k]}:${n}`).join(' ')}"`);
console.log(`CUT_PAIRS="${cuts.join(' ')}"`);
console.log(`SCENE4_RANGE="${S.s4 - 30}-${S.s4 + D.s4 + 15}"`);
console.log(`TOTAL_FRAMES=${TOTAL_FRAMES}`);
console.log(`GROUP_WINDOWS='${JSON.stringify(GROUP_WINDOWS)}'`);
// Passages changed in corte r3 (frame:name), for close-up stills.
const passages: [number, string][] = [
  ...[0, 3, 4, 6, 8, 10, 16].map((f): [number, string] => [S.s3 + f, 'transicao-2-3']),
  ...[0, 8, 16, 22, 27, 28, 30, 33].map((f): [number, string] => [S.s4 + f, 'transicao-3-4']),
  [S.s4 + S4.heroLabel + 10, 'rotulo-a-mais-legivel'],
  [S.s4 + S4.heroCount, 'r-32-25-comeca-a-contar'],
  [R.s4b, 'origem-legenda'],
];
console.log(`PASSAGES="${passages.map(([f, n]) => `${f}:${n}`).join(' ')}"`);
// Delivery posters: one per scene at its main reading moment, scene 4 three times, plus the last frame.
const posters: [number, string][] = [
  [R.s1, 'cena1-o-mes-chega'],
  [R.s2, 'cena2-as-regras'],
  [R.s3, 'cena3-a-conta'],
  [R.s4a, 'cena4-a-diferenca'],
  [R.s4r, 'cena4-o-recuo'],
  [R.s4b, 'cena4-a-origem'],
  [R.s5, 'cena5-o-dinheiro'],
  [R.s6, 'cena6-as-pessoas'],
  [R.s7, 'cena7-fecho'],
  [TOTAL_FRAMES - 1, 'cena7-quadro-final'],
];
console.log(`POSTERS="${posters.map(([f, n]) => `${f}:${n}`).join(' ')}"`);
