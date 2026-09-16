import Link from "next/link";
import type { Route } from "next";

import type { MarketplaceListing } from "@/components/investor";
import { InvoiceRef, ProvenanceTierBadge } from "@/components/shared/domain/status-badges";
import { Card } from "@/components/shared/ui/card";
import { Button } from "@/components/shared/ui/button";
import { ProgressBar } from "@/components/shared/ui/progress-bar";
import { formatDate, formatNaira, formatPercent } from "@/lib/format";

/**
 * One marketplace card (screen 19-invMarketplace).
 *
 * Route-local for now (colocated under investor/marketplace/_components/)
 * per CONTRIBUTING.md #4 — promote to src/components/investor/ once the
 * detail (screen 20) or portfolio route needs the same card.
 */
export function MarketplaceCard({ listing }: { listing: MarketplaceListing }) {
  const percentFunded = listing.amount > 0 ? (listing.fundedAmount / listing.amount) * 100 : 0;

  return (
    <Card className="flex flex-col gap-4 p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <ProvenanceTierBadge tier={listing.provenanceTier} />
        <InvoiceRef id={listing.id} />
      </div>

      <div>
        <h2 className="text-foreground text-lg leading-snug font-medium">{listing.buyerName}</h2>
        <p className="text-muted-foreground mt-1.5 font-mono text-sm leading-relaxed">
          {formatNaira(listing.amount)} · due {formatDate(listing.dueDate)} ·{" "}
          {formatPercent(listing.expectedReturnPct)} return
        </p>
      </div>

      <ProgressBar percent={percentFunded} label={`${listing.id} funding progress`} />

      <div className="flex items-center justify-between gap-3">
        <p className="text-muted-foreground font-mono text-sm">
          {formatPercent(percentFunded, 0)} funded
        </p>
        <Button asChild variant="secondary">
          <Link href={`/investor/marketplace/${listing.id}` as Route}>View invoice</Link>
        </Button>
      </div>
    </Card>
  );
}
