/**
 * NEXORA Design Tokens (JS) — Cinematic Digital Expedition
 * Mirror of CSS tokens for canvas/JS use
 */
window.NEXORA = window.NEXORA || {};

NEXORA.colors = {
  bg:          '#070A09',
  bgSecondary: '#0C110F',
  surface:     '#0F1511',
  card:        '#111714',

  /* Map accent — use for route, active state, not everywhere */
  cyan:        '#55C7D6',
  cyanDeep:    '#2E8A96',
  cyanGlow:    'rgba(85,199,214,0.10)',

  /* Travel gold */
  gold:        '#CFA85A',
  goldWarm:    '#B8893E',
  goldGlow:    'rgba(207,168,90,0.12)',

  /* Earth/nature */
  sand:        '#D8C7A1',
  earthGreen:  '#6E8B68',
  routeGold:   '#CFA85A',
  forest:      '#304A3A',
  sky:         '#739EB5',

  /* Success / nature green */
  green:       '#7DB87D',
  greenDeep:   '#4E8B4E',
  greenGlow:   'rgba(125,184,125,0.10)',

  textPrimary:   '#F2F0E9',
  textSecondary: '#A9AEA7',
  textMuted:     '#6E756F',

  border:       'rgba(255,255,255,0.07)',
  borderStrong: 'rgba(255,255,255,0.12)',
  borderGold:   'rgba(207,168,90,0.20)',
  borderCyan:   'rgba(85,199,214,0.15)',
};

NEXORA.easing = {
  easeOut:    t => 1 - Math.pow(1-t, 3),
  easeInOut:  t => t < 0.5 ? 2*t*t : 1 - Math.pow(-2*t+2,2)/2,
  easeSpring: t => {
    const c4 = (2*Math.PI)/3;
    if (t === 0) return 0;
    if (t === 1) return 1;
    return Math.pow(2,-10*t)*Math.sin((t*10-0.75)*c4)+1;
  }
};
