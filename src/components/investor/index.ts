import type { Invoice, ProvenanceTier } from "@/types";

// Components used only within the investor area — if a second area needs one of
// these, promote it to src/components/shared/ instead of duplicating it.

// Dummy data for the investor area, until a real API exists (see
// docs/RAIQUID_CONTEXT.md, "Open decisions").
// Lives here (not in each route's own _components/) because the marketplace detail (screen 20), fund
// (screen 21), portfolio and wallet routes all need the same underlying wallet
// figure — per CONTRIBUTING.md #4, promote once a second route needs it.
export const INVESTOR_WALLET_BALANCE = 840_000;

export const MIN_INVESTMENT = 5_000;

/**
 * A marketplace listing pairs the shared Invoice with the buyer's provenance
 * tier badge shown on each card (screen 19-invMarketplace).
 */
export interface MarketplaceListing extends Invoice {
  provenanceTier: ProvenanceTier;
}

/**
 * Dummy marketplace listings, until a real API exists (see
 * docs/RAIQUID_CONTEXT.md, "Open decisions" — data fetching/backend).
 * Shaped exactly like the real domain types so swapping in a live fetch
 * later requires no changes to the components that consume these.
 *
 * The three entries below are verified against screen 19-invMarketplace
 * (desktop + mobile exports, viewed 2026-09-11):
 * buyer name, amount, due date, return %, funded % and tier badge per card.
 * RQ-INV-4471 intentionally mirrors the business fixture's funding state
 * (2,000,000 amount / 1,240,000 funded / 11.5% / 8 investors) — it is the
 * same invoice seen from the investor side.
 *
 * fundedAmount is derived from the on-screen funded % (rounded), since the
 * export shows only the percent, not the naira figure.
 */
export const INVESTOR_MARKETPLACE_LISTINGS: MarketplaceListing[] = [
  {
    id: "RQ-INV-4471",
    tokenId: "RQ-INV-4471-T1",
    businessId: "biz_1",
    buyerId: "buyer_1",
    buyerName: "Distify Distribution Ltd",
    amount: 2_000_000,
    dueDate: "2026-10-30",
    submittedAt: "2026-08-25",
    description: "Textile supply delivery, August batch",
    status: "funding",
    expectedReturnPct: 11.5,
    fundedAmount: 1_240_000, // 62% — matches screen 19 and the business fixture
    fundingInvestorCount: 8,
    platformFeePct: 3,
    reserveContributionPct: 1,
    provenanceTier: "carried",
  },
  {
    id: "RQ-INV-4502",
    tokenId: "RQ-INV-4502-T1",
    businessId: "biz_2",
    buyerId: "buyer_2",
    buyerName: "MTN Retail Partners",
    amount: 6_400_000,
    dueDate: "2026-11-20",
    submittedAt: "2026-08-28",
    description: "Retail airtime and device supply, August batch",
    status: "funding",
    expectedReturnPct: 8.2,
    fundedAmount: 1_984_000, // 31% of 6,400,000
    fundingInvestorCount: 5,
    platformFeePct: 3,
    reserveContributionPct: 1,
    provenanceTier: "anchored",
  },
  {
    id: "RQ-INV-4390",
    tokenId: "RQ-INV-4390-T1",
    businessId: "biz_3",
    buyerId: "buyer_3",
    buyerName: "Lagos Freight Co.",
    amount: 1_150_000,
    dueDate: "2026-11-15",
    submittedAt: "2026-09-05",
    description: "Freight and logistics services, Q3",
    status: "funding",
    expectedReturnPct: 15,
    fundedAmount: 103_500, // 9% of 1,150,000
    fundingInvestorCount: 2,
    platformFeePct: 3,
    reserveContributionPct: 1,
    provenanceTier: "quarried",
  },
];

/**
 * Aggregate a real API would return pre-computed. Deliberately NOT derived
 * from INVESTOR_MARKETPLACE_LISTINGS above: the export's subtitle reads
 * "12 invoices open for funding" while isolating 3 cards, so the count can
 * include listings already archived off this verified set — same pattern as
 * BUSINESS_STATS vs BUSINESS_INVOICES.
 */
export const INVESTOR_MARKETPLACE_STATS = {
  openInvoicesCount: 12,
};
