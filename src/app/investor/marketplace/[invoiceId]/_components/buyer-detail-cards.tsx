import { ProvenanceTierBadge } from "@/components/shared/domain/status-badges";
import { Badge } from "@/components/shared/ui/badge";
import { Card, CardTitle } from "@/components/shared/ui/card";
import { formatMonthYear, formatNumber, formatPercent } from "@/lib/format";
import type { ProvenanceTier } from "@/types";

import type { BuyerProvenance } from "../../_lib/listing";
import { DetailRow } from "./invoice-detail-cards";

// Reputation numbers are passed in from the real GET /investor/marketplace/{id}
// response now (see ../_lib/listing.ts, toBuyerProvenance) — no more
// INVESTOR_BUYER_PROVENANCE fixture lookup keyed by buyerId, which would
// return undefined (and crash) for any real buyer id.
export function BuyerProvenanceCard({
  provenanceTier,
  acceptanceRatePct,
  onTimeRatePct,
  invoicesFinanced,
  memberSince,
}: {
  provenanceTier: ProvenanceTier;
} & BuyerProvenance) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between gap-3">
        <CardTitle>Buyer provenance</CardTitle>
        <ProvenanceTierBadge tier={provenanceTier} />
      </div>
      <dl className="divide-border mt-4 divide-y">
        <DetailRow label="Acceptance rate">{formatPercent(acceptanceRatePct, 0)}</DetailRow>
        <DetailRow label="On-time payment rate">
          {onTimeRatePct === null ? "—" : formatPercent(onTimeRatePct, 0)}
        </DetailRow>
        <DetailRow label="Invoices financed">{formatNumber(invoicesFinanced)}</DetailRow>
        <DetailRow label="On platform since">{formatMonthYear(memberSince)}</DetailRow>
      </dl>
    </Card>
  );
}

export function ProtectionCard() {
  return (
    <Card className="p-6">
      <CardTitle>How you&apos;re protected</CardTitle>
      <ol className="text-muted-foreground mt-4 list-decimal space-y-3 pl-5 text-sm leading-relaxed">
        <li>Provenance — visible payment history before you fund</li>
        <li>Formal acceptance — buyer digitally confirmed the debt</li>
        <li>
          Reserve pool{" "}
          <Badge tone="green" className="ml-2 align-middle">
            Covered
          </Badge>
        </li>
        <li className="text-muted-foreground/60">
          Trade credit insurance — planned for later phases
        </li>
      </ol>
    </Card>
  );
}
