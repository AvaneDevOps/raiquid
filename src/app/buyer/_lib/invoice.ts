import type { Invoice } from "@/types";

// Shared by every buyer screen that reads invoices — all backed by
// GET /buyer/invoices or GET /buyer/payment-schedule, confirmed against
// the backend source (raiquid-api's BuyerController/BuyerService): a
// Prisma Invoice with `include: { business: true }` — from the buyer's
// side, the "supplier" is the business that issued the invoice, i.e. the
// nested business.legalName. confirmToken is a real scalar field on
// Invoice (used for the magic-link confirm/review flow) — present here
// because listInvoices/getPaymentSchedule don't `select` a restricted
// field set, so it comes through. expectedReturnPct is fed by the real
// investorYieldPct field (Decimal(5,2), already a percentage).
// fundingInvestorCount still has no backing field, same gap as
// elsewhere.
export interface BuyerInvoice extends Invoice {
  supplierName: string;
  confirmToken?: string;
}

interface BusinessRef {
  legalName?: string;
}

export function toBuyerInvoice(raw: Record<string, unknown>): BuyerInvoice {
  const business = raw.business as BusinessRef | undefined;
  const supplierName = business?.legalName ?? "—";
  return {
    id: String(raw.id ?? ""),
    businessId: String(raw.businessId ?? ""),
    buyerId: String(raw.buyerId ?? ""),
    buyerName: supplierName,
    supplierName,
    amount: Number(raw.amount ?? 0),
    dueDate: String(raw.dueDate ?? ""),
    submittedAt: String(raw.createdAt ?? ""),
    description: String(raw.description ?? ""),
    status: (raw.status as Invoice["status"]) ?? "submitted",
    expectedReturnPct: Number(raw.investorYieldPct ?? 0),
    fundedAmount: Number(raw.fundedAmount ?? 0),
    fundingInvestorCount: 0,
    platformFeePct: Number(raw.platformFeePct ?? 0),
    reserveContributionPct: Number(raw.reserveContributionPct ?? 0),
    confirmToken: typeof raw.confirmToken === "string" ? raw.confirmToken : undefined,
  };
}

// submitted/awaiting_acceptance are the only statuses awaiting the
// buyer's review — everything else has already been accepted (or
// disputed and reset, per ConfirmController_submitReview).
export function needsReview(invoice: BuyerInvoice): boolean {
  return invoice.status === "submitted" || invoice.status === "awaiting_acceptance";
}
