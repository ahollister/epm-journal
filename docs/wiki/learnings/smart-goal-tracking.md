# SMART Goal Setting and Tracking

SMART Goal setting and tracking is a P2 feature that enables musicians to define structured, measurable goals for practice sessions and track completion over time. It's one of "The Big Three" from EPM Level 2.

## EPM Methodology Context

SMART Goals are part of **EPM Level 2 — The Big Three**. They operationalize **Deliberate Practice** (Level 1): practice is goal-directed, with full concentration and immediate feedback. A SMART goal provides the "goal-directed" part — the practitioner knows exactly what they're working toward in each session.

### SMART format

| Letter | Meaning | In EPM context |
|--------|---------|----------------|
| **S**pecific | What exactly will be accomplished | "Play measures 32–40 at 120 bpm with clean articulation" |
| **M**easurable | How completion is verified | "Recorded take shows zero articulation errors at 120 bpm" |
| **A**chievable | Realistic within the session/cycle | Not "master the entire concerto in one session" |
| **R**elevant | Connected to a skill wheel dimension | "This goal targets Technique (articulation)" |
| **T**ime-bound | Has a deadline or session scope | "Complete by end of this focus block" |

### Validation logic

SMART goal validation is a pure domain function. Input: a goal string or structured goal object. Output: `{ valid: boolean, violations: string[] }` listing which SMART criteria are not met. This is testable with plain Jest — no mocking.

## Architecture Placement

| Aspect | Location |
|--------|----------|
| Tab | **Progress** (bottom tab navigator) |
| Route file | `src/app/(tabs)/progress` — thin re-export (shared with skill wheel, cycle review) |
| Feature folder | `features/progress/` — React components + Zustand store (shared with other Progress features) |
| Domain logic | `domain/` — SMART goal validation (pure function) |
| Native integration | None |

### Store bridging

The Progress feature's Zustand store:
1. Calls the **SMART goal validation** pure function when a user drafts or edits a goal.
2. Persists goals with their completion status.
3. Exposes reactive state (active goals, completed goals, goal history per session/cycle) to UI components.

### Relationship to session runner

Goals are set in the Progress tab but **consumed** during sessions in the Practice tab. The session runner should display the current session's active goals so the practitioner can reference them. This cross-tab data flow goes through shared domain types and persistent storage — not through direct feature-folder imports.

## Current Status

**Domain validation in place.** The SMART goal validation pure function is implemented in `domain/`. The Progress tab UI for goal creation, listing, and tracking is placeholder. Full integration with the session runner is pending.

## Relationship to other features

- **Skill Wheel** — goals are tagged with relevant skill wheel dimensions; completing goals in a dimension contributes to that dimension's score.
- **Cycle Review** — goal completion rates are a key metric in cycle review. "Completed 7/10 goals this cycle, with weakest completion in Ear Training."
- **Session Runner** — active goals should be visible during the session.

## Key Constraints

- SMART goal validation must remain a pure domain function — input (goal text/object) → output (validity + violations).
- The Progress feature folder may not import from other feature folders.
- Goals are persistent data; the store handles serialization but validation logic stays in `domain/`.

## Related Pages

- [Architecture](../architecture.md) — domain layer, store bridging
- [Glossary](../glossary.md) — SMART goal, Progress tab
- [Skill Wheel Visualization](./skill-wheel-visualization.md) — goal completion feeds wheel scores
- [Cycle Review](./cycle-review.md) — goal completion rates are a cycle review metric
- [Session Runner](./session-runner.md) — displays active goals during sessions
- [Project Context](../project-context.md) — EPM Level 2, V1 Feature Priority
