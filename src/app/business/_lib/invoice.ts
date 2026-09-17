import type { Invoice } from "@/types";

// Shared by business/invoices/page.tsx and business/dashboard/page.tsx —
// both read plain GET /business/invoices rows. Response shape confirmed
// against the backend source (raiquid-api's BusinessService.listInvoices):
// a Prisma Invoice with `include: { buyer: true }`, so buyerName is the
// nested buyer.legalName, not a flat field. expectedReturnPct is fed by
// the real investorYieldPct field (Decimal(5,2), already a percentage).
// fundingInvestorCount still has no backing field, same gap as
// elsewhere.
interface BuyerRef {
  legalName?: string;
}

export function toInvoice(raw: Record<string, unknown>): Invoice {
  const buyer = raw.buyer as BuyerRef | undefined;
  return {
    id: String(raw.id ?? ""),
    businessId: String(raw.businessId ?? ""),
    buyerId: String(raw.buyerId ?? ""),
    buyerName: buyer?.legalName ?? "—",
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
  };
}

// Matches admin's own real definition of "active" (raiquid-api's
// admin.service.ts, PIPELINE_EXCLUDED): not submitted/awaiting_acceptance
// (not yet accepted) and not repaid (fully settled) — i.e. genuinely
// in-flight (tokenized, funding, funded, or overdue).
export function isActive(invoice: Invoice): boolean {
  return (
    invoice.status !== "submitted" &&
    invoice.status !== "awaiting_acceptance" &&
    invoice.status !== "repaid"
  );
}
