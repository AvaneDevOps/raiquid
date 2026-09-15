# Documentation and integration compliance audit

Audit target: the repository snapshot supplied for the post-merge cleanup.

## Cleaned in this pass

- Restored the missing `next-auth`/Credentials imports in `src/auth.ts`.
- Removed JSDoc from the touched authentication action so source comments follow the repository's single-line-comment rule.
- Made the investor tier type derive from `ProvenanceTier` instead of redefining the tier union in `src/types/investor.ts`.
- Removed generated `next-env.d.ts` and `tsconfig.tsbuildinfo` artifacts from the repository snapshot.

## Remaining blockers before calling this integration-ready

1. `src/types/api-generated.ts` is missing. The integration guide requires the frontend OpenAPI types to be generated from the backend contract and treated as read-only.
2. The service modules are still generic wrappers rather than typed endpoint functions. This is intentionally deferred in the project context because the integration guide does not document every endpoint yet, but it means live backend integration is not complete.
3. Auth is still Auth.js demo credentials, while the integration guide's live path requires Clerk bearer tokens and Clerk signup metadata. Do not enable live authenticated API calls until that provider decision is reconciled.
4. The supplied environment prevented a dependency install and therefore a definitive `npm run validate` / `npm run build` run could not be completed here. The static TypeScript invocation also failed because the dependency type packages were not fully installed.

## Existing repository convention debt

The repository still contains pre-existing JSDoc/header comments in other `.ts`/`.tsx` files. `CONTRIBUTING.md` says source comments should be rare, single-line `//` comments only, with no JSDoc blocks or file/screen header comments. Those are separate from the post-merge fixes above and should be cleaned in a dedicated refactor if the team wants the entire tree to be strictly comment-compliant.

## Verification performed

- Inspected `AGENTS.md`, `CONTRIBUTING.md`, `docs/RAIQUID_CONTEXT.md`, `docs/ROUTE_MAP.md`, and the frontend/backend integration guide.
- Inspected the buyer screens 13, 14, 15, and 16 from the supplied screenshot exports before making screen-related observations.
- Confirmed the supplied archive has no `.git` history, so the exact merge diff cannot be reconstructed from this snapshot.
