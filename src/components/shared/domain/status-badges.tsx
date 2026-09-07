import type {
  InvoiceStatus,
  OnChainStatus,
  PayoutStatus,
  ProvenanceTier,
  WhitelistStatus,
} from "@/types";
import { Badge, type BadgeTone } from "@/components/shared/ui/badge";
import {
  INVOICE_STATUS_META,
  PROVENANCE_TIER_META,
  WHITELIST_STATUS_META,
  ONCHAIN_STATUS_META,
  PAYOUT_STATUS_META,
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

export function PayoutStatusBadge({
  status,
  className,
}: {
  status: PayoutStatus;
  className?: string;
}) {
  const meta = PAYOUT_STATUS_META[status];
  return (
    <Badge tone={meta.tone} className={className}>
      {meta.label}
    </Badge>
  );
}

// amber on the invoice-detail header (screens 06-09); green once the
// token is closed/burned (screen 23) — hence the overridable tone.
export function InvoiceRef({
  id,
  tone = "amber",
  className,
}: {
  id: string;
  tone?: BadgeTone;
  className?: string;
}) {
  return (
    <Badge tone={tone} className={className}>
      {id}
    </Badge>
  );
}
