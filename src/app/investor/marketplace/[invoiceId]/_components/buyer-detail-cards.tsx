import { INVESTOR_BUYER_PROVENANCE } from "@/components/investor";
import { ProvenanceTierBadge } from "@/components/shared/domain/status-badges";
import { Badge } from "@/components/shared/ui/badge";
import { Card, CardTitle } from "@/components/shared/ui/card";
import { formatMonthYear, formatNumber, formatPercent } from "@/lib/format";
import type { ProvenanceTier } from "@/types";

import { DetailRow } from "./invoice-detail-cards";

export function BuyerProvenanceCard({
  buyerId,
  provenanceTier,
}: {
  buyerId: string;
  provenanceTier: ProvenanceTier;
}) {
  const provenance = INVESTOR_BUYER_PROVENANCE[buyerId];

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between gap-3">
        <CardTitle>Buyer provenance</CardTitle>
        <ProvenanceTierBadge tier={provenanceTier} />
      </div>
      <dl className="divide-border mt-4 divide-y">
        <DetailRow label="Acceptance rate">
          {formatPercent(provenance.acceptanceRatePct, 0)}
        </DetailRow>
        <DetailRow label="On-time payment rate">
          {provenance.onTimeRatePct === null ? "—" : formatPercent(provenance.onTimeRatePct, 0)}
        </DetailRow>
        <DetailRow label="Invoices financed">{formatNumber(provenance.invoicesFinanced)}</DetailRow>
        <DetailRow label="On platform since">{formatMonthYear(provenance.memberSince)}</DetailRow>
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
