# Test Harness & Dependency Setup

The project now has a runnable test harness with Jest + jest-expo, plus the V1 dependency set (zustand, AsyncStorage, nanoid). Several configuration choices are worth documenting because they address known footguns in the Expo/React Native ecosystem.

## Dependencies Added

| Package | Install method | Purpose |
|---------|---------------|---------|
| `zustand` | `pnpm add` | Onboarding store (pure JS, no native deps) |
| `@react-native-async-storage/async-storage` | `npx expo install` | Baseline persistence (Expo-managed native dep) |
| `nanoid` | `pnpm add` | Characteristic IDs |
| `jest-expo` | `npx expo install -- --save-dev` | Jest preset for Expo |
| `jest` | `pnpm add -D` | Test runner |
| `@testing-library/react-native` | `pnpm add -D` | Component testing utilities |
| `react-test-renderer` | `pnpm add -D` | Snapshot rendering (pinned to 19.0.0) |
| `@types/jest` | `pnpm add -D` | Jest type definitions |

**Install pattern:** Expo-managed native dependencies use `npx expo install` (which resolves the correct version for the current Expo SDK). Pure JS dependencies use `pnpm add` / `pnpm add -D`.

## `nanoid/non-secure` Entry Point

The project uses the `nanoid/non-secure` entry point rather than the default `nanoid`:

```ts
import { nanoid } from "nanoid/non-secure";
```

**Why:** React Native's Hermes runtime does not provide `crypto.getRandomValues`, which the default `nanoid` entry point requires. The `nanoid/non-secure` variant uses `Math.random()` instead, which is available in all JS environments including Hermes.

This is acceptable because characteristic IDs are not security-sensitive — they only need to be unique within a user's local dataset, not globally collision-resistant. `Math.random()`-based IDs are sufficient for this use case.

## Jest Configuration

### Preset and transformIgnorePatterns

The Jest config lives in `package.json`:

```json
{
  "scripts": {
    "test": "jest"
  },
  "jest": {
    "preset": "jest-expo",
    "transformIgnorePatterns": [
      "node_modules/(?!(nanoid)/)"
    ]
  }
}
```

**Why `transformIgnorePatterns` for nanoid:** `jest-expo`'s default `transformIgnorePatterns` excludes all `node_modules` from Babel transformation. But `nanoid` ships as ESM, and Jest (running in Node) needs ESM modules to be transformed to CJS. Without the exception, importing `nanoid` in a test file fails with a syntax error on the `export` keyword.

This is a known jest-expo footgun: any dependency that ships ESM (not CJS) must be added to the exemption list. For V1, only `nanoid` needs this. If future dependencies also ship ESM, they'll need the same treatment.

### `react-test-renderer` pinned to 19.0.0

`react-test-renderer` is pinned to `19.0.0` to match the React 19 version used by Expo SDK 53. A mismatch between `react-test-renderer` and `react` causes `useSyncExternalStore` errors in component tests (React 18 vs 19 internal API difference).

## What's NOT in V1

- **SQLite / Drizzle / ORM** — the V1 persistence layer is a single JSON snapshot + boolean flag via AsyncStorage. No relational storage, no migration framework. This aligns with the [2026-05-14 persistence decision](../decisions.md).
- **zustand/persist middleware** — persistence is handled by explicit AsyncStorage calls at known points (e.g., Stage 7 of onboarding), not by automatic middleware serialization.

## Architecture Placement

| Artifact | Location |
|----------|----------|
| Jest config | `package.json` (`"jest"` block) |
| Test files | Colocated with source (`*.test.ts` / `*.test.tsx`) |
| nanoid import | Feature stores and domain modules that need characteristic IDs |

## Related Pages

- [Architecture](../architecture.md) — layers, constraints
- [Decisions](../decisions.md) — async storage persistence decision (2026-05-14)
- [Skill Wheel Chart Implementation](./skill-wheel-chart-implementation.md) — another implementation discovery (no babel.config.js, no Reanimated)
- [Design Tokens & Theme Module](./design-tokens-theme-module.md) — another implementation discovery
