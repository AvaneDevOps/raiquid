import { Badge } from "@/components/shared/ui/badge";
import { ONCHAIN_ACTION_META } from "@/lib/domain-display";
import type { OnChainAction } from "@/types";

export function OnChainActionBadge({
  action,
  className,
}: {
  action: OnChainAction;
  className?: string;
}) {
  const meta = ONCHAIN_ACTION_META[action];

  return (
    <Badge tone={meta.tone} className={className}>
      {meta.label}
    </Badge>
  );
}
