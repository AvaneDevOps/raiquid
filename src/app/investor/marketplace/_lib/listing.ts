import type { MarketplaceListing } from "@/components/investor";

// Shared by the marketplace list and detail pages — both call
// GET /investor/marketplace(/{id}), confirmed against the backend source
// (raiquid-api's InvestorService.listMarketplace/getMarketplaceListing):
// a Prisma Invoice with `include: { buyer: true }` (detail also includes
// `business`, unused here — this screen never displays the supplier).
// Buyer name and provenance tier are the nested raw.buyer object, not flat
// fields. amount, dueDate, status, fundedAmount, platformFeePct and
// reserveContributionPct are all real. expectedReturnPct is fed by the
// real investorYieldPct field (Decimal(5,2), already a percentage —
// same convention as platformFeePct/reserveContributionPct). Only
// fundingInvestorCount still has no backing field — see
// docs/RAIQUID_CONTEXT.md, "Open decisions".
interface BuyerRef {
  legalName?: string;
  provenanceTier?: MarketplaceListing["provenanceTier"];
}

export function toListing(raw: Record<string, unknown>): MarketplaceListing {
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
    status: (raw.status as MarketplaceListing["status"]) ?? "tokenized",
    expectedReturnPct: Number(raw.investorYieldPct ?? 0),
    fundedAmount: Number(raw.fundedAmount ?? 0),
    fundingInvestorCount: 0,
    platformFeePct: Number(raw.platformFeePct ?? 0),
    reserveContributionPct: Number(raw.reserveContributionPct ?? 0),
    provenanceTier: buyer?.provenanceTier ?? "quarried",
  };
}

// The buyer's reputation numbers do have real fields (Buyer.acceptanceRate,
// onTimePaymentRate, invoicesFinancedCount) — but per the backend's own
// code comment (raiquid-api's admin.service.ts), they're 0 for every buyer
// today because computing them was deferred; this isn't a guess or a
// fabricated placeholder, it's the real field read as-is, which happens to
// currently be 0 until that computation is built. acceptanceRate/
// onTimePaymentRate are stored as 0..1 decimals, scaled to a percentage
// here. memberSince has no literal field — buyer.createdAt is the closest
// real proxy (when the buyer record was created).
export interface BuyerProvenance {
  acceptanceRatePct: number;
  onTimeRatePct: number | null;
  invoicesFinanced: number;
  memberSince: string;
}

interface BuyerReputationRef {
  acceptanceRate?: string | number;
  onTimePaymentRate?: string | number;
  invoicesFinancedCount?: number;
  createdAt?: string;
}

export function toBuyerProvenance(raw: Record<string, unknown>): BuyerProvenance {
  const buyer = raw.buyer as BuyerReputationRef | undefined;
  return {
    acceptanceRatePct: Number(buyer?.acceptanceRate ?? 0) * 100,
    onTimeRatePct: Number(buyer?.onTimePaymentRate ?? 0) * 100,
    invoicesFinanced: Number(buyer?.invoicesFinancedCount ?? 0),
    memberSince: String(buyer?.createdAt ?? ""),
  };
}
