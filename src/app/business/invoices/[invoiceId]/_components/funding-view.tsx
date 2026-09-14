import { Stepper } from "@/components/shared/domain/stepper";
import { Card } from "@/components/shared/ui/card";
import { ProgressBar } from "@/components/shared/ui/progress-bar";
import { INVOICE_LIFECYCLE_STEPS, INVOICE_STATUS_STEP_INDEX } from "@/lib/domain-display";
import { formatNaira, formatPercent } from "@/lib/format";
import type { Invoice } from "@/types";

import { TOP_CONTRIBUTORS } from "./fixtures";

// Screen 08-bizFunding.
export function FundingView({ invoice }: { invoice: Invoice }) {
  const percentFunded = invoice.amount > 0 ? (invoice.fundedAmount / invoice.amount) * 100 : 0;
  const namedContributors = TOP_CONTRIBUTORS[invoice.id] ?? [];

  const namedTotal = namedContributors.reduce((sum, c) => sum + c.amount, 0);
  const namedCount = namedContributors.length;
  const otherCount = invoice.fundingInvestorCount - namedCount;
  const otherAmount = invoice.fundedAmount - namedTotal;

  return (
    <>
      <Stepper
        steps={INVOICE_LIFECYCLE_STEPS}
        currentIndex={INVOICE_STATUS_STEP_INDEX[invoice.status]}
        className="mt-8"
      />

      <div className="mt-8 space-y-4">
        <Card className="p-6">
          <h3 className="text-foreground font-semibold">Funding progress</h3>
          <div className="mt-4 flex items-baseline justify-between">
            <p className="text-muted-foreground font-mono text-sm">
              {formatNaira(invoice.fundedAmount)} raised
            </p>
            <p className="text-foreground text-sm">{formatPercent(percentFunded, 0)}</p>
          </div>
          <ProgressBar percent={percentFunded} className="mt-3" />
          <p className="text-muted-foreground mt-4 text-sm">
            {invoice.fundingInvestorCount} investors funding this invoice
          </p>
        </Card>

        <Card className="p-6">
          <h3 className="text-foreground font-semibold">Contributing investors</h3>
          <dl className="divide-border mt-4 divide-y">
            {namedContributors.map((contributor) => (
              <div
                key={contributor.initials}
                className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
              >
                <dt className="text-foreground">{contributor.initials}</dt>
                <dd className="text-foreground">{formatNaira(contributor.amount)}</dd>
              </div>
            ))}
            {otherCount > 0 ? (
              <div className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                <dt className="text-foreground">+{otherCount} others</dt>
                <dd className="text-foreground">{formatNaira(otherAmount)}</dd>
              </div>
            ) : null}
          </dl>
        </Card>
      </div>
    </>
  );
}
