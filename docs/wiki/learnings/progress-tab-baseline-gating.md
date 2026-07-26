# Progress Tab: Empty State & Baseline Gating

The Progress tab (`app/(tabs)/progress.tsx`) is the first non-placeholder tab screen implemented. It conditionally renders based on onboarding state, using `useBaseline` as the single seam for baseline-dependent features.

## `useBaseline` Hook

The hook at `src/features/onboarding/useBaseline.ts` is the canonical way for any component to determine whether a baseline exists:

```ts
function useBaseline(): { baseline: Baseline | null; loading: boolean; isComplete: boolean }
```

### Design

- **`useFocusEffect` (expo-router):** Re-reads storage on mount AND every tab focus. This is the key insight — without it, the Progress tab would only read storage once on mount. After completing onboarding (Stage 7), the user navigates to the Progress tab, but the tab was already mounted behind the modal. `useFocusEffect` ensures the hook re-reads storage when the tab gains focus, finding the newly written baseline immediately.
- **Stale-request protection:** If a storage read is in-flight when a new focus event arrives, the previous result is discarded.
- **Defensive gating:** `isOnboardingComplete()` returns `true` AND `getBaseline()` returns non-null before the hook reports `isComplete: true`. If the flag is set but the baseline is missing/corrupt (crash between the two atomic-ish writes), the hook returns `baseline: null` — the UI degrades to the empty state rather than showing a corrupt half-state.

## Progress Tab Rendering

Three states, checked in order:

| State | Condition | Rendered |
|-------|-----------|----------|
| Loading | `loading === true` | Loading spinner / skeleton |
| Empty (no baseline) | `baseline === null` | "Complete onboarding to see your skill wheel." + "Start Onboarding" button → `router.push('/onboarding')`; dark themed (`backgroundColor: colors.bgBase`) |
| Baseline present | `baseline !== null` | `<SkillWheelChart characteristics={baseline.characteristics} interactive={false} />` |

## Graceful Degradation (FR6.3)

`useBaseline` is the seam for all baseline-dependent features. Any future feature that needs a baseline (e.g., Cycle Review delta computation) follows this pattern:

```ts
const { baseline, loading } = useBaseline();

if (loading) return <LoadingSpinner />;
if (baseline === null) return <EmptyState message="Complete onboarding to track progress." />;

// Safe to use baseline here
const deltas = computeDeltas(baseline, currentScores);
```

The hook centralizes the gating logic — no feature reimplements the "do we have a baseline?" check, and no feature talks to `baselineRepository` directly.

## Why `useFocusEffect` Matters

The Progress tab is a bottom-tab screen. When onboarding launches as a full-screen modal (`app/onboarding.tsx`), the tab bar and its screens remain mounted behind the modal. Without `useFocusEffect`:

1. Progress tab mounts → reads storage → finds no baseline → shows empty state.
2. User launches onboarding from empty state CTA.
3. User completes all 7 stages → baseline written to AsyncStorage.
4. User taps "Explore your Progress" → `router.replace('/(tabs)/progress')`.
5. Progress tab was already mounted → no remount → still shows empty state.

With `useFocusEffect`:

5. Progress tab receives focus → `useFocusEffect` callback fires → re-reads storage → finds the new baseline → immediately shows the wheel.

This makes the transition from onboarding completion to Progress tab feel seamless.

## Architecture Placement

| Artifact | Location |
|----------|----------|
| Progress tab route | `app/(tabs)/progress.tsx` |
| `useBaseline` hook | `src/features/onboarding/useBaseline.ts` |
| Consumed repository | `src/features/onboarding/data/baselineRepository.ts` |
| Chart component | `src/shared/components/skill-wheel/SkillWheelChart.tsx` |

## Related Pages

- [Architecture](../architecture.md) — implementation status table
- [Skill Wheel + Onboarding](../features/skill-wheel-onboarding.md) — full feature spec and flow
- [Persistence Layer](./persistence-layer.md) — two-layer design, atomic-ish writes, defensive reads
- [Glossary](../glossary.md) — `useBaseline`, `baselineRepository`
