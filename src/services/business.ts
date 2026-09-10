import { apiClient } from "./client";

export function createInvoice<TResponse = unknown>(data: unknown): Promise<TResponse> {
  return apiClient.post("/business/invoices", data);
}
