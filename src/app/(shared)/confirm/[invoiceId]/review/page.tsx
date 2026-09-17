import { notFound } from "next/navigation";

import { InvoiceRef } from "@/components/shared/domain/status-badges";
import { StandaloneShell } from "@/components/shared/layout/standalone-shell";
import { Card } from "@/components/shared/ui/card";
import { InlineNotice } from "@/components/shared/ui/notice";
import { formatDate, formatNaira } from "@/lib/format";
import { ApiError } from "@/services";

import { getConfirmation, type Confirmation } from "../_lib/confirmation";
import { ReviewActions } from "./_components/review-actions";

export default async function Page({ params }: PageProps<"/confirm/[invoiceId]/review">) {
  const { invoiceId } = await params;

  let invoice: Confirmation;

  try {
    invoice = await getConfirmation(invoiceId);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }

    throw error;
  }

  return (
    <StandaloneShell>
      <div className="space-y-6">
        <h1 className="font-display text-foreground flex flex-wrap items-center gap-2 text-2xl font-semibold">
          Confirm <InvoiceRef id={invoiceId} />
        </h1>

        <Card className="p-5">
          <div className="divide-border divide-y">
            <div className="flex items-center justify-between gap-5 py-4 first:pt-0">
              <span>From</span>
              <span className="text-right">{invoice.supplierName}</span>
            </div>

            <div className="flex items-center justify-between gap-5 py-4">
              <span>Amount owed</span>
              <span>{formatNaira(invoice.amount)}</span>
            </div>

            <div className="flex items-center justify-between gap-5 py-4 last:pb-0">
              <span>Payable on</span>
              <span>{formatDate(invoice.dueDate)}</span>
            </div>
          </div>
        </Card>

        <InlineNotice>
          Your supplier has already been paid early by investors. On the due date, your payment goes
          to them instead — the amount and date don&apos;t change.
        </InlineNotice>

        <ReviewActions invoiceId={invoiceId} supplierName={invoice.supplierName} />
      </div>
    </StandaloneShell>
  );
}
