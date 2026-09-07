"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { InvestmentOpportunity } from "@/types/investor";
import { Card, CardHeader, CardTitle } from "@/components/shared/ui/card";
import type { Variants } from "framer-motion";
import { ProvenanceTierBadge } from "../shared/domain";
import { Badge, BadgeTone } from "../shared/ui";

const cardVariant: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

interface InvestmentCardProps {
  investment: InvestmentOpportunity;
  className?: string;
}

export function InvestmentCard({ investment, className }: InvestmentCardProps) {
  return (
    <motion.div variants={cardVariant}>
      <Card className={cn("p-5 md:p-6", className)}>
        <CardHeader className="border-0 p-0">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-sm md:text-base">{investment.company}</CardTitle>
              <ProvenanceTierBadge tier={investment.tierType} className="-mt-1" />
            </div>
            <Badge tone="green" className="mt-1">
              Strong
            </Badge>
          </div>
        </CardHeader>

        <div className="mt-6 flex justify-between">
          <div>
            <p className="text-muted-foreground text-xs">Available</p>
            <p className="text-foreground mt-0 text-sm font-semibold">{investment.available}</p>
          </div>

          <div>
            <p className="text-muted-foreground text-xs">Return</p>
            <p className="text-success mt-1 text-sm font-semibold">{investment.returnRate}</p>
          </div>

          <div>
            <p className="text-muted-foreground text-xs">Due in</p>
            <p className="text-foreground mt-1 text-sm font-semibold">{investment.due}</p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
