// ProvenanceCard.tsx
import { Check, CircleDot, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

import { Card, CardHeader, CardTitle } from "@/components/shared/ui/card";

import type { ProvenanceItem } from "./index";

interface ProvenanceCardProps {
  item: ProvenanceItem;
  className?: string;
}

const icons: Record<string, LucideIcon> = {
  check: Check,
  trust: CircleDot,
};

export function ProvenanceCard({ item, className }: ProvenanceCardProps) {
  const Icon = item.icon ? icons[item.icon] : null;

  return (
    <Card className={cn("p-5", className)}>
      <CardHeader className="border-0 p-0">
        <div className="bg-surface-raised flex h-7 w-7 items-center justify-center rounded-md">
          {item.emoji ? (
            <span className="text-sm leading-none">{item.emoji}</span>
          ) : (
            Icon && <Icon className="text-accent-400 h-3.5 w-3.5" />
          )}
        </div>

        <CardTitle className="mt-3 text-sm">{item.title}</CardTitle>
      </CardHeader>

      <p className="text-muted-foreground mt-1 text-xs leading-5">{item.description}</p>
    </Card>
  );
}
