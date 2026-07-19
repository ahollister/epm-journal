import { colors } from '@/shared/lib/theme';

/** The six wheel colours, in the order used when assigning colours by index. */
export const PALETTE = [
  colors.wheel.tone,
  colors.wheel.timing,
  colors.wheel.technique,
  colors.wheel.repertoire,
  colors.wheel.improvisation,
  colors.wheel.earTraining,
] as const;

export const WHEEL_PALETTE = PALETTE;

export function colourForIndex(index: number): string {
  const paletteIndex = ((index % PALETTE.length) + PALETTE.length) % PALETTE.length;
  return PALETTE[paletteIndex];
}
