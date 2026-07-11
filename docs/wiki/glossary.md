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