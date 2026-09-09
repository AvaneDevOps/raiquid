import { Badge, type BadgeTone } from "@/components/shared/ui/badge";
import type { OnChainAction } from "@/types";

const ACTION_META: Record<OnChainAction, { label: string; tone: BadgeTone }> = {
  mint: { label: "Mint", tone: "amber" },
  whitelist: { label: "Whitelist", tone: "amber" },
  transfer: { label: "Transfer", tone: "amber" },
  burn: { label: "Burn", tone: "amber" },
};

export function OnChainActionBadge({
  action,
  className,
}: {
  action: OnChainAction;
  className?: string;
}) {
  const meta = ACTION_META[action];
  return (
    <Badge tone={meta.tone} className={className}>
      {meta.label}
    </Badge>
  );
}
