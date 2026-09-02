import type { InvoiceStatus, ProvenanceTier, WhitelistStatus, OnChainStatus } from "@/types";
import { Badge } from "@/components/shared/ui/badge";
import { cn } from "@/lib/utils";
import {
  INVOICE_STATUS_META,
  PROVENANCE_TIER_META,
  WHITELIST_STATUS_META,
  ONCHAIN_STATUS_META,
} from "@/lib/domain-display";

/**
 * The ONLY place a domain status / tier is turned into a chip. Every one
 * of these wraps <Badge>, so they all get the seal-chip shape. Never
 * render a raw <Badge tone="…"> for a status in a page — add or change
 * the mapping in src/lib/domain-display.ts instead.
 */

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

/**
 * Monospace id chip, e.g. `RQ-INV-4471` / `RQ-INV-4471-T1`. Amber
 * seal-chip on the invoice-detail header (screens 06–09); the id keeps
 * its own casing. For a plain inline id inside a table row, render the
 * string directly instead of this chip.
 */
export function InvoiceRef({ id, className }: { id: string; className?: string }) {
  return (
    <Badge tone="amber" className={cn("tracking-normal normal-case", className)}>
      {id}
    </Badge>
  );
}
