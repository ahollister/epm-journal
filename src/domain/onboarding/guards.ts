import type { Stage } from './stages';
import type { OnboardingState, ThreeLists } from './types';

function hasWhyQuality(qualities: string[] | undefined): boolean {
  return qualities?.some((quality) => quality.trim().length > 0) ?? false;
}

export function threeListsComplete(lists: ThreeLists): boolean {
  return (
    lists.who.length >= 5 &&
    lists.who.length <= 10 &&
    lists.who.every((who) => hasWhyQuality(lists.why[who])) &&
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
        return s.threeLists.who.every((who) =>
          hasWhyQuality(s.threeLists.why[who]),
        );
      }

      if (subStep === 2) {
        // This is the stage boundary, so validate the full exercise again in
        // case restored or edited state made an earlier sub-step incomplete.
        return threeListsComplete(s.threeLists);
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
