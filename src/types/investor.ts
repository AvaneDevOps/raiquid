export interface InvestmentOpportunity {
  company: string;
  tier: string;
  available: string;
  returnRate: string;
  due: string;
  tierColor: "gold" | "green";
  tierType: "anchored" | "carried";
}
