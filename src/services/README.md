# Services

All frontend communication with the Raiquid API belongs here.

- `client.ts` owns the API base URL, JSON handling, and API errors. Every
  method takes the Clerk session token as an explicit argument — fetch it
  fresh per call (`useAuth().getToken()` client-side, `(await auth()).getToken()`
  server-side) rather than storing it anywhere shared; a module-level token
  would leak across concurrent requests from different users.
- `handle-api-error.ts` classifies a thrown `ApiError` by status (401 vs.
  the "not provisioned yet" 403) and retries the latter with backoff, per
  the integration guide's section 2.2.
- `business.ts`, `buyer.ts`, `investor.ts`, `admin.ts`, and `notifications.ts` mirror the backend areas described in the integration guide.
- `src/types/api-generated.ts` is generated from the backend OpenAPI document and must not be edited by hand.

Run `npm run generate:api-types` whenever the backend contract changes.

The integration guide does not document every endpoint yet, so the service modules deliberately do not invent endpoint paths. Add concrete service functions from the generated OpenAPI contract as each area is migrated from fixtures.
