# Practice Tab Copy Update: `_layout.tsx` Tab Bar Label Sync

When changing user-facing copy on a tab screen (e.g., the Practice tab heading from "Get your baseline" to "Create your baseline"), there's a non-obvious second location that must be updated: the tab bar label in `app/(tabs)/_layout.tsx`.

## The Two-File Change

| File | What changed | Why |
|------|-------------|-----|
| `app/(tabs)/index.tsx` | Heading text: `"Get your baseline"` → `"Create your baseline"` | The visible copy on the Practice tab's empty state |
| `app/(tabs)/_layout.tsx` | Tab bar label: `"Get your baseline"` → `"Create your baseline"` | The label shown in the bottom tab navigator |

## Why This Is Easy to Miss

The tab screen file (`index.tsx`) is the obvious place to make the change — it's where the heading renders. But Expo Router's tab bar labels are configured in `_layout.tsx` via the `title` option on each `Tabs.Screen`. If you only update the screen component, the tab bar still shows the old copy, creating an inconsistency between the in-page heading and the tab label.

## Build Verification Caught It

The mismatch was discovered during build verification, not in the original change plan. This reinforces that copy changes touching tab screens should always include a check of the corresponding `_layout.tsx` entry.

## Related Pages

- [Practice Tab & Baseline Gating](./practice-tab-baseline-gating.md) — the baseline-gating pattern whose copy was updated
- [Architecture](../architecture.md) — implementation status table includes this correction
