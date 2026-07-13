# Project Context

Canonical context document for the EPM Journal project. Any Arc agent starting work on this project should read this first.

---

## EPM Methodology Summary

EPM (Effective Practice Method) is a structured framework for deliberate musical practice. It operates on three levels.

### Level 1 — Core Principles
- **Deliberate Practice** — Practice is goal-directed, with full concentration and immediate feedback loops.
- **Measurable Progress** — Every session produces observable data (recordings, scores, goal completion).
- **Reflective Loop** — Practitioners review recordings and data to inform the next session's goals.

### Level 2 — The Big Three
1. **Session State Machine** — Every practice session follows a defined lifecycle: *Setup → Warmup → Focus Block(s) → Cooldown → Review*. Transitions are rule-governed (e.g., cannot skip warmup, must complete review before closing).
2. **SMART Goals** — Session goals follow the SMART format (Specific, Measurable, Achievable, Relevant, Time-bound). Validation logic is pure and lives in `domain/`.
3. **Skill Wheel** — A polar bar / rose chart that scores the musician across multiple skill dimensions (e.g., Tone, Timing, Technique, Repertoire, Improvisation, Ear Training). Scores are derived from session data and periodic self-assessments.

### Level 3 — Execution
- **Gap Click** — A metronome mode where clicks are silenced for configurable beat windows, forcing the musician to internalize pulse. The mute/resume schedule is computed by a pure domain function; audio playback is handled by the native metronome engine.
- **Recording Policy** — Domain rules governing when recording is required vs. optional during a session. Ensures the reflective loop has artifacts to review.
- **Cycle Review** — At the end of a practice cycle (e.g., weekly), the practitioner reviews skill wheel deltas, goal completion rates, and recordings to set the next cycle's focus areas.

---

## Tech Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | **Expo** (managed workflow) | Fast iteration, OTA updates, good ecosystem for React Native |
| UI | **React Native** | Cross-platform (iOS + Android) from a single codebase |
| Language | **TypeScript** | Type safety across the entire stack, especially important for domain logic correctness |
| Routing | **Expo Router** (file-based) | Convention over configuration; thin route files re-export feature components |
| State | **Zustand** | Lightweight, colocated with feature folders, no boilerplate |
| Audio (native) | **AVAudioEngine** (iOS) / **Oboe/AAudio** (Android) | Sub-millisecond timing precision required for metronome; JS-based audio solutions cannot achieve this |
| Testing (domain) | **Jest** (plain, no mocks) | Pure functions are testable with zero setup |

---

## Architecture Decision

The codebase follows a **feature-folder + pure domain/** architecture:

```
src/app/                ← Expo Router (thin route files)
      ↓ composes
features/<name>/         ← UI (React components) + Zustand store (colocated)
      ↓ imports
domain/                  ← Pure business-logic functions (zero deps)
      ↓ produces data consumed by
native/                  ← Platform-native modules (iOS: AVAudioEngine, Android: Oboe/AAudio)
```

### Key rules
- **Domain code** has zero dependencies — no React, no React Native. Pure input → output.
- **Feature folders** may import from `domain/` but never from other feature folders.
- **Components** never import `domain/` or native modules directly — they go through the Zustand store.
- **Route files** are thin one-line re-exports — e.g., `export { default } from "@/features/practice/PracticeScreen"`.

See [Architecture](./architecture.md) and [Decisions](./decisions.md) for full rationale.

---

## V1 Feature Priority

| Priority | Feature | Tab | Status |
|----------|---------|-----|--------|
| P0 | Session runner (metronome, timer, state machine) | Practice | Placeholder |
| P0 | Gap Click exercise mode | Practice | Domain function complete; native integration pending |
| P1 | Practice journal (session log, recordings) | Journal | Placeholder |
| P1 | Recording policy engine | (domain) | Domain function in place |
| P2 | Skill Wheel visualization | Progress | Placeholder |
| P2 | SMART goal setting and tracking | Progress | Domain validation in place |
| P2 | Cycle review | Progress | Placeholder |
| P3 | Skill Wheel onboarding flow | Progress | UX design in progress |

---

## Skill Wheel Onboarding Flow

The Skill Wheel onboarding introduces new users to the skill assessment framework and captures their initial self-assessment baseline.

### Flow outline

1. **Introduction screen** — Explains what the Skill Wheel is and why it matters. Shows an example wheel with six dimensions (Tone, Timing, Technique, Repertoire, Improvisation, Ear Training).
2. **Dimension-by-dimension assessment** — The user rates themselves (1–10) on each dimension, one at a time. Each screen includes a description of the dimension and concrete examples of what each score level means (e.g., "1 = Cannot keep steady time with a metronome, 10 = Can play complex polyrhythms accurately at any tempo").
3. **Confirmation and wheel preview** — Shows the resulting radar chart. User can go back and adjust any dimension.
4. **Goal suggestion** — Based on the lowest-scoring dimensions, suggests 1–2 focus areas for the first practice cycle. User can accept or override.
5. **Completion** — Saves the baseline assessment and sets the first cycle's focus. Transitions the user to the Practice tab to start their first session.

### UX principles
- One dimension per screen (no overwhelming forms).
- Concrete, musician-friendly descriptions (not abstract numbers).
- The wheel is visual — users understand their profile at a glance.
- Onboarding is skippable but gently encouraged (the baseline powers cycle review deltas).

---

*This page is the canonical starting point for the EPM Journal project. See the sidebar pages for deeper dives into architecture, decisions, glossary, and specific learnings.*
