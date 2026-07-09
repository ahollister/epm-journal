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
