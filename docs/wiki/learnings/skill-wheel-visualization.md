# Skill Wheel Visualization

The Skill Wheel is a P2 visualization feature that displays the musician's scores across multiple skill dimensions as a radar/spider chart. It's one of "The Big Three" from EPM Level 2.

## EPM Methodology Context

The Skill Wheel is part of **EPM Level 2 — The Big Three**. It provides:

- A **visual snapshot** of the musician's abilities across dimensions, making strengths and weaknesses immediately apparent.
- **Measurable Progress** (Level 1) — scores are derived from session data and periodic self-assessments, producing a quantifiable baseline.
- **Reflective Loop** (Level 1) — reviewing the wheel informs which skills to focus on in the next practice cycle.

### User-defined characteristics

Per Benny Greb's *Effective Practice for Musicians*, the skill wheel dimensions are **not** a fixed canonical set. They emerge from the user's own Three Lists exercise (Who → Why → Improvements) during onboarding. Each user defines their own characteristics — observable behavioral statements like "Maintaining steady tempo through fills" or "Voice-leading through ii-V-I progressions."

The number of characteristics is variable (typically 4–8). Common themes may include areas like tone, timing, technique, repertoire, improvisation, and ear training, but the specific characteristics are personal and user-defined.

> **Correction (2025-07-18):** Prior versions of this page listed six canonical dimensions (Tone, Timing, Technique, Repertoire, Improvisation, Ear Training). This was incorrect per the book. See the [Skill Wheel + Onboarding feature spec](../features/skill-wheel-onboarding.md#user-defined-characteristics) for the corrected model.

## Architecture Placement

| Aspect | Location |
|--------|----------|
| Tab | **Progress** (bottom tab navigator) |
| Route file | `src/app/(tabs)/progress` — thin re-export |
| Feature folder | `features/progress/` — React components + Zustand store |
| Domain logic | `domain/` — Skill wheel calculations (scoring/aggregation) |
| Native integration | None (pure UI + domain calculations) |

### Store bridging

The Progress feature folder has a colocated Zustand store. The store:
1. Calls the **skill wheel calculation** pure functions from `domain/` — these aggregate session data into dimension scores.
2. Exposes reactive state (dimension scores, historical deltas, current cycle focus areas) to React components.
3. Handles self-assessment updates (user rates themselves on a dimension; store persists and recalculates).

### Visualization component

The polar bar / rose chart is a React component in `features/progress/`. It renders each user-defined characteristic as an independent 60° wedge with radial distance proportional to the 1–10 score (max radius 140 = score 10). There is no connecting polygon between wedges; 4° gaps separate adjacent wedges. 5 concentric reference rings mark scale bands 1, 3, 6, 8, 10. The component is "dumb" — it receives scores as props and renders them. The store owns the data.

## Current Status

**Placeholder.** The route, tab, and feature folder scaffolding exist. Domain-level skill wheel calculation functions are implemented. The visualization component and full store integration are pending.

## Relationship to other features

- **SMART Goal Tracking** — goal completion rates feed into skill wheel scores (achieving goals in a dimension raises that dimension's score).
- **Cycle Review** — the wheel is the primary visualization for cycle review, showing deltas (score changes) since the last cycle.
- **Skill Wheel Onboarding** — the onboarding flow captures the initial baseline that seeds the wheel; see [Skill Wheel Onboarding](./skill-wheel-onboarding.md).

## Key Constraints

- Skill wheel calculation functions in `domain/` must be pure — input (session data, self-assessments) → output (dimension scores).
- The Progress feature folder may not import from other feature folders (e.g., Journal, Practice).
- The visualization component should be separable — the chart rendering can evolve independently of the scoring logic.

## Related Pages

- [Architecture](../architecture.md) — feature folders, domain layer
- [Glossary](../glossary.md) — Skill wheel, Progress tab
- [SMART Goal Tracking](./smart-goal-tracking.md) — feeds goal completion into wheel scores
- [Cycle Review](./cycle-review.md) — uses the wheel for periodic review
- [Skill Wheel Onboarding](./skill-wheel-onboarding.md) — captures the initial baseline
- [Project Context](../project-context.md) — EPM Level 2, Skill Wheel Onboarding Flow


---

## Chart Model History

The Skill Wheel visualization model has gone through several iterations. The definitive visualization is a **polar bar / rose chart** (2026-05-13): 6 equal 60° wedges, radial distance = score, 4° gaps between wedges, no connecting polygon. Each characteristic reads independently — no implied correlation. 5 concentric reference rings at r=14, 42, 84, 112, 140 (scale bands 1, 3, 6, 8, 10). Center (180, 180), max radius 140 (= score 10).

Prior models (all superseded):
- Radar/spider chart with connecting polygon (original, restored in error on 2025-07-18 reversal)
- Stacked horizontal bars (2025-07-18, recorded in error)

See [Decisions](../decisions.md) for the full history and the 2026-05-13 authoritative decision.
