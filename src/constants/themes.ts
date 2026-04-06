export interface GradientColors {
  start: string;
  end: string;
  accent: string;
}

export type GradientTheme =
  | 'ocean'
  | 'sunset'
  | 'aurora'
  | 'rose'
  | 'mint'
  | 'lavender'
  | 'ember'
  | 'slate';

export const GRADIENT_THEMES: Record<GradientTheme, GradientColors> = {
  ocean: { start: '#0077B6', end: '#00B4D8', accent: '#90E0EF' },
  sunset: { start: '#F77F00', end: '#FCBF49', accent: '#FFE066' },
  aurora: { start: '#06D6A0', end: '#118AB2', accent: '#73D2DE' },
  rose: { start: '#E63946', end: '#F4A261', accent: '#FFB4A2' },
  mint: { start: '#2DC653', end: '#73E2A7', accent: '#B7E4C7' },
  lavender: { start: '#7B2FBE', end: '#BC6FF1', accent: '#D9A7FF' },
  ember: { start: '#D62828', end: '#F77F00', accent: '#FCBF49' },
  slate: { start: '#495057', end: '#6C757D', accent: '#ADB5BD' },
};

export const THEME_KEYS = Object.keys(GRADIENT_THEMES) as GradientTheme[];

export const CATEGORY_EMOJIS: Record<string, string> = {
  vacation: '✈️',
  birthday: '🎂',
  exam: '📚',
  holiday: '🎄',
  fitness: '💪',
  custom: '⭐',
};

export const COLORS = {
  background: '#0a0a1a',
  surface: 'rgba(255, 255, 255, 0.08)',
  surfaceLight: 'rgba(255, 255, 255, 0.12)',
  text: '#FFFFFF',
  textSecondary: 'rgba(255, 255, 255, 0.6)',
  textTertiary: 'rgba(255, 255, 255, 0.35)',
  border: 'rgba(255, 255, 255, 0.1)',
  danger: '#FF453A',
};
