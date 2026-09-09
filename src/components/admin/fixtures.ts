import type {
  OnChainAction,
  OnChainStatus,
  PlatformOverview,
  ReservePoolSnapshot,
  ProvenanceRegistryEntry,
} from "@/types";

/**
 * Dummy data for the admin area, until a real API exists (see
 * docs/RAIQUID_CONTEXT.md, "Open decisions" — data fetching/backend).
 * Shaped like the real domain types so swapping in a live fetch later
 * requires no changes to the components that consume these.
 *
 * Lives here (not in overview/_components/) so /admin/reserve can reuse
 * ADMIN_RESERVE_SNAPSHOT once it's built, per CONTRIBUTING.md #4.
 */
export const ADMIN_OVERVIEW: PlatformOverview = {
  totalValueFinanced: 142_600_000,
  activeInvoices: 37,
  onTimeRepaymentRatePct: 94,
  activeInvestors: 812,
};

export const ADMIN_RESERVE_SNAPSHOT: ReservePoolSnapshot = {
  currentBalance: 6_140_000,
  contributionRatePct: 1.5,
  coverageRatioPct: 4.3,
  claimsPaid: 0,
};

/**
 * Recent on-chain activity, screen 26-adminOverview. Deliberately not the
 * shared OnChainEvent type: the overview shows the invoice/token id (e.g.
 * "RQ-INV-4502-T1") with the action as plain mono text, while the ledger
 * (screen 29, OnChainEvent) shows a truncated wallet address with the
 * action as an amber chip — see docs/DESIGN_SYSTEM.md, "Domain-specific
 * visual patterns worth naming". Same OnChainAction/OnChainStatus enums,
 * different presentation, no shared component for it yet.
 */
export interface RecentActivityItem {
  id: string;
  action: OnChainAction;
  tokenId: string;
  status: OnChainStatus;
}

export const ADMIN_RECENT_ACTIVITY: RecentActivityItem[] = [
  { id: "act_1", action: "mint", tokenId: "RQ-INV-4502-T1", status: "confirmed" },
  { id: "act_2", action: "transfer", tokenId: "RQ-INV-4471-T1", status: "confirmed" },
  { id: "act_3", action: "burn", tokenId: "RQ-INV-4091-T1", status: "confirmed" },
];

/** Screen 27-adminReserve, "Balance growth" bar chart. No chart library is
 * installed yet (see docs/RAIQUID_CONTEXT.md, "Open decisions" — charting
 * library), so this is a handful of plain divs, not a real chart component —
 * revisit once a library is chosen. `highlighted` marks the amber-gradient
 * bars (the two most recent months on the export); the rest render muted.
 */
export interface ReserveBalancePoint {
  date: string; // ISO date, first of the month
  value: number;
  highlighted?: boolean;
}

export const ADMIN_RESERVE_BALANCE_GROWTH: ReserveBalancePoint[] = [
  { date: "2026-04-01", value: 890_000 },
  { date: "2026-05-01", value: 1_120_000 },
  { date: "2026-06-01", value: 1_460_000 },
  { date: "2026-07-01", value: 4_260_000, highlighted: true },
  { date: "2026-08-01", value: 6_140_000, highlighted: true },
];

export const ADMIN_RESERVE_BALANCE_RANGE_LABEL = "Apr — Aug 2026";

export const ADMIN_PROVENANCE_REGISTRY: ProvenanceRegistryEntry[] = [
  {
    buyerId: "buyer_1",
    buyerName: "Distify Distribution Ltd",
    tier: "carried",
    acceptanceRatePct: 100,
    onTimeRatePct: 92,
    invoicesFinanced: 15,
    memberSince: "2026-03-01",
  },
  {
    buyerId: "buyer_2",
    buyerName: "MTN Retail Partners",
    tier: "anchored",
    acceptanceRatePct: 100,
    onTimeRatePct: 99,
    invoicesFinanced: 41,
    memberSince: "2026-01-01",
  },
  {
    buyerId: "buyer_3",
    buyerName: "Lagos Freight Co.",
    tier: "quarried",
    acceptanceRatePct: 100,
    onTimeRatePct: null,
    invoicesFinanced: 1,
    memberSince: "2026-08-01",
  },
  {
    buyerId: "buyer_4",
    buyerName: "Portharcourt Retailers",
    tier: "quarried",
    acceptanceRatePct: 80,
    onTimeRatePct: 60,
    invoicesFinanced: 3,
    memberSince: "2026-05-01",
  },
];
