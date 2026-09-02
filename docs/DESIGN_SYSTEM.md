# Design system reference

This documents what the approved screens (`raiquid-screens.zip`, 31
screens × desktop/mobile) actually show, so whoever implements a
component builds the same visual language everywhere instead of
reinventing it per screen.

The `src/components/shared/**` layer described here is **implemented**
(styles + logic, not stubs) — `ui/`, `domain/`, and `layout/`. Render
every piece at `/dev/components` (a dev-only gallery route). The
area-specific folders (`business/`, `buyer/`, `investor/`, `admin/`,
`landing/`) are still empty and fill in as screens get built.

## Method note (why you can trust these numbers)

The color tokens below were **not** eyeballed. They were extracted by
running a pixel histogram + hue-range search over the actual exported
PNGs (`01-landing`, `04-bizDashboard`, `10-bizList`,
`19-invMarketplace`, `22-invPortfolio`, `29-adminLedger`), so the hex
values are real evidence from the design artifact. That said, an
exported PNG is still one step removed from the design source — if a
Figma file or a token export (Figma Tokens / Style Dictionary JSON)
becomes available, reconcile against that and treat it as authoritative
over this document.

Fonts cannot be recovered from pixels, but the families below are now
**settled** — confirmed by the "Ledger of Stone" design session that
produced this system: Fraunces / IBM Plex Sans / IBM Plex Mono. They're
wired up in `src/app/layout.tsx` via `next/font/google`.

## Color tokens

Defined as CSS custom properties in `src/app/globals.css` under
`@theme inline` (Tailwind v4's CSS-first theme config), so they're
usable directly as Tailwind utilities (`bg-surface`, `text-accent-400`,
`border-danger-muted`, etc.) with no `tailwind.config.js` needed.

| Token                      | Hex       | Used for                                    |
| -------------------------- | --------- | ------------------------------------------- |
| `--color-bg`               | `#18150f` | Page background                             |
| `--color-surface`          | `#1e1a13` | Cards, sidebar, table rows                  |
| `--color-surface-raised`   | `#241f16` | Hover state / raised surface                |
| `--color-border`           | `#2b2418` | Default hairline border                     |
| `--color-border-strong`    | `#3a3020` | Emphasized border (inputs, active states)   |
| `--color-foreground`       | `#e8e1d3` | Headings, primary text                      |
| `--color-muted-foreground` | `#948d81` | Secondary/help text                         |
| `--color-accent-400`       | `#e7b862` | Lighter amber (gradient top, hover)         |
| `--color-accent-500`       | `#dcae57` | Amber mid                                   |
| `--color-accent-600`       | `#d19d43` | Deeper amber (gradient bottom)              |
| `--color-success`          | `#7ecbab` | "Repaid", "Confirmed", "Anchored tier" text |
| `--color-success-muted`    | `#3d5a4b` | Success badge border/background tint        |
| `--color-danger`           | `#e58667` | "Overdue", "Failed", "Decline" text         |
| `--color-danger-muted`     | `#6b4433` | Danger badge border/background tint         |

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
`Italiana` is reserved for the logo wordmark only and is not loaded yet
(no logo asset).

## Layout shells

Four distinct shells cover all 31 screens — do not invent a fifth
without a design reason.

1. **Landing chrome** — `LandingHeader` (wordmark, nav links, Sign in /
   Get started) + `LandingFooter` (wordmark, links, sandbox disclaimer).
   Composed directly by the `(landing)` route group's `layout.tsx` —
   there is no single `LandingShell` component.
2. **StandaloneShell** — thin header, no nav links, single centered card
   on a plain background. Used by the `(shared)` route group (auth,
   verify, confirm/*). Reachable pre-authentication.
3. **RoleShell** — desktop: fixed left sidebar (wordmark, nav items,
   user card pinned to the bottom). Mobile: sidebar disappears, nav
   items move to a fixed bottom tab bar, and the user card moves to a
   small header at the top. **Both breakpoints render from the same
   `ROLE_NAV[role]` entry** (`src/lib/nav-config.ts`). `RoleShell` takes
   a `role` prop (`"business" | "buyer" | "investor"`) plus the
   `SessionUser`; `Sidebar` / `BottomTabBar` look the nav array up
   themselves, so the Lucide icon components never cross the
   server→client boundary. Used by `business/`, `buyer/`, `investor/`.
4. **AdminShell** — breadcrumb-style "Raiquid / platform" header over a
   horizontal tab row (Overview / Reserve pool / Provenance registry /
   Ledger). Confirmed **identical at both breakpoints** (screen 26
   mobile keeps the top tabs, horizontally scrollable, rather than
   switching to a bottom bar) — this is a deliberate difference from
   RoleShell, not an oversight. Used by `admin/`.

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

| Component                                                                                 | File                                                     | What it is                                                                                                                                                                                                                                                    |
| ----------------------------------------------------------------------------------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Button`                                                                                  | `shared/ui/button.tsx`                                   | 4 variants (primary/secondary/ghost/danger) × 3 sizes (sm/md/lg). Primary = minted-gold vertical gradient. **Rounded corners — never the seal-chip shape.** `asChild` (via `@radix-ui/react-slot`) renders the style onto a `<Link>` instead of a `<button>`. |
| `Badge`                                                                                   | `shared/ui/badge.tsx`                                    | The generic chip — 4 tones (amber/green/red/neutral), mono, and the **seal-chip silhouette** (see below), applied here so every wrapper inherits it. Never render a raw `<Badge tone="…">` for a status in a page — go through the domain components.         |
| `Card` / `CardHeader` / `CardTitle` / `StatCard`                                          | `shared/ui/card.tsx`                                     | The one panel treatment: `rounded-xl`, `border-border`, `bg-surface`. `StatCard` is label-over-large-figure (e.g. "Active invoices" / "3"); `emphasize` tints the figure minted-gold.                                                                         |
| `ProgressBar`                                                                             | `shared/ui/progress-bar.tsx`                             | Minted-gold horizontal fill bar — invoice funding %, reserve-pool coverage. `percent` clamped 0–100, `role="progressbar"`.                                                                                                                                    |
| `EmptyState`                                                                              | `shared/ui/notice.tsx`                                   | Centered icon + heading + body + CTA (screen 31, "No invoices yet"). `icon` prop takes a node.                                                                                                                                                                |
| `InlineNotice`                                                                            | `shared/ui/notice.tsx`                                   | Dot + copy callout box, 3 tones (`info` / `success` / `danger`) — sandbox disclaimers, reassurance copy, delayed-transaction warnings. The "no real funds move" disclaimer is an `info` notice.                                                               |
| `InvoiceStatusBadge`, `ProvenanceTierBadge`, `WhitelistStatusBadge`, `OnChainStatusBadge` | `shared/domain/status-badges.tsx`                        | Wrap `Badge` with the enum → `{label, tone}` lookup from `src/lib/domain-display.ts`. **The only place a status/tier is rendered.** Change a label or colour in `domain-display.ts`, never inline.                                                            |
| `InvoiceRef`                                                                              | `shared/domain/status-badges.tsx`                        | Monospace id chip, e.g. `RQ-INV-4471`. Same seal-chip shape as the status badges; keeps the id's own casing.                                                                                                                                                  |
| `Stepper`                                                                                 | `shared/domain/stepper.tsx`                              | Numbered-circles-joined-by-a-line tracker. Generic over a `steps` array — drives both `INVOICE_LIFECYCLE_STEPS` (5-stage, screens 06–09) and `WHITELIST_STEPS` (3-stage, screens 03/18) from `domain-display.ts`.                                             |
| `Sidebar`, `BottomTabBar`, `UserSummary`                                                  | `shared/layout/`                                         | Desktop nav (`hidden md:flex`), mobile bottom nav (`flex md:hidden`), and the avatar+name+subtitle card shared between them. `Sidebar`/`BottomTabBar` take `role`, not a nav array.                                                                           |
| `RoleShell`, `AdminShell`, `StandaloneShell`                                              | `shared/layout/`                                         | The three authenticated / semi-authenticated shells described above.                                                                                                                                                                                          |
| `LandingHeader`, `LandingFooter`                                                          | `shared/layout/landing-header.tsx`, `landing-footer.tsx` | Public `(landing)` site chrome.                                                                                                                                                                                                                               |

## The seal-chip shape

Every status / tier / token-id **chip** (never a button, never a card)
has its **top-left and bottom-right corners sliced at 45°**, giving a
stamped-seal / ticket-stub silhouette. It's a `clip-path` polygon in the
`seal-chip` utility (`globals.css`), applied by `<Badge>` so every tone
and every domain wrapper (`InvoiceStatusBadge`, `InvoiceRef`, …) gets it
automatically.

The cut depth is `--seal-chamfer` (currently `7px`), tuned by eye —
revisit against the chips in `04-bizDashboard` / `28-adminProvenance`
once the Figma source is available. Chips currently render as a
tone-tinted fill with no hairline stroke; if the source shows a 1px
border tracking the chamfer, wrap the content in a second element with
the same `seal-chip` class over a 1px tone-coloured pad.

## Domain-specific visual patterns worth naming

- **Struck-through amounts**: repaid/fee-adjusted figures are shown with
  a strikethrough on the original amount next to the net figure (e.g.
  invoice payout breakdown, screen 09). A `.text-strike-muted` utility
  exists in `globals.css` for this.
- **Provenance tier badges are directional**: Quarried (neutral/gray) →
  Carried (amber) → Anchored (green) — the color intensifies as trust
  increases; don't assign tier colors arbitrarily.
- **Sandbox disclaimers appear on every money-moving action** (repay,
  fund) via `InlineNotice` — these are not optional copy, they're a
  because this build settles on a Brickken testnet sandbox (Base
  Sepolia), not real funds. Keep them on any new money-moving screen.
