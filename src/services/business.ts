import type { components, paths } from "@/types/api-generated";
import { apiClient, type ApiToken } from "./client";

type CreateInvoiceInput = components["schemas"]["CreateInvoiceDto"];
type UpdateBusinessSettingsInput = components["schemas"]["UpdateBusinessSettingsDto"];
type BusinessInvoiceListQuery = paths["/business/invoices"]["get"]["parameters"]["query"];

export const businessService = {
  listInvoices<TResponse = unknown>(
    token: ApiToken,
    query?: BusinessInvoiceListQuery,
  ): Promise<TResponse> {
    const params = new URLSearchParams();

    if (query?.page !== undefined) {
      params.set("page", String(query.page));
    }

    if (query?.pageSize !== undefined) {
      params.set("pageSize", String(query.pageSize));
    }

    if (query?.status !== undefined) {
      params.set("status", query.status);
    }

    const queryString = params.toString();

    return apiClient.get<TResponse>(
      `/business/invoices${queryString ? `?${queryString}` : ""}`,
      token,
    );
  },

  getInvoice<TResponse = unknown>(id: string, token: ApiToken): Promise<TResponse> {
    return apiClient.get<TResponse>(`/business/invoices/${id}`, token);
  },

  createInvoice<TResponse = unknown>(
    data: CreateInvoiceInput,
    token: ApiToken,
  ): Promise<TResponse> {
    return apiClient.post<TResponse>("/business/invoices", data, token);
  },

  getWallet<TResponse = unknown>(token: ApiToken): Promise<TResponse> {
    return apiClient.get<TResponse>("/business/wallet", token);
  },

  getSettings<TResponse = unknown>(token: ApiToken): Promise<TResponse> {
    return apiClient.get<TResponse>("/business/settings", token);
  },

  updateSettings<TResponse = unknown>(
    data: UpdateBusinessSettingsInput,
    token: ApiToken,
  ): Promise<TResponse> {
    return apiClient.patch<TResponse>("/business/settings", data, token);
  },
};
