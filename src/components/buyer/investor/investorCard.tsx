import { cn } from "@/lib/utils";
import { Badge } from "@/components/shared/ui/badge";
import type { InvestmentOpportunity } from "./index";
import { Card, CardHeader, CardTitle } from "@/components/shared/ui/card";

interface InvestmentCardProps {
  investment: InvestmentOpportunity;
  className?: string;
}

export function InvestmentCard({ investment, className }: InvestmentCardProps) {
  return (
    <Card className={cn("p-5 md:p-6", className)}>
      <CardHeader className="border-0 p-0">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-sm md:text-base">{investment.company}</CardTitle>

            {/* Tier */}
            <Badge tone={investment.tierType === "carried" ? "amber" : "green"} className="-mt-1">
              {investment.tier}
            </Badge>
          </div>

          {/* Status */}
          <Badge tone="green" className="mt-1">
            Strong
          </Badge>
        </div>
      </CardHeader>

      {/* Stats */}
      <div className="mt-6 flex justify-between">
        <div>
          <p className="text-xs text-[#817b70]">Available</p>

          <p className="mt-0 text-sm font-semibold text-[#e8e0d2]">{investment.available}</p>
        </div>

        <div>
          <p className="text-xs text-[#817b70]">Return</p>

          <p className="mt-1 text-sm font-semibold text-[#65b18b]">{investment.returnRate}</p>
        </div>

        <div>
          <p className="text-xs text-[#817b70]">Due in</p>

          <p className="mt-1 text-sm font-semibold text-[#e8e0d2]">{investment.due}</p>
        </div>
      </div>
    </Card>
  );
}
