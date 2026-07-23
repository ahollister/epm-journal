# Architecture

High-level shape of the system. The big pieces, how they fit together, and the constraints that shaped them.

## Layers

```
app/                    ← Expo Router (thin route files, compose features)
      ↓ composes
feature-folder/          ← UI (React components) + Zustand store (colocated)
      ↓ imports
domain/                  ← Pure business-logic functions (zero deps)
      ↓ produces data consumed by
native/                  ← Platform-native modules (iOS: AVAudioEngine, Android: Oboe/AAudio)
```

> **⚠️ Implementation status (2026-05-13):** The `domain/`, `features/`, and `shared/` directories currently contain only `.gitkeep` placeholders — no domain functions, stores, or components are implemented yet. The architecture described here is the target design, not the current state. See the [2026-05-13 drift decision](../decisions.md).

## Constraints
- Domain code must remain zero-dependency (no React, no React Native, no AsyncStorage, etc.)
- Feature folders may not import from each other
- Shared UI primitives live outside feature folders (e.g. `components/`)

The architecture described above is the **target design**. The actual codebase is in active implementation with substantial progress since the initial scaffold:

- `src/domain/`, `src/features/`, and `src/shared/` are partially populated — domain functions, shared components, and feature code are implemented (see table below).
- The three tab screens (`app/(tabs)/index`, `journal`, `progress`) are static placeholder components.
- **Zustand** is installed and used for the onboarding store.
- **AsyncStorage** is the V1 persistence choice (no SQLite, no zustand/persist middleware). See the [2026-05-14 persistence decision](../decisions.md).
- **Jest + jest-expo** test harness is configured with multiple test suites passing.
- Routing lives at `app/` (repo root), not `src/app/` as previously documented.
- `app.json` sets `userInterfaceStyle: "dark"` — the onboarding route forces dark theme and the app-wide default is now dark to prevent a white flash on mount.
- Design tokens exist as CSS variables in an HTML mockup (`docs/designs/design-system.html`) with **double-prefixed names** (e.g. `--color-color-accent-primary`). A hand-authored TypeScript theme module at `src/shared/lib/theme.ts` exports single-prefix names and reconciles the mismatch. See [Design Tokens & Theme Module](../learnings/design-tokens-theme-module.md).
- `AGENTS.md` references Expo v57 docs but `package.json` pins `expo ~53.0.0`.

| Artifact | Location | Status |
|----------|----------|--------|
| SkillWheelChart (rose chart) | `src/shared/components/skill-wheel/SkillWheelChart.tsx` | Implemented — polar bar / rose chart, `Pressable` feedback, no Reanimated; wrapped in `React.memo`; geometry recomputed via `useMemo` |
| Chart geometry (coxcomb path math) | `src/shared/components/skill-wheel/geometry.ts` | Implemented — pure, framework-free SVG path math (`scoreToRadius`, `wedgePath`, `hitWedgePath`, `labelAnchor`); 16 Jest tests; zero React/RN deps |
| Chart palette (colour assignment) | `src/shared/components/skill-wheel/palette.ts` | Implemented — `colourForIndex(i)` deterministic by array index, cycles mod 6; computed at render time, not stored with characteristic data |
| Theme module | `src/shared/lib/theme.ts` | Implemented — single-prefix TS theme object, reconciles double-prefixed CSS vars |
| Onboarding route | `app/onboarding.tsx` | Implemented — single route, store-driven stage machine (7 stages); registered as full-screen modal in `app/_layout.tsx` with `gestureEnabled: false` (blocks iOS swipe-back); intro screen includes "Skip for now" button that dismisses onboarding and returns to Progress tab empty state |
| Onboarding container | `src/features/onboarding/OnboardingContainer.tsx` | Implemented — reads `stage` from store; switch/map from `Stage` → stage component; renders `<ProgressChrome />` for stages 2–6 only; forces dark theme via `colors.bgBase` root + `<StatusBar style="light" />`; registers `BackHandler` listener (stages 2–7: consume event, call `store.back()` and return `true`; stage 1 intro: return `false` for default dismissal); cleanup on unmount |
| ProgressChrome | `src/features/onboarding/components/ProgressChrome.tsx` | Implemented — thin presentational component; reads store state reactively (`stage`, `subStep`, `characteristics.length`); renders stage-specific contextual progress text for stages 2–6 per Orchestration FR3.1; returns `null` for intro/complete; `textMuted` styling; 8 Jest tests |
| CompletionScreen (Stage 7) | `src/features/onboarding/stages/CompletionScreen.tsx` | Implemented — confirms baseline saved (FR5.1); conditionally lists focus areas if `focusAreas.length > 0` (FR5.2); primary CTA "Start your first session" → `router.replace('/(tabs)')` (FR5.3); secondary CTA "Explore your Progress" → `router.replace('/(tabs)/progress')` (FR5.4); uses `router.replace` so onboarding route is removed from the stack |
| Onboarding store | (colocated with onboarding feature) | Implemented — holds in-memory state through Stage 7, then calls `baselineRepository` to persist; `complete()` assembles `Baseline`, awaits persistence, advances only on success; surfaces retry prompt on failure |
| AsyncStorage wrapper | `src/shared/lib/storage.ts` | Implemented — typed `getJson<T>` / `setJson<T>` / `remove` wrappers; swallows JSON parse errors; keeps AsyncStorage out of feature code and tests |
| baselineRepository | `src/features/onboarding/data/baselineRepository.ts` | Implemented — domain-shaped persistence API with versioned keys (`epm.*.v1`), atomic-ish writes (baseline first, flag second), defensive completion checks, `clear()` for dev/test |
| Domain types | `src/domain/onboarding/types.ts` | Implemented — `Characteristic`, `ThreeLists`, `Baseline`, `OnboardingState`; zero-dependency, consumed by onboarding store, guards, chart, and future Progress/Cycle-Review |
| Stage machine | `src/domain/onboarding/stages.ts` | Implemented — seven stages (`intro` through `complete`), `Stage` type, zero-dependency |
| Navigation guards | `src/domain/onboarding/guards.ts` | Implemented — `canAdvance(stage, state)` single gate called by the store before `next()`; `threeListsComplete(lists)` standalone validator; pure functions with 21 boundary/truth-table tests; gated stages: threeLists, characteristics, rating; self-gating stages: intro, confirm, focus, complete |
| ID generation utility | `src/shared/lib/id.ts` | Implemented — thin wrapper around `nanoid/non-secure`; exports `newId()`; called from onboarding store's `addCharacteristic` action; never from domain (domain stays zero-dep and deterministic) |
| Test harness | `package.json` (jest config + scripts) | Configured — jest-expo preset, `transformIgnorePatterns` for nanoid ESM, `react-test-renderer@19.0.0` |
| V1 dependencies | `package.json` | Installed — zustand, AsyncStorage, nanoid (non-secure) |

| IntroScreen (Stage 1) | `src/features/onboarding/stages/IntroScreen.tsx` | Implemented — renders example `<SkillWheelChart interactive={false} />` with 6 hardcoded dummy characteristics (Tone, Timing, Technique, Repertoire, Improvisation, Ear Training) and scores `[3, 6, 7, 4, 5, 8]`; caption "This is what a skill wheel looks like after assessment."; value-prop copy in musician-friendly language; "Get Started" → `store.next()`, "Skip for now" → `router.back()` (dismisses onboarding, no baseline saved); dark `colors.bgBase` background, no progress chrome per Orchestration FR3.1 |