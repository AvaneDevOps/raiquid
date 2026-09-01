# Design system reference

This documents what the approved screens (`raiquid-screens.zip`, 31
screens × desktop/mobile) actually show, so whoever implements a
component builds the same visual language everywhere instead of
reinventing it per screen. It is a reference, not code — the
components it describes are currently empty stubs in
`src/components/`; see each stub's TODO comment for a pointer back here.

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

Fonts, by contrast, are **not** evidence — you cannot recover a font
family from pixels. They're a considered visual match, flagged as an
assumption below. Confirm with design before shipping.

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

## Typography (assumption — confirm before shipping)

| Token            | Family (assumed) | Used for                                                                                              |
| ---------------- | ---------------- | ----------------------------------------------------------------------------------------------------- |
| `--font-display` | Fraunces (serif) | Headings — has the elegant italic treatment seen on "working capital." in the hero                    |
| `--font-sans`    | Inter            | Body copy, labels, form inputs                                                                        |
| `--font-mono`    | JetBrains Mono   | Invoice/token ids, on-chain addresses, status chips, the browser-chrome-style url bars in the mockups |

All three are loaded via `next/font/google` in the root layout once
implemented (no external `<link>` tags, no layout shift).

## Layout shells

Four distinct shells cover all 31 screens — do not invent a fifth
without a design reason.

1. **MarketingShell** — header (logo, nav links, Sign in / Get started)
   - footer. Used by `(marketing)`.
2. **StandaloneShell** — thin header, no nav links, single centered card
   on a plain background. Used by `(standalone)` (auth, verify,
   confirm/*). Reachable pre-authentication.
3. **RoleShell** — desktop: fixed left sidebar (logo, nav items, user
   card pinned to the bottom). Mobile: sidebar disappears, nav items
   move to a fixed bottom tab bar, and the user card moves to a small
   header at the top. **Both breakpoints render from the exact same
   `NavItem[]` array** (`src/lib/nav-config.ts`) — confirmed by
   comparing screen 04/15/19 desktop vs. mobile exports pixel-for-pixel
   on nav item order and labels. Used by `business/`, `buyer/`,
   `investor/`.
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

Every one of these appears in `src/components/`, currently as an empty
stub. Build in roughly this order — later components depend on
earlier ones.

| Component                                                                                 | File                       | What it is                                                                                                                                                                                                                     |
| ----------------------------------------------------------------------------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `Button`                                                                                  | `ui/button.tsx`            | 4 variants (primary/secondary/ghost/danger) × 3 sizes. Primary = amber gradient fill. Needs `asChild` (via `@radix-ui/react-slot`, already a dependency) to render as a `<Link>` without nesting `<a>` inside `<button>`.      |
| `Badge`                                                                                   | `ui/badge.tsx`             | Bordered pill, 4 tones (amber/green/red/neutral), mono font. This is the _generic_ primitive — status-specific rendering goes through the domain components below, never a raw `<Badge tone="...">` in a page.                 |
| `Card` / `CardHeader` / `CardTitle` / `StatCard`                                          | `ui/card.tsx`              | The one panel treatment used everywhere: rounded-xl, `border-border`, `bg-surface`. `StatCard` is the label-over-large-figure pattern (e.g. "Active invoices" / "3").                                                          |
| `ProgressBar`                                                                             | `ui/progress-bar.tsx`      | Amber horizontal bar — invoice funding %, reserve pool chart.                                                                                                                                                                  |
| `EmptyState`                                                                              | `ui/notice.tsx`            | Centered icon + heading + body + CTA (screen 31, "No invoices yet").                                                                                                                                                           |
| `InlineNotice`                                                                            | `ui/notice.tsx`            | Dot + copy callout box, 3 tones — sandbox disclaimers, reassurance copy, delayed-transaction warnings. Used constantly; check screens 03/05/13/14/16/18/21/31 for real copy examples.                                          |
| `InvoiceStatusBadge`, `ProvenanceTierBadge`, `WhitelistStatusBadge`, `OnChainStatusBadge` | `domain/status-badges.tsx` | Wrap `Badge` with the enum -> {label, tone} lookup from `src/lib/domain-display.ts`. **These are the only place a status/tier ever gets rendered** — never call `<Badge tone="green">Repaid</Badge>` directly in a page.       |
| `InvoiceRef`                                                                              | `domain/status-badges.tsx` | Monospace id chip, e.g. `RQ-INV-4471`.                                                                                                                                                                                         |
| `Stepper`                                                                                 | `domain/stepper.tsx`       | Numbered-circle-connected-by-a-line tracker. Generic over a `steps` array — reused for the 5-stage invoice lifecycle (screens 06-09) AND the 3-stage verify/whitelisting flows (screens 03, 18). Don't build a second stepper. |
| `Sidebar`, `BottomTabBar`, `UserSummary`                                                  | `layout/`                  | Desktop nav, mobile nav, and the avatar+name+subtitle card shared between them.                                                                                                                                                |
| `RoleShell`, `AdminShell`, `StandaloneShell`                                              | `layout/`                  | The three authenticated/semi-authenticated shells described above.                                                                                                                                                             |
| `MarketingHeader`, `MarketingFooter`                                                      | `layout/`                  | Public site chrome.                                                                                                                                                                                                            |

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
