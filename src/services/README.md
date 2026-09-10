# Services

All frontend communication with the Raiquid API belongs here.

- `client.ts` owns the API base URL, bearer token attachment, JSON handling, and API errors.
- `business.ts`, `buyer.ts`, `investor.ts`, `admin.ts`, and `notifications.ts` mirror the backend areas described in the integration guide.
- `src/types/api-generated.ts` is generated from the backend OpenAPI document and must not be edited by hand.

Run `npm run generate:api-types` whenever the backend contract changes.

The integration guide does not document every endpoint yet, so the service modules deliberately do not invent endpoint paths. Add concrete service functions from the generated OpenAPI contract as each area is migrated from fixtures.
