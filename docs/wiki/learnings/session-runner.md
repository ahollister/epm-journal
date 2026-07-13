# Session Runner

The session runner is the core P0 feature of EPM Journal. It hosts the active practice session and is the primary interface during practice.

## EPM Methodology Context

The session runner implements the **Session State Machine** from EPM Level 2 — "The Big Three." Every practice session follows a defined lifecycle:

```
Setup → Warmup → Focus Block(s) → Cooldown → Review
```

Transitions are rule-governed:
- Cannot skip warmup.
- Must complete review before closing.
- Focus blocks may repeat; warmup and cooldown are singular.

This lifecycle enforces **Deliberate Practice** (Level 1): practice is goal-directed, with full concentration and immediate feedback loops. The runner keeps the practitioner inside the structure.

## Architecture Placement

| Aspect | Location |
|--------|----------|
| Tab | **Practice** (bottom tab navigator) |
| Route file | `src/app/(tabs)/practice` — thin re-export |
| Feature folder | `features/practice/` — React components + Zustand store |
| Domain logic | `domain/` — session state machine (pure functions) |
| Native integration | `native/` — metronome engine (AVAudioEngine / Oboe/AAudio) |

### Store bridging (Zustand)
The Practice feature folder has a colocated Zustand store. The store:
1. Imports the **session state machine** pure functions from `domain/`.
2. Exposes reactive state (current phase, elapsed time, metronome config) and actions (transition phase, start/stop) to React components.
3. Calls into the **native metronome engine** when the metronome needs to start/stop or change tempo.

Components never import `domain/` or native modules directly — they go through the store.

### Metronome integration
The session runner uses the platform-native metronome engine for click playback during practice. The native module (AVAudioEngine on iOS, Oboe/AAudio on Android) handles sub-millisecond precision audio. On Android, a foreground service keeps audio alive when backgrounded.

The metronome engine concerns itself only with playing sounds at precise times; **scheduling policy** (which beats, what tempo, gap patterns) comes from `domain/` via the store.

## Sub-features composed by the session runner

- **Metronome** — basic click at configurable tempo, integrated with the state machine phases.
- **Timer** — session duration tracking per phase and overall.
- **Gap Click** — exercise mode (P0) where beats are silenced for configurable windows; see [Gap Click Exercise](./gap-click-exercise.md).
- **Recording** — governed by the [Recording Policy Engine](./recording-policy-engine.md), which determines when recording is required vs. optional during a session.

## Current Status

**Placeholder.** The route, tab, and feature folder scaffolding exist. The domain-level session state machine is implemented. Native metronome engine is in progress. Full integration of state machine → store → components → native module is pending.

## Key Constraints

- The session state machine in `domain/` must remain zero-dependency — no React, no React Native.
- The Practice feature folder may not import from other feature folders (e.g., Journal, Progress).
- All metronome scheduling policy must flow through `domain/` pure functions; the native module is a "dumb" transport.

## Related Pages

- [Architecture](../architecture.md) — layers, routing shell, native modules
- [Decisions](../decisions.md) — metronome native module decision, Gap Click scheduling decision
- [Glossary](../glossary.md) — EPM, Zustand store, Practice tab, Metronome engine, Foreground service
- [Gap Click Exercise](./gap-click-exercise.md)
- [Recording Policy Engine](./recording-policy-engine.md)
