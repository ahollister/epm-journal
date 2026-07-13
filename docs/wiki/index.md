# Wiki

This is the project wiki - an agent-curated knowledge base for everything the team and its agents need to remember about this project.

- [Project Context](./project-context.md) — canonical context document; read this first.
- [Glossary](./glossary.md) - project-specific terminology.
- [Decisions](./decisions.md) - significant project decisions, append-only.
- [Architecture](./architecture.md) - high-level shape of the system.
- **Learnings** - per-topic discoveries:
  - [Feature folders + domain/ separation](./learnings/feature-folders-and-domain-separation.md) — why business logic lives in pure functions, how Zustand bridges to UI.
  - **V1 Features** — one page per feature, with full EPM and architectural context:
    - [Session Runner](./learnings/session-runner.md) — P0; the active practice session UI (state machine, metronome, timer).
    - [Gap Click Exercise](./learnings/gap-click-exercise.md) — P0; metronome mode with configurable beat silencing.
    - [Practice Journal](./learnings/practice-journal.md) — P1; session log, recordings, and the Reflective Loop.
    - [Recording Policy Engine](./learnings/recording-policy-engine.md) — P1; domain rules for when recording is required vs. optional.
    - [Skill Wheel Visualization](./learnings/skill-wheel-visualization.md) — P2; radar chart of six skill dimensions.
    - [SMART Goal Tracking](./learnings/smart-goal-tracking.md) — P2; structured goal setting with domain validation.
    - [Cycle Review](./learnings/cycle-review.md) — P2; periodic review of deltas, goals, and focus areas.
    - [Skill Wheel Onboarding](./learnings/skill-wheel-onboarding.md) — P3; initial self-assessment baseline flow.
  - **Feature Deep Dives** — comprehensive single-page specs with all book content:
    - [Skill Wheel + Onboarding](./features/skill-wheel-onboarding.md) — complete feature spec: Who/Why/Improvements, characteristic extraction, self-rating rules, wheel visualization, weakest-slice algorithm, and full onboarding flow.
