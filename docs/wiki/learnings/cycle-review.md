# Cycle Review

Cycle Review is a P2 feature that enables the practitioner to periodically (e.g., weekly) review progress across all dimensions — skill wheel deltas, goal completion rates, and recordings — and set focus areas for the next cycle.

## EPM Methodology Context

Cycle Review is part of **EPM Level 3 — Execution**. It closes the **Reflective Loop** (Level 1): the practitioner reviews what happened over a practice cycle, identifies patterns, and uses those insights to set the next cycle's direction.

The full reflective loop:
1. **Practice** (Session Runner) — execute sessions with goals and recordings.
2. **Record** (Recording Policy) — capture artifacts.
3. **Review** (Cycle Review) — look back at the cycle's data.
4. **Plan** — set focus areas and goals for the next cycle.

Cycle Review is step 3. Without it, the loop is open and practice becomes undirected over time.

## What a cycle review includes

- **Skill wheel deltas** — how each dimension score changed since the last review. Are weak areas improving? Are strong areas plateauing?
- **Goal completion rates** — what percentage of SMART goals were completed? Which dimensions had the highest/lowest completion?
- **Recording highlights** — key recordings that demonstrate progress or persistent issues.
- **Focus area selection** — based on the data, which 1–2 dimensions should the next cycle emphasize?

## Architecture Placement

| Aspect | Location |
|--------|----------|
| Tab | **Progress** (bottom tab navigator) |
| Route file | `src/app/(tabs)/progress` — thin re-export (shared with skill wheel, SMART goals) |
| Feature folder | `features/progress/` — React components + Zustand store |
| Domain logic | No dedicated cycle review domain module yet; aggregates data from skill wheel calculations and goal completion |
| Native integration | None |

### Store bridging

The Progress feature's Zustand store:
1. Aggregates data from the current cycle: session history (from journal data), skill wheel scores, goal completion stats.
2. Computes deltas — comparing current scores against the previous cycle's baseline.
3. Exposes reactive state (cycle data, deltas, selected focus areas) to UI components.
4. Persists cycle boundaries and focus area selections.

### Data dependencies

Cycle review is the most cross-cutting feature. It consumes data from:
- **Skill Wheel** — dimension scores and historical trends (same feature folder — Progress).
- **SMART Goals** — completion rates per dimension (same feature folder — Progress).
- **Practice Journal** — session logs, recording metadata (different feature folder — Journal).

Since feature folders cannot import from each other, this cross-folder data access must go through a shared persistence layer or be mediated by the routing/navigation layer (e.g., passing data via route params or a shared domain-typed data layer).

## Current Status

**Placeholder.** The Progress tab scaffolding exists. No cycle review UI, store logic, or cross-feature data aggregation is implemented yet.

## Key Constraints

- Cycle review logic that transforms raw data into deltas and insights should live in `domain/` as pure functions — testable, no React dependencies.
- The Progress feature folder may not import from the Journal feature folder. Cross-feature data access must be solved architecturally (shared persistence, domain-typed data contracts, or navigation-layer mediation).
- Cycle boundaries (when a cycle starts/ends) are a domain concept — they should be modeled in `domain/`, not in UI state.

## Related Pages

- [Architecture](../architecture.md) — feature folder constraints, domain layer
- [Glossary](../glossary.md) — Cycle Review, Progress tab, EPM
- [Skill Wheel Visualization](./skill-wheel-visualization.md) — provides dimension scores for delta computation
- [SMART Goal Tracking](./smart-goal-tracking.md) — provides goal completion rates
- [Practice Journal](./practice-journal.md) — provides session logs and recording metadata
- [Project Context](../project-context.md) — EPM Level 3, V1 Feature Priority
