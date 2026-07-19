import type { Stage } from './stages';
import type { OnboardingState, ThreeLists } from './types';

type OnboardingProgress = OnboardingState & {
  subStep?: number;
};

export function threeListsComplete(lists: ThreeLists): boolean {
  return (
    lists.who.length >= 5 &&
    lists.who.length <= 10 &&
    lists.who.every((who) => (lists.why[who]?.length ?? 0) >= 1) &&
    lists.improvements.length >= 3
  );
}

export function canAdvance(stage: Stage, state: OnboardingProgress): boolean {
  switch (stage) {
    case 'threeLists':
      return threeListsComplete(state.threeLists);
    case 'characteristics':
      return state.characteristics.length >= 3;
    case 'rating':
      if (state.subStep !== undefined) {
        const currentCharacteristic = state.characteristics[state.subStep];

        return (
          currentCharacteristic?.score != null &&
          (state.subStep < state.characteristics.length - 1 ||
            state.characteristics.every(
              (characteristic) => characteristic.score != null,
            ))
        );
      }

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
