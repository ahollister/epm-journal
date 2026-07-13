# Gap Click Exercise

Gap Click is a metronome exercise mode (P0) that forces the musician to internalize pulse by silencing clicks for configurable beat windows.

## EPM Methodology Context

Gap Click is part of **EPM Level 3 — Execution**. It's a deliberate practice tool: by removing the external pulse for a window of beats, the musician must maintain internal time, then check alignment when clicks resume. This creates a tight feedback loop central to deliberate practice (Level 1).

## How It Works

1. A regular metronome click plays at the configured tempo.
2. For a configurable number of beats (the "gap"), clicks are **silenced** (muted).
3. After the gap, clicks **resume** at the same tempo.
4. The musician must land precisely on the resumed click — any drift reveals timing weakness.

The mute/resume pattern repeats throughout the exercise.

## Architecture Placement

| Aspect | Location |
|--------|----------|
| Tab | **Practice** (composed within the session runner) |
| Feature folder | `features/practice/` — UI controls for gap configuration |
| Domain logic | `domain/` — **Gap Click scheduling** (pure function: given tempo + gap length, produces a click/mute instruction list) |
| Native transport | `native/` — metronome engine, receives the instruction list and executes it with precise timing |

### Separation of scheduling and transport

This is the key architectural insight for Gap Click (recorded as a [formal decision](../decisions.md)):

- **Scheduling policy** (which beat to play, when to mute, when to resume) lives in `domain/` as a pure function. It takes parameters (tempo, gap length in beats, total duration) and returns a list of `{ beat, action: "click" | "silent" }` instructions. This is testable with plain Jest — no audio, no timers.
- **Audio transport** is the native metronome engine's job. It receives the instruction list and executes each action at the precise wall-clock time. It doesn't know about "gaps" — it just plays or silences as instructed.

### Store bridging

The Practice feature's Zustand store:
1. Calls the Gap Click domain function with user-configured parameters (tempo, gap length).
2. Passes the resulting instruction list to the native metronome engine.
3. Exposes reactive state (is gap active, current beat, gap configuration) to UI components.

## Current Status

**Domain function complete; native integration pending.** The pure scheduling function is implemented and testable in `domain/`. The native metronome engine can receive and execute instruction lists. What remains is the full wired path: UI controls → store → domain function → native engine.

## Key Constraints

- The Gap Click scheduling function must remain pure — same inputs always produce the same schedule. No randomness, no side effects, no platform dependencies.
- The native engine must not contain any Gap Click logic — it plays what it's told, when it's told.

## Related Pages

- [Decisions](../decisions.md) — Gap Click scheduling as domain function (2025-07-16)
- [Glossary](../glossary.md) — Gap Click, Metronome engine, AVAudioEngine, Oboe/AAudio
- [Session Runner](./session-runner.md) — the parent feature that composes Gap Click
- [Architecture](../architecture.md) — domain layer, native modules
