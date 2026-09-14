import { apiClient, type ApiToken } from "./client";

export function createInvoice<TResponse = unknown>(
  data: unknown,
  token: ApiToken,
): Promise<TResponse> {
  return apiClient.post("/business/invoices", data, token);
}
