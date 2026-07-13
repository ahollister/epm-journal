# Practice Journal

The practice journal is a P1 feature providing a log of past practice sessions, recordings, and notes. It serves the **Reflective Loop** — the practitioner reviews past sessions to inform future ones.

## EPM Methodology Context

The Journal directly supports two EPM Level 1 principles:

- **Measurable Progress** — Every session produces observable data (recordings, scores, goal completion). The journal is where that data is browsed and revisited.
- **Reflective Loop** — Practitioners review recordings and data to inform the next session's goals. The journal is the "look back" surface; the session runner is the "look forward" surface.

It also connects to EPM Level 3 — **Cycle Review** (see [Cycle Review](./cycle-review.md)) uses journal data to compute skill wheel deltas and goal completion rates over a practice cycle.

## Architecture Placement

| Aspect | Location |
|--------|----------|
| Tab | **Journal** (bottom tab navigator) |
| Route file | `src/app/(tabs)/journal` — thin re-export |
| Feature folder | `features/journal/` — React components + Zustand store |
| Domain logic | No dedicated journal domain module yet; interacts with session data and recording artifacts |
| Native integration | None directly; accesses recordings produced by the native metronome/audio engine |

### Store bridging

The Journal feature folder has a colocated Zustand store. The store:
1. Loads past session data (phase durations, goal outcomes, notes).
2. Lists recordings with metadata (date, session phase, duration).
3. Exposes filtering/browsing state to React components.

The Journal feature folder may import from `domain/` (for types, session state definitions) but never from other feature folders.

### Relationship to Recording Policy

The journal displays recordings whose existence is governed by the [Recording Policy Engine](./recording-policy-engine.md). The recording policy determines when a recording is required vs. optional; the journal is where those recordings live for review.

## Current Status

**Placeholder.** The route, tab, and feature folder scaffolding exist. No journal UI or store is implemented yet. The recording policy domain function is in place but the journal has no integration with it.

## Key Constraints

- The Journal feature folder may not import from other feature folders (e.g., Practice, Progress).
- Session data consumed by the journal should be produced by domain functions — the journal store should not contain its own data transformation logic.
- Recordings are platform artifacts; the journal accesses them via a native module or file system abstraction, not by embedding audio logic.

## Related Pages

- [Architecture](../architecture.md) — routing shell, feature folders
- [Glossary](../glossary.md) — Journal tab, EPM Journal, Reflective Loop
- [Recording Policy Engine](./recording-policy-engine.md) — governs which sessions have recordings
- [Cycle Review](./cycle-review.md) — consumes journal data for periodic review
- [Session Runner](./session-runner.md) — produces the session data the journal displays
- [Project Context](../project-context.md) — EPM methodology, V1 Feature Priority
