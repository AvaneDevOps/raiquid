/**
 * Shared by the landing page's illustrative financing estimate
 * (src/components/landing/for-businesses-section.tsx) and the real
 * invoice payout breakdown (business/invoices/[invoiceId]) — same
 * calculation, one place, per the project's single-source-of-truth
 * convention (see CONTRIBUTING.md #1).
 */
export interface FinancingBreakdown {
  platformFee: number;
  reserveContribution: number;
  netAmount: number;
}

export function computeFinancingBreakdown(
  amount: number,
  platformFeePct: number,
  reserveContributionPct: number,
): FinancingBreakdown {
  const platformFee = (amount * platformFeePct) / 100;
  const reserveContribution = (amount * reserveContributionPct) / 100;
  const netAmount = amount - platformFee - reserveContribution;
  return { platformFee, reserveContribution, netAmount };
}
