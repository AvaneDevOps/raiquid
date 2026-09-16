# Raiquid

Raiquid is a dark-theme Next.js application for tokenised invoice financing for Nigerian SMEs. Businesses upload verified invoices, buyers confirm what they owe, invoices are tokenised and listed for funding, and investors receive returns as the buyer repays on the due date.

The product is built for the Brickken Developer Build Programme and uses the Base Sepolia sandbox, with the design language and product flow documented in the repo's design and route artifacts.

## Project status

This repo is a working frontend implementation with the shared foundation and major role shells in place. The route tree is scaffolded and many screens are implemented, while a few routes remain stubs as noted in the route map.

For the full handoff context, start here:

- docs/RAIQUID_CONTEXT.md
- docs/DESIGN_SYSTEM.md
- docs/ROUTE_MAP.md

## Architecture summary

- One responsive Next.js app, not a monorepo or separate mobile app
- App Router with Next.js 16.3
- TypeScript strict mode
- Tailwind CSS v4 styling
- React 19
- Auth via Clerk, with route protection handled at the app layer
- Domain model and display mappings centralized in src/types/domain.ts and src/lib/domain-display.ts
- Route structure mirrors the URL structure 1:1 in src/app

## Quick start

### Prerequisites

- Node 22 recommended (see .nvmrc)
- npm

### Install and run

```bash
nvm install
nvm use
npm install
cp .env.example .env.local
npm run dev
```

Then open http://localhost:3000.

## Scripts

| Command                    | What it does                                      |
| -------------------------- | ------------------------------------------------- |
| npm run dev                | Start the Next.js dev server with Turbopack       |
| npm run build              | Create a production build                         |
| npm run start              | Run the production app                            |
| npm run lint               | Run ESLint                                        |
| npm run lint:fix           | Auto-fix ESLint issues                            |
| npm run typecheck          | Run TypeScript checks                             |
| npm run format             | Format the repo with Prettier                     |
| npm run format:check       | Check formatting without rewriting files          |
| npm run validate           | Run lint + typecheck + format checks              |
| npm run generate:api-types | Regenerate API types from the live OpenAPI schema |

## Documentation map

- CONTRIBUTING.md — branch flow, commit conventions, PR checklist, and the project rules that prevent drift
- docs/RAIQUID_CONTEXT.md — product definition, architecture decisions, current implementation state, and assumptions to verify
- docs/DESIGN_SYSTEM.md — tokens, typography, shells, and shared component inventory
- docs/ROUTE_MAP.md — route-by-route status and screen mapping

## Repo structure

```text
.
├── AGENTS.md
├── CODEOWNERS
├── CONTRIBUTING.md
├── README.md
├── commitlint.config.js
├── docs/
│   ├── DESIGN_SYSTEM.md
│   ├── RAIQUID_CONTEXT.md
│   ├── ROUTE_MAP.md
│   └── screens/
├── public/
├── scripts/
├── src/
│   ├── app/
│   │   ├── (landing)/
│   │   ├── (shared)/
│   │   ├── admin/
│   │   ├── business/
│   │   ├── buyer/
│   │   ├── investor/
│   │   └── ...
│   ├── components/
│   │   ├── admin/
│   │   ├── business/
│   │   ├── buyer/
│   │   ├── investor/
│   │   ├── landing/
│   │   └── shared/
│   ├── lib/
│   ├── services/
│   ├── types/
│   ├── proxy.ts
│   └── ...
├── .env.example
├── .nvmrc
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── tsconfig.json
└── ...
```

## Working conventions

The repo has a few strong conventions worth following:

- Single source of truth for enums and display mappings in src/types/domain.ts and src/lib/domain-display.ts
- Navigation configuration in src/lib/nav-config.ts rather than per-page duplication
- Shared primitives live under src/components/shared; app-specific ones stay in their route area until a second area needs them
- Route params should use the Next.js generated page prop type pattern
- Dark theme only; no light-mode variant is intended

## Contribution workflow

Before opening a PR:

```bash
npm run validate
npm run build
```

This matches the repo's contribution rules and CI expectations. See CONTRIBUTING.md for branch naming, conventional commits, and review requirements.

## Important note

This repo is still being built out incrementally. The route map and design docs are the source of truth for what is implemented versus stubbbed, and those files should be treated as the canonical reference for screen status and product behavior.
