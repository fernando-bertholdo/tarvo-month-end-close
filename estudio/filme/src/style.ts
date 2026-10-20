// Film tokens from estudio/STYLE.md ("Tokens prontos para código", TypeScript block).
// Keys are in English; the Portuguese STYLE.md name sits in the comment so the mapping
// stays checkable. Durations and delays are frames at 30 fps; sizes are px at 1080p.

export const style = {
  fps: 30,
  frame: {
    width: 1920,
    height: 1080,
    marginX: 120, // margemX
    marginY: 96, // margemY
    columns: 12,
    column: 118, // coluna
    gutter: 24, // calha
    baseline: 8, // base
  },
  color: {
    background: '#F9F5FA', // fundo
    surface: '#FFFFFF', // superficie
    surface2: '#F0ECF1', // superficie2
    border: '#DAD5DB', // borda do filme (2 px)
    ink: '#1B121D', // tinta
    text2: '#635665', // texto2
    accent: '#AB1D72', // acento
    accentSoft: '#FFE4F0', // acentoSuave
    onAccent: '#FFFFFF', // sobreAcento
    good: '#206B38', // bom
    goodTint: '#DFE4E3', // bomFundo (12% over fundo)
    goodTintOnSurface: '#E4EDE7', // bom over superficie
    alert: '#805C09', // alerta
    alertTint: '#EAE3DD', // alertaFundo
    alertTintOnSurface: '#F0EBE1',
    critical: '#A83538', // critico
    criticalTint: '#EFDEE3', // criticoFundo
    criticalTintOnSurface: '#F5E7E7',
    floatShadow: '0 2px 4px rgba(27,18,29,.06), 0 16px 40px -12px rgba(27,18,29,.22)', // sombraFlutua
  },
  font: {family: 'Manrope', numbers: 'tabular-nums lining-nums'},
  type: {
    hero: {size: 176, weight: 700, lineHeight: 1.0, tracking: -0.02}, // heroi
    heroPrefix: {size: 88, weight: 600, lineHeight: 1.0, tracking: 0}, // heroiPrefixo
    secondary: {size: 112, weight: 700, lineHeight: 1.0, tracking: -0.02}, // secundario
    title: {size: 72, weight: 600, lineHeight: 1.1, tracking: -0.02, maxLines: 2, maxChars: 28}, // titulo
    highlight: {size: 56, weight: 600, lineHeight: 1.15, tracking: -0.01}, // destaque
    body: {size: 44, weight: 500, lineHeight: 1.3, tracking: 0}, // corpo
    label: {size: 36, weight: 600, lineHeight: 1.3, tracking: 0.01}, // rotulo (absolute minimum)
  },
  space: [0, 8, 16, 24, 32, 48, 64, 96, 128], // espaco
  shape: {border: 2, controlRadius: 12, cardRadius: 16, sealRadius: 999, iconStroke: 3, icon: 40, sealHeight: 64}, // forma
  curve: {
    settle: [0.2, 0.8, 0.2, 1], // pousa
    rise: [0.2, 0.7, 0.2, 1], // sobe
    text: [0.25, 0.46, 0.45, 0.94], // texto
    confirm: [0.2, 1.3, 0.4, 1], // confirma (passes the target)
    bar: [0.4, 0, 0.2, 1], // barra
    exit: [0.4, 0, 1, 1], // sai
    pulse: [0.45, 0, 0.55, 1], // pulso
  },
  dur: {
    micro: 6,
    seal: 12, // selo
    rise: 15, // sobe
    line: 15, // linha
    card: 24, // cartao
    cardOpacity: 21, // cartaoOpacidade
    title: 24, // titulo (plus 4 per line)
    exit: 10, // saida
    continuity: 24, // continuidade
    counter: 30, // contador
    counterInt: 24, // contadorInteiro
    dive: 36, // mergulho
    open: 15, // abertura
    clickDown: 5, // cliqueDesce
    clickBack: 7, // cliqueVolta
    clickRing: 22, // anelClique
    pulse: 48,
    pulseCycles: 2,
  },
  delay: {
    list: 5, // lista
    titleLine: 4, // tituloLinha
    processing: 22, // processamento
    swapOverlap: 3, // trocaSobreposta
    counterAfterLabel: 6, // contadorAposRotulo
    sealAfterCounter: 6, // seloAposContador
    effectAfterClick: 6, // efeitoAposClique
    nextAfterPrevious: 9, // proximoAposAnterior
  },
  dist: {rise: 20, line: 32, card: 64, title: 24, titleBlur: 8, diveScale: 1.25}, // dist
  opacityEndsAt: 0.7, // opacidadeTerminaEm
  pause: {base: 20, perWord: 8, minimum: 45, endOfScene: 15}, // pausa
  cursor: {height: 40, outline: 2, min: 18, max: 36, base: 12, pxPerFrame: 40, waitBeforeClick: 9, fade: 12, maxArc: 0.04},
  gaze: {jump: 6, hold: 6, maxRows: 6, outline: 4, fill: 0.06}, // olhar
  limits: {wordsOnScreen: 40, textLevels: 3, accentPerScene: 1, confirmPerScene: 1, emptyBackgroundMin: 0.55},
} as const;

// pausaDeLeitura from STYLE.md: max(45, 20 + 8 x words).
export const readingPause = (words: number) =>
  Math.max(style.pause.minimum, style.pause.base + style.pause.perWord * words);

// duracaoCursor from STYLE.md (kept for reuse; this film has no analyst cursor).
export const cursorDuration = (distancePx: number) =>
  Math.max(
    style.cursor.min,
    Math.min(style.cursor.max, Math.round(style.cursor.base + distancePx / style.cursor.pxPerFrame)),
  );

// Title entry duration: 24 frames plus 4 per line.
export const titleDuration = (lines: number) => style.dur.title + style.delay.titleLine * lines;

// 12-column grid helpers: left edge of column n and width of a span of n columns.
export const col = (n: number) => style.frame.marginX + n * (style.frame.column + style.frame.gutter);
export const span = (n: number) => n * style.frame.column + (n - 1) * style.frame.gutter;

// Type role to CSS. Tracking is in em, as in STYLE.md.
type TypeRole = {size: number; weight: number; lineHeight: number; tracking: number};
export const typeStyle = (role: TypeRole, extra: React.CSSProperties = {}): React.CSSProperties => ({
  fontFamily: style.font.family,
  fontSize: role.size,
  fontWeight: role.weight,
  lineHeight: role.lineHeight,
  letterSpacing: `${role.tracking}em`,
  ...extra,
});

export const tabular: React.CSSProperties = {fontVariantNumeric: style.font.numbers};
