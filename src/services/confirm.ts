import type { components } from "@/types/api-generated";
import { apiClient } from "./client";

type ReviewConfirmationInput = components["schemas"]["ReviewConfirmationDto"];

export const confirmService = {
  getConfirmation<TResponse = unknown>(invoiceId: string): Promise<TResponse> {
    return apiClient.get<TResponse>(`/confirm/${invoiceId}`, null);
  },

  submitReview<TResponse = unknown>(
    invoiceId: string,
    data: ReviewConfirmationInput,
  ): Promise<TResponse> {
    return apiClient.post<TResponse>(`/confirm/${invoiceId}/review`, data, null);
  },
};

function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null ? (value as Record<string, unknown>) : {};
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function asNumber(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

export interface ConfirmationInvoice {
  id: string;
  supplierName: string;
  amount: number;
  dueDate: string;
  description: string;
  proofOfDeliveryUrl?: string;
}

export function normalizeConfirmation(payload: unknown, fallbackId: string): ConfirmationInvoice {
  const root = asRecord(payload);
  const invoice = asRecord(root.invoice ?? payload);
  const business = asRecord(invoice.business);

  return {
    id: asString(invoice.id, fallbackId),
    supplierName: asString(
      invoice.businessLegalName,
      asString(
        invoice.supplierName,
        asString(business.legalName, asString(business.name, "Your supplier")),
      ),
    ),
    amount: asNumber(invoice.amount),
    dueDate: asString(invoice.dueDate),
    description: asString(invoice.description),
    proofOfDeliveryUrl: asString(invoice.proofOfDeliveryUrl) || undefined,
  };
}
