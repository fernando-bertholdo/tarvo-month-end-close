// Manrope (SIL OFL 1.1) embedded from public/fonts, no network at render time.
// The two subsets carry the Google Fonts unicode ranges, so a glyph outside them falls
// back visibly instead of silently. Missing in this subset: U+2192 (arrow), U+2264 and
// U+2248 (approximately equal); the film draws "≈" as a vector (components/Approx.tsx).
//
// <FontGate> holds the render (delayRender) until both faces are loaded and only then
// mounts its children, so text measured during render (measure.ts) uses the real font.

import React, {useEffect, useState} from 'react';
import {cancelRender, continueRender, delayRender, staticFile} from 'remotion';
import {style} from './style';

const LATIN =
  'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD';
const LATIN_EXT =
  'U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF';

const FACES = [
  {file: 'fonts/manrope-latin-ext.woff2', range: LATIN_EXT},
  {file: 'fonts/manrope-latin.woff2', range: LATIN},
];

let loaded = false;
let loading: Promise<void> | null = null;

const loadFonts = (): Promise<void> => {
  if (loaded) return Promise.resolve();
  if (loading) return loading;
  loading = Promise.all(
    FACES.map((f) =>
      new FontFace(style.font.family, `url(${staticFile(f.file)}) format('woff2')`, {
        weight: '200 800',
        style: 'normal',
        unicodeRange: f.range,
        display: 'block',
      }).load(),
    ),
  ).then((faces) => {
    faces.forEach((face) => document.fonts.add(face));
    loaded = true;
    // Shows up in `remotion render --log=verbose`; the technical report quotes it.
    console.log(`[fonts] Manrope loaded: ${faces.map((f) => f.status).join(', ')}; check 600 36px = ${document.fonts.check(`600 36px ${style.font.family}`)}`);
  });
  return loading;
};

export const FontGate: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [handle] = useState(() => delayRender('Loading Manrope'));
  const [ready, setReady] = useState(loaded);

  useEffect(() => {
    loadFonts()
      .then(() => setReady(true))
      .catch((err) => cancelRender(err));
  }, []);

  useEffect(() => {
    if (ready) continueRender(handle);
  }, [ready, handle]);

  return ready ? <>{children}</> : null;
};
