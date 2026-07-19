import { create } from 'zustand';

import { canAdvance } from '@/domain/onboarding/guards';
import { STAGES, type Stage } from '@/domain/onboarding/stages';
import type {
  Baseline,
  Characteristic,
  OnboardingState as OnboardingDraft,
  ThreeLists,
} from '@/domain/onboarding/types';
import { baselineRepository } from '@/features/onboarding/data/baselineRepository';
import { newId } from '@/shared/lib/id';

const LAST_THREE_LIST_SUB_STEP = 2;

function emptyThreeLists(): ThreeLists {
  return { who: [], why: {}, improvements: [] };
}

export interface OnboardingState extends OnboardingDraft {
  stage: Stage;
  subStep: number;
  focusAreas: string[];
  error: string | null;
  next(): void;
  back(): void;
  goToCharacteristicRating(id: string): void;
  addCharacteristic(name: string): void;
  renameCharacteristic(id: string, name: string): void;
  removeCharacteristic(id: string): void;
  rateCharacteristic(id: string, score: number): void;
  setFocusAreas(ids: string[]): void;
  complete(): Promise<void>;
  reset(): void;
}

function isIntraStageStep(state: OnboardingState): boolean {
  if (state.stage === 'threeLists') {
    return state.subStep < LAST_THREE_LIST_SUB_STEP;
  }

  if (state.stage === 'rating') {
    return state.subStep < state.characteristics.length - 1;
  }

  return false;
}

function isCurrentCharacteristicRated(state: OnboardingState): boolean {
  return state.stage !== 'rating' || state.characteristics[state.subStep]?.score != null;
}

const initialState = (): Pick<
  OnboardingState,
  'stage' | 'subStep' | 'threeLists' | 'characteristics' | 'focusAreas' | 'error'
> => ({
  stage: 'intro',
  subStep: 0,
  threeLists: emptyThreeLists(),
  characteristics: [],
  focusAreas: [],
  error: null,
});

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
  ...initialState(),

  next: () => {
    const state = get();
    if (!canAdvance(state.stage, state)) return;

    if (isIntraStageStep(state)) {
      if (!isCurrentCharacteristicRated(state)) return;
      set({ subStep: state.subStep + 1, error: null });
      return;
    }

    const nextStage = STAGES[STAGES.indexOf(state.stage) + 1];
    if (nextStage !== undefined) set({ stage: nextStage, subStep: 0, error: null });
  },

  back: () => {
    const state = get();
    if (state.stage === 'intro') return;

    if (
      state.subStep > 0 &&
      (state.stage === 'threeLists' || state.stage === 'rating')
    ) {
      set({ subStep: state.subStep - 1 });
      return;
    }

    const previousStage = STAGES[STAGES.indexOf(state.stage) - 1];
    if (previousStage !== undefined) set({ stage: previousStage, subStep: 0 });
  },

  goToCharacteristicRating: (id) => {
    const index = get().characteristics.findIndex(
      (characteristic) => characteristic.id === id,
    );
    if (index !== -1) set({ stage: 'rating', subStep: index, error: null });
  },

  addCharacteristic: (name) => {
    const trimmedName = name.trim();
    if (!trimmedName) return;

    set((state) => ({
      characteristics: [
        ...state.characteristics,
        {
          id: newId(),
          name: trimmedName,
          order: state.characteristics.length + 1,
          score: undefined,
        },
      ],
    }));
  },

  renameCharacteristic: (id, name) => {
    const trimmedName = name.trim();
    if (!trimmedName) return;
    set((state) => ({
      characteristics: state.characteristics.map((characteristic) =>
        characteristic.id === id ? { ...characteristic, name: trimmedName } : characteristic,
      ),
    }));
  },

  removeCharacteristic: (id) => {
    set((state) => ({
      characteristics: state.characteristics
        .filter((characteristic) => characteristic.id !== id)
        .map((characteristic, index) => ({ ...characteristic, order: index + 1 })),
      focusAreas: state.focusAreas.filter((focusArea) => focusArea !== id),
    }));
  },

  rateCharacteristic: (id, score) => {
    set((state) => ({
      characteristics: state.characteristics.map((characteristic) =>
        characteristic.id === id ? { ...characteristic, score } : characteristic,
      ),
    }));
  },

  setFocusAreas: (ids) => set({ focusAreas: ids.slice(0, 2) }),

  complete: async () => {
    const { characteristics, focusAreas } = get();
    const baseline: Baseline = {
      version: 1,
      characteristics: characteristics.map((characteristic) => ({ ...characteristic })),
      focusAreas: [...focusAreas],
      createdAt: new Date().toISOString(),
      userId: 'local',
    };

    try {
      await baselineRepository.completeOnboarding(baseline);
      set({ stage: 'complete', subStep: 0, error: null });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : String(error) });
      throw error;
    }
  },

  reset: () => set(initialState()),
}));
