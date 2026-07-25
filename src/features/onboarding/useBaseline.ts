import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';

import type { Baseline } from '@/domain/onboarding/types';
import { baselineRepository } from '@/features/onboarding/data/baselineRepository';

export interface UseBaselineResult {
  baseline: Baseline | null;
  loading: boolean;
  isComplete: boolean;
}

/**
 * Reads the persisted onboarding result whenever the route is focused.
 *
 * A baseline is the source of truth for baseline-dependent UI. The completion
 * flag is still exposed for callers that need to distinguish an untouched
 * state from a completed state, but a flag without its baseline is treated as
 * incomplete to safely handle partial persistence.
 */
export function useBaseline(): UseBaselineResult {
  const [baseline, setBaseline] = useState<Baseline | null>(null);
  const [loading, setLoading] = useState(true);
  const [isComplete, setIsComplete] = useState(false);

  const loadBaseline = useCallback(() => {
    let cancelled = false;

    setLoading(true);

    void Promise.all([
      baselineRepository.getBaseline(),
      baselineRepository.isOnboardingComplete(),
    ])
      .then(([nextBaseline, onboardingComplete]) => {
        if (cancelled) {
          return;
        }

        setBaseline(nextBaseline);
        setIsComplete(onboardingComplete && nextBaseline !== null);
      })
      .catch(() => {
        if (cancelled) {
          return;
        }

        // Storage failures degrade to the same safe state as no baseline.
        setBaseline(null);
        setIsComplete(false);
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useFocusEffect(loadBaseline);

  return { baseline, loading, isComplete };
}
