import { useOnboardingStore } from '@/features/onboarding/store';
import { CharacteristicDefinition } from './stages/CharacteristicDefinition';
import { CharacteristicReview } from './stages/CharacteristicReview';
import { CompletionScreen } from './stages/CompletionScreen';
import { ConfirmationScreen } from './stages/ConfirmationScreen';
import { FocusSelectionScreen } from './stages/FocusSelectionScreen';
import { RatingScreen } from './stages/RatingScreen';

export { ImprovementsList } from './stages/ImprovementsList';
export { WhoList } from './stages/WhoList';
export { WhyList } from './stages/WhyList';

export function Characteristics() {
  const subStep = useOnboardingStore((state) => state.subStep);
  return subStep === 1 ? <CharacteristicReview /> : <CharacteristicDefinition />;
}

export function Rating() {
  return <RatingScreen />;
}

export function Confirm() {
  return <ConfirmationScreen />;
}

export function Focus() {
  return <FocusSelectionScreen />;
}

export function Complete() {
  return <CompletionScreen />;
}
