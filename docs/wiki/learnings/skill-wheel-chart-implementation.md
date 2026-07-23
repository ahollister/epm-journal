# Skill Wheel Chart Implementation Notes

The SkillWheelChart component is implemented as a polar bar / rose chart using React Native's built-in drawing primitives. Several implementation constraints shaped the approach.

## No Reanimated — Deliberate Choice

The project has **no `babel.config.js`**, which means the `react-native-reanimated` Babel plugin is not wired. Rather than adding a babel config and the Reanimated dependency solely for chart interactions, the chart deliberately uses **plain `Pressable`** for press feedback.

### Why not add Reanimated?

- Reanimated requires a `babel.config.js` with the Reanimated plugin — this is the only feature that would need it at this stage.
- Adding a babel config changes the build pipeline for the entire project; it should be a considered decision, not a side effect of chart implementation.
- `Pressable` provides adequate feedback (opacity reduction on press) for the chart's interaction needs: tap a wedge to see its score, tap a label to navigate.
- If future iterations need smooth gesture-driven interactions (drag to rotate, pinch to zoom), Reanimated can be added then with a clear justification.

### What the chart uses instead

- `Pressable` wrapping each wedge and label for tap feedback.
- Standard React Native `Animated` API (built-in, no plugin needed) for any simple transitions.
- SVG-like drawing via `react-native-svg` (already in the dependency tree via Expo) for wedge arcs, reference rings, and labels.

## Chart Rendering Approach

The chart renders within a fixed 360×360 canvas (`Svg` viewBox) with center at (180, 180). Each wedge is an SVG `Path` element computing arc segments. Reference rings are `Circle` elements with no fill. Labels are `Text` elements positioned at each wedge's outer edge using trigonometric placement.

### Key implementation details

| Detail | Value |
|--------|-------|
| Canvas size | 360×360, center (180, 180) |
| Max wedge radius | 140 (maps to score 10) |
| Wedge angle | 60° per characteristic (6 wedges × 60° = 360°) |
| Gap between wedges | 4° |
| Drawing library | `react-native-svg` |
| Press feedback | `Pressable` with opacity reduction |
| Animation | None for V1; plain render |

## Component Location

The chart lives at `src/shared/components/skill-wheel/SkillWheelChart.tsx` — in the shared components directory, not in a feature folder. This is because both onboarding and the Progress tab consume it, and feature folders may not import from each other. See the [2026-05-14 decision](../decisions.md).

## Current Status

**Implemented.** The chart component renders wedges, rings, and labels. Press feedback works via `Pressable`. No Reanimated, no babel.config.js. Path math is extracted into a separate pure geometry module (`geometry.ts`) with 16 Jest tests — zero React/RN dependencies.

## Geometry Module Separation

The chart's SVG path math lives in a separate module at `src/shared/components/skill-wheel/geometry.ts` — pure, framework-free functions with zero React or React Native dependencies. This separation follows the same pattern as the `domain/` layer: pure functions that are testable with plain Jest without any rendering.

### Constants

| Constant | Value | Purpose |
|----------|-------|---------|
| `VIEWBOX` | 360 | SVG canvas dimension |
| `CENTER` | 180 | Center point (VIEWBOX / 2) |
| `MAX_RADIUS` | 140 | Maps to score 10 |
| `CENTER_DOT_R` | 3 | Center dot radius |
| `RING_SCORES` | `[1, 3, 6, 8, 10]` | Reference ring score thresholds |

### Functions

- **`scoreToRadius(score)`** — Maps a 0–10 score to a radius via `score / 10 * MAX_RADIUS`. Clamped to `[0, MAX_RADIUS]`. Handles out-of-range defensively.
- **`wedgePath(centerX, centerY, innerR, outerR, startAngleDeg, endAngleDeg)`** — Returns an SVG `d` string for a filled sector. First wedge starts at 12 o'clock (−90°), clockwise. Each wedge spans `360 / N` degrees.
- **`hitWedgePath(centerX, centerY, startAngleDeg, endAngleDeg)`** — Convenience wrapper: calls `wedgePath` with `innerR=0`, `outerR=MAX_RADIUS`. Used for invisible touch overlays so short wedges near the centre still meet the 44×44pt minimum tap target. This is a deliberate UX choice — a wedge with score 1 would otherwise produce an untappably small hit area.
- **`labelAnchor(centerX, centerY, radius, midAngleDeg)`** — Returns `{x, y, textAnchor}` for positioning a perimeter label just outside the ring at the wedge's angular midpoint. `textAnchor` is derived from the angle so labels don't overrun the viewport.

### Why separate geometry from rendering?

- **Testability.** All 16 tests run as pure Jest with zero rendering — no `react-native-svg`, no component mounting. Known-angle snapshots for N=4 (90° wedges) provide deterministic coverage.
- **No framework coupling.** The geometry functions know nothing about React, React Native, or SVG libraries. They produce plain strings and numbers. The chart component (`SkillWheelChart.tsx`) consumes them.
- **Shared by all chart placements.** Onboarding confirmation, Progress tab, and cycle review all use the same geometry — extracting it prevents accidental drift between placements.
- **Domain-like pattern.** Though the module lives in `src/shared/components/skill-wheel/` (not `domain/`) because it's chart-specific path math rather than business-logic domain rules, it follows the same zero-dependency discipline.

## Related Pages

- [Architecture](../architecture.md) — shared components placement
- [Decisions](../decisions.md) — chart placement decision (2026-05-14), rose chart decision (2026-05-13)
- [Skill Wheel + Onboarding](../features/skill-wheel-onboarding.md) — visual specification
- [Design Tokens & Theme Module](./design-tokens-theme-module.md) — theme consumption


## Palette Module (`palette.ts`)

The chart's colour assignment is extracted into a separate module at `src/shared/components/skill-wheel/palette.ts`. It exports a single function `colourForIndex(i)` that returns a deterministic colour by array index, cycling mod 6. Colours are computed at render time — they are not stored with characteristic data.

### Why separate palette from rendering?

- **Deterministic and testable.** Given index 3, always returns the same colour. No randomness, no theme dependency.
- **No framework coupling.** The function is pure — it takes a number, returns a colour string. Zero React/RN deps.
- **Shared by all chart placements.** Onboarding confirmation, Progress tab, and cycle review all use the same palette — extracting it prevents accidental colour drift between placements.

## Defensive Rendering Patterns

The chart component handles several edge cases defensively to avoid crashes and provide graceful degradation:

### React.memo + useMemo

The component is wrapped in `React.memo` to prevent re-renders when parent state changes but chart props haven't. All geometry computation (wedge paths, label anchors) is inside `useMemo` keyed on `characteristics`, so expensive SVG path math only runs when the data actually changes.

### Empty array

When `characteristics` is an empty array `[]`, the chart renders an empty-state placeholder instead of crashing. No wedges, no labels — just the reference rings and a message.

### Missing scores (undefined/null)

A characteristic with `score: undefined` or `score: null` renders as a full muted sector (using `bgOverlay` colour at low opacity) with a "—" label. The wedge is visually present (the user knows the characteristic exists) but clearly unscored.

### N > 12

If more than 12 characteristics are passed, the chart logs a `console.warn` but still renders. Each wedge angle shrinks proportionally (`360 / N` degrees), so the chart remains functional but may become visually crowded. The warning is a signal to the parent to reconsider its data.

### Score clamping

Scores outside the 0–10 range are clamped by `scoreToRadius` — a score of -3 maps to radius 0, a score of 15 maps to `MAX_RADIUS` (140). The chart never draws a wedge beyond the outer reference ring, and never draws a negative (inward) wedge. This is defensive: the domain layer should enforce 0–10, but the rendering layer doesn't trust it.

### Centre dot

A small `<Circle r=3>` at the exact centre (180, 180) in `textMuted` colour provides a visual anchor. Without it, wedges with very low scores (near-zero radius) leave the centre looking hollow. The dot is always present regardless of data.

## Weakest-Area Card Sub-Component

The chart component includes an integrated weakest-area card, rendered below the SVG when `showWeakest={true}` (Chart FR10.6). It is NOT a separate component — it's part of `SkillWheelChart.tsx`'s render output. The parent controls visibility via the `showWeakest` prop.

### Weakest determination

The chart does NOT compute which characteristic is weakest. The parent (store/screen) determines the weakest and passes it as `highlightIds[0]`. The card reads `characteristics.find(c => c.id === highlightIds[0])` to get the name and score. The colour comes from `colourForIndex(index)` where `index` is the characteristic's position in the array — this keeps colour assignment deterministic and consistent with the wedge colours in the chart above it.

### Layout (token-based)

- **Container**: `accentSoft` bg, `borderSubtle` border, `radius.md` (12px), `space.base` (16px) padding.
- **Header**: "WEAKEST AREA" section label — 11px/600, `textMuted`, letter-spacing 0.1em, hairline rule extending right.
- **Body row**: 10px colour dot (weakest characteristic's colour), name in `textPrimary` 20px/600, "X / 10" in `textMuted` 13px.
- **CTA**: "Focus next session" button — capsule shape, gradient fill (`accentPrimary → accentHover`), `accentOn` text, uppercase, min-height 44px, `radius.full`. Fires `onFocusCtaPress` prop.

### Gradient button via react-native-svg

RN has no CSS gradient support. The CTA button uses `react-native-svg`'s `<LinearGradient>` (already installed for the chart) for the button fill — no additional gradient library was added. This is a pragmatic reuse of an existing dependency rather than introducing a new one (e.g., `expo-linear-gradient` or `react-native-linear-gradient`).

### Defensive fallback

When `showWeakest` is `true` but `highlightIds` is empty or `undefined`, the card renders a "No data yet" placeholder instead of crashing. This prevents a blank or broken card when the parent hasn't yet computed the weakest characteristic.

## Interactive Mode (`interactive` prop)

The chart supports two modes gated by a boolean `interactive` prop:

- **Interactive** (`interactive={true}`): each wedge is tappable via a full-radius `hitWedgePath` overlay, and press feedback is active. Used by onboarding Stage 5 (confirmation) — tapping a wedge calls `onWedgeTap(characteristic.id)` to navigate back to Stage 4 pre-scrolled to that characteristic's rating screen.
- **Static** (`interactive={false}`, default): wedges are display-only — no touch overlays, no handlers, no press feedback. Used by onboarding Stage 1 (example wheel) and the Progress tab.

### Hit targets (FR8.3): `hitWedgePath` overlays

Short wedges near the centre (low scores) are too narrow to tap reliably. Each interactive wedge renders an invisible full-radius overlay behind its visual wedge:

- **Visual wedge**: `wedgePath(centerX, centerY, 0, scoreToRadius(score), startAngle, endAngle)` — shows the actual score.
- **Hit overlay**: `hitWedgePath(centerX, centerY, startAngle, endAngle)` — identical sector shape but at `MAX_RADIUS` (140), regardless of the actual score. This guarantees every wedge meets the 44×44pt iOS HIG minimum tap target.

The overlay is a transparent SVG `Path` wrapped in a `Pressable`. The visual wedge renders on top — the user never sees the overlay, they just get the larger tap area.

These overlays are **only rendered when `interactive={true}`**. Static charts omit them entirely.

### Press feedback (FR8.4): `pressedId` state

Press feedback uses a simple local `pressedId` state — no Reanimated, no animation library:

- **On press in**: `pressedId` is set to the pressed characteristic's `id`.
- **While pressed**: that wedge's `fillOpacity` bumps from the default `0.5` to `0.75`. All other wedges remain at `0.5`.
- **On press out / release**: `pressedId` is reset to `null`, all wedges return to `0.5`.

The `0.5` baseline opacity is the chart's normal resting state — it lets the concentric reference rings and centre dot remain visible beneath the wedges. The `0.75` bump is enough to be visually noticeable without being jarring. This replaces the Chart PRD's `--shadow-glow` suggestion, which doesn't port to React Native (see [Design Tokens & Theme Module](./design-tokens-theme-module.md)).

### `onWedgeTap` callback

Each interactive wedge's `Pressable` calls `onWedgeTap?.(characteristic.id)` — the optional-chaining means a missing callback is a safe no-op. This handles the edge case of `interactive={true}` but no `onWedgeTap` prop: wedges render with interactive styling (hit overlays, press feedback), but taps do nothing.

### Rapid-tap handling

The chart does **not** debounce or throttle taps. Multiple rapid taps each fire `onWedgeTap(id)`. The parent is responsible for any debounce logic. For the onboarding flow, this is fine — the store's `goToCharacteristicRating` action is idempotent (navigating to the same stage/screen is a no-op).

### Why no Reanimated for press feedback

The `pressedId` → `fillOpacity` toggle is a simple boolean state change — React's built-in state and re-render cycle handle it without visible lag. Adding Reanimated (and its required `babel.config.js` plugin) solely for a 0.5→0.75 opacity bump is disproportionate. The project has no `babel.config.js` and changing the build pipeline for every developer for this one interaction is not justified. If future iterations need smooth gesture-driven interactions (drag to rotate, pinch to zoom), Reanimated can be added then with a clear justification.
