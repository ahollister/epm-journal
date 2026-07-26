# Practice Tab: Baseline-Aware Prompt

The Practice tab (`app/(tabs)/index.tsx`) — the default landing screen when the app opens — now implements the same baseline-gating pattern as the Progress tab. Rather than showing a dead-end "Session runner coming soon" placeholder to all users, it conditionally renders based on onboarding state.

## Why This Matters

The Practice tab is the first thing a user sees when they open the app. Before this change, a first-time user saw a static placeholder with no indication that onboarding existed — they had to discover the Progress tab on their own. Now, an un-onboarded user sees a clear onboarding CTA immediately, guiding them to the baseline assessment that powers all progress tracking.

## Three-State Rendering

The Practice tab mirrors the exact three-state pattern from the Progress tab, checked in order:

| State | Condition | Rendered |
|-------|-----------|----------|
| Loading | `loading === true` | Centered `<ActivityIndicator>` |
| No baseline | `baseline === null && !loading` | "Get your baseline" heading, value-prop copy about the 10-minute self-assessment, "Start Onboarding" button → `router.push('/onboarding')` |
| Baseline present | `baseline !== null` | Existing "Session runner coming soon" placeholder (will be replaced by the actual Practice experience in a future arc) |

## Styling

Follows the Progress tab's empty-state styling exactly:

- `colors.bgBase` background
- Heading: `fontSize.xl` / `fontWeight: '600'` (same as Progress tab's title)
- Body copy: `colors.textPrimary` / `colors.textSecondary`
- Button: `<Pressable>` with `accessibilityRole="button"`, `colors.accentPrimary` background, `borderRadius: 9999` (pill shape), `colors.accentOn` label text
- No horizontal rules, no cards — centred text + button, same layout as Progress tab's empty state

## Imports

```ts
import { useRouter } from 'expo-router';
import { useBaseline } from '@/features/onboarding/useBaseline';
import { colors, fontSize, space } from '@/shared/lib/theme';
```

## Validating `useBaseline` as a Cross-Tab Seam

The Practice tab is the second consumer of `useBaseline`, confirming its design as the single seam for baseline-dependent features. Both tabs:

- Import the same hook (`useBaseline`)
- Follow the same three-state pattern (loading → empty → content)
- Use `useFocusEffect` under the hood for tab-focus re-reads (same as Progress tab — see [Progress Tab & Baseline Gating](./progress-tab-baseline-gating.md))
- Gate on `baseline === null` before rendering baseline-dependent content

This validates the FR6.3 graceful degradation pattern: any future feature that needs a baseline imports `useBaseline` and follows the same gating discipline.

## Architecture Placement

| Artifact | Location |
|----------|----------|
| Practice tab route | `app/(tabs)/index.tsx` |
| `useBaseline` hook | `src/features/onboarding/useBaseline.ts` |
| Consumed repository | `src/features/onboarding/data/baselineRepository.ts` |

## Related Pages

- [Progress Tab & Baseline Gating](./progress-tab-baseline-gating.md) — the pattern this tab mirrors
- [Architecture](../architecture.md) — implementation status
- [Persistence Layer](./persistence-layer.md) — two-layer design, defensive reads
- [Skill Wheel + Onboarding](../features/skill-wheel-onboarding.md) — full onboarding flow
- [Glossary](../glossary.md) — `useBaseline`
