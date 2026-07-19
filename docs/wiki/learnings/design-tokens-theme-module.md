# Design Tokens & Theme Module

The project's design tokens have a reconciliation challenge: the canonical token definitions in `docs/designs/design-system.html` use double-prefixed CSS custom property names, but PRDs and components reference single-prefix names. A hand-authored TypeScript theme module bridges the gap.

## The Double-Prefix Problem

The design system HTML mockup (`docs/designs/design-system.html`) defines CSS variables with double-prefixed names:

```css
--color-color-accent-primary
--color-color-bg-surface
--color-color-text-primary
```

The `--color-` prefix appears twice because the design tool (likely Figma export or similar) namespaces tokens by category, and the category name itself contains `color`. This is an artifact of the design tool's export pipeline, not an intentional naming convention.

PRDs and component specs reference single-prefix names (e.g., `color-accent-primary`, `color-bg-surface`). Components cannot directly consume the double-prefixed CSS variables without either (a) knowing the double-prefix convention, or (b) using a translation layer.

## The Reconciliation: `src/shared/lib/theme.ts`

A hand-authored TypeScript theme module at `src/shared/lib/theme.ts` resolves the naming mismatch by exporting single-prefix token objects with **concrete literal values** transcribed directly from `docs/designs/design-system.html:16-63`:

```ts
import { colors } from '@/shared/lib/theme';
// colors.accentPrimary → '#22c55e'
```

The module exports four named `as const` objects:

- **`colors`** — 16 colour tokens including a nested `wheel` sub-object for wheel-specific tones (tone, timing, technique, repertoire, improvisation, earTraining)
- **`fontSize`** — 7 size tokens (xs: 11 → display: 40)
- **`space`** — 8 spacing tokens (xs: 4 → xxxl: 64)
- **`radius`** — 5 border-radius tokens (xs: 4 → full: 9999)

**Naming:** keys use PRD-intent single-prefix names (e.g., `accentPrimary`, `bgBase`, `wheel.tone`) — NOT the HTML's double-prefix `--color-color-*` — so every import reads `colors.accentPrimary`, not `colors.colorAccentPrimary`.

**Values are concrete, not CSS variable references.** The module exports literal hex strings and numbers. Components use them directly in `StyleSheet.create` or inline styles — there is no runtime CSS-variable resolution. The "reconciliation" is the **naming convention** (single-prefix keys vs. the HTML's double-prefixed CSS custom property names), not a value-mapping layer.

### Design decisions

- **Not a theming framework.** No light mode, no `ThemeContext`, no provider. Flat `import { colors } from '@/shared/lib/theme'`.
- **`--shadow-glow` intentionally excluded.** The design system defines a CSS `box-shadow` string that doesn't port to React Native directly. The chart press feedback uses a fill-opacity bump instead (see chart tickets). Do not try to translate it.
- **Comment traceability.** The module includes a comment linking back to `docs/designs/design-system.html:16-63` so future maintainers know where the values came from.

## Why Not Fix the Source?

The HTML mockup could theoretically be post-processed to strip the double prefix, but:
- The mockup is the canonical design artifact — altering it breaks fidelity with the design tool.
- Future design updates would re-introduce the double prefix, requiring re-patching.
- The theme.ts module is a single source of truth that can be regenerated if the design tokens change, without touching the HTML.

## Architecture Placement

| Artifact | Location |
|----------|----------|
| CSS token definitions | `docs/designs/design-system.html` (double-prefixed, design-tool export) |
| TS theme module | `src/shared/lib/theme.ts` (single-prefix, hand-authored; exports `colors`, `fontSize`, `space`, `radius` as `as const` named exports) |
| Consumer imports | `import { colors } from "@/shared/lib/theme"` — named exports with concrete literal values, not a single theme object |

## Current Status

**Implemented.** The theme module exists at `src/shared/lib/theme.ts` and exports `colors`, `fontSize`, `space`, and `radius` as `as const` objects with concrete literal values (hex strings and numbers). Components consume named exports (e.g., `import { colors } from '@/shared/lib/theme'`). The double-prefix HTML mockup remains the canonical design artifact. `--shadow-glow` is intentionally excluded; chart press feedback uses fill-opacity instead.

## Related Pages

- [Architecture](../architecture.md) — shared/lib placement
- [Decisions](../decisions.md) — shared components constraint
