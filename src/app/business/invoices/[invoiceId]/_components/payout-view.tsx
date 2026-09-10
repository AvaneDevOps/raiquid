import Link from "next/link";

import { Button } from "@/components/shared/ui/button";
import { Card } from "@/components/shared/ui/card";
import { computeFinancingBreakdown } from "@/lib/finance";
import { formatNaira, formatPercent } from "@/lib/format";
import type { Invoice } from "@/types";

/**
 * Screen 09-bizPayout only exists for status "funded" — no dedicated
 * screen shows "repaid" or "overdue" from the business's own view. Per
 * docs/RAIQUID_CONTEXT.md ("the business was already paid early") and
 * domain-display.ts's own comment on repaid's step index, the business
 * already has their money by "funded" — what the buyer does afterward
 * (repay on time or go overdue) doesn't change anything on their end.
 * So this same view covers all three statuses; only the badge in
 * InvoiceDetailHeader (rendered by the parent page) differs.
 */
export function PayoutView({ invoice }: { invoice: Invoice }) {
  const { platformFee, reserveContribution, netAmount } = computeFinancingBreakdown(
    invoice.amount,
    invoice.platformFeePct,
    invoice.reserveContributionPct,
  );

  return (
    <div className="mt-8 space-y-4">
      <Card className="p-6 text-center">
        <p className="text-muted-foreground text-sm">Sent to your account</p>
        <p className="font-display text-accent-400 mt-2 text-4xl font-semibold">
          {formatNaira(netAmount)}
        </p>
        <p className="text-muted-foreground mt-2 font-mono text-sm">just now</p>
      </Card>

      <Card className="p-6">
        <h3 className="text-foreground font-semibold">Breakdown</h3>
        <dl className="mt-4 space-y-4">
          <div className="border-border flex items-baseline justify-between border-b pb-4">
            <dt className="text-muted-foreground text-sm">Invoice amount</dt>
            <dd className="text-foreground line-through">{formatNaira(invoice.amount)}</dd>
          </div>
          <div className="border-border flex items-baseline justify-between border-b pb-4">
            <dt className="text-muted-foreground text-sm">
              Platform fee ({formatPercent(invoice.platformFeePct, 0)})
            </dt>
            <dd className="text-danger">−{formatNaira(platformFee)}</dd>
          </div>
          <div className="border-border flex items-baseline justify-between border-b pb-4">
            <dt className="text-muted-foreground text-sm">
              Reserve contribution ({formatPercent(invoice.reserveContributionPct, 0)})
            </dt>
            <dd className="text-danger">−{formatNaira(reserveContribution)}</dd>
          </div>
          <div className="flex items-baseline justify-between">
            <dt className="text-foreground font-semibold">Net payout</dt>
            <dd className="text-foreground font-semibold">{formatNaira(netAmount)}</dd>
          </div>
        </dl>
      </Card>

      <div className="flex items-center gap-3">
        {/* No receipt feature exists yet — disabled rather than a
            button that looks actionable but silently does nothing. */}
        <Button variant="secondary" disabled title="Receipts aren't available yet">
          View receipt
        </Button>
        <Button variant="ghost" asChild>
          <Link href="/business/dashboard">Back to dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
