# Recording Policy Engine

The Recording Policy Engine is a P1 domain-level feature that defines the rules for when recording is required vs. optional during a practice session. It ensures the Reflective Loop always has artifacts to review.

## EPM Methodology Context

Recording Policy is part of **EPM Level 3 — Execution**. It directly supports two EPM Level 1 principles:

- **Measurable Progress** — Recordings are the primary observable data from a session. Without recordings, the practitioner has no artifact to measure against.
- **Reflective Loop** — The practitioner reviews recordings to identify issues and inform the next session's goals. The recording policy guarantees that reviewable artifacts exist.

Without a recording policy, the reflective loop breaks — there's nothing to reflect on.

## Architecture Placement

| Aspect | Location |
|--------|----------|
| Tab | None — domain-only feature, consumed by Practice tab |
| Feature folder | Consumed by `features/practice/` (the session runner enforces the policy) |
| Domain logic | `domain/` — Recording policy (pure functions) |
| Native integration | None directly; recordings are produced by the platform audio system |

### Pure domain function

The recording policy lives entirely in `domain/` as a pure function (or set of functions). Input: session state (current phase, session type, user preferences). Output: a directive — `required`, `optional`, or `not-applicable` for the current moment.

This is testable with plain Jest: given a session phase, assert the recording requirement.

### Store bridging

The Practice feature's Zustand store:
1. Calls the recording policy domain function with the current session phase.
2. Enforces the policy — e.g., preventing phase transition if a required recording hasn't started.
3. Exposes recording state (is recording, policy directive) to UI components.

### Downstream consumer: Practice Journal

The [Practice Journal](./practice-journal.md) displays recordings. The recording policy determines which sessions have recordings; the journal surfaces them for review.

## Current Status

**Domain function in place.** The pure recording policy logic exists in `domain/`. Integration with the session runner store and UI is pending.

## Key Constraints

- The recording policy must remain a pure domain function — no React, no React Native, no file system access. It answers "should we record?" not "how do we record?"
- The policy must be enforceable by the session state machine — e.g., "cannot end warmup without starting recording" if warmup recording is required.
- Recordings are platform artifacts; the policy doesn't manage files, only the decision to record.

## Related Pages

- [Decisions](../decisions.md) — feature-folders + domain/ separation (recording policy was part of the original domain split)
- [Glossary](../glossary.md) — EPM, Recording Policy, Reflective Loop
- [Session Runner](./session-runner.md) — enforces the policy during sessions
- [Practice Journal](./practice-journal.md) — surfaces recordings for review
- [Architecture](../architecture.md) — domain layer, store bridging
- [Project Context](../project-context.md) — EPM Level 3 Execution
