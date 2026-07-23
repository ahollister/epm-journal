import type { Stage } from './stages';
import type { OnboardingState, ThreeLists } from './types';

export function threeListsComplete(lists: ThreeLists): boolean {
  return (
    lists.who.length >= 5 &&
    lists.who.length <= 10 &&
    lists.who.every((who) => (lists.why[who]?.length ?? 0) >= 1) &&
    lists.improvements.length >= 3
  );
}

export function canAdvance(
  stage: Stage,
  s: OnboardingState,
  subStep?: number,
): boolean {
  switch (stage) {
    case 'threeLists':
      if (subStep === 0) {
        return s.threeLists.who.length >= 5 && s.threeLists.who.length <= 10;
      }

      if (subStep === 1) {
        return s.threeLists.who.every(
          (who) => (s.threeLists.why[who]?.length ?? 0) >= 1,
        );
      }

      if (subStep === 2) {
        return s.threeLists.improvements.length >= 3;
      }

      return threeListsComplete(s.threeLists);
    case 'characteristics':
      return s.characteristics.length >= 3;
    case 'rating':
      return s.characteristics.every((characteristic) => characteristic.score != null);
    case 'intro':
    case 'confirm':
    case 'focus':
    case 'complete':
      return true;
  }
}
