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
- The full Business role area — dashboard, invoices list, invoice upload,
  invoice detail (screens 04–09), wallet, and settings (screens 04–12) — is
  implemented with typed local fixtures in
  `src/components/business/fixtures.ts`. Fixtures mirror the screen-facing
  domain contract so the data source can later be replaced by an API
  without changing the presentation components.
- The full Admin role area — overview, reserve, provenance, and ledger
  (screens 26–29) — is implemented the same way, with typed local fixtures
  in `src/components/admin/fixtures.ts`.
- Landing's "How it works" and "For businesses" sections (`/#how-it-works`,
  `/#for-businesses`) are implemented against the screen 01 exports on
  both breakpoints. "For investors", "Why provenance matters" and FAQ
  are implemented, including the final CTA band.
- Auth.js demo authentication is wired up for the current sandbox. Live API
  authentication remains pending the Clerk/Auth.js reconciliation described
  under "Auth provider" below.
- Tooling includes ESLint, Prettier, Husky + commitlint, CI, CODEOWNERS,
  and the repository templates.

What's still a stub:

- Routes still marked `stub` in `docs/ROUTE_MAP.md` (Investor role area, `/verify`,
  and `/notifications`). Buyer and `/confirm/*` flows are now implemented.
- The frontend/backend integration is being wired through `src/services/` using the
  live API contract described in `docs/Frontend_Backend_Integration_Guide.pdf`.
  Business and Admin screens still use fixtures until their service calls are
  migrated screen-by-screen.

When a screen is built, replace its stub implementation, update its status in
`docs/ROUTE_MAP.md` in the same change, and update this section when the
implementation state materially changes.

## Open decisions (not made yet — don't assume an answer)

- **Auth provider — Clerk.** The frontend uses Clerk (`@clerk/nextjs`)
  with a custom `/auth` screen (email + password sign-up/sign-in, "Continuing
  as" role picker). The user's Raiquid role lives in Clerk
  `publicMetadata.role` (promoted server-side from `unsafeMetadata` at
  sign-up via `POST /auth/complete-role`); `getSessionUser()` in
  `src/components/shared/layout/session-user.tsx` is the authoritative
  server-side session + role guard, and `src/proxy.ts` (clerkMiddleware)
  bounces unauthenticated hits on protected routes to `/auth`. The live
  integration guide describes Clerk-issued bearer tokens and Clerk signup
  metadata — `ClerkApiTokenProvider` in `src/services/auth-token.ts` wires
  the Clerk session token into `src/services/client.ts`'s token-provider
  seam for authenticated backend requests.
- **Data fetching / backend.** The live API contract is documented in
  `docs/Frontend_Backend_Integration_Guide.pdf`. All backend communication
  belongs in `src/services/`, with `src/services/client.ts` responsible for
  the base URL, authentication header, JSON handling, and API errors.
  Generated OpenAPI types belong in `src/types/api-generated.ts` and must not
  be edited by hand. Screen fixtures remain in place until each screen is
  migrated to its service.
- **On-chain integration.** The chain is Ethereum Sepolia (chain ID
  11155111, confirmed against raiquid-api's `BRICKKEN_CHAIN_ID` config
  default — not Base Sepolia, which earlier copy on this screen and
  others incorrectly said). No frontend SDK/library choice has been made
  for calling Brickken directly or reading on-chain state client-side —
  today everything on-chain is mediated through raiquid-api's own
  `/admin/ledger` mirror table, which this pass wired for real.
  `.env.example` has commented-out placeholders
  (`NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL`, `BRICKKEN_API_KEY`) for a future
  direct-to-chain integration — rename the RPC URL var to match the real
  chain, and extend `src/lib/env.ts`'s schema alongside them, if that's
  decided.
- **Error reporting.** `src/app/error.tsx` has a `console.error` with a
  comment marking where a real reporter (Sentry, etc.) would go.
- **Charting library.** The reserve-pool balance-growth chart (screen 27) and any future chart need a real library — none is installed.
- **Manual verification for the 401/403 wiring in `src/services/client.ts`.**
  No automated test exists for this yet. Most screens now call into
  `src/services/` for real (see "Still fixture / no real endpoint yet"
  below for what doesn't), so this can be exercised on any real
  authenticated page rather than only from the console — but a targeted
  check still hasn't been walked by hand end to end:
  - **401** — call `apiClient.get("/buyer/dashboard", "not-a-real-token")`
    (any real path, a garbage/expired token string). Expect the browser to
    navigate to `/auth?callbackUrl=...` and the call to reject with an
    `ApiError` (status 401) — check the Network tab, not just the redirect.
  - **403, "not provisioned yet"** — sign up a brand-new account and, in
    the few seconds before the Clerk-webhook-driven backend provisioning
    finishes, call `apiClient.get(...)` against any authenticated endpoint
    using that fresh session's real token (`await window.Clerk.session
.getToken()`). Expect no redirect and no immediate rejection — the
    call should retry silently (~1s, 2s, 4s) and either succeed once
    provisioning catches up or reject after 4 attempts (~7s total) if it
    doesn't.

### Still fixture / no real endpoint yet

Consolidated here in one place rather than scattered per-screen notes.
Every entry below was confirmed by reading raiquid-api's controller +
service + DTO (or the Prisma schema) directly — none of these are
guesses, they're the honest result of checking and finding nothing.

**Business**

- **Invoice detail (screens 06-09), buyer reputation summary.** The
  awaiting-acceptance view's "accepted X of Y invoices" line has no
  matching real field (only rate percentages exist, no raw counts) —
  `BUYER_SUMMARIES` fixture left in place, harmlessly inert for real
  invoices (the component already null-guards a missing lookup).
- **Invoice detail, named funding contributors.** The funding view's
  per-investor breakdown has no real identity to show —
  `GET /business/invoices/{id}` includes `holdings` but each holding's
  `investorId` is opaque, no display name attached. `TOP_CONTRIBUTORS`
  fixture left in place; degrades gracefully to "+N others" using the
  real aggregate amount and count once a real invoice has holdings.
- **Business wallet, payout account/history.** `pendingPayout`,
  `payoutAccount` (bank name/account number), and `payoutHistory` all
  stay on the `BUSINESS_WALLET` fixture — there's no bank-account
  concept anywhere on the real `Business` model (only
  `payoutWalletAddress`, a crypto address) and no per-payout status
  field on `WalletTransaction`.
- **Business settings.** `registrationNumber` and
  `countryOfIncorporation` are real, optional `PATCH /business/settings`
  fields with no input on the screen yet (`payoutWalletAddress` now has
  one, wired on the wallet screen instead — see below). Notification
  toggles are local-only — no notification-preferences endpoint exists
  on the backend at all.
- **Business wallet, "Pending payout" and "Payout history."** Both now
  derived for real from `GET /business/invoices` (funded → pending sum,
  repaid → history rows) rather than fixture — no new backend needed.
  Caps at the endpoint's own max `pageSize` (100), so this is an honest
  derivation from what's actually returned, not a guaranteed full sum if
  a business somehow has more invoices than that.
- **Business wallet, payout account.** `payoutWalletAddress` is now
  wired for real (display + edit) — confirmed exposed by
  `GET /business/settings` (no `select` restriction there) and accepted
  by `PATCH`'s `UpdateBusinessSettingsDto`, the same real column and
  DTO pattern already used for `investingWalletAddress` on investor
  settings.
- **Business dashboard.** Previously never wired at all (missed in the
  earlier pass). "Active invoices" and "Recent invoices" are now real,
  via `GET /business/invoices` (same mapping as `business/invoices`).
  "Total financed" and "Avg. time to cash" are removed outright — no
  stats-aggregate endpoint exists for the former, and the latter would
  need acceptance-to-payout timing nobody computes yet.

**Buyer**

- **Buyer dashboard, provenance detail.** "14 of 15 invoices" (a raw
  count) has no backing — same gap as the business-side reputation
  summary above, only rate percentages exist.
- **Buyer settings, authorized contacts.** No such concept on the
  `Buyer` model — `BUYER_SETTINGS.authorizedContacts` fixture left in
  place. Notification toggles are local-only, same as business.
- **Buyer pay screen, payment method.** `BUYER_PAYMENT_ACCOUNT` (bank
  name/account number) fixture left in place — no bank-account field on
  `Buyer` either.

**Investor**

- **Investor marketplace (screens 19, 20), `expectedReturnPct`/
  `fundingInvestorCount`.** `expectedReturnPct` is now wired for real —
  `Invoice.investorYieldPct` (`Decimal(5,2)`, already a percentage) was
  added backend-side and is mapped in `toListing()`
  (`src/app/investor/marketplace/_lib/listing.ts`), and in the other
  three invoice mappers that share the same gap (`src/app/business/
_lib/invoice.ts`, `src/app/buyer/_lib/invoice.ts`, `src/app/business/
invoices/[invoiceId]/_lib/invoice.ts`) — so sorting the marketplace by
  "return" is real now too. `fundingInvestorCount` still has no backing
  field and stays placeholder 0.
- **Investor marketplace detail, buyer-provenance numbers.**
  `Buyer.acceptanceRate`/`onTimePaymentRate`/`invoicesFinancedCount` _do_
  exist as real fields and are wired for real — but per raiquid-api's
  own code comment (`admin.service.ts`), they're 0 for every buyer today
  because computing them was deferred backend-side, not because the
  frontend is faking them.
- **Investor whitelisting, document upload (screen 18).** Skipped
  entirely. `POST /investor/whitelisting` accepts optional
  `identityDocumentKey`/`proofOfAddressKey` from
  `POST /investor/whitelisting/upload-url` (a presigned R2 URL) — neither
  is required server-side, so the wired form submits with just
  `legalName` + `countryOfResidence`. No file picker, no upload-url call,
  no upload progress UI exists yet. Build the presigned-upload flow
  before this counts as a complete KYC submission.
- **Investor portfolio, buyer name column.**
  `GET /investor/portfolio(/:id)` only includes the invoice, not
  `invoice.buyer` — there is no real buyer name available from this
  endpoint at all. Shows "—" for every row rather than a guess.
- **Investor portfolio, aggregate stats — now derived, one caveat.**
  `totalInvested`, `totalReturned`, and `activeHoldingsCount` are now
  summed for real from the same `GET /investor/portfolio` response
  (capped at its own max `pageSize` of 100 — an honest derivation from
  what's returned, not a guaranteed exact total past that). Invoice
  count uses the response's real `total`, not the fetched page's
  length. `avgReturnPct` is now always "—", not sometimes-computed: read
  `BuyerService.payInvoice` directly and confirmed `holding.repaidAmount`
  is set to exactly the original invested amount — there is no separate
  yield/profit field anywhere in the real repayment flow, on this
  endpoint or any other found tonight. A "return %" computed from that
  would read ~100% for every repaid holding, which isn't a real return
  figure — it would just confirm principal came back, and showing it as
  a percentage return would be more misleading than showing nothing.
  Genuine investment yield may be settled entirely on-chain via
  Brickken's `dividendDistribution` (see `AdminService
.finalizeInvoiceOnChain`) rather than through this off-chain wallet
  ledger at all — if so, it needs its own endpoint before this number
  can ever be real. The "since" date is dropped entirely — no real field
  for it in this response.
- **Investor settings, `investingWalletAddress`.** A real, optional
  `PATCH /investor/settings` field with no input on the screen yet.
  Notification toggles are local-only, same as the other two roles.

**Admin**

- **Reserve pool, contribution rate.** No single platform-wide value —
  `reserveContributionPct` is set per invoice by the buyer's provenance
  tier (`PROVENANCE_FEE_SCHEDULE`), not a flat rate. Now shown as honest
  text ("Varies by buyer tier") instead of a fabricated flat percentage;
  the `ADMIN_RESERVE_SNAPSHOT.contributionRatePct` fixture is unused.
- **Reserve pool, balance-growth chart.** No historical time-series
  endpoint exists — `getReserve()` returns only the current balance. Now
  an empty/not-available state instead of fixture bars; the
  `ADMIN_RESERVE_BALANCE_GROWTH` fixture and `BalanceGrowthCard` component
  are unused (also blocked on no charting library being installed, see
  below).
- **Provenance registry, "member since" date.** `GET /admin/provenance`'s
  own `select` clause doesn't include `Buyer.createdAt` — left blank
  rather than guessed.

**Corrected while wiring this pass, not a gap:** the on-chain event
model's real `OnChainAction` values (`newTokenization`, `whitelist`,
`mintToken`, `newSto`, `newInvest`, `closeOffer`, `claimTokens`,
`dividendDistribution`) and the real chain — **Ethereum Sepolia**, chain
ID 11155111, confirmed directly against raiquid-api's
`BRICKKEN_CHAIN_ID` config default and a schema comment calling the
`84532` (Base Sepolia) column default an unused legacy fallback — have
replaced the original invented `mint`/`whitelist`/`transfer`/`burn` set
and the "Base Sepolia" text that appeared in three separate places
(the tokenized invoice-detail view, the investor wallet's sandbox
notice, and the admin ledger's own subtitle). None of those three
places agreed with each other before this; now all three say the same,
confirmed thing.

## Assumptions to confirm with design/product before treating as final

- **Fonts** (Fraunces / IBM Plex Sans / IBM Plex Mono) — a considered
  visual match against the exports, named by the design session. Not
  pixel-provable. See `docs/DESIGN_SYSTEM.md`.
- **`/buyer/invoices`** ("Invoices to review") — no dedicated list export exists.
  The implemented table uses the invoice, supplier, amount, due date, status,
  and review action fields inferred from the buyer dashboard and the business
  invoice list. Confirm the final field set with design/product.
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
