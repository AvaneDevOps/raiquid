import type { BusinessWallet, Invoice, ProvenanceTier } from "@/types";

/**
 * Dummy data for the business area, until a real API exists (see
 * docs/RAIQUID_CONTEXT.md, "Open decisions" — data fetching/backend).
 * Shaped exactly like the real domain types so swapping in a live fetch
 * later requires no changes to the components that consume these.
 *
 * Lives here (not in each route's own _components/) because both
 * /business/dashboard and /business/invoices need the same underlying
 * invoices — per CONTRIBUTING.md #4, promote once a second route in
 * the area needs it, rather than maintaining two copies that drift.
 * (They already had: dashboard's original fixture guessed due dates
 * for lack of evidence; screen 10-bizList showed the real ones.)
 *
 * Ordered most-recent-first by invoice id (matches submission order —
 * screen 04's "recent invoices" are simply the first 3 here).
 */
export const BUSINESS_INVOICES: Invoice[] = [
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
    fundedAmount: 1_240_000, // 62% — screen 08-bizFunding
    fundingInvestorCount: 8,
    platformFeePct: 3,
    reserveContributionPct: 1,
  },
  {
    id: "RQ-INV-4390",
    businessId: "biz_1",
    buyerId: "buyer_2",
    buyerName: "Lagos Freight Co.",
    amount: 1_150_000,
    dueDate: "2026-11-15",
    submittedAt: "2026-09-05",
    description: "Freight and logistics services, Q3",
    status: "awaiting_acceptance",
    expectedReturnPct: 10,
    fundedAmount: 0,
    fundingInvestorCount: 0,
    platformFeePct: 3,
    reserveContributionPct: 1,
  },
  {
    id: "RQ-INV-4266",
    tokenId: "RQ-INV-4266-T1",
    businessId: "biz_1",
    buyerId: "buyer_1",
    buyerName: "Distify Distribution Ltd",
    amount: 1_450_000,
    dueDate: "2026-08-02",
    submittedAt: "2026-06-01",
    description: "Textile supply delivery, June batch",
    status: "repaid",
    expectedReturnPct: 11,
    fundedAmount: 1_450_000,
    fundingInvestorCount: 6,
    platformFeePct: 3,
    reserveContributionPct: 1,
  },
  {
    id: "RQ-INV-4180",
    tokenId: "RQ-INV-4180-T1",
    businessId: "biz_1",
    buyerId: "buyer_3",
    buyerName: "Portharcourt Retailers",
    amount: 640_000,
    dueDate: "2026-07-19",
    submittedAt: "2026-05-20",
    description: "Retail goods supply, May order",
    status: "overdue",
    expectedReturnPct: 12,
    fundedAmount: 640_000,
    fundingInvestorCount: 4,
    platformFeePct: 3,
    reserveContributionPct: 1,
  },
  {
    id: "RQ-INV-4091",
    tokenId: "RQ-INV-4091-T1",
    businessId: "biz_1",
    buyerId: "buyer_1",
    buyerName: "Distify Distribution Ltd",
    amount: 980_000,
    dueDate: "2026-07-03",
    submittedAt: "2026-05-01",
    description: "Textile supply delivery, April batch",
    status: "repaid",
    expectedReturnPct: 10.5,
    fundedAmount: 980_000,
    fundingInvestorCount: 5,
    platformFeePct: 3,
    reserveContributionPct: 1,
  },
];

/**
 * Business-wide aggregates a real API would return pre-computed (see
 * docs/RAIQUID_CONTEXT.md's note on this same pattern in the dashboard).
 * Deliberately NOT derived from BUSINESS_INVOICES above, which is only
 * the current/recent set — "totalInvoicesCount" and "totalFinanced" can
 * include invoices already fully archived off this list.
 */
export const BUSINESS_STATS = {
  totalInvoicesCount: 7,
  activeInvoicesCount: 3,
  activeInvoicesAmountInProgress: 4_600_000,
  totalFinanced: 18_200_000,
  totalFinancedSince: "March 2026",
  avgDaysToCash: 1.4,
};

/**
 * Buyer track-record summary, keyed by buyerId. Needed by both
 * /business/invoices/[invoiceId] (screen 06's "Accepted 14 of 15
 * invoices on time") and /business/invoices/new (screen 05's "14 of 15
 * invoices paid on time") — promoted here once that second route
 * needed the same data (was route-local to [invoiceId] before).
 *
 * Raw counts, not percentages, since the exact copy on both screens
 * needs a numerator/denominator that Buyer.acceptanceRate alone can't
 * reconstruct precisely. Only buyer_1 (Distify) has real evidence
 * (screens 05 and 06 agree: 14 of 15); buyer_2/buyer_3 are plausible
 * placeholders since no screen currently shows their card.
 */
export const BUYER_SUMMARIES: Record<
  string,
  { tier: ProvenanceTier; acceptedOnTime: number; totalSent: number }
> = {
  buyer_1: { tier: "carried", acceptedOnTime: 14, totalSent: 15 },
  buyer_2: { tier: "quarried", acceptedOnTime: 2, totalSent: 3 },
  buyer_3: { tier: "carried", acceptedOnTime: 6, totalSent: 7 },
};

export const BUSINESS_WALLET: BusinessWallet = {
  totalReceived: BUSINESS_STATS.totalFinanced,
  pendingPayout: {
    id: "payout_pending_1",
    date: "2026-08-25",
    invoiceId: "RQ-INV-4471",
    amount: 1_240_000,
    status: "pending",
    invoiceStatus: "funding",
  },
  payoutAccount: {
    bankName: "GTBank",
    accountNumberLast4: "4021",
    accountHolderName: "Adaeze Okonkwo",
  },
  payoutHistory: [
    {
      id: "payout_1",
      date: "2026-08-02",
      invoiceId: "RQ-INV-4266",
      amount: 1_406_500,
      status: "received",
    },
    {
      id: "payout_2",
      date: "2026-07-03",
      invoiceId: "RQ-INV-4091",
      amount: 950_600,
      status: "received",
    },
  ],
};
