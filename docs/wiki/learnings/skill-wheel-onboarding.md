# Skill Wheel Onboarding

The Skill Wheel Onboarding is a P3 feature that introduces new users to the skill assessment framework and captures their initial self-assessment baseline. This baseline powers cycle review deltas — without it, there's no "before" to compare against.

## EPM Methodology Context

The onboarding serves two EPM purposes:

1. **Establishes the baseline for Measurable Progress** (Level 1) — the first skill wheel snapshot is the reference point for all future deltas. Every cycle review compares current scores against this (or a subsequent) baseline.
2. **Teaches the Skill Wheel framework** (Level 2) — the user learns how to define their own characteristics via the Three Lists exercise (Who → Why → Improvements) and how to assess themselves honestly. This mental model carries into goal setting and session focus.

## Flow Outline (7 stages)

### 1. Introduction screen
Explains what the Skill Wheel is and why it matters. Shows an example wheel. Sets expectations: "You'll define your own skill dimensions based on who you are as a musician. Be honest — there are no wrong answers, and this is just your starting point."

### 2. Three Lists (1–3 screens)
The user writes their three lists: **Who am I?** (musical identity and abilities), **Why am I practicing?** (motivations and goals), and **What improvements am I targeting?** (specific growth areas). These lists are the raw material for characteristic extraction.

### 3. Characteristic Extraction (1 screen per characteristic)
From the Three Lists, the user distills raw list items into well-formed **characteristics** — observable behavioral statements like "Maintaining steady tempo through fills." Each confirmed characteristic becomes a dimension on the wheel. Users typically extract 4–8 characteristics.

### 4. Self-Rating (1 screen per characteristic)
The user rates themselves (1–10) on each characteristic, one at a time. Each screen includes a fixed 4-band rubric (Beginner 1–3, Intermediate 4–6, Advanced 7–8, Expert 9–10) with the same band descriptions shown for every characteristic. The selected number highlights the matching band. This preserves characteristic-anchored rating (match yourself to a description, not a bare number) while being buildable as ~4 string constants — a per-characteristic name-keyed lookup is unbuildable because characteristic names are free-form text. See the [2026-05-14 decision](../decisions.md).

### 5. Confirmation and wheel preview
Shows the resulting radar chart with all characteristics plotted. The user can tap any characteristic to go back and adjust, or confirm when satisfied.

### 6. Goal suggestion
Based on the lowest-scoring characteristics, the app suggests focus areas for the first practice cycle. The user can accept the suggestion or manually choose different focus characteristics.

### 7. Completion
Saves the baseline assessment, sets the first cycle's focus areas, and transitions the user to the Practice tab.

## UX Principles (quoted from project-context)

> - One dimension per screen (no overwhelming forms).
> - Concrete, musician-friendly descriptions (not abstract numbers).
> - The wheel is visual — users understand their profile at a glance.
> - Onboarding is skippable but gently encouraged (the baseline powers cycle review deltas).

## Architecture Placement

| Aspect | Location |
|--------|----------|
| Tab | **Progress** (bottom tab navigator) |
| Route file | Likely a modal or stack screen within the Progress tab |
| Feature folder | `features/progress/` — React components + Zustand store |
| Domain logic | `domain/` — Skill wheel calculations (reused for baseline scoring) |
| Native integration | None |

### Store bridging

The Progress feature's Zustand store:
1. Holds the in-progress self-assessment ratings during onboarding.
2. Calls the skill wheel calculation domain functions to produce the baseline wheel.
3. Persists the completed baseline and first-cycle focus areas.
4. Exposes onboarding state (current step, ratings, completion status) to UI components.

### Relationship to other features

- **Skill Wheel Visualization** — the same radar chart component used for ongoing progress visualization should render the onboarding preview. This ensures visual consistency between the baseline view and all future wheel views.
- **Cycle Review** — the onboarding baseline is the reference point for the first cycle review's deltas. If onboarding is skipped, the first cycle review has no baseline and must either prompt onboarding or use the first self-assessment as the baseline.

## Current Status

**UX design in progress.** The flow is defined (see above). No onboarding UI or store logic is implemented yet. The skill wheel calculation domain functions (reused by onboarding) are in place.

## Key Constraints

- Onboarding must reuse the existing skill wheel domain functions — no duplicate scoring logic.
- The radar chart component should be shared between onboarding preview and the main Skill Wheel Visualization.
- Onboarding is skippable but the app must handle the "no baseline" case gracefully in cycle review.
- The Progress feature folder may not import from other feature folders.

## Related Pages

- [Skill Wheel Visualization](./skill-wheel-visualization.md) — the main wheel view; shares the radar chart component and domain functions
- [Cycle Review](./cycle-review.md) — consumes the onboarding baseline for deltas
- [SMART Goal Tracking](./smart-goal-tracking.md) — focus areas selected during onboarding become the basis for first-cycle goals
- [Project Context](../project-context.md) — full onboarding flow specification
- [Glossary](../glossary.md) — Skill wheel, Progress tab

**Part of the Skill Wheel + Onboarding epic.** The flow is defined (see above and the [full feature spec](../features/skill-wheel-onboarding.md)). No onboarding UI or store logic is implemented yet. The skill wheel calculation domain functions (reused by onboarding) are in place. The shared radar chart component is pending.

Re-baselining, session-derived scores, and profile editing are explicitly out of scope for this epic — onboarding is a one-time flow only.

**Book grounding:** The onboarding flow is directly grounded in Benny Greb's *Effective Practice Method* book — the 3 Lists exercise (Who/Why/Improvements), characteristic extraction as "peeling the onion," the wheel as a "car tire" metaphor, and the weakest-slice focus strategy. See the [full feature spec](../features/skill-wheel-onboarding.md#book-grounding) for the complete book-to-app mapping.


---

## Chart Model History

The Skill Wheel visualization model has gone through several iterations. The definitive visualization is a **polar bar / rose chart** (2026-05-13): 6 equal 60° wedges, radial distance = score, 4° gaps between wedges, no connecting polygon. Each characteristic reads independently — no implied correlation. 5 concentric reference rings at r=14, 42, 84, 112, 140 (scale bands 1, 3, 6, 8, 10).

Prior models (all superseded):
- Radar/spider chart with connecting polygon (original, restored in error on 2025-07-18 reversal)
- Stacked horizontal bars (2025-07-18, recorded in error)

See [Decisions](../decisions.md) for the full history and the 2026-05-13 authoritative decision.
