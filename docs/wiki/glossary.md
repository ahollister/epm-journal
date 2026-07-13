# Glossary

Project-specific terminology and definitions. When something is referred to by a name that wouldn't be obvious to a newcomer, it belongs here.

- **Feature folder** — A directory under `features/<name>/` that owns a self-contained slice of UI and its colocated Zustand store. Feature folders depend on `domain/` but not on other feature folders.
- **Domain layer (`domain/`)** — Pure business-logic functions with zero external dependencies (no React, no React Native). Contains rules engines, validators, calculators, and state machines. Testable with plain Jest.
- **Zustand store** — A lightweight state management primitive (from the Zustand library). Each feature folder has its own colocated store that bridges the pure `domain/` functions to React components.
- **EPM** — (presumed) The core domain this project models. EPM rules include session state machines, SMART goal validation, skill wheel calculations, and recording policy.
- **SMART goal** — A structured goal format (Specific, Measurable, Achievable, Relevant, Time-bound). Validation logic lives in `domain/`.
- **Skill wheel** — A scoring or aggregation mechanism for skills. Calculation logic lives in `domain/`.

- **Gap Click** — A metronome exercise mode where clicks are intentionally silenced for a configurable number of beats, forcing the musician to internalize the pulse. The mute/resume schedule is computed by a pure domain function; audio playback is handled by the native metronome engine.
- **Metronome engine** — The platform-native module responsible for low-latency audio. Uses AVAudioEngine on iOS, Oboe/AAudio on Android. Receives a simple instruction list (which beats to play) from the domain layer; does not contain scheduling policy.
- **AVAudioEngine** — Apple's low-latency audio framework for iOS/macOS. Used as the iOS backend for the metronome engine.
- **Oboe/AAudio** — Google's low-latency audio libraries for Android. Oboe is a C++ wrapper that can use AAudio (API 27+) or fall back to OpenSL ES. Used as the Android backend for the metronome engine.
- **Foreground service** — An Android service that runs with a persistent notification, allowing the app to continue audio playback when backgrounded. Used to keep the metronome audible during practice sessions with the screen off or another app in the foreground.

- **EPM Journal** — The application name. A mobile-first, offline-first practice journal for musicians, built with Expo/React Native.
- **Expo Router** — Expo's file-based routing framework. Route files under `src/app/` map filesystem paths to screen components. Route files are kept thin — they re-export feature components rather than owning UI logic.
- **Practice tab** — The session runner tab. Hosts the active practice session UI (metronome, recording, timer).
- **Journal tab** — The practice journal tab. Browsing past sessions, recordings, and notes.
- **Progress tab** — The progress tracking tab. Skill wheel visualization, SMART goals, and cycle review.

- **3 Lists exercise** — From Benny Greb's *Effective Practice Method* book: three foundational questions every musician answers — **Who am I?** (musical identity and current abilities), **Why am I practicing?** (motivations and goals), and **What improvements am I targeting?** (specific growth areas). These three lists structurally map to the Skill Wheel Onboarding's self-assessment baseline, goal suggestion, and characteristic extraction respectively.
- **Car tire metaphor** — Benny Greb's analogy for the skill wheel: musicianship is like a car tire — if one slice is underinflated (a weak dimension), the whole tire (the musician) can't perform smoothly. Directly informs the weakest-slice focus strategy in onboarding Stage 4 and the radar chart visualization.
- **Peeling the onion** — Benny Greb's term for characteristic-anchored self-assessment: instead of rating an abstract skill, the musician peels through layers of increasingly specific behavioral descriptions until they find the one that matches. This is the model behind the characteristic bands in the onboarding dimension screens.

- **Independent categorical rating** — A chart model where each dimension is assessed on its own scale and displayed independently (e.g., stacked horizontal bars). Contrasts with a **relational profile** model (e.g., radar/spider chart) where the visual encoding implies interplay between dimensions. The Skill Wheel uses independent categorical ratings because each characteristic is scored separately on a 1–10 band with no computed relationship between them.


**Correction (2025-07-18):** The "Independent categorical rating" entry above was written to support the stacked-horizontal-bar model, which has been reversed. The Skill Wheel uses a **radar/spider chart** — see the reversal entry in [Decisions](./decisions.md). The radar chart's concentric rings (mapped to the 1–10 band color zones: red 1–3, amber 4–6, lime 7–8, green 9–10) and polygon overlay remain the authoritative visual encoding.

**Update (2026-05-13):** The "Independent categorical rating" entry above and its correction (which supported stacked bars then restored the radar chart) are both superseded. The authoritative Skill Wheel visualization is a **polar bar / rose chart**: 6 equal 60° wedges, radial distance = score (1–10, max radius 140), 4° gaps between wedges, no connecting polygon. Each wedge reads independently — no implied correlation between characteristics. 5 concentric reference rings at r=14, 42, 84, 112, 140 map to scale bands 1, 3, 6, 8, 10. See the [2026-05-13 decision](./decisions.md).

- **Polar bar / rose chart** — The Skill Wheel visualization geometry: 6 equal 60° wedges around a center point (180, 180), each wedge's radial distance from center represents that characteristic's 1–10 score (max radius 140 = score 10). Wedges are separated by 4° gaps so each reads independently; there is no connecting polygon between wedges. 5 concentric reference rings at r=14, 42, 84, 112, 140 correspond to scale bands 1, 3, 6, 8, 10. Used in onboarding confirmation, Progress tab, and cycle review — only the date stamp and CTA label vary between placements.