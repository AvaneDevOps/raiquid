import type { components, paths } from "@/types/api-generated";
import { apiClient, type ApiToken } from "./client";

type PayInvoiceInput = components["schemas"]["PayInvoiceDto"];
type UpdateBuyerSettingsInput = components["schemas"]["UpdateBuyerSettingsDto"];
type BuyerInvoiceListQuery = paths["/buyer/invoices"]["get"]["parameters"]["query"];

export const buyerService = {
  listInvoices<TResponse = unknown>(
    token: ApiToken,
    query?: BuyerInvoiceListQuery,
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
      `/buyer/invoices${queryString ? `?${queryString}` : ""}`,
      token,
    );
  },

  getPaymentSchedule<TResponse = unknown>(token: ApiToken): Promise<TResponse> {
    return apiClient.get<TResponse>("/buyer/payment-schedule", token);
  },

  payInvoice<TResponse = unknown>(
    id: string,
    data: PayInvoiceInput,
    token: ApiToken,
  ): Promise<TResponse> {
    return apiClient.post<TResponse>(`/buyer/invoices/${id}/pay`, data, token);
  },

  getSettings<TResponse = unknown>(token: ApiToken): Promise<TResponse> {
    return apiClient.get<TResponse>("/buyer/settings", token);
  },

  updateSettings<TResponse = unknown>(
    data: UpdateBuyerSettingsInput,
    token: ApiToken,
  ): Promise<TResponse> {
    return apiClient.patch<TResponse>("/buyer/settings", data, token);
  },
};
