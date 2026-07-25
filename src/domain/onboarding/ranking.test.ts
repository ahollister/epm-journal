import type { Characteristic } from './types';
import { pickWeakestSlices, rankCharacteristics } from './ranking';

function characteristic(
  id: string,
  score: number,
  order: number,
): Characteristic {
  return { id, name: id, order, score };
}

describe('rankCharacteristics', () => {
  it('sorts by score and uses Stage 3 order for ties without mutating input', () => {
    const input = [
      characteristic('high', 8, 1),
      characteristic('tie-late', 4, 3),
      characteristic('low', 2, 2),
      characteristic('tie-early', 4, 1),
    ];

    expect(rankCharacteristics(input).map(({ id }) => id)).toEqual([
      'low',
      'tie-early',
      'tie-late',
      'high',
    ]);
    expect(input.map(({ id }) => id)).toEqual([
      'high',
      'tie-late',
      'low',
      'tie-early',
    ]);
  });
});

describe('pickWeakestSlices', () => {
  it('returns the lowest count with the same score and order rules', () => {
    const characteristics = [
      characteristic('one', 5, 1),
      characteristic('two', 2, 2),
      characteristic('three', 2, 1),
      characteristic('four', 8, 4),
    ];

    expect(pickWeakestSlices(characteristics, 3).map(({ id }) => id)).toEqual([
      'three',
      'two',
      'one',
    ]);
  });
});
