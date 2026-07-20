import { colors } from '../../lib/theme';

/** The six colours used by the skill wheel, in their stable display order. */
export const WHEEL_PALETTE = [
  colors.wheel.tone,
  colors.wheel.timing,
  colors.wheel.technique,
  colors.wheel.repertoire,
  colors.wheel.improvisation,
  colors.wheel.earTraining,
] as const;

/** Returns the deterministic wheel colour for an array index. */
export function colourForIndex(index: number): string {
  const paletteIndex = ((index % WHEEL_PALETTE.length) + WHEEL_PALETTE.length) % WHEEL_PALETTE.length;

  return WHEEL_PALETTE[paletteIndex];
}
