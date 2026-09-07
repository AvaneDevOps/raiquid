import { ProvenanceTierBadge } from "@/components/shared/domain/status-badges";
import { Stepper } from "@/components/shared/domain/stepper";
import { Card } from "@/components/shared/ui/card";
import { InlineNotice } from "@/components/shared/ui/notice";
import { INVOICE_LIFECYCLE_STEPS, INVOICE_STATUS_STEP_INDEX } from "@/lib/domain-display";
import { formatDate, formatNaira } from "@/lib/format";
import type { Invoice } from "@/types";

import { BUYER_SUMMARIES } from "@/components/business/fixtures";

// Screen 06-bizPending (status: submitted / awaiting_acceptance).
export function AwaitingAcceptanceView({ invoice }: { invoice: Invoice }) {
  const buyerSummary = BUYER_SUMMARIES[invoice.buyerId];

  return (
    <>
      <Stepper
        steps={INVOICE_LIFECYCLE_STEPS}
        currentIndex={INVOICE_STATUS_STEP_INDEX[invoice.status]}
        className="mt-8"
      />

      <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-foreground font-semibold">Buyer</h3>
          <p className="text-foreground mt-4 text-lg">{invoice.buyerName}</p>
          {buyerSummary ? (
            <>
              <ProvenanceTierBadge tier={buyerSummary.tier} className="mt-2" />
              <p className="text-muted-foreground mt-4 text-sm">
                Accepted {buyerSummary.acceptedOnTime} of {buyerSummary.totalSent} invoices on time
              </p>
            </>
          ) : null}
        </Card>

        <Card className="p-6">
          <h3 className="text-foreground font-semibold">Invoice</h3>
          <dl className="mt-4 space-y-4">
            <div className="border-border flex items-center justify-between border-b pb-4">
              <dt className="text-muted-foreground text-sm">Amount</dt>
              <dd className="text-foreground">{formatNaira(invoice.amount)}</dd>
            </div>
            <div className="border-border flex items-center justify-between border-b pb-4">
              <dt className="text-muted-foreground text-sm">Due date</dt>
              <dd className="text-foreground">{formatDate(invoice.dueDate)}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground text-sm">Submitted</dt>
              <dd className="text-foreground">{formatDate(invoice.submittedAt)}</dd>
            </div>
          </dl>
        </Card>
      </div>

      <InlineNotice tone="info" className="mt-6">
        We&apos;ll notify you the moment {invoice.buyerName.split(" ")[0]} responds — typically
        within 2 business days.
      </InlineNotice>
    </>
  );
}
