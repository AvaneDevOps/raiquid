# Design system reference

This documents what the approved screens actually show, so whoever
implements a component builds the same visual language everywhere
instead of reinventing it per screen. The exports live in
`docs/screens/{desktop,mobile}/` (31 screens each) — open the file
before making a "screen NN shows X" claim (see "Working with screen
evidence" in `docs/RAIQUID_CONTEXT.md`).

The `src/components/shared/**` layer described here is **implemented**
(styles + logic, not stubs) — `ui/`, `domain/`, and `layout/` — and was
reconciled against the exports on 2026-09-04. Render every piece at
`/dev/components` (a dev-only gallery route). The area-specific folders
(`business/`, `buyer/`, `investor/`, `admin/`, `landing/`) are still
empty and fill in as screens get built.

## Method note (why you can trust these numbers)

The color tokens below were **not** eyeballed. They were extracted by
running a pixel histogram + hue-range search over the actual exported
PNGs, so the hex values are real evidence from the design artifact. That
said, an exported PNG is still one step removed from the design source —
if a Figma file or a token export becomes available, reconcile against
that and treat it as authoritative over this document.

Fonts cannot be recovered from pixels. The families are a considered
visual match against every export (a serif with an italic display cut, a
humanist sans, a monospace) and were named by the "Ledger of Stone"
design session: Fraunces / IBM Plex Sans / IBM Plex Mono. Wired up in
`src/app/layout.tsx` via `next/font/google`. Treat as settled unless the
Figma says otherwise.

## Color tokens

Defined as CSS custom properties in `src/app/globals.css` under
`@theme inline` (Tailwind v4's CSS-first theme config), so they're
usable directly as Tailwind utilities (`bg-surface`, `text-accent-400`,
`border-danger-muted`, etc.) with no `tailwind.config.js` needed.

| Token                      | Hex       | Used for                                                                                              |
| -------------------------- | --------- | ----------------------------------------------------------------------------------------------------- |
| `--color-bg`               | `#18150f` | Page background                                                                                       |
| `--color-surface`          | `#1e1a13` | Cards, sidebar, table rows                                                                            |
| `--color-surface-raised`   | `#241f16` | Hover state / raised surface                                                                          |
| `--color-border`           | `#2b2418` | Default hairline border                                                                               |
| `--color-border-strong`    | `#3a3020` | Emphasized border (inputs, active states)                                                             |
| `--color-foreground`       | `#e8e1d3` | Headings, primary text                                                                                |
| `--color-muted-foreground` | `#948d81` | Secondary/help text                                                                                   |
| `--color-accent-400`       | `#e7b862` | Lighter amber (gradient top, hover)                                                                   |
| `--color-accent-500`       | `#dcae57` | Amber mid                                                                                             |
| `--color-accent-600`       | `#d19d43` | Deeper amber (gradient bottom)                                                                        |
| `--color-success`          | `#7ecbab` | Green chip text/stroke: Tokenized, Funded, Repaid, Confirmed, Anchored, Whitelisted; positive returns |
| `--color-success-muted`    | `#3d5a4b` | (currently unused)                                                                                    |
| `--color-danger`           | `#e58667` | Red chip text/stroke: Overdue, Failed; "−₦" deductions                                                |
| `--color-danger-muted`     | `#6b4433` | `danger` Button border                                                                                |

Amber/gold is the one recurring accent — used for primary CTAs, the
active nav state, in-progress status chips, and money figures the
platform wants to draw the eye to (e.g. "You receive early"). Green and
red-orange are reserved strictly for success/danger semantics — never
used decoratively.

Team vocabulary (from the design session; the CSS variable names above
stay as-is for now): `--color-bg` = _basalt-950_, `--color-surface` =
_basalt-900_, `--color-surface-raised` = _basalt-850_, `--color-border`
= _line_, `--color-border-strong` = _line-strong_, `--color-foreground`
= _limestone_, `--color-muted-foreground` = _stone_, accent =
_minted-gold_, success = _patina-green_, danger = _rust-red_.

Raiquid is **dark-theme only, everywhere**, including the `(landing)`
pages. There is no light theme — do not add one. `globals.css` sets
`color-scheme: dark`.

## Typography

| Token            | Family        | Used for                                                                                            |
| ---------------- | ------------- | --------------------------------------------------------------------------------------------------- |
| `--font-display` | Fraunces      | Headings, `CardTitle`, stat figures — the serif with the elegant italic treatment                   |
| `--font-sans`    | IBM Plex Sans | Body copy, labels, form inputs, nav — everything not a heading or a datum                           |
| `--font-mono`    | IBM Plex Mono | Invoice/token ids, on-chain addresses, the text inside every seal chip, the browser-chrome url bars |

All three are loaded via `next/font/google` in `src/app/layout.tsx`
(self-hosted, no external `<link>`, no layout shift) and exposed to
Tailwind as the `font-display` / `font-sans` / `font-mono` utilities.

The **logo** is an "R" in a filled minted-gold rounded square on the
marketing header (screens 01–03), and a thin hexagon outline in the app
sidebar / admin header (screens 04+). The shells currently use a single
Lucide `Hexagon` glyph everywhere — replace with the real two-form mark
when an asset lands.

## Layout shells

Landing chrome, `RoleShell` and `AdminShell` cover the app; the
`(shared)` pre-auth screens each bring their own. Don't invent a new one
without a design reason.

1. **Landing chrome** — `LandingHeader` (wordmark, nav links, Sign in /
   Get started) + `LandingFooter` (wordmark, links, sandbox disclaimer).
   Composed directly by the `(landing)` route group's `layout.tsx` —
   there is no single `LandingShell` component.
2. **`(shared)` group has no single shell.** The exports show three
   different treatments and `(shared)/layout.tsx` is a pass-through:
   - `/confirm/*` (13, 14) — **`StandaloneShell`**: a chromeless
     centered `max-w-lg` card, no wordmark, no header.
   - `/auth` (02) — the marketing **`LandingHeader`** (no footer) over a
     centered card.
   - `/verify` (03) — the marketing **`LandingHeader`** (no footer) over
     a wide left-aligned column, no card.
     Open question for the team: `/auth` and `/verify` arguably belong in
     `(landing)`. Left in `(shared)` for now; each page composes its own
     chrome when built.
3. **RoleShell** — desktop: fixed left sidebar (wordmark, **text-only
   nav items — no icons**, active item = minted-gold text on a raised
   rounded rect, user card pinned bottom). Mobile: sidebar hidden, nav
   moves to a fixed bottom tab bar (**a small dot per item**, not an
   icon), user card moves to a slim top header. **Both breakpoints
   render from the same `ROLE_NAV[role]` entry** (`src/lib/nav-config.ts`).
   `RoleShell` takes a `role` prop (`"business" | "buyer" | "investor"`)
   plus the `SessionUser`. Used by `business/`, `buyer/`, `investor/`.
4. **AdminShell** — "Raiquid / platform" wordmark over a horizontal
   text-only tab row (Overview / Reserve pool / Provenance registry /
   Ledger); active tab = minted-gold text + minted-gold underline.
   Confirmed **identical at both breakpoints** (screen 26 mobile keeps
   the top tabs, horizontally scrollable, rather than switching to a
   bottom bar). Used by `admin/`.

Implement shells as CSS-only responsive (`hidden md:flex` /
`flex md:hidden`), not JS `matchMedia` — both the sidebar and the
bottom-tab markup should always be in the DOM to avoid a
hydration-mismatch risk, with breakpoint-only visibility toggled by
Tailwind classes.

## Component inventory

`src/components/` is split into **`shared/`** (components that appear
across multiple roles or are generic) and **one folder per app area**
(`business/`, `buyer/`, `investor/`, `admin/`, `landing/`) for
components unique to that part of the app.

**Shared vs. area-specific:** a component starts life in its area
folder. It only moves to `shared/` once a _second_ area actually needs
it — don't pre-emptively share. If a second area needs an area-specific
component, promote it to `src/components/shared/` rather than
duplicating it. Each area folder carries an `index.ts` barrel and a
`README.md` stating this rule.

Everything below lives under `src/components/shared/` and is
**implemented**. Each subfolder has an `index.ts` barrel, so
`@/components/shared/ui`, `.../domain`, `.../layout` all work as import
paths.

| Component                                                                                 | File                                                     | What it is                                                                                                                                                                                                                                                                                                                                                                         |
| ----------------------------------------------------------------------------------------- | -------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Button`                                                                                  | `shared/ui/button.tsx`                                   | 4 variants (primary/secondary/ghost/danger) × 3 sizes (sm/md/lg). Primary = minted-gold vertical gradient. **Rounded corners — never the seal-chip shape.** `asChild` (via `@radix-ui/react-slot`) renders the style onto a `<Link>` instead of a `<button>`.                                                                                                                      |
| `Badge`                                                                                   | `shared/ui/badge.tsx`                                    | The generic chip — 4 tones (amber/green/red/neutral), mono, **sentence case (label as-written, not uppercased)**, and the **seal-chip silhouette** (see below). Never render a raw `<Badge tone="…">` for a status in a page — go through the domain components.                                                                                                                   |
| `Card` / `CardHeader` / `CardTitle` / `StatCard`                                          | `shared/ui/card.tsx`                                     | The one panel treatment: `rounded-xl`, `border-border`, `bg-surface`. `StatCard` is label-over-large-figure (e.g. "Active invoices" / "3"). The label is plain sentence-case muted text (not uppercased); `emphasize` tints the figure minted-gold — used for the screen's headline metric, money or not (screen 26 emphasises a rate).                                            |
| `ProgressBar`                                                                             | `shared/ui/progress-bar.tsx`                             | Minted-gold horizontal fill bar — invoice funding %, reserve-pool coverage. `percent` clamped 0–100, `role="progressbar"`.                                                                                                                                                                                                                                                         |
| `EmptyState`                                                                              | `shared/ui/notice.tsx`                                   | Centered icon + serif heading + body + CTA (screen 31, "No invoices yet"). Content only — no self-border; screen 31 sits it inside a `Card`. `icon` prop takes a node.                                                                                                                                                                                                             |
| `InlineNotice`                                                                            | `shared/ui/notice.tsx`                                   | Dot + copy callout box, 3 tones (`info` / `success` / `danger`). **Dot, border, faint fill and the body text are all the tone colour** (screens 03/06/07/16/31). The "no real funds move" disclaimer is an `info` notice.                                                                                                                                                          |
| `InvoiceStatusBadge`, `ProvenanceTierBadge`, `WhitelistStatusBadge`, `OnChainStatusBadge` | `shared/domain/status-badges.tsx`                        | Wrap `Badge` with the enum → `{label, tone}` lookup from `src/lib/domain-display.ts`. **The only place a status/tier is rendered.** Change a label or colour in `domain-display.ts`, never inline.                                                                                                                                                                                 |
| `InvoiceRef`                                                                              | `shared/domain/status-badges.tsx`                        | Monospace id chip, e.g. `RQ-INV-4471`. Amber on the invoice-detail header (screens 06–09); `tone="green"` once the token is closed/burned (screen 23). Render the raw string, not this chip, for an inline id in a table row or notification.                                                                                                                                      |
| `Stepper`                                                                                 | `shared/domain/stepper.tsx`                              | Circles-joined-by-a-line tracker (verified screens 03/06/07/08/18). Complete = filled patina-green + check, current = filled minted-gold + number, upcoming = outline. Drives `INVOICE_LIFECYCLE_STEPS` (Submitted → Buyer review → Tokenized → Funded → Repaid; map a status to its index with `INVOICE_STATUS_STEP_INDEX`) and `WHITELIST_STEPS`, both from `domain-display.ts`. |
| `Sidebar`, `BottomTabBar`, `UserSummary`                                                  | `shared/layout/`                                         | Desktop nav (`hidden md:flex`, text-only items), mobile bottom nav (`flex md:hidden`, a dot per item), and the avatar+name+subtitle card shared between them. `Sidebar`/`BottomTabBar` take `role`, not a nav array.                                                                                                                                                               |
| `RoleShell`, `AdminShell`, `StandaloneShell`                                              | `shared/layout/`                                         | The three authenticated / semi-authenticated shells described above.                                                                                                                                                                                                                                                                                                               |
| `LandingHeader`, `LandingFooter`                                                          | `shared/layout/landing-header.tsx`, `landing-footer.tsx` | Public `(landing)` site chrome.                                                                                                                                                                                                                                                                                                                                                    |

## The seal-chip shape

Every status / tier / token-id **chip** (never a button, never a card)
has its **top-left and bottom-right corners sliced at 45°** (verified
against chip crops from screens 04/06/10/28), giving a stamped-seal /
ticket-stub silhouette. It's a `clip-path` polygon in the `seal-chip`
utility (`globals.css`), applied by `<Badge>` so every tone and every
domain wrapper gets it automatically.

The cut depth is `--seal-chamfer` — **`6px`**, measured off 4×
chip crops (the exports may be a 2× render, so treat as ±2px). Chips
render as a **1px tone-coloured stroke that follows the chamfer** (an
`inset` box-shadow, which `clip-path` clips to the polygon) + tone
mono text, **no fill** — the chip interior is the page/card background
(verified: screens 04/06/07/09/10/28/29).

## Domain-specific visual patterns worth naming

- **Deductions are shown in `--color-danger` with a "−₦" prefix**, not
  a strikethrough (invoice payout breakdown screen 09, the financing
  estimate on screen 01, invoice detail screen 20). No strikethrough
  pattern appears in any export (checked 09/16/20/23); there is no
  `.text-strike-muted` utility.
- **Provenance tier badges are directional**: Quarried (neutral/gray) →
  Carried (amber) → Anchored (green) — the color intensifies as trust
  increases. The `domain-display` labels carry a "tier" suffix
  ("Carried tier"), matching screens 06/15/20; the registry (screen 28)
  drops it because that column is headed "Tier".
- **Invoice-status tone** (verified screens 04/06/07/08/09/10):
  `tokenized`, `funded` and `repaid` are **green** — each is a completed
  milestone. `overdue` is red. `submitted`, `awaiting_acceptance` and
  `funding` are amber. `tokenized` being green was mis-flagged as amber
  in an earlier pass; a pixel sample of 07-bizTokenized reads `#68c0a2`,
  identical to the "Funded"/"Repaid" chips.
- **On-chain**: `confirmed` green, `pending` amber, `failed` red
  (screen 29). The action ("Mint" / "Transfer" / "Burn" / "Whitelist")
  is an amber chip in the ledger (29) but plain mono text in the
  overview (26) — no shared component for it yet.
- **Sandbox disclaimers appear on every money-moving action** (repay,
  fund) as an `info` `InlineNotice` (screens 03/16/18) — not optional
  copy, because this build settles on a Brickken testnet sandbox (Base
  Sepolia), not real funds. Keep them on any new money-moving screen.
- **Notifications** (screen 30): each row is a tone dot + message +
  relative timestamp — positive = green, informational = amber,
  warning = red. Invoice ids inside the message are plain mono, not
  chips.
