import type { components, paths } from "@/types/api-generated";
import type { Invoice, InvoiceStatus, ProvenanceTier } from "@/types";
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

  getSettings(token: ApiToken): Promise<BuyerSettingsData> {
    return apiClient.get<unknown>("/buyer/settings", token).then(normalizeBuyerSettings);
  },

  updateSettings(data: UpdateBuyerSettingsInput, token: ApiToken): Promise<BuyerSettingsData> {
    return apiClient.patch<unknown>("/buyer/settings", data, token).then(normalizeBuyerSettings);
  },
};

const INVOICE_STATUSES = new Set<InvoiceStatus>([
  "submitted",
  "awaiting_acceptance",
  "tokenized",
  "funding",
  "funded",
  "repaid",
  "overdue",
]);

const PROVENANCE_TIERS = new Set<ProvenanceTier>(["quarried", "carried", "anchored"]);

function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null ? (value as Record<string, unknown>) : {};
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function asNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);

    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return fallback;
}

function asStatus(value: unknown): InvoiceStatus {
  const status = value === "submitted" ? "awaiting_acceptance" : value;
  return typeof status === "string" && INVOICE_STATUSES.has(status as InvoiceStatus)
    ? (status as InvoiceStatus)
    : "awaiting_acceptance";
}

function asProvenanceTier(value: unknown): ProvenanceTier {
  return typeof value === "string" && PROVENANCE_TIERS.has(value as ProvenanceTier)
    ? (value as ProvenanceTier)
    : "quarried";
}

// The current backend OpenAPI document does not describe invoice response bodies,
// so this adapter isolates that contract gap from the UI.
export type BuyerInvoice = Invoice & {
  supplierName: string;
  confirmToken?: string;
};

export function normalizeBuyerInvoices(payload: unknown): BuyerInvoice[] {
  const root = asRecord(payload);
  const items = Array.isArray(payload)
    ? payload
    : Array.isArray(root.items)
      ? root.items
      : Array.isArray(root.data)
        ? root.data
        : Array.isArray(root.invoices)
          ? root.invoices
          : [];

  return items.map((item, index) => {
    const raw = asRecord(item);
    const invoice = asRecord(raw.invoice ?? raw);
    const supplier = asRecord(invoice.business);
    const id = asString(invoice.id, asString(invoice.invoiceNumber, `invoice-${index + 1}`));

    return {
      id,
      tokenId: asString(invoice.tokenId) || undefined,
      businessId: asString(invoice.businessId),
      buyerId: asString(invoice.buyerId),
      buyerName: asString(invoice.buyerLegalName, asString(invoice.buyerName)),
      amount: asNumber(invoice.amount),
      dueDate: asString(invoice.dueDate),
      submittedAt: asString(invoice.submittedAt, asString(invoice.createdAt)),
      description: asString(invoice.description),
      proofOfDeliveryUrl: asString(invoice.proofOfDeliveryUrl) || undefined,
      status: asStatus(invoice.status),
      expectedReturnPct: asNumber(
        invoice.investorYieldPct,
        asNumber(invoice.expectedReturnPct, asNumber(invoice.expectedReturn)),
      ),
      fundedAmount: asNumber(invoice.fundedAmount, asNumber(invoice.amountFunded)),
      fundingInvestorCount: asNumber(invoice.fundingInvestorCount, asNumber(invoice.investorCount)),
      platformFeePct: asNumber(invoice.platformFeePct),
      reserveContributionPct: asNumber(invoice.reserveContributionPct),
      confirmToken: asString(invoice.confirmToken) || undefined,
      supplierName: asString(
        invoice.businessLegalName,
        asString(invoice.supplierName, asString(supplier.legalName, asString(supplier.name, "—"))),
      ),
    } as BuyerInvoice;
  });
}

export interface BuyerSettingsData {
  legalName: string;
  contactEmail: string;
  contactPhone: string;
  provenanceTier: ProvenanceTier;
  onTimePaymentRate: number;
}

export function normalizeBuyerSettings(payload: unknown): BuyerSettingsData {
  const root = asRecord(payload);

  return {
    legalName: asString(root.legalName, asString(root.companyName, asString(root.name))),
    contactEmail: asString(root.contactEmail, asString(root.billingEmail)),
    contactPhone: asString(root.contactPhone, asString(root.phone)),
    provenanceTier: asProvenanceTier(root.provenanceTier),
    onTimePaymentRate: asNumber(root.onTimePaymentRate),
  };
}

export function normalizePaymentSchedule(payload: unknown): BuyerInvoice[] {
  return normalizeBuyerInvoices(payload);
}
