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

## Current Implementation Status (2026-05-13)

The architecture described above is the **target design**. The actual codebase is in an early scaffold state:

- `src/domain/`, `src/features/`, and `src/shared/{components,hooks,lib}` contain only `.gitkeep` files — no domain functions, stores, or components are implemented.
- The three tab screens (`app/(tabs)/index`, `journal`, `progress`) are static placeholder components.
- **Zustand** is not in `package.json` despite being the documented state management bridge.
- No persistence library (AsyncStorage, SQLite, etc.) is installed.
- No test framework (Jest, jest-expo) is installed despite PRDs specifying unit-test acceptance criteria.
- Routing lives at `app/` (repo root), not `src/app/` as previously documented.
- `app.json` sets `userInterfaceStyle: "light"` but the design system (`docs/designs/design-system.html`) is dark-themed.
- Design tokens exist only as CSS variables in an HTML mockup — there is no TypeScript theme module yet.
- `AGENTS.md` references Expo v57 docs but `package.json` pins `expo ~53.0.0`.
- Expo SDK version documented elsewhere may not match the actual pinned version.

See the [2026-05-13 drift discovery decision](../decisions.md).

## Current Implementation Status (2026-05-14)

The architecture described above is the **target design**. The actual codebase is in an early scaffold state with some progress since the initial assessment:

- `src/domain/`, `src/features/`, and `src/shared/{components,hooks,lib}` are partially populated — some domain functions and shared components are implemented (see below), but most feature folders remain `.gitkeep` placeholders.
- The three tab screens (`app/(tabs)/index`, `journal`, `progress`) are static placeholder components.
- **Zustand** is not in `package.json` despite being the documented state management bridge.
- **AsyncStorage** is the V1 persistence choice (no SQLite, no zustand/persist middleware). See the [2026-05-14 persistence decision](../decisions.md).
- No test framework (Jest, jest-expo) is installed despite PRDs specifying unit-test acceptance criteria.
- Routing lives at `app/` (repo root), not `src/app/` as previously documented.
- `app.json` sets `userInterfaceStyle: "light"` but the design system (`docs/designs/design-system.html`) is dark-themed.
- Design tokens exist as CSS variables in an HTML mockup (`docs/designs/design-system.html`) with **double-prefixed names** (e.g. `--color-color-accent-primary`). A hand-authored TypeScript theme module at `src/shared/lib/theme.ts` exports single-prefix names and reconciles the mismatch. See [Design Tokens & Theme Module](../learnings/design-tokens-theme-module.md).
- `AGENTS.md` references Expo v57 docs but `package.json` pins `expo ~53.0.0`.
- Expo SDK version documented elsewhere may not match the actual pinned version.

| Artifact | Location | Status |
|----------|----------|--------|
| SkillWheelChart (rose chart) | `src/shared/components/skill-wheel/SkillWheelChart.tsx` | Implemented — polar bar / rose chart, `Pressable` feedback, no Reanimated |
| Theme module | `src/shared/lib/theme.ts` | Implemented — single-prefix TS theme object, reconciles double-prefixed CSS vars |
| Onboarding route | `app/onboarding.tsx` | Implemented — single route, store-driven stage machine (7 stages) |
| Onboarding store | (colocated with onboarding feature) | Implemented — AsyncStorage persistence, atomic-ish write at Stage 7 |
| Domain types | `src/domain/onboarding/types.ts` | Implemented — `Characteristic`, `ThreeLists`, `Baseline`; zero-dependency, consumed by onboarding, chart, and future Progress/Cycle-Review |
| ID generation utility | `src/shared/lib/id.ts` | Implemented — thin wrapper around `nanoid/non-secure`; exports `newId()`; centralizes the non-secure import so callers never need to know about Hermes compatibility |
| Test harness | `package.json` (jest config + scripts) | Configured — jest-expo preset, `transformIgnorePatterns` for nanoid ESM, `react-test-renderer@19.0.0` |
| V1 dependencies | `package.json` | Installed — zustand, AsyncStorage, nanoid (non-secure) |

| Artifact | Location | Status |
|----------|----------|--------|
| SkillWheelChart (rose chart) | `src/shared/components/skill-wheel/SkillWheelChart.tsx` | Implemented — polar bar / rose chart, `Pressable` feedback, no Reanimated |
| Theme module | `src/shared/lib/theme.ts` | Implemented — single-prefix TS theme object, reconciles double-prefixed CSS vars |
| Onboarding route | `app/onboarding.tsx` | Implemented — single route, store-driven stage machine (7 stages) |
| Onboarding store | (colocated with onboarding feature) | Implemented — holds in-memory state through Stage 7, then calls `baselineRepository` to persist |
| AsyncStorage wrapper | `src/shared/lib/storage.ts` | Implemented — typed `getJson<T>` / `setJson<T>` / `remove` wrappers; swallows JSON parse errors; keeps AsyncStorage out of feature code and tests |
| baselineRepository | `src/features/onboarding/data/baselineRepository.ts` | Implemented — domain-shaped persistence API with versioned keys (`epm.*.v1`), atomic-ish writes (baseline first, flag second), defensive completion checks, `clear()` for dev/test |
| Domain types | `src/domain/onboarding/types.ts` | Implemented — `Characteristic`, `ThreeLists`, `Baseline`; zero-dependency, consumed by onboarding, chart, and future Progress/Cycle-Review |
| ID generation utility | `src/shared/lib/id.ts` | Implemented — thin wrapper around `nanoid/non-secure`; exports `newId()`; called from onboarding store's `addCharacteristic` action; never from domain (domain stays zero-dep and deterministic) |
| Test harness | `package.json` (jest config + scripts) | Configured — jest-expo preset, `transformIgnorePatterns` for nanoid ESM, `react-test-renderer@19.0.0` |
| V1 dependencies | `package.json` | Installed — zustand, AsyncStorage, nanoid (non-secure) |
