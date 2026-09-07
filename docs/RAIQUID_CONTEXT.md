# Raiquid — project context

Read this before writing any code. It's the handover from the person who
set up this repo to whoever builds it out next — a human
developer or another AI coding agent. If you're an agent picking this up
cold: this document plus `docs/DESIGN_SYSTEM.md` and `docs/ROUTE_MAP.md`
are your brief. Don't guess at anything covered here; where something
genuinely isn't covered, say so and ask rather than inventing an answer,
per "Assumptions to confirm" at the bottom.

## Working with screen evidence

Any claim of the form "screen NN shows X" or "verified against the
exports" must be backed by an actual file-read/view step in the same
session, on that specific file. Before making a claim like that:

(a) confirm the screenshot file actually exists at the path you're
about to cite (`ls` / `find` it first — don't assume from a past
session or from memory),
(b) view/read it,
(c) only then state what it shows.

If screenshots are not available in the workspace, say so explicitly
("no screenshot available for screen NN, this is inferred from written
docs / best guess") rather than presenting an inference as an
observation. A wrong guess that's labeled as a guess is fine and
expected; a wrong guess presented as verified pixel evidence is not.

_Why this exists: a past session claimed several `domain-display.ts`
tones were "verified against the exports" with no file-read in its tool
output, and got `tokenized` wrong (amber, not green) by reading a green
`InlineNotice` on the same screen as if it were the status badge._

## What Raiquid is

Tokenized invoice financing for Nigerian SMEs. Three-sided marketplace:

- **Business** uploads an invoice a buyer owes them for goods/services
  already delivered.
- **Buyer** formally confirms the invoice is genuine and the amount is
  owed (this does not create a new obligation — it just verifies an
  existing one).
- Once confirmed, the invoice is **tokenized** (minted as an on-chain
  token) and listed on a marketplace.
- **Investors** fund fractions of the tokenized invoice, buying it at a
  discount to its face value.
- On the due date, the buyer pays the platform (not the original
  business — the business was already paid early). The platform
  distributes principal + return to investors and burns the token.

It's built for the **Brickken Developer Build Programme**: everything
runs on a sandbox network (**Base Sepolia**), and every money-moving
action in the designs carries an explicit "this is simulated, no real
funds move" disclaimer. Keep that disclaimer pattern on any new
money-moving screen — see `InlineNotice` in `docs/DESIGN_SYSTEM.md`.

## The provenance system

Raiquid's core trust mechanism. Every **buyer** (not business, not
investor) accumulates a provenance record based on how reliably they
pay:

- **Quarried** (entry tier, neutral/gray) → **Carried** (amber) →
  **Anchored** (green, best terms). Tier is driven by acceptance rate
  and on-time payment rate over the buyer's invoice history.
- Higher tier unlocks lower reserve contributions and faster financing
  for the _suppliers_ who send that buyer invoices — the incentive is
  structured so buyers want to build their record.
- The registry is public within the platform (`/admin/provenance` shows
  every buyer's record — screen 28's tagline is literally "Every
  buyer's record, in the open").

This is the single most distinctive piece of the product; don't flatten
it into a generic "credit score" in implementation — the tier semantics
(Quarried/Carried/Anchored) and their direction are load-bearing.

## Roles

Four account kinds, chosen at sign-up (`/auth`, screen 02):

| Role       | What they do                                                    | Shell                               |
| ---------- | --------------------------------------------------------------- | ----------------------------------- |
| `business` | Uploads invoices, gets paid early                               | `RoleShell` (sidebar/bottom-tabs)   |
| `buyer`    | Confirms invoices, repays on the due date                       | `RoleShell`                         |
| `investor` | Funds invoices, earns a return                                  | `RoleShell`                         |
| `admin`    | Internal ops — platform metrics, reserve pool, registry, ledger | `AdminShell` (top tabs, no sidebar) |

Investors in the designs are explicitly framed as including **diaspora
investors** (the sample investor persona, Emeka Nwosu, is a "Diaspora
investor · London") — keep country-of-residence and international
payment context in mind wherever investor onboarding/settlement is
built out.

## Architecture decisions

**One responsive Next.js web app. No monorepo, no separate mobile app.**
This was an explicit correction during scaffolding — an earlier pass
set this up as a Turborepo with separate marketing/app packages, which
was wrong. Mobile is the exact same app at a narrower Tailwind
breakpoint; there is no native app and no plan for one right now. If a
future need for a genuinely separate deployable (e.g. splitting
marketing off to its own host) comes up, that's a new decision to make
then — don't assume it's already been decided in this direction.

**Stack**: Next.js 16.3 (App Router, Turbopack, typed routes),
TypeScript (strict), Tailwind CSS v4, React 19. All pinned to current
versions as of Sept 2026 — see `package.json`, and re-check
`https://nextjs.org/docs` before assuming an API surface, since this
version is likely newer than an agent's training data (Next.js 16
ships its own agent-guidance file, `AGENTS.md` at the repo root,
generated by `next dev`/`next build` — read it, it says the same
thing more forcefully).

**`src/proxy.ts`, not `middleware.ts`.** Next.js 16.3 deprecated
`middleware.ts` in favor of `proxy.ts` (Node.js runtime by default,
not Edge) partway through this scaffold being built — the deprecation
warning surfaced during a real `next build`, not from documentation
research. If you see tutorials or training data referencing
`middleware.ts`, they predate this rename. Keep proxy checks "thin"
(optimistic cookie-presence only) — put real auth/authorization
decisions in a Server Component or data-access layer instead. See the
comments in `src/proxy.ts`.

**Route structure mirrors the URL structure 1:1.** Every folder under
`src/app` is named after its actual URL segment — `business/invoices/
[invoiceId]`, not some abstracted `[role]/[resource]/[id]`. This was a
deliberate choice for a small team: it's slower to add a role than a
generic system would be, but there are only four roles and they're
genuinely different products with different shells, so the
abstraction wasn't worth the indirection.

**Single source of truth, enforced by file layout, not convention
alone**:

- Every enum (invoice status, provenance tier, whitelist status, on-chain
  status, payout status) lives once in `src/types/domain.ts`.
- Every enum's display label + color lives once in
  `src/lib/domain-display.ts`, consumed only by the domain badge
  components in `src/components/shared/domain/status-badges.tsx`.
- Nav items live once in `src/lib/nav-config.ts`, consumed by both the
  desktop sidebar and the mobile bottom-tab bar.

  The point of all three: a copy change or a color change is a one-line
  edit in one file, not a grep-and-pray across the codebase. Don't
  reintroduce a second source for any of these.

## What's real vs. what's a stub right now

This is an incremental screen build. The shared foundation is implemented,
and individual routes are marked done in `docs/ROUTE_MAP.md` as their approved
screens are implemented.

What's real:

- The full route tree exists and resolves.
- `src/types/domain.ts` is the domain source of truth for the implemented
  and planned screen data model.
- `src/app/globals.css` contains the pixel-sampled design tokens.
- `src/components/shared/**` contains the shared UI, domain, and layout
  primitives reconciled against the approved exports.
- `src/lib/domain-display.ts` contains the single display mapping for every
  domain status used by the shared domain badge components.
- Business Wallet (`/business/wallet`, screen 11) is implemented with typed
  local fixtures. The fixture mirrors the screen-facing domain contract so
  the data source can later be replaced by an API without changing the
  presentation components.
- Tooling includes ESLint, Prettier, Husky + commitlint, CI, CODEOWNERS,
  and the repository templates.

What's still a stub:

- Routes still marked `stub` in `docs/ROUTE_MAP.md`.
- Authentication, backend/data fetching, and on-chain integration remain
  open decisions and are not wired into the Wallet screen.

When a screen is built, replace its stub implementation, update its status in
`docs/ROUTE_MAP.md` in the same change, and update this section when the
implementation state materially changes.

## Open decisions (not made yet — don't assume an answer)

- **Auth provider.** Nothing is wired up. `src/components/shared/layout/
session-user.tsx` defines the `SessionUser` shape every shell needs
  and throws `Not implemented` — that's the seam. `src/proxy.ts` has
  the route-protection seam. Pick a provider (NextAuth/Auth.js, Clerk,
  a custom JWT flow, whatever fits) and wire both without changing
  their public shape if you can help it.
- **Data fetching / backend.** No API layer or database is decided. The
  business Wallet currently uses typed local fixtures in
  `src/components/business/fixtures.ts`. Keep temporary screen data shaped
  like the domain contracts and replace the fixture source when the backend
  contract is defined; do not introduce a shared `src/data/` convention.
- **On-chain integration.** Screens reference Base Sepolia mint/
  transfer/burn events and a Brickken sandbox. No SDK/library choice
  has been made for actually calling Brickken or reading on-chain
  state. `.env.example` has commented-out placeholders
  (`NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL`, `BRICKKEN_API_KEY`) for when
  this is decided — uncomment and extend `src/lib/env.ts`'s schema
  alongside them.
- **Error reporting.** `src/app/error.tsx` has a `console.error` with a
  comment marking where a real reporter (Sentry, etc.) would go.
- **Charting library.** The reserve-pool balance-growth chart (screen 27) and any future chart need a real library — none is installed.

## Assumptions to confirm with design/product before treating as final

- **Fonts** (Fraunces / IBM Plex Sans / IBM Plex Mono) — a considered
  visual match against the exports, named by the design session. Not
  pixel-provable. See `docs/DESIGN_SYSTEM.md`.
- **`/buyer/invoices`** ("Invoices to review") — the nav label is
  verified (screen 15) but there is still no dedicated export for the
  list itself. Built as an inferred table matching `/business/invoices`
  (screen 10); confirm the real field set.
- **`/auth` and `/verify`** (screens 02, 03) sit under the marketing
  `LandingHeader` (no footer), not a standalone shell — so they arguably
  belong in the `(landing)` route group rather than `(shared)`. Left in
  `(shared)` for now; confirm before building them.
- **The business verification flow** (screen 03) is a 3-stage stepper —
  Documents submitted / Under review / Verified — with no enum in
  `src/types/domain.ts` (only the investor `WhitelistStatus` exists).
  Add one when that screen is built.

Resolved by the 2026-09-04 export pass:

- **`/notifications`** — the export (screen 30) shows the panel only, no
  chrome. Treated as the export isolating the panel: build it inside the
  visitor's current role shell like every other authenticated route.
- **`/how-it-works`, `/for-businesses`, `/for-investors`** — screen 01
  has all three as sections on `/`. They are **not routes**; `LANDING_NAV`
  links to `/#how-it-works` etc. (route folders deleted).

## Working conventions

See `CONTRIBUTING.md` for the day-to-day rules (branching, commits, PR
checklist) — it's short, read it too. The one thing worth repeating
here: **replace a stub, don't build around it.** If you're implementing
`/investor/marketplace`, replace the whole `page.tsx` file. Don't leave
the `// TODO` stub in place and add real content as a sibling, and
don't partially implement half a page and leave the rest stubbed
without a comment explaining what's deferred and why.
