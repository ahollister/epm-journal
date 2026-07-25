import type { Characteristic } from './types';

/**
 * Sort characteristics from lowest score to highest, preserving the user's
 * Stage 3 order when scores are tied.
 */
export function rankCharacteristics(
  characteristics: Characteristic[],
): Characteristic[] {
  return [...characteristics].sort((a, b) => {
    const scoreA = a.score == null || Number.isNaN(a.score)
      ? Number.POSITIVE_INFINITY
      : a.score;
    const scoreB = b.score == null || Number.isNaN(b.score)
      ? Number.POSITIVE_INFINITY
      : b.score;
    const scoreDifference = scoreA - scoreB;

    return scoreDifference || a.order - b.order;
  });
}

/**
 * Return the lowest-scoring characteristics, using the user's order as the
 * deterministic tiebreaker.
 */
export function pickWeakestSlices(
  characteristics: Characteristic[],
  count = 3,
): Characteristic[] {
  return rankCharacteristics(characteristics).slice(0, Math.max(0, count));
}
