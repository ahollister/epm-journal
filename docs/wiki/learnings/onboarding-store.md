# Onboarding Store

The onboarding Zustand store at `src/features/onboarding/store.ts` is the single source of truth for all onboarding state across all seven stages. It bridges the pure domain layer (types, stages, guards) to the UI, and is the sole orchestrator of stage transitions, data mutations, and persistence.

## Store Shape

```ts
interface OnboardingState {
  stage: Stage;                        // current stage index (from domain/stages)
  subStep: number;                     // intra-stage cursor (which list / which characteristic)
  threeLists: ThreeLists;              // { who:[], why:{}, improvements:[] }
  characteristics: Characteristic[];   // name, order, score; ids via newId()
  focusAreas: string[];                // 0–2 characteristic ids
  // transitions
  next(): void;
  back(): void;
  goToCharacteristicRating(id: string): void;
  // data mutations
  addCharacteristic(name: string): void;
  rateCharacteristic(id: string, score: number): void;
  setFocusAreas(ids: string[]): void;
  // lifecycle
  complete(): Promise<void>;
  reset(): void;
}
```

## Key Design Decisions

### No `persist` middleware — all state is in-memory

The store uses **no `zustand/persist` middleware**. All state lives in memory. If the app is killed mid-flow, progress is lost and the user restarts at Stage 1. This is the explicit PRD choice (Orchestration FR4.2).

Persistence happens at exactly one point: `complete()` at Stage 7. There is no mid-flow autosave, no partial snapshot. This avoids the risk of persisting an incomplete baseline.

### `subStep` — single intra-stage cursor

`subStep` is the single cursor for intra-stage navigation. It tracks position within multi-screen stages:

- **Stage 2 (Three Lists):** which list the user is on (0 = Who, 1 = Why, 2 = Improvements)
- **Stage 4 (Rating):** which characteristic the user is rating (index into `characteristics[]`)

`subStep` resets to `0` on every **stage-boundary** `next()` / `back()` call. This means entering or re-entering a stage always starts from the beginning of that stage's sequence.

### Ratings live on `Characteristic.score`

Ratings are stored directly on the `Characteristic` object's `score` field — not in a separate map or lookup table. Implications:

- **Rename** a characteristic → rating is preserved (matched by stable `id`)
- **Remove** a characteristic → rating is dropped (falls out with the removed object)
- **Re-order** characteristics → ratings follow their characteristic (matched by `id`)

No separate cleanup or synchronization is needed.

### `complete()` — the single persistence point

`complete()` is the **only** write to durable storage. It:

1. Assembles a `Baseline` from the current in-memory state (`characteristics`, `focusAreas`)
2. Calls `baselineRepository.completeOnboarding(baseline)`
3. On **success**: advances stage to `complete`
4. On **failure**: stays on the current stage and surfaces the error — does NOT advance to `complete` with unsaved data

This means the user sees an error on failure and can retry, rather than silently losing their baseline.

### `back()` at `intro` — `shouldDismiss` flag for container

When `back()` is called at the `intro` stage (Stage 1), the store sets a `shouldDismiss` boolean flag on the state. The container (the `onboarding.tsx` route component) reads this flag to dismiss the onboarding screen. The store itself does not own the navigation/dismissal — it delegates to the container. Calling `reset()` clears `shouldDismiss` along with all other state.

### Stage 5 wedge-tap: `goToCharacteristicRating(id)`

From the confirmation stage (Stage 5), tapping a wedge on the rose chart calls `goToCharacteristicRating(id)`, which:

1. Sets `stage` to `rating` (Stage 4)
2. Sets `subStep` to the index of the characteristic with the given `id`

The user then walks **forward** through the remaining characteristics (via `next()`), eventually returning to `confirm`. This is a wedge-in from Stage 5 → Stage 4, not a full back-navigation.

### Rating guard: advance one characteristic at a time

The rating guard in `canAdvance` allows advancing from one characteristic to the next (one at a time), even if later characteristics are unrated. However, advancing **past** the rating stage (i.e., to `confirm`) is gated: **all** characteristics must have a score before `canAdvance('rating', state)` returns `true` for the final advance. This allows the wedge-tap flow (user rates one characteristic at a time and eventually reaches confirm) while preventing confirmation with unscored characteristics.

## Store Tests

The store has unit tests covering:

- Add / rename / remove characteristics while preserving ratings (matched by `id`)
- `next()` gated when stage conditions are unmet (via domain guards)
- `complete()` calls `baselineRepository.completeOnboarding()` and handles success/failure — including retry on failure, and gating on fully-scored characteristics
- `reset()` wipes all state clean, including `shouldDismiss`
- `back()` at `intro` sets `shouldDismiss` flag; container handles dismissal
- Rating, focus area selection, and wedge-tap navigation (`goToCharacteristicRating`)
- Invalid-rating edge cases (scores outside 0–10 range, unrated characteristics blocking completion)

Tests use a real Zustand store instance (no mock store), calling actions and asserting state — consistent with the project's mock-free domain-testing discipline.

## Architecture Placement

| Artifact | Location |
|----------|----------|
| Store | `src/features/onboarding/store.ts` (colocated with onboarding feature) |
| Store tests | `src/features/onboarding/store.test.ts` |
| Consumed domain | `src/domain/onboarding/types.ts`, `stages.ts`, `guards.ts` |
| Consumed persistence | `src/features/onboarding/data/baselineRepository.ts` |
| Consumed ID util | `src/shared/lib/id.ts` (`newId()` for characteristic IDs) |

## Related Pages

- [Architecture](../architecture.md) — implementation status, feature-folder layout
- [Decisions](../decisions.md) — AsyncStorage persistence decision (2026-05-14)
- [Persistence Layer](./persistence-layer.md) — two-layer design (storage.ts + baselineRepository)
- [Skill Wheel + Onboarding](../features/skill-wheel-onboarding.md) — full feature spec and stage flow
- [Glossary](../glossary.md) — Characteristic, ThreeLists, Baseline, OnboardingState, baselineRepository

### Reorder / Rename / Remove characteristics (Stage 3 Part B)

The store exposes three mutation actions used by the CharacteristicReview screen:

**`reorderCharacteristics(fromIndex: number, toIndex: number)`** — Moves a characteristic from one position to another in the array. After the move, rewrites every characteristic's `order` field to be sequential (1-indexed, no gaps) based on the new array position. This order is consumed downstream as the coxcomb axis order and the tiebreaker for `rankCharacteristics` in Stage 6. The `id` and `score` are preserved across reorder.

**`renameCharacteristic(id: string, newName: string)`** — Updates the `name` field of the characteristic with the given `id`. The `id` is stable (nanoid), so any existing rating (`score`) survives rename. This is called from the inline text edit mode on the CharacteristicReview screen.

**`removeCharacteristic(id: string)`** — Removes the characteristic with the given `id` from the array entirely, along with any rating. After removal, rewrites `order` values on the remaining characteristics to keep them sequential. If the user later goes back to CharacteristicDefinition and re-adds a characteristic with the same name, it gets a new `id` and no previous rating — the removal is permanent.

These three actions operate on the in-memory `characteristics[]` array. They do not persist to AsyncStorage — persistence only happens at `complete()` (Stage 7).

### Stage 4 sequential rating: `next()` and `back()` behavior

During Stage 4 (rating), `next()` increments `subStep` to move to the next characteristic. If the current characteristic is the last one, `next()` advances the stage to `confirm` (Stage 5) — gated by `canAdvance('rating', ...)`, which requires **all** characteristics to have a score.

`back()` during Stage 4 decrements `subStep` to return to the previous characteristic. If the current characteristic is the first one (index 0), `back()` returns to Stage 3 Part B (CharacteristicReview) — this allows the user to review and potentially reorder/rename/remove characteristics before proceeding with rating.

This means the user can walk backward through the rating flow all the way to the characteristic review screen, make edits, then walk forward again through any remaining unrated (or already-rated) characteristics.

### `rateCharacteristic(id, score)` — ID-based, not index-based

The `rateCharacteristic` action matches by `id`, not by array index. This ensures that reordering or renaming characteristics in Stage 3 doesn't break ratings — the `id` is a stable nanoid that survives all Stage 3 mutations. When the user returns from Stage 3 review back to Stage 4 rating, previously-rated characteristics still show their scores because they're matched by `id`.
