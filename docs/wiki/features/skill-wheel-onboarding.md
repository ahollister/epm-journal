# Skill Wheel + Onboarding

The Skill Wheel is one of "The Big Three" from EPM Level 2. Its onboarding flow (P3) introduces new users to the skill assessment framework and captures their initial self-assessment baseline — the reference point for all future cycle review deltas.

---

## Book Grounding

The onboarding flow is directly grounded in Benny Greb's *Effective Practice Method* book. Several core concepts from the book map explicitly to app features:

In the app, these same questions are answered structurally:
- **Who** → The user writes their "Who" list — musical identity, current abilities, influences, what they can and cannot do. This is raw material for characteristic extraction.
- **Why** → The user writes their "Why" list — motivations, goals, what drives them to practice. This informs which characteristics matter most and guides the goal suggestion stage.
- **Improvements** → The user writes specific areas they want to grow. Combined with the "Who" list, these are distilled into **characteristics** — observable behavioral statements that become the dimensions of the skill wheel.

The Three Lists are not mapped onto a fixed set of six dimensions. Instead, the characteristics that emerge from the lists *are* the dimensions. Each user's wheel is personal — a jazz guitarist may have 5 characteristics, a classical pianist may have 7. See [User-Defined Characteristics](#user-defined-characteristics).

Greb describes skill assessment as peeling an onion: each layer reveals a more specific, behavioral picture of ability. You don't ask "how good is my timing?" — you ask "can I play with a metronome without drifting? can I hold a groove through fills? can I play ahead of the beat intentionally?"

The characteristic extraction model in the app follows this exactly. Instead of presenting abstract 1–10 scales for generic categories, the user first defines their own characteristics from their Three Lists, then peels through behavioral bands to find the description that best matches them. See [Characteristic Extraction](#characteristic-extraction).

Greb uses the metaphor of a car tire: if one slice of the tire is flat (underinflated), the car won't drive smoothly regardless of how good the other slices are. A musician with killer technique but weak ear training is like a car with a flat tire — it moves, but it's unstable and inefficient.

The radar chart visualization is the direct translation of this metaphor. The wheel shows at a glance which slices are inflated and which are flat. The visual payoff at Stage 5 (confirmation) is literally the user seeing their tire for the first time.

Greb's prescription is to focus practice on the weakest slice — the most underinflated part of the tire. This yields the greatest overall improvement because it addresses the binding constraint. Working on an already-strong area produces marginal gains; fixing the flat tire makes everything drive better.

The app's weakest-slice algorithm (Stage 6: Goal Suggestion) implements this strategy directly: the system identifies the three lowest-scoring characteristics and suggests the weakest as the first cycle's focus area. See [Picking the 3 Weakest Slices](#picking-the-3-weakest-slices).

## Who

The Skill Wheel + Onboarding is for **every musician using EPM Journal**, regardless of skill level:

- **Beginners** — The wheel gives them a structured way to see their starting point across the dimensions that matter to them. The onboarding walkthrough teaches them how to define characteristics and assess themselves honestly.
- **Intermediates** — They arrive with uneven skills. The wheel surfaces their blind spots immediately — characteristics they thought were strengths may score lower than expected.
- **Advanced/Pro players** — Even experts have relative weaknesses. The wheel forces honest self-assessment across characteristics they might otherwise ignore. A pro with killer technique might discover their sight-reading lags.

The onboarding is designed for **first-time users** who have never seen the Skill Wheel framework. Returning users skip it; it lives in the Progress tab as a re-accessible baseline editor.

## Why

The Skill Wheel + Onboarding exists for five reasons:

1. **Establishes the baseline for Measurable Progress (EPM Level 1).** Every cycle review compares current scores against the initial baseline. Without this first snapshot, there is no "before" — deltas are meaningless, and the reflective loop is open.

2. **Teaches the Skill Wheel framework (EPM Level 2).** The user learns how to define their own characteristics, how to assess themselves honestly, and why multi-dimensional tracking matters. This mental model carries into SMART goal setting and session focus.

3. **Surfaces blind spots immediately.** A musician who only thinks about technique gets confronted with their ear-training and improvisation characteristics. The wheel makes lopsidedness visible.

4. **Guides the first practice cycle.** The onboarding suggests focus areas based on the lowest-scoring characteristics, giving the user a concrete starting direction instead of "now go practice."

5. **Makes the abstract tangible.** "Rate your musicianship" is overwhelming. "Rate your ability to maintain steady tempo through fills, where 3 means 'I rush noticeably' and 8 means 'solid at most tempos'" is concrete and answerable.

## Improvements Over Ad-Hoc Self-Assessment

| Ad-hoc approach | Skill Wheel Onboarding |
|---|---|
| "How good am I?" — unanswerable | User-defined characteristics, each with anchored descriptions |
| One global rating — hides lopsidedness | Radar chart instantly reveals weak slices |
| No baseline — can't measure growth | First snapshot powers all future cycle review deltas |
| Subjective and mood-dependent | Anchored scales with behavioral examples reduce drift |
| No follow-through — rate it and forget it | Feeds directly into focus area selection and first-cycle goals |
| Feels like a test | Framed as "your starting point — no wrong answers" |

## User-Defined Characteristics

Per Benny Greb's *Effective Practice for Musicians*, the skill wheel dimensions are **not** a fixed canonical set. Instead, they emerge from the user's own **Three Lists exercise**:

1. **Who am I?** — musical identity and current abilities
2. **Why am I practicing?** — motivations and goals
3. **What improvements am I targeting?** — specific growth areas

From these three lists, the user extracts **characteristics** — observable, behavioral descriptions of what they can and cannot do. These characteristics become the dimensions of their personal skill wheel.

For example, a jazz guitarist's Three Lists might yield characteristics like:
- "Comping behind a soloist without overplaying"
- "Sight-reading chord charts at tempo"
- "Voice-leading through ii-V-I progressions"
- "Transcribing solos by ear"

A classical pianist's Three Lists might yield entirely different characteristics:
- "Evenness of tone across dynamic ranges"
- "Memorization of 30+ minutes of repertoire"
- "Pedaling clarity in Romantic-era pieces"
- "Orchestral reduction at sight"

**The characteristics are the dimensions.** There is no fixed count of six — each musician's wheel has the number of characteristics that emerge from their Three Lists. A radar chart with 4 axes is as valid as one with 8.

### How characteristics become dimensions

1. The user writes their Three Lists (Stage 2).
2. From the lists, the app helps the user extract **characteristics** — concrete, behavioral statements about their playing (Stage 3).
3. Each characteristic becomes a dimension on the wheel.
4. The user then rates themselves on each characteristic using characteristic-anchored self-assessment bands (Stage 4).

This replaces the previous (incorrect) assumption of six canonical dimensions (Tone, Timing, Technique, Repertoire, Improvisation, Ear Training). Those six were an oversimplification. Greb's book is explicit: the dimensions are personal — they come from the musician's own honest self-assessment, not from a prescribed list.

> **Correction record (2025-07-18):** Prior versions of this spec and the related wiki pages incorrectly specified six fixed dimensions. Per the book, dimensions are user-defined via the Three Lists → characteristic extraction process. The radar chart, weakest-slice algorithm, and self-rating rules all still apply — but they operate on the user's own characteristics, not a canonical six. See [Decisions](../decisions.md).

## Characteristic Extraction

Before rating a characteristic, the user is shown **characteristic statements** — observable, behavioral descriptions of what that skill looks like at different levels. This is not abstract number-mapping; it's "which of these sounds most like you?"

### How characteristics are extracted

Characteristics emerge from the user's Three Lists (Stage 2) and are refined during the characteristic extraction stage (Stage 3). The app helps the user turn raw list items into well-formed characteristic statements. Sources include:

- **"What improvements" list items** — e.g., "I want to stop rushing fills" → characteristic: "Maintaining steady tempo through fills"
- **"Who" list items** — e.g., "I can play blues in E and A" → characteristic: "Blues vocabulary in common keys"
- **Practice friction points** — e.g., "I avoid improvising because I don't know what to play" → characteristic: "Spontaneous melodic creation"
- **Performance goals** — e.g., "I want to play with a cleaner tone at high volumes" → characteristic: "Dynamic control and tone consistency"

Each characteristic is rated using the **"visualize your 10"** method from Benny Greb's book. The user is guided by four characteristic-agnostic prompts to build a mental picture of what mastery looks like for that specific characteristic, then rates by gut in ~10 seconds on a **0–10 scale**. The four prompts are:

1. **What would you be able to do at a 10?** — visualize the concrete abilities that define mastery for this characteristic.
2. **What elements are included?** — break down what sub-skills or components make up that picture of mastery.
3. **Why aren't you already at 10?** — identify the gaps between current ability and the visualized ideal.
4. **What's the max?** — define the ceiling: is 10 an achievable human maximum for this characteristic, or a theoretical ideal?

This is characteristic-anchored self-assessment driven entirely by the user's own visualization, not by pre-authored band descriptions. The four prompts are static copy constants in the feature layer — no domain module for rating bands. See the [2026-05-14 reversal decision](../decisions.md).

### Example: user-defined characteristic extraction

A guitarist's "Improvements" list includes "I want to stop rushing fills." The extracted characteristic is "Maintaining steady tempo through fills."

The user then goes through the four "visualize your 10" prompts for this characteristic:

| Prompt | User's mental answer |
|--------|---------------------|
| What would you be able to do at a 10? | "Play any fill at any tempo without losing the pulse — the time is rock-solid no matter what I throw in." |
| What elements are included? | "Subdivisions, triplet fills, cross-rhythms, tempo changes — all without drifting." |
| Why aren't you already at 10? | "I rush when I get excited during fills, especially at faster tempos and with odd groupings." |
| What's the max? | "Studio-drummer-level time — the kind where the click track is redundant." |

After ~10 seconds of reflection, the user rates themselves: "Based on that picture of a 10, I'm around a 4 — I can hold time through simple fills at moderate tempos, but anything complex or fast and I drift."

The same four prompts appear for every characteristic — only the characteristic name changes. Each rating is a gut-check against the user's own visualized ceiling, not against an external rubric.

## Self-Rating Rules

The onboarding enforces three self-rating rules to ensure the baseline is honest and useful:

### Rule 1: Avoid 5 (the midpoint bias)

Musicians, when unsure, gravitate toward the middle. On a 0–10 scale, 5 is the arithmetic midpoint — it says "I don't know" or "I'm average" — and produces flat, low-signal wheels where every dimension is a 5.

**The rule:** The onboarding gently discourages 5. If the user selects 5, it prompts: *"5 is the hardest score to learn from. Do you lean closer to 'I can do this sometimes' (4) or 'I can usually do this' (6)?"* This forces a direction. Because the scale is 0–10, 5 sits at the true centre — the nudge is well-founded.

The same applies to the midpoint of any band. The goal is a wheel with shape — peaks and valleys that reveal the real profile.

### Rule 3: The 10-second rule (go with your gut)

Overthinking produces inflated or deflated scores. The user reads the characteristics, then has roughly 10 seconds to pick a band and number. If they deliberate longer, they're likely gaming the number rather than assessing honestly.

**The rule:** The UI doesn't enforce a hard timer, but the copy encourages speed: *"Don't overthink it. Read the descriptions, pick the one that fits best, and move on. You can always adjust later."* The dimension screens are designed to be scannable — characteristics are bullet points, not paragraphs.

---

## Onboarding Flow (7 stages)

### Stage 1: Introduction (1 screen)

Explains what the Skill Wheel is and why it matters. Shows an example wheel — not the user's (there's no data yet), but a sample to set expectations.

Key copy points:
- "You'll define your own skill dimensions based on who you are as a musician."
- "Be honest — there are no wrong answers. This is your starting point, not a test."
- "Your baseline powers your progress tracking. Every future review compares against where you started."
- Visual: a filled example radar chart with clear peaks and valleys, labeled "This is what a skill wheel looks like after assessment."

### Stage 2: Three Lists (1–3 screens)

The user writes their three lists, one at a time:

1. **Who am I?** — Musical identity, current abilities, influences, what I can and cannot do. Prompts: "What instruments do you play? What styles? What are you good at? What do you struggle with?"
2. **Why am I practicing?** — Motivations, goals, what drives me. Prompts: "Why do you make music? What do you want to achieve? What would make practice feel worth it?"
3. **What improvements am I targeting?** — Specific growth areas. Prompts: "What frustrates you about your playing? What do you wish you could do? What would your teacher tell you to work on?"

The lists are free-text but the UI provides prompts and examples. The user can write as many items as they want (minimum: 3 per list to ensure enough material for characteristic extraction).

### Stage 3: Characteristic Extraction (1 screen per characteristic)

From the Three Lists, the app helps the user distill their raw list items into well-formed **characteristics** — observable behavioral statements.

For each list item the user wants to track, they:
1. Select the raw list item (e.g., "I want to stop rushing fills").
2. The app suggests a characteristic formulation (e.g., "Maintaining steady tempo through fills").
3. The user refines and confirms: "Yes, that's what I mean" or edits it.
4. The characteristic is added to their wheel as a dimension.

The user can extract as many characteristics as they want (suggested: 4–8). They can also skip items — not every list item needs to become a wheel dimension.

After extraction, the user sees their full set of characteristics as a list: "Your skill wheel will track these dimensions." They can reorder, rename, or remove before proceeding.

### Stage 4: Self-Rating on each characteristic (1 screen per characteristic)

The user rates themselves (0–10) on each characteristic, one at a time. This is where the "visualize your 10" self-assessment happens.

Each screen contains:
1. **Characteristic name** — the user's own wording (e.g., "Maintaining steady tempo through fills").
2. **The four "visualize your 10" prompts** — characteristic-agnostic, same for every characteristic:
   - **What would you be able to do at a 10?**
   - **What elements are included?**
   - **Why aren't you already at 10?**
   - **What's the max?**
3. **Slider or numeric pad** — the user selects a number 0–10. Default position is "not set."
4. **Rating scale reference** — the 0–10 scale with midpoint 5 clearly marked.
5. **Progress indicator** — "Characteristic 3 of 6" with dots or a progress bar.

> **Design decision (2026-05-14 — REVERSAL):** An earlier decision introduced a fixed 4-band rubric (Beginner/Intermediate/Advanced/Expert). This has been reversed — the book contains no behavioural bands. The authoritative mechanism is the four "visualize your 10" prompts above, which are static copy constants in the feature layer. The `ratingBands.ts` domain module (RATING_BANDS/bandForScore) is deleted. See [Decisions](../decisions.md).

The order is user-defined (the order they confirmed characteristics in Stage 3).

### Stage 5: Confirmation and wheel preview (1 screen)

Shows the resulting rose chart with all characteristics plotted:

- **The wheel is the hero** — large, centered, immediately readable. Peaks and valleys are visually obvious.
- Tap any characteristic point to go back and adjust that rating.
- A summary text: "Your highest: [characteristic] (8). Your lowest: [characteristic] (3)."
- **"Looks good"** primary button confirms and advances.
- **"Adjust"** secondary option returns to the characteristic list for edits.

The wheel preview MUST use the same SkillWheelChart component from `src/shared/components/skill-wheel/SkillWheelChart.tsx`. Visual consistency between onboarding and ongoing tracking is non-negotiable.

### Stage 6: Goal suggestion (1 screen)

Based on the wheel shape, the app suggests focus areas for the first practice cycle:

- **Algorithm:** Select the 3 weakest characteristics (lowest scores; tiebreak by user-defined characteristic order from Stage 3).
- **Presentation:** "Your three lowest characteristics are [A] (3), [B] (4), and [C] (5). We suggest focusing on [A] for your first cycle."
- The user can:
  - **Accept the suggestion** — the weakest characteristic becomes the first cycle's focus area.
  - **Choose manually** — pick any 1–2 characteristics as focus areas.
  - **Skip** — no focus area set; the user can set one later in Cycle Review.

### Stage 7: Completion (1 screen)

- Confirms baseline saved (FR5.1).
- Lists selected focus areas if `focusAreas.length > 0` (FR5.2): "Your focus for your first cycle: {name1}, {name2}".
- Primary CTA "Start your first session" → `router.replace('/(tabs)')` (Practice tab, FR5.3).
- Secondary CTA "Explore your Progress" → `router.replace('/(tabs)/progress')` (Progress tab, FR5.4).
- Uses `router.replace` so the onboarding route is removed from the stack — back button from Practice/Progress won't re-enter onboarding.
- **Persistence contract:** `complete()` must succeed (baseline written, then flag set — AC10 ordering) before the store advances to Stage 7. On failure, the user stays on the current stage and sees an inline error + "Retry" button. The completion screen is never shown with unsaved data.

### Skippable but encouraged

Onboarding can be skipped from the introduction screen. If skipped:
- No baseline exists. The first cycle review will detect this and prompt onboarding.
- The skill wheel in the Progress tab shows an empty state: "Complete onboarding to see your skill wheel."
- The user can start onboarding at any time from the Progress tab.

## The Pie Chart / Wheel Visualization

The skill wheel is a **polar bar / rose chart** with 6 equal 60° wedges — one per user-defined characteristic. Each wedge's radial distance from the center represents that attribute's score on the 1–10 scale. There is no connecting polygon between wedges; each characteristic reads as an independent radial bar. This is NOT a traditional radar/spider chart (which would have a filled connecting polygon), nor is it a literal pie chart.

### Visual specification

| Property | Value |
|----------|-------|
| Chart type | Polar bar / rose chart |
| Wedges | 6 equal 60° wedges, one per user-defined characteristic |
| Center | (180, 180) |
| Max radius | 140 (= score 10) |
| Scale per axis | 0–10 |
| Gap between wedges | 4° — wedges read as separate blocks, no connecting polygon |
| Grid rings | 5 concentric reference rings at r=14, 42, 84, 112, 140 (scale bands 1, 3, 6, 8, 10) |
| Fill | Solid fill within each wedge (no inter-wedge polygon) |
| Point markers | None — the wedge itself is the visual indicator |
| Label position | Outside the chart, at each wedge's outer edge |
| Color | Band-colored fill per wedge (red 1–3, amber 4–6, lime 7–8, green 9–10); muted reference rings; characteristic labels in readable contrast |

### Why rose chart and not radar or bar chart

- **Independent wedges, no implied correlation.** Unlike a radar chart's connecting polygon, the rose chart treats each characteristic as a standalone radial bar. There is no filled polygon suggesting a "profile" — each dimension reads independently, matching the data model (independent categorical ratings on a 1–10 scale).
- **Retains the wheel metaphor.** The radial/circular layout preserves Benny Greb's car tire concept — peaks and valleys are instantly visible. The "flat tire" (a weak characteristic) is visually obvious as a short wedge.
- **Shape recognition is instant.** A lopsided wheel (strong on one side, weak on the other) is visible in milliseconds — no reading numbers required.
- **Deltas are visual.** When comparing two cycles, overlaying two sets of wedges shows growth/decline as radial distance change.

### Shared component constraint

*(Consolidated into the main [Architecture Placement](#architecture-placement) section above. The chart lives at `src/shared/components/skill-wheel/SkillWheelChart.tsx` — see the [2026-05-14 chart placement decision](../decisions.md).)*

## Picking the 3 Weakest Slices

After the user confirms their ratings, the system identifies the three lowest-scoring characteristics for the goal suggestion stage.

### Algorithm

```
Input:  characteristics[] — array of { name: string, score: 1–10 }, 
        in user-defined order (from Stage 3)
Output: weakest[3] — the three characteristics with the lowest scores, 
        tiebroken by user-defined order

1. Sort characteristics by (score ASC, user_defined_order ASC)
2. Take first 3
```

User-defined order is the order the user confirmed characteristics in Stage 3 (Characteristic Extraction). This is the tiebreak order.

### Tiebreak rationale

If two characteristics have the same score, the user-defined order breaks the tie. Why?

- **The user's own priority.** The order they confirmed characteristics reflects their implicit sense of which characteristics matter most. The first characteristic they extracted is likely the most salient.
- **Deterministic.** No randomness. The same input always produces the same suggestion.
- **Transparent.** If the user asks "why [A] over [B]?", the answer is simple: "They're tied, and you listed [A] first."

### Presentation to the user

The 3 weakest are presented as a ranked list with scores:

> Your three areas with the most room to grow:
> 1. **[Characteristic A]** (3)
> 2. **[Characteristic B]** (4)
> 3. **[Characteristic C]** (5)
>
> We recommend focusing on **[Characteristic A]** for your first practice cycle.

The primary suggestion is always #1 (the absolute lowest). But the user sees all three and can choose any of them — or a completely different characteristic.

### Edge cases

| Case | Behavior |
|------|----------|
| All scores tied (flat wheel) | Differentiation warning fires first (see Rule 2). If user proceeds anyway, pick first 3 by user-defined order. |
| Two-way tie for lowest | Both shown; user-defined order breaks for the primary suggestion. |
| Three-way (or more) tie for lowest | All tied characteristics shown; first by user-defined order is primary suggestion. |
| One characteristic vastly lower (gap ≥ 3) | The primary suggestion is unambiguous. The other two "weakest" may be mid-range scores; that's fine — the user sees the gap. |

## Architecture Placement

| Aspect | Location |
|--------|----------|
| Tab | **Progress** (bottom tab navigator) |
| Route file | `app/onboarding.tsx` — single Expo Router route; stage navigation driven by store stage machine, not route transitions |
| Feature folder | `features/progress/` — React components (onboarding screens) + Zustand store |
| Shared component | `src/shared/components/skill-wheel/SkillWheelChart.tsx` — the rose chart widget, shared by onboarding and Progress tab |
| Domain types | `src/domain/onboarding/types.ts` — `Characteristic`, `ThreeLists`, `Baseline`, `OnboardingState`; zero-dependency, consumed by onboarding store, guards, chart, and future Progress/Cycle-Review |
| Domain logic | `src/domain/onboarding/stages.ts` — stage machine (7 stages, `Stage` type); `src/domain/onboarding/guards.ts` — `canAdvance` and `threeListsComplete` pure navigation guards; plus skill wheel calculations (scoring, aggregation, weakest-slice algorithm) |
| Native integration | None |

## UX Principles

**Overarching constraint: Onboarding must NOT feel like a boring form-filling exercise.** Every design decision in the flow serves this goal. The four mechanisms that deliver it:

1. **Characteristic-anchored self-rating** — users match themselves to concrete behavioral descriptions (the fixed 4-band rubric: Beginner 1–3, Intermediate 4–6, Advanced 7–8, Expert 9–10), rather than picking abstract numbers. The band descriptions do the heavy lifting; the number is just the summary.
2. **10-second gut-check pace** — the flow encourages fast, intuitive answers. The UI doesn't enforce a hard timer, but the copy and scannable design push the user toward snap judgments. Overthinking produces inflated or deflated scores.
3. **Progress visibility** — "Characteristic 3 of 6" keeps the user oriented and the end in sight. No surprise length; the user always knows where they are and how much remains.
4. **The radar chart as visual payoff** — the wheel preview at confirmation is the reward for completing the rating screens. It transforms individual ratings into a meaningful, glanceable profile. This is the moment the user shifts from "I'm filling out a form" to "this is my musical fingerprint."

### Principles from project context (restated here)

- One characteristic per screen (no overwhelming forms).
- Concrete, musician-friendly descriptions (not abstract numbers).
- The wheel is visual — users understand their profile at a glance.
- Onboarding is skippable but gently encouraged (the baseline powers cycle review deltas).

### Additional UX principles from the self-rating design

- **Don't let the user rate until they've read.** The slider/input appears below the band descriptions, after a slight scroll. This encourages reading before rating.
- **No zero or null scores.** All characteristics must be rated to produce a wheel. The confirmation screen is gated — "Confirm" is disabled until all characteristics have values.
- **Progress is always visible.** The user always knows they're on "Characteristic 3 of 6" — no surprise length.
- **The wheel is the reward.** After the rating screens, the confirmation screen with the rose chart feels like a payoff — "here's your musical profile."

## Self-Assessment vs. Session-Derived Scores

The onboarding produces a **self-assessment baseline** — the user's own honest rating. This is different from **session-derived scores** that the Skill Wheel Visualization computes over time:

| Aspect | Onboarding (self-assessment) | Ongoing (session-derived) |
|--------|------------------------------|---------------------------|
| Source | User's self-rating | Aggregated from session data, goal completion, recordings |
| Purpose | Establish baseline | Track growth against baseline |
| Frequency | Once (or re-baseline on demand) | Updated continuously per cycle |
| Subjectivity | High (honest self-assessment) | Lower (data-driven, but still has human judgment in goal completion) |
| Drift risk | Moderate (honesty culture mitigates) | Low (data-anchored) |

Over time, session-derived scores become the primary data source, and the self-assessment baseline becomes a historical reference point. The user may choose to re-baseline (re-do the onboarding self-assessment) if they feel their original ratings were off — this creates a new baseline but preserves the old one in history.

---

**Domain layer, routing, container, and Stage 7 implemented; stages 1–6 pending.** The stage machine (`stages.ts` — 7 stages, `Stage` type), navigation guards (`guards.ts` — `canAdvance` and `threeListsComplete` with 21 boundary/truth-table tests), and shared domain types (`types.ts` — `Characteristic`, `ThreeLists`, `Baseline`, `OnboardingState`) are implemented as pure zero-dependency domain functions. The onboarding store, route (`app/onboarding.tsx` — registered as full-screen modal above the tab bar), container (`OnboardingContainer.tsx` — stage-driven rendering with conditional `<ProgressChrome />` for stages 2–6), persistence layer (`baselineRepository`), and Stage 7 (`CompletionScreen.tsx` — confirms baseline saved, conditionally lists focus areas, uses `router.replace` for Practice/Progress CTAs) are also implemented. Dark theme is forced: `app.json` `userInterfaceStyle: "dark"`, `<StatusBar style="light" />` at route root, `backgroundColor: colors.bgBase` on container. Entry point: Progress tab empty state → `router.push('/onboarding')`. No auto-launch on first run. Stage screens for stages 1–6 are pending. The rose chart component (`SkillWheelChart`) is implemented and shared. Design corrected (2025-07-18): user-defined characteristics via Three Lists → characteristic extraction, not six canonical dimensions.

## Key Constraints

- Onboarding must reuse the existing skill wheel domain functions — no duplicate scoring logic.
- The rose chart component is shared between onboarding preview and the main Skill Wheel Visualization, and must accept a variable number of axes. It lives at `src/shared/components/skill-wheel/SkillWheelChart.tsx`, not in a feature folder — see the [2026-05-14 chart placement decision](../decisions.md).
- Onboarding is a single Expo Router route (`app/onboarding.tsx`) with a store-driven stage machine — not one route per stage.
- Onboarding is skippable; the app must handle the "no baseline" case gracefully in cycle review.
- The Progress feature folder may not import from other feature folders.
- Self-rating domain functions (validation, weakest-slice, flat detection) must be pure — no side effects, no platform dependencies.
- All user-defined characteristics must be rated before confirmation; no partial wheels can be saved.
- **One-time flow only.** Re-baselining, session-derived score computation, and profile editing are out of scope for this epic — they belong to the ongoing Skill Wheel Visualization and Cycle Review features.

## Related Pages

- [Skill Wheel Visualization](../learnings/skill-wheel-visualization.md) — the main wheel view; shares the radar chart component and domain functions
- [Cycle Review](../learnings/cycle-review.md) — consumes the onboarding baseline for deltas
- [SMART Goal Tracking](../learnings/smart-goal-tracking.md) — focus areas become first-cycle goals
- [Architecture](../architecture.md) — feature folders, domain layer, store bridging
- [Glossary](../glossary.md) — Skill wheel, Progress tab, EPM
- [Project Context](../project-context.md) — EPM Level 2, onboarding flow specification

**Single epic: Skill Wheel + Onboarding.** The full 5-stage onboarding flow plus the shared radar chart component are scoped as a single deliverable. The flow, self-rating rules, characteristic extraction model, and weakest-slice algorithm are fully defined. Domain functions (`computeWheelShape`, `pickWeakestSlices`, `detectFlatWheel`, `suggestFocusArea`, `validateScoreRange`) are partially implemented. No onboarding UI or store logic is implemented yet. The shared radar chart component is pending.

**Explicitly out of scope for this epic:**
- Re-baselining (re-doing the self-assessment later)
- Session-derived scores (the ongoing, data-driven dimension scoring)
- Profile editing (adjusting scores outside the one-time onboarding flow)

- Onboarding must reuse the existing skill wheel domain functions — no duplicate scoring logic.
- The radar chart component must be shared between onboarding preview and the main Skill Wheel Visualization.
- Onboarding is skippable; the app must handle the "no baseline" case gracefully in cycle review.
- The Progress feature folder may not import from other feature folders.
- Self-rating domain functions (validation, weakest-slice, flat detection) must be pure — no side effects, no platform dependencies.
- All six dimensions must be rated before confirmation; no partial wheels can be saved.
- **One-time flow only.** Re-baselining, session-derived score computation, and profile editing are out of scope for this epic — they belong to the ongoing Skill Wheel Visualization and Cycle Review features.


---

## Chart Model History

The Skill Wheel visualization model has gone through several iterations. The definitive visualization is a **polar bar / rose chart** (2026-05-13): 6 equal 60° wedges, radial distance = score, 4° gaps between wedges, no connecting polygon. Each characteristic reads independently — no implied correlation. 5 concentric reference rings at r=14, 42, 84, 112, 140 (scale bands 1, 3, 6, 8, 10).

Prior models (all superseded):
1. **Radar/spider chart with connecting polygon** — original design; implied correlation between dimensions.
2. **Stacked horizontal bars** (2025-07-18, recorded in error — not a real signed-off decision).
3. **Radar chart restored** (2025-07-18 reversal, also recorded in error — not a real signed-off decision).

See [Decisions](../decisions.md) for the full history and the 2026-05-13 authoritative decision.

## Architecture Placement

| Aspect | Location |
|--------|----------|
| Tab | **Progress** (bottom tab navigator) |
| Route file | `app/onboarding.tsx` — single Expo Router route; stage navigation driven by store stage machine, not route transitions |
| Feature folder | `features/progress/` — React components (onboarding screens) + Zustand store |
| Shared component | `src/shared/components/skill-wheel/SkillWheelChart.tsx` — the rose chart widget, shared by onboarding and Progress tab |
| Domain logic | `domain/` — Skill wheel calculations (scoring, aggregation, weakest-slice algorithm) |
| Native integration | None |

### Shared component constraint

The rose chart component MUST be a single, shared implementation used by:
- **Onboarding confirmation (Stage 5)** — first-ever view, baseline snapshot.
- **Skill Wheel Visualization (Progress tab)** — ongoing view, updated over cycles.
- **Cycle Review** — overlay of current vs. previous cycle.

The component accepts a variable-length array of characteristics as props. Two chart implementations = visual drift = user confusion. One component, props-driven.

**Placement:** The chart lives at `src/shared/components/skill-wheel/SkillWheelChart.tsx` — in the shared components directory, NOT in `features/progress/`. This is because both the onboarding flow and the Progress tab consume the chart, and feature folders may not import from each other. See the [2026-05-14 decision](../decisions.md).

**Placement variants:** The same widget appears on the Progress tab and cycle review; only the date stamp and CTA label change between placements.


**Update (2026-05-15): Stage 1 (IntroScreen) implemented.** Lives at `src/features/onboarding/stages/IntroScreen.tsx`. Renders an example `<SkillWheelChart characteristics={dummyData} interactive={false} />` with 6 hardcoded characteristics (Tone, Timing, Technique, Repertoire, Improvisation, Ear Training) and scores `[3, 6, 7, 4, 5, 8]` — clear peaks and valleys (FR11.1). Caption: "This is what a skill wheel looks like after assessment." (FR11.4). Value-prop copy in musician-friendly language (FR1.1, FR1.3). "Get Started" → `store.next()` (advances to Stage 2). "Skip for now" → `router.back()` (dismisses onboarding, no baseline saved, Progress tab empty state shown — FR1.5). Dark `colors.bgBase` background, no progress chrome (intro stage, Orchestration FR3.1). Stages 2–6 remain pending.