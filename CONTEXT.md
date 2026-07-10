# EPM Journal — Project Context

## What this is
A mobile-first, offline-first practice journal for musicians. Built with React Native via Expo (managed workflow, SDK 57), TypeScript (strict mode), Expo Router for file-based navigation.

## Current state
- **Shell scaffolded:** Expo Router with three-tab navigation (Practice, Journal, Progress).
- **Feature folders exist** with placeholder screen components — real features start in subsequent tickets.
- **Domain layer** (`src/domain/`) is stubbed but empty — pure functions for EPM session logic, skill wheel calculations, SMART goal validation, and recording policy will land here.
- **No state management yet:** Zustand stores are planned but not yet created.
- **No data model / SQLite schema** yet — coming when the UX is wireframed.

## Architecture (see `docs/wiki/architecture.md` for full details)
```
src/
├── features/          ← UI screens + Zustand stores, one folder per feature
├── domain/            ← pure functions, zero React/Expo imports, trivially testable
├── shared/            ← cross-cutting hooks, components, lib
└── app/               ← Expo Router file-based routes (thin — just compose features)
```

### Key rules
- Feature folders import from `domain/` but never from each other.
- Components never import `domain/` directly — they go through the Zustand store.
- Domain code has zero dependencies (no React, no React Native).

## Stack
- Expo SDK 57 (managed workflow)
- TypeScript strict mode
- Expo Router (file-based navigation)
- Zustand (planned, not installed yet)
- expo-av, expo-notifications, react-native-svg (installed)

## Recent changes
- 2025-07-16: Moved placeholder screen components from `src/app/(tabs)/` into `src/features/<feature>/` so routes are thin composers, matching the architecture stance.
