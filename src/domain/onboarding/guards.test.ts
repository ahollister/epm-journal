import { canAdvance, threeListsComplete } from './guards';
import type { Characteristic, OnboardingState, ThreeLists } from './types';

function makeLists(overrides: Partial<ThreeLists> = {}): ThreeLists {
  const who = ['one', 'two', 'three', 'four', 'five'];

  return {
    who,
    why: Object.fromEntries(who.map((name) => [name, ['reason']])) as Record<
      string,
      string[]
    >,
    improvements: ['one', 'two', 'three'],
    ...overrides,
  };
}

function makeState(overrides: Partial<OnboardingState> = {}): OnboardingState {
  return {
    threeLists: makeLists(),
    characteristics: [],
    ...overrides,
  };
}

function characteristic(score?: number): Characteristic {
  return { id: String(score ?? 'unrated'), name: 'Characteristic', order: 1, score };
}

describe('threeListsComplete', () => {
  it.each([
    ['who at minimum boundary', makeLists()],
    ['who at maximum boundary', makeLists({ who: Array.from({ length: 10 }, (_, i) => `who-${i}`), why: Object.fromEntries(Array.from({ length: 10 }, (_, i) => [`who-${i}`, ['reason']])) })],
    ['three improvements at minimum boundary', makeLists()],
  ])('returns true for %s', (_description, lists) => {
    expect(threeListsComplete(lists)).toBe(true);
  });

  it.each([
    ['too few who entries', makeLists({ who: ['one', 'two', 'three', 'four'] })],
    ['too many who entries', makeLists({ who: Array.from({ length: 11 }, (_, i) => `who-${i}`) })],
    ['a who entry has no why entries', makeLists({ why: { one: [], two: ['reason'], three: ['reason'], four: ['reason'], five: ['reason'] } })],
    ['a who entry is missing from why', makeLists({ why: { one: ['reason'], two: ['reason'], three: ['reason'], four: ['reason'] } })],
    ['fewer than three improvements', makeLists({ improvements: ['one', 'two'] })],
  ])('returns false for %s', (_description, lists) => {
    expect(threeListsComplete(lists)).toBe(false);
  });
});

describe('canAdvance', () => {
  it.each(['intro', 'confirm', 'focus', 'complete'] as const)(
    'allows self-gating stage %s',
    (stage) => {
      expect(canAdvance(stage, makeState())).toBe(true);
    },
  );

  it.each([
    ['valid three lists', makeState(), true],
    ['invalid three lists', makeState({ threeLists: makeLists({ improvements: ['one', 'two'] }) }), false],
  ] as const)('gates threeLists: %s', (_description, state, expected) => {
    expect(canAdvance('threeLists', state)).toBe(expected);
  });

  it.each([
    ['fewer than three characteristics', [], false],
    ['exactly three characteristics', [characteristic(1), characteristic(2), characteristic(3)], true],
    ['more than three characteristics', [characteristic(1), characteristic(2), characteristic(3), characteristic(4)], true],
  ] as const)('gates characteristics: %s', (_description, characteristics, expected) => {
    expect(
      canAdvance('characteristics', makeState({ characteristics: [...characteristics] })),
    ).toBe(expected);
  });

  it.each([
    ['no characteristics', [], true],
    ['all characteristics scored', [characteristic(1), characteristic(10)], true],
    ['one characteristic is undefined', [characteristic(1), characteristic()], false],
    [
      'one characteristic is null',
      [characteristic(1), { ...characteristic(2), score: null } as unknown as Characteristic],
      false,
    ],
  ] as const)('gates rating: %s', (_description, characteristics, expected) => {
    expect(
      canAdvance('rating', makeState({ characteristics: [...characteristics] })),
    ).toBe(expected);
  });
});
