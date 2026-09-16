import type { Invoice } from "@/types";

// GET /business/invoices/{id} response, confirmed against the backend
// source (raiquid-api's BusinessController/BusinessService.getInvoice):
// a Prisma Invoice with `include: { buyer: true, holdings: true,
// onChainEvents: true }`. buyerName is the nested buyer.legalName.
// fundingInvestorCount has no scalar field but is real, derived from the
// included holdings array's length (not invented). tokenId maps to the
// real brickkenTokenSymbol field. acceptedAt maps to the real confirmedAt
// field (set when the buyer accepts via the confirm flow).
// expectedReturnPct is fed by the real investorYieldPct field
// (Decimal(5,2), already a percentage — same convention as
// platformFeePct/reserveContributionPct).
interface BuyerRef {
  legalName?: string;
}

export function toInvoice(raw: Record<string, unknown>): Invoice {
  const buyer = raw.buyer as BuyerRef | undefined;
  const holdings = Array.isArray(raw.holdings) ? raw.holdings : [];
  return {
    id: String(raw.id ?? ""),
    tokenId: typeof raw.brickkenTokenSymbol === "string" ? raw.brickkenTokenSymbol : undefined,
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
    fundingInvestorCount: holdings.length,
    platformFeePct: Number(raw.platformFeePct ?? 0),
    reserveContributionPct: Number(raw.reserveContributionPct ?? 0),
  };
}

// confirmedAt is set exactly when the buyer accepts via the magic-link
// confirm flow — the real backing for the "Accepted on"/"Listed" subtitle
// dates the page previously sourced from the INVOICE_ACCEPTED_AT fixture.
export function toAcceptedAt(raw: Record<string, unknown>): string | undefined {
  return typeof raw.confirmedAt === "string" ? raw.confirmedAt : undefined;
}

// The mint OnChainEvent for this invoice, if one has been written yet —
// real per-invoice on-chain status, replacing tokenized-view.tsx's
// previously-hardcoded "confirmed".
export interface MintEvent {
  status: string;
  chainId: number;
}

export function toMintEvent(raw: Record<string, unknown>): MintEvent | undefined {
  const events = Array.isArray(raw.onChainEvents) ? raw.onChainEvents : [];
  const mint = events.find(
    (event): event is Record<string, unknown> =>
      typeof event === "object" &&
      event !== null &&
      (event as Record<string, unknown>).action === "mint",
  );
  if (!mint) return undefined;
  return {
    status: String(mint.status ?? "pending"),
    chainId: Number(mint.chainId ?? 0),
  };
}
