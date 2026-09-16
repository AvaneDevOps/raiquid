# Route map

Every route currently scaffolded, its layout group, the screen it's
built from (`docs/screens/{desktop,mobile}/NN-*.png`), and its current
status. Every `page.tsx`/`layout.tsx` file exists on disk already — this
table is about what's _implemented_ inside each, not whether the route
resolves.

Status legend: **stub** = returns `null` / passes through children only
(current state of everything, per the Sept 2026 strip-down). Once a
route is built for real, flip its status here in the same PR.

## Landing — `(landing)` route group, `LandingHeader` + `LandingFooter`

| Route | Screen     | Status |
| ----- | ---------- | ------ |
| `/`   | 01-landing | done   |

Note: "How it works", "For businesses" and "For investors" are **not
routes** — they are in-page anchors on `/`. `LANDING_NAV` links to
`/#how-it-works`, `/#for-businesses` and `/#for-investors`, so the real
landing page must give those sections `id="how-it-works"`,
`id="for-businesses"` and `id="for-investors"`.

## Shared — `(shared)` route group, no shared shell

| Route                         | Screen          | Chrome                          | Status |
| ----------------------------- | --------------- | ------------------------------- | ------ |
| `/auth`                       | 02-auth         | `LandingHeader` + centered card | done   |
| `/verify`                     | 03-verify       | `LandingHeader` + wide column   | stub   |
| `/confirm/[invoiceId]`        | 13-buyerRequest | `StandaloneShell` (no chrome)   | done   |
| `/confirm/[invoiceId]/review` | 14-buyerAccept  | `StandaloneShell` (no chrome)   | done   |

`(shared)/layout.tsx` is a pass-through — the exports show three
different chrome treatments (see `docs/DESIGN_SYSTEM.md`, "Layout
shells"), so each page composes its own. Reachable without an
authenticated session — `/confirm/*` in particular is the magic-link a
buyer receives by email/SMS. Do not wrap it in an auth check. `/auth`
and `/verify` may move to `(landing)`.

## Business — `business/` route group, `RoleShell` (sidebar / bottom-tabs)

| Route                                | Screen                                                                                        | Status |
| ------------------------------------ | --------------------------------------------------------------------------------------------- | ------ |
| `/business` (redirects to dashboard) | —                                                                                             | done   |
| `/business/dashboard`                | 04-bizDashboard                                                                               | done   |
| `/business/invoices`                 | 10-bizList                                                                                    | done   |
| `/business/invoices/new`             | 05-bizUpload                                                                                  | done   |
| `/business/invoices/[invoiceId]`     | 06/07/08/09 (bizPending/Tokenized/Funding/Payout — one page, 5 status states via the stepper) | done   |
| `/business/wallet`                   | 11-bizWallet                                                                                  | done   |
| `/business/settings`                 | 12-bizSettings                                                                                | done   |

## Buyer — `buyer/` route group, `RoleShell`

| Route                             | Screen                    | Status |
| --------------------------------- | ------------------------- | ------ |
| `/buyer` (redirects to dashboard) | —                         | done   |
| `/buyer/dashboard`                | 15-buyerDashboard         | done   |
| `/buyer/invoices`                 | _(inferred — see note)_   | done   |
| `/buyer/invoices/[invoiceId]/pay` | 16-buyerRepay             | done   |
| `/buyer/payment-schedule`         | 15-buyerDashboard (table) | done   |
| `/buyer/settings`                 | 17-buyerSettings          | done   |

Note: "Invoices to review" — the nav label is verified (screen 15) but
there is no dedicated list-screen export. Build it consistent with
`/business/invoices` (screen 10), but confirm the exact fields with
design first.

## Investor — `investor/` route group, `RoleShell`

| Route                                    | Screen            | Status |
| ---------------------------------------- | ----------------- | ------ |
| `/investor` (redirects to portfolio)     | —                 | done   |
<<<<<<< HEAD
| `/investor/portfolio`                    | 22-invPortfolio   | stub   |
| `/investor/portfolio/[invoiceId]`        | 23-invRepay       | stub   |
| `/investor/marketplace`                  | 19-invMarketplace | stub   |
| `/investor/marketplace/[invoiceId]`      | 20-invDetail      | stub   |
| `/investor/marketplace/[invoiceId]/fund` | 21-invFund        | stub   |
| `/investor/whitelisting`                 | 18-invWhitelist   | stub   |
| `/investor/wallet`                       | 24-invWallet      | stub   |
| `/investor/settings`                     | 25-invSettings    | stub   |
=======
| `/investor/portfolio`                    | 22-invPortfolio   | done   |
| `/investor/portfolio/[invoiceId]`        | 23-invRepay       | done   |
| `/investor/marketplace`                  | 19-invMarketplace | done   |
| `/investor/marketplace/[invoiceId]`      | 20-invDetail      | done   |
| `/investor/marketplace/[invoiceId]/fund` | 21-invFund        | done   |
| `/investor/whitelisting`                 | 18-invWhitelist   | done   |
| `/investor/wallet`                       | 24-invWallet      | done   |
| `/investor/settings`                     | 25-invSettings    | done   |
>>>>>>> 126c1250105090cfeb3f5a136297e976271e7075

## Admin — `admin/` route group, `AdminShell` (top tabs, same on mobile)

| Route                | Screen             | Status |
| -------------------- | ------------------ | ------ |
| `/admin` (redirects) | —                  | done   |
| `/admin/overview`    | 26-adminOverview   | done   |
| `/admin/reserve`     | 27-adminReserve    | done   |
| `/admin/provenance`  | 28-adminProvenance | done   |
| `/admin/ledger`      | 29-adminLedger     | done   |

## Shared / cross-cutting

<<<<<<< HEAD
| Route              | Screen           | Status      | Notes                                                                                                                                                                                                   |
| ------------------ | ---------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/notifications`   | 30-notifications | implemented | Export (screen 30) shows the panel only, no chrome — treat as the export isolating content; render inside the visitor's current role shell. Rows: tone dot + message + relative time (green/amber/red). |
| 404                | —                | implemented | `src/app/not-found.tsx`                                                                                                                                                                                 |
| Error boundary     | —                | implemented | `src/app/error.tsx`                                                                                                                                                                                     |
| Empty/error states | 31-emptyError    | implemented | Not a route — a set of UI states (empty invoice list, delayed-transaction notice) that live inside existing pages. See `docs/DESIGN_SYSTEM.md`, "EmptyState" and "InlineNotice".                        |

## Route-protection

`src/proxy.ts` performs the current thin session-cookie check for
`/business/*`, `/buyer/*`, `/investor/*`, `/admin/*`, while the authoritative
role check remains in each role layout. Replace this seam when the live auth
provider is reconciled with the backend integration guide.
=======
| Route              | Screen           | Status | Notes                                                                                                                                                                                                   |
| ------------------ | ---------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/notifications`   | 30-notifications | stub   | Export (screen 30) shows the panel only, no chrome — treat as the export isolating content; render inside the visitor's current role shell. Rows: tone dot + message + relative time (green/amber/red). |
| 404                | —                | stub   | `src/app/not-found.tsx`                                                                                                                                                                                 |
| Error boundary     | —                | stub   | `src/app/error.tsx`                                                                                                                                                                                     |
| Empty/error states | 31-emptyError    | —      | Not a route — a set of UI states (empty invoice list, delayed-transaction notice) that live inside existing pages. See `docs/DESIGN_SYSTEM.md`, "EmptyState" and "InlineNotice".                        |

## Route-protection

`src/proxy.ts` (Clerk `clerkMiddleware`) bounces unauthenticated requests
on `/business/*`, `/buyer/*`, `/investor/*`, `/admin/*` to `/auth`, while
the authoritative role check remains in each role layout via
`getSessionUser()`, which reads the role from Clerk `publicMetadata`.
>>>>>>> 126c1250105090cfeb3f5a136297e976271e7075
