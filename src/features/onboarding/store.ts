import { create } from 'zustand';

export type OnboardingStage = 'intro' | 'threeLists';

export interface OnboardingStore {
  stage: OnboardingStage;
  next: () => void;
}

export const useOnboardingStore = create<OnboardingStore>((set) => ({
  stage: 'intro',
  next: () => set({ stage: 'threeLists' }),
}));
