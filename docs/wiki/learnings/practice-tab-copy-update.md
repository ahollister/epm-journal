# Practice Tab: "Get your baseline" → "Create your baseline"

**Date**: 2026-07-26
**Branch**: `item-4393`

## What changed

The onboarding CTA heading on the Practice tab was changed from "Get your baseline" to "Create your baseline". The tab bar label was also updated to match.

## Where

| File | Change |
|------|--------|
| `app/(tabs)/index.tsx` | Heading text: `"Get your baseline"` → `"Create your baseline"` |
| `app/(tabs)/_layout.tsx` | Tab bar title: `"Practice"` → `"Create your baseline"` |
| `docs/wiki/architecture.md` | Updated mention in practice-tab baseline-gating note |
| `docs/wiki/learnings/practice-tab-baseline-gating.md` | Updated state table and inline reference |

## Notes

- The `_layout.tsx` tab title change was not in the original plan — it was caught during build verification. The tab bar label should stay in sync with the page heading.
- No test changes were needed. The existing test suite already passed against the new string.
