# EPM Journal — Project Context

Mobile-first, offline-first practice journal for musicians. Cross-platform via Expo managed workflow (SDK 57). No backend — everything lives on-device.

## Stack
- **React Native** via **Expo** managed workflow (SDK 57)
- **TypeScript** (strict mode)
- **Expo Router** for file-based navigation

## Architecture
See `../docs/wiki/architecture.md` for the full stance. In brief:

```
src/
├── features/<name>/   ← UI components + Zustand store (colocated)
├── domain/            ← pure functions, zero deps, trivially testable
├── shared/            ← cross-cutting hooks, components, lib
└── app/               ← Expo Router routes (thin — just compose features)
```

Feature folders own their screens. Route files re-export from feature folders. Components never import `domain/` directly — they go through the store.

## Domain glossary
See `../docs/wiki/glossary.md` for the full glossary. Key terms:

- **EPM** — the core domain this project models (session state machines, SMART goals, skill wheel, recording policy)
- **Feature folder** — `features/<name>/` owning UI + Zustand store
- **Gap Click** — metronome exercise with intentional silence gaps
- **Skill wheel** — scoring/aggregation mechanism for skills

## Decisions
See `../docs/wiki/decisions.md` and `../docs/adr/` for architectural decisions.
