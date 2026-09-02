# Raiquid

Tokenized invoice financing for Nigerian SMEs — businesses get paid early
on verified invoices; investors fund fractions of those invoices;
buyers formally confirm what they owe. Built on Brickken blockchain
infrastructure (Base Sepolia sandbox) for the Brickken Developer Build
Programme.

One responsive Next.js web app -- no separate mobile app, no monorepo.
Mobile is the same app at a narrower breakpoint.

**Start here:** [`docs/RAIQUID_CONTEXT.md`](./docs/RAIQUID_CONTEXT.md) --
project context, domain model, architecture decisions, and the current
state of the build. Read it before writing code.

## Stack

- [Next.js 16](https://nextjs.org/docs) (App Router, Turbopack, typed routes)
- TypeScript (strict)
- Tailwind CSS v4
- React 19

## Quick start

```bash
nvm use
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000.

## Scripts

| Command             | What it does                                         |
| ------------------- | ---------------------------------------------------- |
| `npm run dev`       | Start the dev server (Turbopack)                     |
| `npm run build`     | Production build                                     |
| `npm run lint`      | ESLint                                               |
| `npm run typecheck` | `tsc --noEmit`                                       |
| `npm run format`    | Prettier, write mode                                 |
| `npm run validate`  | lint + typecheck + format:check (run before pushing) |

## Documentation

- [`docs/RAIQUID_CONTEXT.md`](./docs/RAIQUID_CONTEXT.md) -- full project
  context and handover notes
- [`docs/DESIGN_SYSTEM.md`](./docs/DESIGN_SYSTEM.md) -- tokens, type
  scale, component inventory
- [`docs/ROUTE_MAP.md`](./docs/ROUTE_MAP.md) -- every route, its source
  screen, and its build status
- [`CONTRIBUTING.md`](./CONTRIBUTING.md) -- branching, commits, PR
  checklist, the rules that keep this codebase consistent

## Project structure

```
src/
  app/                 route tree (see docs/ROUTE_MAP.md for the full map)
    (landing)/         raiquid.io public pages
    (standalone)/      auth, verify, magic-link confirm -- no app chrome
    business/           buyer/           investor/           admin/
    dev/components/     dev-only component gallery (delete before shipping)
  components/
    shared/ui/         generic primitives (Button, Card, Badge, ...)
    shared/domain/     Raiquid-specific (status badges, invoice stepper)
    shared/layout/     shells (RoleShell, AdminShell, StandaloneShell)
    business/ buyer/ investor/ admin/ landing/   area-specific components
  lib/                 utils, formatting, nav config, domain display maps
  types/               domain model (single source of truth for enums)
```
