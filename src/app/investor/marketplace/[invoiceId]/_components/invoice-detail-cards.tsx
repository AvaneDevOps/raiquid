import type { ReactNode } from "react";

import type { MarketplaceListing } from "@/components/investor";
import { Card, CardTitle } from "@/components/shared/ui/card";
import { ProgressBar } from "@/components/shared/ui/progress-bar";
import { formatDate, formatNaira, formatPercent } from "@/lib/format";

export function DetailRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
      <dt className="text-muted-foreground text-sm">{label}</dt>
      <dd className="text-foreground text-sm sm:text-right">{children}</dd>
    </div>
  );
}

export function InvoiceDetailsCard({
  listing,
  goods,
}: {
  listing: MarketplaceListing;
  goods: string;
}) {
  return (
    <Card className="p-6">
      <CardTitle>Invoice</CardTitle>
      <dl className="divide-border mt-4 divide-y">
        <DetailRow label="Amount">
          <span className="font-mono">{formatNaira(listing.amount)}</span>
        </DetailRow>
        <DetailRow label="Due date">{formatDate(listing.dueDate)}</DetailRow>
        <DetailRow label="Expected return">
          <span className="text-accent-400 font-mono">
            {formatPercent(listing.expectedReturnPct)}
          </span>
        </DetailRow>
        <DetailRow label="Goods/services">
          <span className="sm:inline-block sm:max-w-60">{goods}</span>
        </DetailRow>
      </dl>
    </Card>
  );
}

export function FundingProgressCard({ listing }: { listing: MarketplaceListing }) {
  const percentFunded = listing.amount > 0 ? (listing.fundedAmount / listing.amount) * 100 : 0;

  return (
    <Card className="p-6">
      <CardTitle>Funded so far</CardTitle>
      <div className="mt-4 flex items-baseline justify-between">
        <p className="text-muted-foreground font-mono text-sm">
          {formatNaira(listing.fundedAmount)}
        </p>
        <p className="text-foreground text-sm">{formatPercent(percentFunded, 0)}</p>
      </div>
      <ProgressBar
        percent={percentFunded}
        label={`${listing.id} funding progress`}
        className="mt-3"
      />
    </Card>
  );
}
