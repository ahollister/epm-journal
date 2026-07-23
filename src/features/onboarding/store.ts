import { create } from 'zustand';

import { canAdvance } from '../../domain/onboarding/guards';
import { STAGES, type Stage } from '../../domain/onboarding/stages';
import type {
  Baseline,
  OnboardingState as DomainOnboardingState,
  ThreeLists,
} from '../../domain/onboarding/types';
import { newId } from '../../shared/lib/id';
import { baselineRepository } from './data/baselineRepository';

const EMPTY_THREE_LISTS: ThreeLists = {
  who: [],
  why: {},
  improvements: [],
};

export interface OnboardingState extends DomainOnboardingState {
  stage: Stage;
  subStep: number;
  focusAreas: string[];
  shouldDismiss: boolean;
  error: unknown;
  next(): void;
  back(): void;
  goToCharacteristicRating(id: string): void;
  addCharacteristic(name: string): void;
  addWhoName(name: string): void;
  renameCharacteristic(id: string, name: string): void;
  removeCharacteristic(id: string): void;
  removeWhoName(index: number): void;
  rateCharacteristic(id: string, score: number): void;
  setWhyQuality(name: string, index: number, value: string): void;
  addWhyQuality(name: string): void;
  setFocusAreas(ids: string[]): void;
  complete(): Promise<void>;
  reset(): void;
}

function emptyThreeLists(): ThreeLists {
  return {
    who: [...EMPTY_THREE_LISTS.who],
    why: { ...EMPTY_THREE_LISTS.why },
    improvements: [...EMPTY_THREE_LISTS.improvements],
  };
}

function initialState(): Pick<
  OnboardingState,
  | 'stage'
  | 'subStep'
  | 'threeLists'
  | 'characteristics'
  | 'focusAreas'
  | 'shouldDismiss'
  | 'error'
> {
  return {
    stage: 'intro',
    subStep: 0,
    threeLists: emptyThreeLists(),
    characteristics: [],
    focusAreas: [],
    shouldDismiss: false,
    error: null,
  };
}

function nextSubStepLimit(stage: Stage, state: OnboardingState): number | null {
  switch (stage) {
    case 'threeLists':
      return 2;
    case 'characteristics':
    case 'rating':
      return Math.max(state.characteristics.length - 1, 0);
    default:
      return null;
  }
}

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
  ...initialState(),

  next: () => {
    const state = get();

    if (!canAdvance(state.stage, state, state.subStep)) {
      return;
    }

    const subStepLimit = nextSubStepLimit(state.stage, state);

    if (subStepLimit !== null && state.subStep < subStepLimit) {
      set({ subStep: state.subStep + 1 });
      return;
    }

    const stageIndex = STAGES.indexOf(state.stage);
    const nextStage = STAGES[stageIndex + 1];

    if (nextStage === undefined) {
      return;
    }

    if (nextStage === 'complete') {
      void state.complete().catch(() => undefined);
      return;
    }

    set({ stage: nextStage, subStep: 0 });
  },

  back: () => {
    const state = get();

    if (state.stage === 'intro') {
      set({ shouldDismiss: true });
      return;
    }

    if (state.subStep > 0) {
      set({ subStep: state.subStep - 1 });
      return;
    }

    const stageIndex = STAGES.indexOf(state.stage);
    const previousStage = STAGES[stageIndex - 1];

    if (previousStage === undefined) {
      return;
    }

    set({ stage: previousStage, subStep: 0 });
  },

  goToCharacteristicRating: (id) => {
    const index = get().characteristics.findIndex(
      (characteristic) => characteristic.id === id,
    );

    if (index === -1) {
      return;
    }

    set({ stage: 'rating', subStep: index });
  },

  addCharacteristic: (name) => {
    const trimmedName = name.trim();

    if (trimmedName.length === 0) {
      return;
    }

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

  addWhoName: (name) => {
    const trimmedName = name.trim();

    if (trimmedName.length === 0) {
      return;
    }

    set((state) => {
      if (state.threeLists.who.length >= 10) {
        return state;
      }

      return {
        threeLists: {
          ...state.threeLists,
          who: [...state.threeLists.who, trimmedName],
        },
      };
    });
  },

  renameCharacteristic: (id, name) => {
    const trimmedName = name.trim();

    if (trimmedName.length === 0) {
      return;
    }

    set((state) => ({
      characteristics: state.characteristics.map((characteristic) =>
        characteristic.id === id
          ? { ...characteristic, name: trimmedName }
          : characteristic,
      ),
    }));
  },

  removeCharacteristic: (id) => {
    set((state) => {
      const characteristics = state.characteristics
        .filter((characteristic) => characteristic.id !== id)
        .map((characteristic, index) => ({
          ...characteristic,
          order: index + 1,
        }));

      const isCursorStage =
        state.stage === 'characteristics' || state.stage === 'rating';

      return {
        characteristics,
        focusAreas: state.focusAreas.filter((focusArea) => focusArea !== id),
        ...(isCursorStage
          ? {
              subStep: Math.min(
                state.subStep,
                Math.max(characteristics.length - 1, 0),
              ),
            }
          : {}),
      };
    });
  },

  removeWhoName: (index) => {
    set((state) => ({
      threeLists: {
        ...state.threeLists,
        who: state.threeLists.who.filter((_, itemIndex) => itemIndex !== index),
      },
    }));
  },

  rateCharacteristic: (id, score) => {
    set((state) => ({
      characteristics: state.characteristics.map((characteristic) =>
        characteristic.id === id ? { ...characteristic, score } : characteristic,
      ),
    }));
  },

  setWhyQuality: (name, index, value) => {
    set((state) => {
      const qualities = [...(state.threeLists.why[name] ?? [])];

      while (qualities.length <= index) {
        qualities.push('');
      }

      qualities[index] = value;

      return {
        threeLists: {
          ...state.threeLists,
          why: {
            ...state.threeLists.why,
            [name]: qualities,
          },
        },
      };
    });
  },

  addWhyQuality: (name) => {
    set((state) => ({
      threeLists: {
        ...state.threeLists,
        why: {
          ...state.threeLists.why,
          [name]: [...(state.threeLists.why[name] ?? ['']), ''],
        },
      },
    }));
  },

  setFocusAreas: (ids) => {
    set({ focusAreas: ids.slice(0, 2) });
  },

  complete: async () => {
    const state = get();

    if (!canAdvance('rating', state)) {
      const error = new Error(
        'Rate every characteristic before saving your baseline.',
      );
      set({ error });
      throw error;
    }

    const baseline: Baseline = {
      version: 1,
      characteristics: state.characteristics.map((characteristic) => ({
        ...characteristic,
      })),
      focusAreas: [...state.focusAreas],
      createdAt: new Date().toISOString(),
      userId: 'local',
    };

    set({ error: null });

    try {
      await baselineRepository.completeOnboarding(baseline);
      set({ stage: 'complete', subStep: 0, error: null });
    } catch (error) {
      set({ error });
      throw error;
    }
  },

  reset: () => {
    set(initialState());
  },
}));
