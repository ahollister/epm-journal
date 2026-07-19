# Persistence Layer

The onboarding persistence layer is a two-layer design: a thin typed AsyncStorage wrapper plus a domain-shaped repository API. This keeps AsyncStorage out of feature code and out of tests, and gives the rest of the app a meaningful API rather than raw key-value access.

## Layer 1: `src/shared/lib/storage.ts`

A thin typed wrapper over `@react-native-async-storage/async-storage`:

```ts
getJson<T>(key: string): Promise<T | null>
setJson<T>(key: string, value: T): Promise<void>
remove(key: string): Promise<void>
```

**Design choices:**
- **JSON parse errors are swallowed** — logged as warnings, return `null`. The app should never encounter malformed JSON under normal operation (the wrapper is the only writer), but this prevents a corrupted store from crashing the app on launch.
- **Generic `T`** — callers specify the expected shape. No runtime validation; the repository layer owns that responsibility.
- **Single import point** — only `storage.ts` imports `@react-native-async-storage/async-storage`. Feature code and tests import the wrapper (mockable), not the native module.

## Layer 2: `src/features/onboarding/data/baselineRepository.ts`

A domain-shaped API that the rest of the app calls. Uses versioned, namespaced keys:

```ts
const KEYS = {
  baseline: 'epm.baseline.v1',
  onboardingComplete: 'epm.onboardingComplete.v1',
} as const;
```

### Key naming convention

`epm.{domain}.v{version}` — namespaced under `epm.` so future schema bumps or a SQLite migration can coexist without key collisions. The explicit `v1` means a future `v2` schema can live alongside `v1` during migration.

### API

| Method | Behavior |
|--------|----------|
| `completeOnboarding(baseline)` | Writes baseline JSON, THEN sets `onboardingComplete` flag to `true` |
| `getBaseline()` | Reads and parses the baseline JSON; returns `null` if missing or corrupt |
| `isOnboardingComplete()` | Returns `true` only if BOTH the flag is `true` AND `getBaseline()` returns a non-null value |
| `clear()` | Removes both keys — dev/test only |

### Atomic-ish write pattern

AsyncStorage has no multi-key transaction. The write order is:

1. Write baseline JSON (`setJson` for `epm.baseline.v1`)
2. Write flag (`setJson` for `epm.onboardingComplete.v1`, value `true`)

The read side (`isOnboardingComplete`) is **defensive**: it checks both the flag AND that `getBaseline()` returns non-null. A crash between step 1 and step 2 leaves a saved baseline but no flag — which `isOnboardingComplete` treats as NOT complete. The user restarts onboarding, which overwrites the orphaned baseline. This degrades gracefully to "restart" rather than producing a corrupt half-state where the app thinks onboarding is done but has no data.

The reverse order (flag first, then baseline) was explicitly rejected: a crash after the flag write but before the baseline write would make the app believe onboarding is complete with no baseline data — unrecoverable without a `clear()`.

### No partial persistence mid-flow

The onboarding store holds everything in memory until Stage 7 (Completion). It uses **no `zustand/persist` middleware**. Persistence is a single explicit call at the end of the flow, not an automatic serialization on every mutation. This avoids the risk of partial writes mid-flow if the app is killed.

### Mockability

Because `baselineRepository` imports `storage.ts` (not AsyncStorage directly), and `storage.ts` is a thin wrapper, tests can mock `storage.ts` at the module level. The repository's logic (write order, defensive completion check) can be tested without touching AsyncStorage.

## Why AsyncStorage, not SQLite

The baseline is a single JSON snapshot + boolean flag, written once, read on app launch — textbook key-value shape. SQLite would add native dependency complexity for no benefit at this data scale.

If the broader app's practice journal later needs SQLite for queryable session history, the `Baseline.version` field and the repository abstraction make the swap a module change — consumers call `baselineRepository.getBaseline()`, not AsyncStorage directly.

## Architecture Placement

| Artifact | Location | Layer |
|----------|----------|-------|
| AsyncStorage wrapper | `src/shared/lib/storage.ts` | Shared infrastructure — mockable by all consumers |
| baselineRepository | `src/features/onboarding/data/baselineRepository.ts` | Feature data layer — imports `storage.ts`, consumed by onboarding store |
| Onboarding store | (colocated with onboarding feature) | Holds in-memory state; calls `baselineRepository.completeOnboarding()` at Stage 7 |

## Related Pages

- [Architecture](../architecture.md) — implementation status table
- [Decisions](../decisions.md) — 2026-05-14 AsyncStorage persistence decision
- [Glossary](../glossary.md) — baselineRepository, Versioned keys, Atomic-ish write
- [Test Harness & Dependency Setup](./test-harness-setup.md) — AsyncStorage installation, mockability context
