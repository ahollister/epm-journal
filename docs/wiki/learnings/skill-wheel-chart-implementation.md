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

**Implemented.** The chart component renders wedges, rings, and labels. Press feedback works via `Pressable`. No Reanimated, no babel.config.js.

## Related Pages

- [Architecture](../architecture.md) — shared components placement
- [Decisions](../decisions.md) — chart placement decision (2026-05-14), rose chart decision (2026-05-13)
- [Skill Wheel + Onboarding](../features/skill-wheel-onboarding.md) — visual specification
- [Design Tokens & Theme Module](./design-tokens-theme-module.md) — theme consumption
