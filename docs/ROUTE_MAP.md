# Route map

Every route currently scaffolded, its layout group, the screen it's
built from (in `raiquid-screens.zip`), and its current status. Every
`page.tsx`/`layout.tsx` file exists on disk already — this table is
about what's _implemented_ inside each, not whether the route resolves.

Status legend: **stub** = returns `null` / passes through children only
(current state of everything, per the Sept 2026 strip-down). Once a
route is built for real, flip its status here in the same PR.

## Landing — `(landing)` route group, `LandingHeader` + `LandingFooter`

| Route | Screen     | Status |
| ----- | ---------- | ------ |
| `/`   | 01-landing | stub   |

Note: "How it works", "For businesses" and "For investors" are **not
routes** — they are in-page anchors on `/`. `LANDING_NAV` links to
`/#how-it-works`, `/#for-businesses` and `/#for-investors`, so the real
landing page must give those sections `id="how-it-works"`,
`id="for-businesses"` and `id="for-investors"`.

## Shared — `(shared)` route group, `StandaloneShell` (centered card, no nav)

| Route                         | Screen          | Status |
| ----------------------------- | --------------- | ------ |
| `/auth`                       | 02-auth         | stub   |
| `/verify`                     | 03-verify       | stub   |
| `/confirm/[invoiceId]`        | 13-buyerRequest | stub   |
| `/confirm/[invoiceId]/review` | 14-buyerAccept  | stub   |

This group is reachable without an authenticated session — `/confirm/*`
in particular is the magic-link a buyer receives by email/SMS. Do not
wrap it in an auth check.

## Business — `business/` route group, `RoleShell` (sidebar / bottom-tabs)

| Route                                | Screen                                                                                        | Status |
| ------------------------------------ | --------------------------------------------------------------------------------------------- | ------ |
| `/business` (redirects to dashboard) | —                                                                                             | done   |
| `/business/dashboard`                | 04-bizDashboard                                                                               | stub   |
| `/business/invoices`                 | 10-bizList                                                                                    | stub   |
| `/business/invoices/new`             | 05-bizUpload                                                                                  | stub   |
| `/business/invoices/[invoiceId]`     | 06/07/08/09 (bizPending/Tokenized/Funding/Payout — one page, 5 status states via the stepper) | stub   |
| `/business/wallet`                   | 11-bizWallet                                                                                  | stub   |
| `/business/settings`                 | 12-bizSettings                                                                                | stub   |

## Buyer — `buyer/` route group, `RoleShell`

| Route                             | Screen                    | Status |
| --------------------------------- | ------------------------- | ------ |
| `/buyer` (redirects to dashboard) | —                         | done   |
| `/buyer/dashboard`                | 15-buyerDashboard         | stub   |
| `/buyer/invoices`                 | _(inferred — see note)_   | stub   |
| `/buyer/invoices/[invoiceId]/pay` | 16-buyerRepay             | stub   |
| `/buyer/payment-schedule`         | 15-buyerDashboard (table) | stub   |
| `/buyer/settings`                 | 17-buyerSettings          | stub   |

Note: "Invoices to review" is a nav item on screen 15 with no dedicated
list-screen export. Build it consistent with `/business/invoices`'
table pattern, but confirm the exact fields with design first.

## Investor — `investor/` route group, `RoleShell`

| Route                                    | Screen            | Status |
| ---------------------------------------- | ----------------- | ------ |
| `/investor` (redirects to portfolio)     | —                 | done   |
| `/investor/portfolio`                    | 22-invPortfolio   | stub   |
| `/investor/portfolio/[invoiceId]`        | 23-invRepay       | stub   |
| `/investor/marketplace`                  | 19-invMarketplace | stub   |
| `/investor/marketplace/[invoiceId]`      | 20-invDetail      | stub   |
| `/investor/marketplace/[invoiceId]/fund` | 21-invFund        | stub   |
| `/investor/whitelisting`                 | 18-invWhitelist   | stub   |
| `/investor/wallet`                       | 24-invWallet      | stub   |
| `/investor/settings`                     | 25-invSettings    | stub   |

## Admin — `admin/` route group, `AdminShell` (top tabs, same on mobile)

| Route                | Screen             | Status |
| -------------------- | ------------------ | ------ |
| `/admin` (redirects) | —                  | done   |
| `/admin/overview`    | 26-adminOverview   | stub   |
| `/admin/reserve`     | 27-adminReserve    | stub   |
| `/admin/provenance`  | 28-adminProvenance | stub   |
| `/admin/ledger`      | 29-adminLedger     | stub   |

## Shared / cross-cutting

| Route              | Screen           | Status | Notes                                                                                                                                                                                                 |
| ------------------ | ---------------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/notifications`   | 30-notifications | stub   | Export shows no nav chrome at either breakpoint — decide whether this renders inside the visitor's current role shell (likely) or is truly standalone before building. See `docs/RAIQUID_CONTEXT.md`. |
| 404                | —                | stub   | `src/app/not-found.tsx`                                                                                                                                                                               |
| Error boundary     | —                | stub   | `src/app/error.tsx`                                                                                                                                                                                   |
| Empty/error states | 31-emptyError    | —      | Not a route — a set of UI states (empty invoice list, delayed-transaction notice) that live inside existing pages. See `docs/DESIGN_SYSTEM.md`, "EmptyState" and "InlineNotice".                      |

## Route-protection

`src/proxy.ts` gates `/business/*`, `/buyer/*`, `/investor/*`, `/admin/*`
by role, per the `ROLE_PREFIXES` map in that file. It's a stub today
(passes every request through) — see the file's own comments for what
"thin proxy" means before wiring real auth into it.
