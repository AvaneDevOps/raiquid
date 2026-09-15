import { apiClient, type ApiToken } from "./client";
import type { components } from "@/types/api-generated";

export type CreateInvoiceDto = components["schemas"]["CreateInvoiceDto"];

export function createInvoice<TResponse = unknown>(
  data: CreateInvoiceDto,
  token: ApiToken,
): Promise<TResponse> {
  return apiClient.post("/business/invoices", data, token);
}

// Same thin generic pattern as buyer.ts/investor.ts/admin.ts/notifications.ts
// — /business/invoices (list) and /business/invoices/{id} aren't documented
// with a response schema (see src/types/api-generated.ts), so callers pass
// their own TResponse.
export const businessService = {
  get<TResponse>(path: string, token: ApiToken) {
    return apiClient.get<TResponse>(path, token);
  },
};
