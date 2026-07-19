import type { Baseline } from '@/domain/onboarding/types';
import { getJson, remove, setJson } from '@/shared/lib/storage';

const KEYS = {
  baseline: 'epm.baseline.v1',
  onboardingComplete: 'epm.onboardingComplete.v1',
} as const;

export const baselineRepository = {
  async completeOnboarding(baseline: Baseline): Promise<void> {
    await setJson(KEYS.baseline, baseline);
    await setJson(KEYS.onboardingComplete, true);
  },

  async getBaseline(): Promise<Baseline | null> {
    return getJson<Baseline>(KEYS.baseline);
  },

  async isOnboardingComplete(): Promise<boolean> {
    const onboardingComplete = await getJson<boolean>(
      KEYS.onboardingComplete,
    );

    if (onboardingComplete !== true) {
      return false;
    }

    return (await baselineRepository.getBaseline()) !== null;
  },

  async clear(): Promise<void> {
    await remove(KEYS.baseline);
    await remove(KEYS.onboardingComplete);
  },
};
