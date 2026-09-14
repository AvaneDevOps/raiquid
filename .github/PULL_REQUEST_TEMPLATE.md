## What does this PR do?

<!-- One or two sentences. Link the issue/task if there is one. -->

## Screen(s) implemented

<!-- Reference the screen number(s) from docs/screens/, e.g. "Screen 20 (invDetail)". -->

## Checklist

- [ ] Matches the design at both desktop and mobile breakpoints
- [ ] Uses shared primitives from `src/components/shared/ui` (no one-off buttons/cards/badges)
- [ ] Status/tier chips use `InvoiceStatusBadge` / `ProvenanceTierBadge` (not raw `<Badge tone="...">`)
- [ ] New nav items added to `src/lib/nav-config.ts`, not hardcoded in a component
- [ ] `npm run validate` passes locally (lint + typecheck + format)
- [ ] No new `any`, no disabled lint rules without a comment explaining why
- [ ] Left a `ScreenPlaceholder` (with correct screen number) for anything intentionally deferred, rather than silently skipping it
