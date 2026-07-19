import type { OnboardingState, ThreeLists } from './types';
import type { Stage } from './stages';

export function threeListsComplete(lists: ThreeLists): boolean {
  return (
    lists.who.length >= 5 &&
    lists.who.length <= 10 &&
    lists.who.every((who) => (lists.why[who]?.length ?? 0) >= 1) &&
    lists.improvements.length >= 3
  );
}

export function canAdvance(stage: Stage, state: OnboardingState): boolean {
  switch (stage) {
    case 'threeLists':
      return threeListsComplete(state.threeLists);
    case 'characteristics':
      return state.characteristics.length >= 3;
    case 'rating':
      return state.characteristics.every(
        (characteristic) => characteristic.score != null,
      );
    case 'intro':
    case 'confirm':
    case 'focus':
    case 'complete':
      return true;
  }
}
