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