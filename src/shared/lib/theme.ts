// Source: docs/designs/design-system.html:16-63

export const colors = {
  accentPrimary: '#22c55e',
  accentHover: '#16a34a',
  accentOn: '#052e16',
  accentSoft: '#22c55e1a',
  bgBase: '#0a0f0d',
  bgRaised: '#141a17',
  bgOverlay: '#1e2622',
  borderSubtle: '#1f2925',
  borderStrong: '#2d3a35',
  textPrimary: '#f0f4f1',
  textSecondary: '#9ba8a0',
  textMuted: '#5e6b64',
  statusDanger: '#ef4444',
  statusInfo: '#3b82f6',
  statusSuccess: '#22c55e',
  statusWarning: '#f59e0b',
  wheel: {
    tone: '#d9f99d',
    timing: '#86efac',
    technique: '#4ade80',
    repertoire: '#22c55e',
    improvisation: '#16a34a',
    earTraining: '#15803d',
  },
} as const;

export const fontSize = {
  xs: 11,
  sm: 13,
  base: 15,
  md: 17,
  lg: 20,
  xl: 28,
  display: 40,
} as const;

export const space = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
} as const;

export const radius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  full: 9999,
} as const;
