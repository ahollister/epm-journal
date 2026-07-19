# Decisions

Append-only log of significant project decisions. Each entry should record what was decided, why, and (where useful) what was rejected.

---

## 2025-07-16 — Feature-folders + domain/ separation

**What was decided:** The codebase is organized into feature-folders with colocated Zustand stores, plus a `domain/` directory for pure (zero-dependency) business logic functions.

**Why:**
- Feature folders own both UI and state, keeping related code close and discoverable.
- The `domain/` layer contains pure functions for EPM rules (session state machine, SMART goal validation, skill wheel calculations, recording policy) — no React, no native dependencies.
- Zustand stores act as the bridge: they import pure domain functions and expose state + actions to React components.
- Pure domain code is testable with plain Jest. No mocking of React or native APIs needed.

**What was rejected:** A "global store" pattern where all state lives in one place, and business logic mixed into UI components or store files.

---

## 2025-07-16 — Metronome native module: AVAudioEngine + Oboe/AAudio with foreground service

**What was decided:** The metronome feature uses a platform-native module for low-latency audio, with AVAudioEngine on iOS and Oboe/AAudio on Android. Background playback on Android is handled via a foreground service.

**Why:**
- Web/JS-based audio scheduling (e.g. `setTimeout`, `setInterval`, Web Audio API via React Native) cannot achieve the sub-millisecond timing precision required for a metronome.
- AVAudioEngine (iOS) and Oboe/AAudio (Android) are the canonical low-latency audio APIs on each platform — they bypass the higher-latency software layers.
- A foreground service on Android keeps the metronome alive and audible when the app is backgrounded, which is the expected UX for a practice metronome.

**What was rejected:**
- A cross-platform JS-only audio solution (e.g. `expo-av`, `react-native-audio`) — insufficient timing precision.
- A single cross-platform C++ audio engine — the maintenance cost of bridging both platforms through one abstraction wasn't justified; using each platform's first-class audio API directly is simpler and more reliable.

## 2025-07-16 — Gap Click scheduling as a domain function

**What was decided:** The Gap Click scheduling logic (when to play/silence clicks during gap exercises) lives as a pure function in `domain/`, separate from the native audio transport.

**Why:**
- Scheduling policy (which beat, when to mute, when to resume) is business logic — pure input-to-output, testable with Jest.
- The native module concerns itself only with "play this sound at this precise time" — it doesn't know about gap exercises.
- Keeps the boundary clean: the Zustand store computes the schedule via domain functions and passes a simple instruction list to the native module.

## 2025-07-16 — Expo Router with three-tab navigator shell

**What was decided:** The app uses Expo Router (file-based routing) with a bottom tab navigator as the primary navigation shell. Three tabs define the main areas: Practice (session runner), Journal (practice journal and recordings), and Progress (skill wheel, goals, cycle review). Route files are thin one-line re-exports that compose feature components from their respective feature folders.

**Why:**
- Expo Router's file-based routing maps cleanly to the feature-folder structure — each route simply re-exports its corresponding feature screen.
- The three-tab structure provides immediate access to any area without stacking, matching the three core user activities identified for v1.
- Thin route files keep the navigation layer decoupled from UI logic — components live in feature folders where they can be developed and tested independently.

**What was rejected:** (Initial scaffold — no prior navigation approach was in place.)

## 2025-07-16 — Skill Wheel + Onboarding scoped as a single epic; one-time flow only

**What was decided:** The Skill Wheel + Onboarding is a single epic that delivers the full 5-stage onboarding flow plus the shared radar chart component. The onboarding is a one-time flow. Re-baselining, session-derived scores, and profile editing are explicitly out of scope for this epic.

**Why:**
- Bundling the onboarding flow with the shared radar chart ensures visual consistency from day one — the chart the user sees during onboarding is the same component they'll see in the Progress tab.
- Limiting to one-time flow keeps the initial deliverable focused. Re-baselining and profile editing introduce state-management complexity (history, versioning) that can be addressed later.
- Session-derived scores depend on session data aggregation, which requires the Practice and Journal features to be further along. Decoupling this from onboarding avoids blocking the onboarding deliverable on those dependencies.

**What was rejected:** Including re-baselining, session-derived score computation, or profile editing in the initial onboarding epic. These will be addressed as part of the ongoing Skill Wheel Visualization and Cycle Review features.

## 2025-07-18 — Skill Wheel chart model: radar/spider chart replaced with stacked-horizontal-bar layout

**What was decided:** The Skill Wheel visualization will use a stacked-horizontal-bar layout where each user-defined characteristic is its own segmented bar, rather than a radar/spider chart.

**Why:**
- A radar/spider chart visually implies complex interplay and relational comparison between attributes — the area of the polygon, the symmetry across axes, the "shape" all suggest the dimensions are meaningfully related to each other.
- In reality, each skill dimension is assessed independently on a 1–10 band. There is no measured correlation or trade-off between them — a high score in "tone" doesn't mathematically relate to a low score in "improvisation."
- A radar chart's connecting lines and filled polygon area are misleading when the axes represent independent categorical ratings. The visual weight of the polygon suggests a "profile" that isn't actually being computed.
- Stacked horizontal bars make each attribute read as independent — the user compares each bar against its own scale, not against neighboring bars. This matches the assessment model: independent categorical ratings, not a relational profile.

**What was rejected:** The radar/spider chart model. While it maps well to the "car tire" and "wheel" metaphors from Benny Greb's book, the visual encoding misrepresents the underlying data structure. The metaphor can persist in language ("your skill profile," "weakest slice") without requiring a literal radar chart.

**Implications:** This is a representational model choice that future chart work in the app will inherit. The shared chart component (used by onboarding confirmation, Progress tab, and cycle review) must use the bar layout. The domain functions (`computeWheelShape`, etc.) are unaffected — they still produce the same data; only the visual encoding changes.

## 2025-07-18 (REVERSAL) — Stacked-horizontal-bar decision reversed; radar/spider chart restored

**What was decided:** The 2025-07-18 decision (above) to use stacked horizontal bars for the Skill Wheel visualization has been reversed. That entry was not a real signed-off decision and was recorded in error. The authoritative visual design is a **radar/spider chart**: a circle with equal angular segments, one axis per user-defined characteristic (typically 4–8, defined via the Three Lists exercise), with a polygon connecting the user's 1–10 scores on each axis.

**Why:**
- The radar/spider chart maps directly to Benny Greb's "car tire" metaphor — the wheel shape with peaks and valleys is the visual payoff for the user and the entire point of calling it a "skill wheel."
- The 1–10 band color zones (red 1–3, amber 4–6, lime 7–8, green 9–10) map to concentric rings in the radar geometry, reinforcing the banded self-assessment model.
- The widget is shared across onboarding confirmation, the Progress tab, and cycle review — all use the same radar component.

**What was rejected:** The stacked-horizontal-bar layout (previous entry). It is now explicitly reversed and should not be referenced as current design intent.

**Implications:** All documentation describing the radar/spider chart model is authoritative. The "Design Reconsideration" notes appended to `features/skill-wheel-onboarding.md`, `learnings/skill-wheel-visualization.md`, and `learnings/skill-wheel-onboarding.md` are superseded.

## 2026-05-13 — Skill Wheel chart model: polar bar / rose chart (authoritative)

**What was decided:** The Skill Wheel visualization uses a **polar bar / rose chart**: 6 equal 60° wedges (one per user-defined characteristic), with the radial distance of each wedge from the center representing that attribute's score on the 1–10 scale. There is no connecting polygon between wedges — each characteristic reads as an independent radial bar. 4° gaps separate adjacent wedges so they read as distinct blocks. 5 concentric reference rings at r=14, 42, 84, 112, 140 correspond to scale bands 1, 3, 6, 8, 10. Center is (180, 180), max radius is 140 (= score 10). The same widget appears on the Progress tab and cycle review; only the date stamp and CTA label change between placements.

**Why:**
- The rose chart preserves the original design intent (no implied correlation between independent attributes) while honoring the user's chosen radial geometry.
- Each wedge reads as an independent radial bar — the visual encoding matches the data model (independent categorical ratings on a 1–10 scale).
- Unlike a traditional radar/spider chart with connecting polygon, the rose chart does not create a filled polygon that falsely suggests a "profile" or interplay between dimensions.
- Unlike stacked horizontal bars, the rose chart retains the radial/circular "wheel" metaphor that maps to Benny Greb's car tire concept and the "skill wheel" name.
- The concentric reference rings map cleanly to the 1–10 band color zones (red 1–3, amber 4–6, lime 7–8, green 9–10).

**What was rejected:** Both the radar/spider chart (with connecting polygon) and the stacked-horizontal-bar layout. The 2025-07-18 reversal entry that restored the radar chart was not a real signed-off decision and is superseded by this entry.

**Implications:** All three placements (onboarding confirmation, Progress tab, cycle review) use the rose-chart form. Domain functions are unaffected — they produce the same data; only the visual encoding changes.

## 2026-05-14 — Fixed 4-band rubric for self-rating (replaces per-characteristic name-keyed lookup)

**What was decided:** The self-rating stage (Stage 4 of onboarding) uses a FIXED 4-band rubric — the same four bands (Beginner 1–3, Intermediate 4–6, Advanced 7–8, Expert 9–10) shown for every characteristic, with the selected number highlighting the matching band. Band descriptions are ~4 string constants, not per-characteristic lookups.

**Why:**
- The PRD (FR-B2.2/FR-B2.4) originally called for per-characteristic behavioural band descriptions sourced from a name-keyed lookup ("static content that adapts to the characteristic name, not AI-generated"). This is unbuildable because characteristic names are free-form text (FR-A2.4) — a name-keyed lookup would miss for essentially every real user.
- AI generation is a Vision non-goal, so dynamically generating per-characteristic band descriptions is not an option.
- A fixed 4-band rubric preserves the Vision's "characteristic-anchored rating" pillar — the user still matches themselves to a description, not a bare number — while being buildable as simple constants.

**What was rejected:**
- Per-characteristic name-keyed lookup (unbuildable — free-form names can't be keyed).
- AI-generated band descriptions (Vision non-goal).
- Bare number rating (e.g., "rate yourself 1–10") — this IS the failure mode the Vision opens by criticising ("I'm a 6 out of 10 guitarist"). Rejected to preserve the characteristic-anchored rating experience.

**Implications:** FR-B2 is approved/upstream and now diverges from this decision. The PM should update the PRD to specify fixed-rubric bands. All documentation describing per-characteristic tailored band descriptions should be updated to reflect the fixed 4-band rubric.

## 2026-05-14 — SkillWheelChart placed in `src/shared/components/skill-wheel/`, not `features/progress/`

**What was decided:** The SkillWheelChart component lives at `src/shared/components/skill-wheel/SkillWheelChart.tsx`, not in the Progress feature folder as the Chart PRD (FR12.2/FR12.3) originally specified.

**Why:**
- Both the onboarding flow and the Progress tab consume the chart component.
- Feature folders may not import from each other — a hard architectural constraint.
- Placing the chart in `src/shared/components/` makes it a shared UI primitive, available to any consumer without violating the feature-folder import rule.
- The shared placement still satisfies the original intent: a single, props-driven component used by onboarding confirmation, Progress tab, and cycle review — no duplicate implementations.

**What was rejected:** Colocating the chart in `features/progress/` — this would force onboarding (which may have its own feature folder or live elsewhere) to import from the Progress feature folder, violating the architecture constraint.

**Implications:** The Chart PRD (FR12.2/FR12.3) should be updated to reflect the actual `src/shared/components/skill-wheel/` placement. All wiki pages referencing `features/progress/` as the chart's location should be updated.

---

## 2026-05-14 — AsyncStorage for V1 onboarding persistence (not SQLite, not zustand/persist)

**What was decided:** The onboarding baseline is persisted via AsyncStorage with a single JSON snapshot + `onboardingComplete` boolean flag. No zustand/persist middleware. No SQLite. The write is atomic-ish: the baseline snapshot is written first, then the flag is set — both at Stage 7 (Completion).

**Why:**
- AsyncStorage is already available in the Expo managed workflow with zero additional native dependencies.
- A single JSON snapshot is sufficient for the V1 one-time onboarding flow — there is no re-baselining, no history, no incremental updates.
- The `onboardingComplete` flag acts as a cheap gate: the app reads one boolean to decide whether to show onboarding or skip it. No need to deserialize the full baseline on cold start.
- Avoiding zustand/persist middleware keeps the persistence layer explicit and auditable — the store calls AsyncStorage directly at a known point (Stage 7) rather than relying on automatic serialization middleware.
- SQLite is overkill for V1: the data shape is a single snapshot, not a relational model with queryable history.

**What was rejected:**
- SQLite — unnecessary for a single-snapshot V1 baseline; adds native dependency complexity.
- zustand/persist middleware — automatic persistence would fire on every store mutation, risking partial writes mid-flow; explicit write at Stage 7 is simpler and safer.
- Writing the flag before the snapshot — if the flag write succeeds but the snapshot write fails, the app would think onboarding is complete but have no data.

**Implications:** If re-baselining or profile editing are added later, the persistence layer may need to evolve (multiple snapshots, versioning, migration). The atomic-ish write order (baseline first, flag second) means a crash between the two writes leaves a saved baseline but no flag — the app should handle this by checking for orphaned baseline data on startup.

---

## 2026-05-14 — Onboarding is a single Expo Router route (`app/onboarding.tsx`), not seven routes

**What was decided:** The full 7-stage onboarding flow lives behind a single Expo Router route at `app/onboarding.tsx`. Stage navigation is driven by a Zustand store stage machine (currentStep), not by Expo Router route transitions. There is one route, not seven.

**Why:**
- The onboarding stages are a linear, gated sequence — the user cannot jump directly to Stage 4 without passing through Stages 1–3. Expo Router routes are URL-addressable by default, which would allow deep-linking into mid-flow stages.
- A single route with a store-driven stage machine keeps the stage sequence authoritative and unskippable (except for the explicit skip at Stage 1).
- Seven routes would mean seven screen components, seven URL paths, and risk of users bookmarking or deep-linking into mid-flow stages — all complexity with no benefit.
- The store stage machine is simpler to test: advance the stage in the store, assert the rendered screen. No navigation mocking needed.

**What was rejected:** One Expo Router route per stage (7 routes) — unnecessary route proliferation, deep-link risk, harder to enforce stage gating.

**Implications:** The route file at `app/onboarding.tsx` composes the onboarding feature component, which reads `currentStep` from the store and renders the appropriate stage screen. The feature spec's Architecture Placement table should be updated from `src/app/(tabs)/progress/onboarding.tsx` to `app/onboarding.tsx`.

---

## 2026-05-14 (REVERSAL) — Fixed 4-band rubric replaced with "visualize your 10" self-rating prompts; 0–10 scale adopted

**What was decided:** The 2026-05-14 decision (above) to use a fixed 4-band rubric (Beginner/Intermediate/Advanced/Expert) for self-rating has been reversed. After reviewing Benny Greb's *Effective Practicing for Musicians* — the book the entire Skill Wheel arc rebuilds — the book contains **NO behavioural bands at all**. Its rating mechanism is: the user visualizes what a 10 means for their characteristic, guided by four generic, characteristic-agnostic prompts, then rates by gut in ~10 seconds. The four prompts are:

1. What would you be able to do at a 10?
2. What elements are included?
3. Why aren't you already at 10?
4. What's the max?

The self-rating stage now anchors to the user's self-built "visualize your 10" via these four fixed prompts — **not** any pre-authored bands. Additionally, the rating scale is standardized to **0–10** (was 1–10 in PRD/Vision) to match both the book and the chart axes, and so the midpoint-avoidance nudge (5 = indecision) sits at the true arithmetic centre of the scale.

**Why:**
- The fixed 4-band rubric was an invention that drifted from the source material. Greb's book uses NO behavioural bands — the rating mechanism is entirely user-driven: visualize what a 10 means, then rate by gut.
- The Vision doc (§3) captured this correctly; the PRD (FR-B2) is where it drifted into an invented rubric.
- The four prompts are characteristic-agnostic and buildable as static copy constants in the feature layer — no per-characteristic content needed, no domain module for rating bands.
- Standardizing on 0–10 matches both the book and the chart axes (which already use 0–10). The midpoint-avoidance nudge at 5 now sits at the true arithmetic centre, strengthening the nudge.

**What was rejected:**
- The fixed 4-band rubric (Beginner 1–3, Intermediate 4–6, Advanced 7–8, Expert 9–10) — invented, not in the source material.
- The 1–10 rating scale — mismatched with the book (0–10) and the chart axes.
- The `ratingBands.ts` domain module (RATING_BANDS/bandForScore) — deleted; the prompts are feature-layer static copy, not domain logic.

**Implications:**
- The `ratingBands.ts` domain module (RATING_BANDS/bandForScore) is deleted. The four "visualize your 10" prompts move to a feature-layer static-copy constant.
- FR-B2, AC11/AC12, FR-A5 data model, and Vision §3 are PM action items for upstream PRD updates.
- All wiki pages referencing the fixed 4-band rubric or the 1–10 scale should be updated to reflect the "visualize your 10" prompts and the 0–10 scale.
- The midpoint-avoidance nudge (Rule 1) at score 5 is now at the true arithmetic centre of the 0–10 scale, reinforcing its rationale.

---

## 2026-05-14 — Test harness: jest-expo preset, nanoid ESM transform, react-test-renderer@19.0.0 pin

**What was decided:** The test harness uses `jest-expo` preset with a `transformIgnorePatterns` exception for `nanoid` (which ships ESM). `react-test-renderer` is pinned to `19.0.0` to match React 19. Tests run via `"test": "jest"` in `package.json` scripts.

**Why:**
- `jest-expo` provides the canonical Jest preset for Expo projects, handling all the standard React Native transforms out of the box.
- `nanoid` ships as ESM, but Jest (running in Node) needs ESM modules to be transformed to CJS. The default `jest-expo` `transformIgnorePatterns` excludes all `node_modules`, so `nanoid` must be exempted explicitly. Without this, any test importing `nanoid` fails with an ESM syntax error. This is a known jest-expo footgun.
- `react-test-renderer` must match the React version or `useSyncExternalStore` breaks (React 18 vs 19 internal API difference). Expo SDK 53 uses React 19, so `react-test-renderer` is pinned to `19.0.0`.
- Putting the Jest config in `package.json` (rather than a separate `jest.config.js`) keeps configuration centralized and avoids an extra file for a simple preset + one transform exception.

**What was rejected:**
- A separate `jest.config.js` file — unnecessary for the current config complexity; `package.json` is sufficient.
- Not adding `transformIgnorePatterns` — would make `nanoid` (and any future ESM-only dependency) untestable.
- Using a different test framework (Vitest, Mocha) — Jest is the standard for React Native / Expo projects, and `jest-expo` eliminates the need for manual transform configuration.

**Implications:** Any future dependency that ships ESM (rather than CJS) must be added to `transformIgnorePatterns`. The `react-test-renderer` version must stay in lockstep with the React version used by Expo — upgrading Expo SDK may require bumping the pin.


---

## 2026-05-14 — Theme module: flat token objects, no theming framework

**What was decided:** The theme module (`src/shared/lib/theme.ts`) exports named `as const` objects (`colors`, `fontSize`, `space`, `radius`) with concrete literal values (hex strings, numbers), not CSS variable references. It is explicitly NOT a theming framework — no light mode, no context provider, no `ThemeContext`. The `--shadow-glow` CSS box-shadow token is intentionally excluded because it doesn't port to React Native; chart press feedback uses fill-opacity instead.

**Why:**
- Concrete literal values work everywhere in React Native — `StyleSheet.create`, inline styles, SVG props — without requiring CSS-variable resolution at runtime.
- Named exports (`import { colors } from …`) are simpler than a single `theme` object with nested access (`theme.colors.…`).
- Avoiding a theming framework (no light mode, no provider) keeps the module dead-simple: one file, one import, zero runtime cost.
- `--shadow-glow` is a CSS box-shadow string; RN's shadow system is incompatible. Translating it would produce a poor approximation. The chart uses fill-opacity bump on press instead, which is a cleaner RN-native approach.

**What was rejected:**
- Exporting CSS variable references (e.g., `'var(--color-color-accent-primary)'`) — RN doesn't resolve CSS vars in `StyleSheet.create`.
- A `ThemeContext` / provider pattern — unnecessary indirection for a single-theme app.
- Attempting to translate `--shadow-glow` to RN shadow props.

**Implications:** The values are hand-transcribed from `docs/designs/design-system.html:16-63`. If the design mockup changes, the theme module must be updated manually. A comment in the module links back to the source line range for traceability.

---

## 2026-05-14 — Shared domain types placed in `domain/onboarding/`, not a feature folder

**What was decided:** The shared domain types `Characteristic`, `ThreeLists`, and `Baseline` live at `src/domain/onboarding/types.ts` — in the domain layer, not in any feature folder.

**Why:**
- `Characteristic` is consumed by the onboarding store, the SkillWheelChart component (`src/shared/components`), and future Progress/Cycle-Review features. None of these may import from another feature folder.
- `ThreeLists` and `Baseline` are consumed by the onboarding feature (store + stage screens) and the persistence layer.
- Placing them in `domain/` makes them available to all consumers without violating the feature-folder import constraint.
- The module is zero-dependency (no React, no RN, no AsyncStorage) — pure TypeScript interfaces only, consistent with the domain layer constraint.

**What was rejected:** Placing the types in a feature folder (e.g., `features/onboarding/`) — this would force other consumers (chart, Progress, Cycle-Review) to import from a feature folder, violating the architecture constraint.

**Implications:**
- `Characteristic.score` is optional (undefined during Stage 3 of onboarding) but required-in-practice on a persisted `Baseline` (Stage 5 gates on all-rated). No separate `RatedCharacteristic` type — not worth the ceremony.
- `ThreeLists.why` is keyed by name, not id — matches Three Lists FR5 verbatim and the documented duplicate-name edge case.
- `Baseline.userId` is `"local"` — no auth exists yet; field present so future multi-user doesn't require migration.
- `Baseline.version` is `1` — explicit schema version for forward migration, even though V1 has no migration path.