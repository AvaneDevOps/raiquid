import type { ProvenanceTier } from "@/types";

export type InvestorTier = Exclude<ProvenanceTier, "quarried">;

export interface InvestmentOpportunity {
  company: string;
  available: string;
  returnRate: string;
  due: string;
  tierType: InvestorTier;
}
