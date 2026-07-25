import type { Characteristic } from './types';
import { detectFlatWheel } from './wheel';

function characteristic(id: string, score?: number): Characteristic {
  return { id, name: id, order: 1, score };
}

describe('detectFlatWheel', () => {
  it.each([
    ['a range of zero', [1, 1, 1], true, 0],
    ['the threshold range', [3, 5, 4], true, 2],
    ['a range above the threshold', [2, 5, 4], false, 3],
  ] as const)('detects %s', (_description, scores, isFlat, range) => {
    const characteristics = scores.map((score, index) =>
      characteristic(String(index), score),
    );

    expect(detectFlatWheel(characteristics)).toEqual({ isFlat, range });
  });

  it('ignores unrated characteristics', () => {
    expect(
      detectFlatWheel([
        characteristic('one', 2),
        characteristic('two'),
        characteristic('three', 5),
      ]),
    ).toEqual({ isFlat: false, range: 3 });
  });
});
