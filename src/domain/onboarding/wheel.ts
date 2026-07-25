import type { Characteristic } from './types';

export const FLAT_WHEEL_THRESHOLD = 2;

export interface FlatWheelResult {
  isFlat: boolean;
  range: number;
}

export function detectFlatWheel(
  characteristics: Characteristic[],
): FlatWheelResult {
  const scores = characteristics
    .map((characteristic) => characteristic.score)
    .filter((score): score is number => score != null && !Number.isNaN(score));
  const range = scores.length > 0 ? Math.max(...scores) - Math.min(...scores) : 0;

  return {
    isFlat: range <= FLAT_WHEEL_THRESHOLD,
    range,
  };
}
