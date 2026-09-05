import type { Invoice } from "@/types";

/**
 * Dummy data matching screen 04-bizDashboard, until a real API exists
 * (see docs/RAIQUID_CONTEXT.md, "Open decisions" — data fetching/backend).
 * Shaped exactly like the real domain types so swapping in a live fetch
 * later requires no changes to the components that consume these.
 */
export const RECENT_INVOICES: Invoice[] = [
  {
    id: "RQ-INV-4471",
    tokenId: "RQ-INV-4471-T1",
    businessId: "biz_1",
    buyerId: "buyer_1",
    buyerName: "Distify Distribution Ltd",
    amount: 2_000_000,
    dueDate: "2026-10-15",
    submittedAt: "2026-08-20",
    description: "Textile supply delivery, August batch",
    status: "funding",
    expectedReturnPct: 11.5,
    fundedAmount: 1_200_000,
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
    dueDate: "2026-11-02",
    submittedAt: "2026-09-01",
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
    dueDate: "2026-08-10",
    submittedAt: "2026-06-15",
    description: "Textile supply delivery, June batch",
    status: "repaid",
    expectedReturnPct: 11,
    fundedAmount: 1_450_000,
    fundingInvestorCount: 6,
    platformFeePct: 3,
    reserveContributionPct: 1,
  },
];

/**
 * These are dashboard-level aggregates the real API will eventually
 * return pre-computed — deliberately NOT derived from RECENT_INVOICES
 * above (which is only the 3 most recent, not the full active set), so
 * this fixture doesn't encode a wrong assumption about how the real
 * numbers get calculated.
 */
export const DASHBOARD_STATS = {
  activeInvoices: 3,
  activeInvoicesAmountInProgress: 4_600_000,
  totalFinanced: 18_200_000,
  totalFinancedSince: "March 2026",
  avgDaysToCash: 1.4,
};
