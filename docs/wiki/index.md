This is the project wiki - an agent-curated knowledge base for everything the team and its agents need to remember about this project.

## Pages

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
  - **Implementation Discoveries** — concrete findings from build work:
    - [Design Tokens & Theme Module](./learnings/design-tokens-theme-module.md) — double-prefixed CSS vars in the design mockup, and how `src/shared/lib/theme.ts` reconciles them.
    - [Skill Wheel Chart Implementation](./learnings/skill-wheel-chart-implementation.md) — no babel.config.js, no Reanimated, deliberate use of `Pressable` for chart feedback.
    - [Test Harness & Dependency Setup](./learnings/test-harness-setup.md) — jest-expo preset, nanoid/non-secure for Hermes, transformIgnorePatterns for ESM, react-test-renderer@19.0.0 pin.
    - [Persistence Layer](./learnings/persistence-layer.md) — two-layer design (AsyncStorage wrapper + baselineRepository), versioned keys, atomic-ish writes, defensive reads.
    - [Onboarding Store](./learnings/onboarding-store.md) — Zustand store design: subStep cursor, wedge-tap navigation, complete() as single persistence point, no persist middleware.
  - **Feature Deep Dives** — comprehensive single-page specs with all book content:
    - [Skill Wheel + Onboarding](./features/skill-wheel-onboarding.md) — complete feature spec: Who/Why/Improvements, characteristic extraction, self-rating rules, wheel visualization, weakest-slice algorithm, and full onboarding flow.
