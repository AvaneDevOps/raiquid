import { Stepper } from "@/components/shared/domain/stepper";
import { Card } from "@/components/shared/ui/card";
import { ProgressBar } from "@/components/shared/ui/progress-bar";
import { INVOICE_LIFECYCLE_STEPS, INVOICE_STATUS_STEP_INDEX } from "@/lib/domain-display";
import { formatNaira, formatPercent } from "@/lib/format";
import type { Invoice } from "@/types";

// Screen 08-bizFunding.
export function FundingView({ invoice }: { invoice: Invoice }) {
  const percentFunded = invoice.amount > 0 ? (invoice.fundedAmount / invoice.amount) * 100 : 0;

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
          <h3 className="text-foreground font-semibold">Funding activity</h3>
          <p className="text-muted-foreground mt-4 text-sm">
            {invoice.fundingInvestorCount} investors have contributed to this invoice.
          </p>
          <p className="text-foreground mt-3 font-mono text-sm">
            {formatNaira(invoice.fundedAmount)} raised so far
          </p>
        </Card>
      </div>
    </>
  );
}
