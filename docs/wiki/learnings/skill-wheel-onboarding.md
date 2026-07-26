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

### 5. Confirmation and wheel preview — ✅ IMPLEMENTED

Shows the resulting rose chart with all characteristics plotted. Interactive: tapping a wedge navigates back to Stage 4 at that characteristic's rating screen. Flat-wheel detection via `detectFlatWheel` (pure domain function: `max - min`, threshold 2). If flat, a nudge encourages reviewing ratings ("Review ratings" → Stage 4, "Proceed anyway" → Stage 6). If not flat, "Your skill wheel is ready" + "Continue" → Stage 6. Progress chrome "Step 5 of 7". Self-gating — user decides when to proceed.

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

| Aspect             | Location                                                                                                                                                                                                                                             |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tab                | **Progress** (bottom tab navigator)                                                                                                                                                                                                                  |
| Route file         | `app/onboarding.tsx` — single Expo Router route; stage navigation driven by store stage machine, not route transitions                                                                                                                               |
| Feature folder     | `features/progress/` — React components + Zustand store                                                                                                                                                                                              |
| Domain logic       | `src/domain/onboarding/stages.ts` — stage machine (7 stages, `Stage` type); `src/domain/onboarding/guards.ts` — `canAdvance` and `threeListsComplete` pure navigation guards (21 tests); plus skill wheel calculations (reused for baseline scoring) |
| Native integration | None                                                                                                                                                                                                                                                 |

**Domain layer, routing, container, store, persistence, and Stage 7 implemented; stages 1–6 pending.** The stage machine (`stages.ts`), navigation guards (`guards.ts` — `canAdvance` and `threeListsComplete` with 21 boundary/truth-table tests), and shared domain types (`types.ts` — including `OnboardingState`) are implemented as pure zero-dependency domain functions. The onboarding store, route (`app/onboarding.tsx` — full-screen modal above tab bar), container (`OnboardingContainer.tsx` — stage-driven rendering, `<ProgressChrome />` for stages 2–6 only, forced dark theme), persistence layer (`baselineRepository`), and Stage 7 (`CompletionScreen.tsx` — confirms baseline saved, conditionally lists focus areas, `router.replace` CTAs for Practice and Progress) are also in place. Entry point: Progress tab empty state → `router.push('/onboarding')`; no auto-launch on first run. Stage screens for stages 1–6 are pending. The rose chart component (`SkillWheelChart`) is implemented and shared across onboarding confirmation, Progress tab, and cycle review.

## Key Constraints

- Onboarding must reuse the existing skill wheel domain functions — no duplicate scoring logic.
- The radar chart component should be shared between onboarding preview and the main Skill Wheel Visualization.
- Onboarding is skippable but the app must handle the "no baseline" case gracefully in cycle review.
- The Progress feature folder may not import from other feature folders.

- [Skill Wheel Visualization](./skill-wheel-visualization.md) — the main wheel view; shares the radar chart component and domain functions
- [Cycle Review](./cycle-review.md) — consumes the onboarding baseline for deltas
- [SMART Goal Tracking](./smart-goal-tracking.md) — focus areas selected during onboarding become the basis for first-cycle goals
- [Project Context](../project-context.md) — full onboarding flow specification
- [Glossary](../glossary.md) — Skill wheel, Progress tab

**Part of the Skill Wheel + Onboarding epic.** The route (`app/onboarding.tsx`), container (`OnboardingContainer.tsx`), store, persistence layer, and domain functions are implemented. Stage screens (UI components for each of the 7 stages) are pending. The rose chart component (`SkillWheelChart`) is implemented and shared.

Re-baselining, session-derived scores, and profile editing are explicitly out of scope for this epic — onboarding is a one-time flow only.

**Book grounding:** The onboarding flow is directly grounded in Benny Greb's _Effective Practice Method_ book — the 3 Lists exercise (Who/Why/Improvements), characteristic extraction as "peeling the onion," the wheel as a "car tire" metaphor, and the weakest-slice focus strategy. See the [full feature spec](../features/skill-wheel-onboarding.md#book-grounding) for the complete book-to-app mapping.

## Chart Model History

The Skill Wheel visualization model has gone through several iterations. The definitive visualization is a **polar bar / rose chart** (2026-05-13): 6 equal 60° wedges, radial distance = score, 4° gaps between wedges, no connecting polygon. Each characteristic reads independently — no implied correlation. 5 concentric reference rings at r=14, 42, 84, 112, 140 (scale bands 1, 3, 6, 8, 10).

Prior models (all superseded):

- Radar/spider chart with connecting polygon (original, restored in error on 2025-07-18 reversal)
- Stacked horizontal bars (2025-07-18, recorded in error)

See [Decisions](../decisions.md) for the full history and the 2026-05-13 authoritative decision.

**Update (2026-05-15): Stage 1 (IntroScreen) implemented** at `src/features/onboarding/stages/IntroScreen.tsx`. Shows an example rose chart with 6 hardcoded dummy characteristics and scores `[3, 6, 7, 4, 5, 8]`. "Get Started" advances to Stage 2; "Skip for now" dismisses onboarding with no data persisted. Dark background, no progress chrome. Stages 2–6 remain pending.

**Update (2026-05-15): Stage 2 WhoList (sub-step 1 of Three Lists) implemented** at `src/features/onboarding/stages/WhoList.tsx`. Local 3-min timer (component-local — not in store/domain, not persisted), 5–10 name list with add/remove, prompts, and sub-step-aware navigation to WhyList. Remaining Stage 2 sub-steps and Stages 3–6 remain pending.

**Update (2026-05-15): Stage 2 WhyList (sub-step 2 of Three Lists) implemented** at `src/features/onboarding/stages/WhyList.tsx`. Two-column layout with Who names on left, quality inputs on right. Unlimited "Add another" per Who. Completion gate: every Who needs ≥1 non-empty Why; empty rows flagged; "Next" disabled until all pass. Data in `store.threeLists.why` as `Record<string, string[]>` keyed by name (duplicate-name sharing accepted for V1). Whitespace-only rejected. "Next" → ImprovementsList; "Back" → WhoList. Remaining sub-step (ImprovementsList) and Stages 3–6 remain pending.

**Update (2026-05-15): Stage 2 ImprovementsList (sub-step 3 of Three Lists) implemented** at `src/features/onboarding/stages/ImprovementsList.tsx`. Buffet framing, add/delete list mechanics, min 3 gate, soft nudge at ~12 items (non-blocking), no timer. Stored in `store.threeLists.improvements` (`string[]`). Stage boundary: "Next" revalidates all three lists via `canAdvance('threeLists', state)` before advancing to Characteristics. **All three Stage 2 sub-screens (WhoList, WhyList, ImprovementsList) are now implemented.** Stages 3–6 remain pending.

**Domain layer, routing, container, store, persistence, Stage 1, Stage 3 Part A, and Stage 7 implemented; stages 2, 3 Part B, 4–6 pending.** The stage machine (`stages.ts`), navigation guards (`guards.ts` — `canAdvance` and `threeListsComplete` with 21 boundary/truth-table tests), and shared domain types (`types.ts` — including `OnboardingState`) are implemented as pure zero-dependency domain functions. The onboarding store, route (`app/onboarding.tsx` — full-screen modal above tab bar), container (`OnboardingContainer.tsx` — stage-driven rendering, `<ProgressChrome />` for stages 2–6 only, forced dark theme), persistence layer (`baselineRepository`), Stage 1 (`IntroScreen.tsx` — example rose chart, value-prop copy, "Get Started"/"Skip for now"), Stage 3 Part A (`CharacteristicDefinition.tsx` — read-only Three Lists inspiration panel, free-text characteristic entry with add/Enter/remove, empty/whitespace rejection, duplicate inline warnings, min-3 gate, 4–8 guidance, >12 soft warning, intra-stage Next to CharacteristicReview), and Stage 7 (`CompletionScreen.tsx` — confirms baseline saved, conditionally lists focus areas, `router.replace` CTAs for Practice and Progress) are also in place. Entry point: Progress tab empty state → `router.push('/onboarding')`; no auto-launch on first run. Stage screens for stages 2 (Three Lists), 3 Part B (CharacteristicReview), and 4–6 are pending. The rose chart component (`SkillWheelChart`) is implemented and shared across onboarding confirmation, Progress tab, and cycle review.

**Part of the Skill Wheel + Onboarding epic.** The route (`app/onboarding.tsx`), container (`OnboardingContainer.tsx`), store, persistence layer, and domain functions are implemented. Stage screens implemented: Stage 1 (IntroScreen), Stage 3 Part A (CharacteristicDefinition), Stage 7 (CompletionScreen). Pending: Stages 2 (Three Lists), 3 Part B (CharacteristicReview), 4 (Self-Rating), 5 (Confirmation), and 6 (Goal Suggestion). The rose chart component (`SkillWheelChart`) is implemented and shared.

**Update (2026-05-15): Stage 1 (IntroScreen) and Stage 3 Part A (CharacteristicDefinition) implemented.** IntroScreen at `src/features/onboarding/stages/IntroScreen.tsx` — example rose chart with 6 hardcoded dummy characteristics and scores `[3, 6, 7, 4, 5, 8]`. "Get Started" advances to Stage 2; "Skip for now" dismisses onboarding with no data persisted. Dark background, no progress chrome. CharacteristicDefinition at `src/features/onboarding/stages/CharacteristicDefinition.tsx` — read-only Three Lists inspiration panel; free-text characteristic entry with add/Enter support; empty/whitespace rejection; duplicate inline warnings; remove buttons; min-3 gate; 4–8 guidance; >12 soft warning; intra-stage Next advances to CharacteristicReview. Stages 2, 3 Part B (CharacteristicReview), and 4–6 remain pending.

**Update (2026-05-15): Stage 3 Part B (CharacteristicReview) implemented** at `src/features/onboarding/stages/CharacteristicReview.tsx`. Displays all defined characteristics with reorder (up/down arrows, sequential `order` rewriting), inline rename (preserves `id`/score), confirmed removal (✕ with prompt, drops characteristic and rating), and coverage validation ("If you were a 10 out of 10…"). "No" returns to CharacteristicDefinition via `store.back()`; "Yes" advances to rating via `store.next()` gated by `canAdvance` (≥3 characteristics). 35 focused tests. The store gained `reorderCharacteristics`, `renameCharacteristic`, and `removeCharacteristic` actions. Stages 2, 4–6 remain pending.

**Update (2026-05-15): Stage 5 (ConfirmationScreen) implemented** at `src/features/onboarding/stages/ConfirmationScreen.tsx`. Interactive `<SkillWheelChart interactive onWedgeTap={...} />` — tapping a wedge navigates back to Stage 4 at that characteristic's rating subStep. Flat-wheel detection via `detectFlatWheel` from `src/domain/onboarding/wheel.ts` (pure: `max - min`, threshold 2, returns `{ isFlat, range }`). If flat: nudge with "Review ratings" → `store.back()` / "Proceed anyway" → `store.next()`. If not flat: "Your skill wheel is ready" + "Continue" → `store.next()`. Progress chrome "Step 5 of 7". Self-gating — `canAdvance('confirm', ...)` always returns true. 12 test suites, 77 tests passing. Stages 2 (Three Lists) and 6 (Goal Suggestion) remain pending.

**Update (2026-05-15): Stage 6 (FocusSelectionScreen) implemented — all 7 onboarding stages complete.** FocusSelectionScreen at `src/features/onboarding/stages/FocusSelectionScreen.tsx` delivers the ranked-list focus selection with passive tip (wheel-shape-driven content: flat / large gap / default), cap-2 selection with inline feedback, Continue/Skip actions, and store-backed state persistence. Domain functions `rankCharacteristics`, `pickWeakestSlices`, and `detectFlatWheel` are shared with other stages and future Cycle Review. 14 test suites, 84 tests passing. All seven onboarding stages (1–7) are now fully implemented.
