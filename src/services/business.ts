import type { components, paths } from "@/types/api-generated";
import type { Invoice, InvoiceStatus } from "@/types";
import { apiClient, type ApiToken } from "./client";

export interface BusinessSettingsData {
  legalName: string;
  registrationNumber: string;
  countryOfIncorporation: string;
  contactEmail: string;
  contactPhone: string;
  payoutWalletAddress: string;
}

export type BusinessSettings = BusinessSettingsData;

export function normalizeBusinessSettings(payload: unknown): BusinessSettingsData {
  const root = asRecord(payload);

  return {
    legalName: asString(root.legalName, asString(root.name)),
    registrationNumber: asString(root.registrationNumber),
    countryOfIncorporation: asString(root.countryOfIncorporation),
    contactEmail: asString(root.contactEmail),
    contactPhone: asString(root.contactPhone, asString(root.phone)),
    payoutWalletAddress: asString(root.payoutWalletAddress),
  };
}

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

  getSettings(token: ApiToken): Promise<BusinessSettingsData> {
    return apiClient.get<unknown>("/business/settings", token).then(normalizeBusinessSettings);
  },

  updateSettings(
    data: UpdateBusinessSettingsInput,
    token: ApiToken,
  ): Promise<BusinessSettingsData> {
    return apiClient
      .patch<unknown>("/business/settings", data, token)
      .then(normalizeBusinessSettings);
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
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  return fallback;
}

function asStatus(value: unknown): InvoiceStatus {
  const status = value === "submitted" ? "awaiting_acceptance" : value;
  return typeof status === "string" && INVOICE_STATUSES.has(status as InvoiceStatus)
    ? (status as InvoiceStatus)
    : "awaiting_acceptance";
}

// The current backend OpenAPI document does not describe invoice response bodies,
// so this adapter isolates that contract gap from the UI.
export function normalizeBusinessInvoices(payload: unknown): Invoice[] {
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
    const buyer = asRecord(invoice.buyer);
    const id = asString(invoice.id, asString(invoice.invoiceNumber, `invoice-${index + 1}`));
    const amount = asNumber(invoice.amount);
    const fundedAmount = asNumber(invoice.fundedAmount, asNumber(invoice.amountFunded));

    return {
      id,
      tokenId: asString(invoice.tokenId) || undefined,
      businessId: asString(invoice.businessId),
      buyerId: asString(invoice.buyerId),
      buyerName: asString(
        invoice.buyerLegalName,
        asString(invoice.buyerName, asString(buyer.legalName, asString(buyer.name, "—"))),
      ),
      amount,
      dueDate: asString(invoice.dueDate),
      submittedAt: asString(invoice.submittedAt, asString(invoice.createdAt)),
      description: asString(invoice.description),
      proofOfDeliveryUrl: asString(invoice.proofOfDeliveryUrl) || undefined,
      status: asStatus(invoice.status),
      expectedReturnPct: asNumber(invoice.expectedReturnPct, asNumber(invoice.expectedReturn)),
      fundedAmount,
      fundingInvestorCount: asNumber(invoice.fundingInvestorCount, asNumber(invoice.investorCount)),
      platformFeePct: asNumber(invoice.platformFeePct),
      reserveContributionPct: asNumber(invoice.reserveContributionPct),
    };
  });
}

export interface BusinessWalletData {
  totalReceived: number;
  pendingPayout?: {
    id: string;
    date: string;
    invoiceId: string;
    amount: number;
    status: "pending" | "received";
    invoiceStatus: InvoiceStatus;
  };
  payoutAccount: {
    bankName: string;
    accountNumberLast4: string;
    accountHolderName: string;
  };
  payoutHistory: Array<{
    id: string;
    date: string;
    invoiceId: string;
    amount: number;
    status: "pending" | "received";
  }>;
}

export function normalizeBusinessWallet(payload: unknown): BusinessWalletData {
  const root = asRecord(payload);
  const account = asRecord(root.payoutAccount ?? root.payoutBankAccount ?? root.bankAccount);
  const pending = asRecord(root.pendingPayout ?? root.pending);
  const historyValue = root.payoutHistory ?? root.payouts ?? root.transactions;
  const history = Array.isArray(historyValue) ? historyValue : [];

  const normalizePayout = (value: unknown, index: number) => {
    const payout = asRecord(value);
    const status = payout.status === "received" ? "received" : "pending";
    return {
      id: asString(payout.id, `payout-${index + 1}`),
      date: asString(payout.date, asString(payout.createdAt)),
      invoiceId: asString(payout.invoiceId),
      amount: asNumber(payout.amount),
      status: status as "pending" | "received",
    };
  };

  const pendingPayout =
    Object.keys(pending).length > 0
      ? {
          ...normalizePayout(pending, 0),
          invoiceStatus: asStatus(pending.invoiceStatus),
        }
      : undefined;

  return {
    totalReceived: asNumber(root.totalReceived, asNumber(root.balance, asNumber(root.total))),
    pendingPayout,
    payoutAccount: {
      bankName: asString(account.bankName, asString(account.bank)),
      accountNumberLast4: asString(
        account.accountNumberLast4,
        asString(account.last4, asString(account.accountNumber).slice(-4)),
      ),
      accountHolderName: asString(account.accountHolderName, asString(account.accountName)),
    },
    payoutHistory: history.map(normalizePayout),
  };
}
