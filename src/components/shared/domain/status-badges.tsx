import type { InvoiceStatus, ProvenanceTier, WhitelistStatus, OnChainStatus } from "@/types";
import { Badge } from "@/components/shared/ui/badge";
import { cn } from "@/lib/utils";
import {
  INVOICE_STATUS_META,
  PROVENANCE_TIER_META,
  WHITELIST_STATUS_META,
  ONCHAIN_STATUS_META,
} from "@/lib/domain-display";

export function InvoiceStatusBadge({
  status,
  className,
}: {
  status: InvoiceStatus;
  className?: string;
}) {
  const meta = INVOICE_STATUS_META[status];
  return (
    <Badge tone={meta.tone} className={className}>
      {meta.label}
    </Badge>
  );
}

export function ProvenanceTierBadge({
  tier,
  className,
}: {
  tier: ProvenanceTier;
  className?: string;
}) {
  const meta = PROVENANCE_TIER_META[tier];
  return (
    <Badge tone={meta.tone} className={className}>
      {meta.label}
    </Badge>
  );
}

export function WhitelistStatusBadge({
  status,
  className,
}: {
  status: WhitelistStatus;
  className?: string;
}) {
  const meta = WHITELIST_STATUS_META[status];
  return (
    <Badge tone={meta.tone} className={className}>
      {meta.label}
    </Badge>
  );
}

export function OnChainStatusBadge({
  status,
  className,
}: {
  status: OnChainStatus;
  className?: string;
}) {
  const meta = ONCHAIN_STATUS_META[status];
  return (
    <Badge tone={meta.tone} className={className}>
      {meta.label}
    </Badge>
  );
}

export function InvoiceRef({ id, className }: { id: string; className?: string }) {
  return (
    <Badge tone="amber" className={cn("tracking-normal normal-case", className)}>
      {id}
    </Badge>
  );
}
