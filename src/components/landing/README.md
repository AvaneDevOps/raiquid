Components used only within the landing page area — if a second area needs one of these, promote it to `src/components/shared/` instead of duplicating it.

**Why these live here instead of under `src/app/(landing)/_components/`:**
CONTRIBUTING.md #4 says route-specific components normally start
colocated under their route's own `_components/` folder, and only get
promoted to `src/components/{area}/` once a _second route_ in that area
needs them. Landing skips straight to `src/components/landing/` instead,
because `(landing)` only has one real route — the homepage itself
(`/`) — that composes these sections. `/how-it-works` and
`/for-businesses` are not separate pages; they redirect to anchors on
the homepage (see `src/lib/nav-config.ts`'s `LANDING_NAV`). Since a
"second route" in this area isn't really coming, waiting for one before
promoting would just mean these components sit under a single route's
`_components/` folder forever for no reason — so they start in the
area folder directly instead.

This is a deliberate, one-off exception for this specific area, not a
precedent for skipping the colocate-first step elsewhere. Other areas
(`business/`, `buyer/`, `investor/`, `admin/`) have multiple real
routes each and should follow CONTRIBUTING.md #4 as written: colocate
under the route's `_components/` first, promote here only once a second
route in that area actually needs the same component.
