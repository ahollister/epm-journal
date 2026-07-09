# Architecture

High-level shape of the system. The big pieces, how they fit together, and the constraints that shaped them.

## Layers

```
feature-folder/          ← UI (React components) + Zustand store (colocated)
      ↓ imports
domain/                  ← Pure business-logic functions (zero deps)
      ↓ produces data consumed by
native/                  ← Platform-native modules (iOS: AVAudioEngine, Android: Oboe/AAudio)
```

### Feature folders (`features/<name>/`)
Each feature folder owns:
- React components (UI)
- A colocated Zustand store (`store.ts`) — state, actions, selectors

Feature folders depend on `domain/` but never on other feature folders.

### Domain layer (`domain/`)
Pure functions. No React. No React Native. No side effects. Input in, output out.

Current domain modules:
- **Session state machine** — EPM session lifecycle transitions
- **SMART goal validation** — validation rules for goal format
- **Skill wheel calculations** — scoring/aggregation logic
- **Recording policy** — rules for when recording is allowed/required
- **Gap Click scheduling** — generates click/mute sequences for gap exercises (pure schedule, separate from audio transport)

All domain code is testable with plain Jest — no mocking framework needed.

### Native modules (`native/`)
Platform-specific native code for performance-critical features that JS cannot handle alone.

Current native modules:
- **Metronome engine** — low-latency audio playback via AVAudioEngine (iOS) and Oboe/AAudio (Android). Android uses a foreground service to keep audio alive when the app is backgrounded. The native module concerns itself only with playing sounds at precise times; scheduling policy comes from `domain/`.

### Zustand stores (bridge)
Stores live in feature folders, import pure functions from `domain/`, and expose them as reactive state + actions to components. Stores may also call into native modules (e.g. passing a click schedule to the metronome engine). Components never import `domain/` or native modules directly — they go through the store.

## Constraints
- Domain code must remain zero-dependency (no React, no React Native, no AsyncStorage, etc.)
- Feature folders may not import from each other
- Shared UI primitives live outside feature folders (e.g. `components/`)
