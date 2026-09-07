# Contributing to Raiquid

This is the short version of how we work day-to-day. For project context
(what Raiquid is, the domain model, architecture decisions), read
`docs/RAIQUID_CONTEXT.md` first — this file is process, that one is
substance.

## Setup

```bash
nvm install      # first time only — installs the Node version in .nvmrc
nvm use          # Node version pinned in .nvmrc (22)
npm install
cp .env.example .env.local
npm run dev
```

Node 22 is the standard and what CI runs on. It's not hard-enforced
(`.npmrc` sets `engine-strict=false`), so if you're on Node 20.9+ you can
still install and run — Next.js 16.3 only needs `>=20.9`. You'll see a
one-time `EBADENGINE` warning; treat it as a reminder to upgrade when you
get a chance. Below Node 20.9, Next won't run at all.

## Branching

`type/short-description`, e.g. `feat/investor-marketplace-filters`,
`fix/business-invoice-status-badge`. Branch off `main`, PR back into
`main`. No long-lived feature branches — if a feature needs more than a
few days, split it into smaller PRs behind a `ScreenPlaceholder` or a
feature flag rather than one large branch.

## Commits

[Conventional Commits](https://www.conventionalcommits.org/), enforced by
commitlint on every commit:

```
<type>(<scope>): <subject>

feat(investor): add marketplace tier filter
fix(business): correct funded-percentage rounding
docs(docs): update route map after admin restructure
```

Types: `feat`, `fix`, `refactor`, `docs`, `chore`, `test`, `style`.
Scopes: `business`, `buyer`, `investor`, `admin`, `landing`, `auth`,
`ui`, `types`, `infra`, `docs`, `deps` (see `commitlint.config.js` for
the enforced list).

## Before opening a PR

```bash
npm run validate   # lint + typecheck + format:check
npm run build      # catches anything validate doesn't
```

Both run in CI on every PR; running them locally first saves a
round-trip.

## The rules that keep this codebase from fragmenting

These are the ones worth internalizing, not just following because a
linter says so:

1. **One status/tier enum, one place it's displayed.** Invoice status,
   provenance tier, whitelist status, on-chain status all live in
   `src/types/domain.ts`, and their label/color mapping lives in
   `src/lib/domain-display.ts`. If you need a new status value or a
   different color for one, change it there — never hardcode a tone or
   label inline in a page component.
2. **Nav items live in `src/lib/nav-config.ts`, once.** The desktop
   sidebar and mobile bottom-tab bar both read the same `ROLE_NAV[role]`
   entry (they take a `role`, not a nav array). Adding a nav item in one
   component instead of the config is exactly the drift this prevents.
3. **`src/components/` is `shared/` plus one folder per app area.**
   `src/components/shared/` (`ui/`, `domain/`, `layout/`) is for
   components that appear across multiple roles or are generic —
   nothing role-specific. `src/components/{business,buyer,investor,admin,landing}/`
   each hold components used only within that area. A component
   **starts in its area folder**; it only gets promoted to
   `src/components/shared/` once a _second_ area actually needs it —
   don't pre-emptively share, and never duplicate a component across
   two areas instead of promoting it. If you catch yourself styling a
   second bespoke button/card/badge instead of using or extending
   `Button`/`Card`/`Badge` from `shared/ui`, stop and extend the
   primitive instead. Every one-off is a future inconsistency someone
   else has to notice and fix.
4. **Colocate route-specific components under their route folder**
   (e.g. `src/app/investor/marketplace/_components/`) using a
   `_`-prefixed private folder; promote a component to its app-area
   folder under `src/components/` once a second route in that area
   needs it, and only to `src/components/shared/` once a second app
   area needs it. Don't pre-emptively share.

   **Exception: `src/components/landing/`.** Landing's homepage
   sections (`how-it-works-section.tsx`, `for-businesses-section.tsx`,
   etc.) go straight into `src/components/landing/`, skipping the
   `_components/` colocation step — deliberately, not by oversight. See
   `src/components/landing/README.md` for why.

5. **Route params use `PageProps<'/exact/path/[param]'>`**, the
   Next.js-generated global type (see any `[invoiceId]/page.tsx` for an
   example) — don't hand-type `{ params: { invoiceId: string } }`.
6. **Replace a `ScreenPlaceholder`, don't build around it.** If a page
   is a placeholder, the correct PR either replaces the whole file with
   a real implementation, or leaves it untouched — never adds partial
   real content around a leftover placeholder block.
7. **Comments in `.ts`/`.tsx` are the exception, not the default.**
   Rename a variable or extract a function before writing a comment to
   explain what code does. When you do need one — a non-obvious business
   rule, a workaround, a "why" the code can't carry — use a single-line
   `//`. No `/** */` blocks, no JSDoc tags, no comment restating the
   next line, no header explaining a file's purpose or naming the
   screen/route it serves (that goes in `docs/` or the PR). This is for
   source only; the Markdown docs keep their full prose.

## Code review

Every PR needs one approval before merging. CODEOWNERS auto-requests
the right reviewer based on which folder changed — if you're touching
`src/components/shared/layout/` or `src/types/`, expect the tech director in
the loop, since those are shared-foundation changes that affect every
screen.
