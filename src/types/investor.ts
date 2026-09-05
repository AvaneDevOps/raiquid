// Components used only within the investor area — if a second area needs one of
// these, promote it to src/components/shared/ instead of duplicating it.
export interface InvestmentOpportunity {
  company: string;
  tier: string;
  available: string;
  returnRate: string;
  due: string;
  tierColor: "gold" | "green";
  tierType: "anchored" | "carried";
}

export const opportunities: InvestmentOpportunity[] = [
  {
    company: "Distify Distribution Ltd",
    tier: "Carried tier",
    available: "₦650,000",
    returnRate: "6.5%",
    due: "42 days",
    tierColor: "gold",
    tierType: "carried",
  },
  {
    company: "MTN Retail Partners",
    tier: "Anchored tier",
    available: "₦200,000",
    returnRate: "5.8%",
    due: "28 days",
    tierColor: "green",
    tierType: "anchored",
  },
];
export const investorBenefits: string[] = [
  "Start with as little as ₦10,000",
  "Invest in invoices accepted by verified buyers",
  "Clear return before you invest",
  "Track repayment in real time",
];
