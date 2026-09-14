import { notFound } from "next/navigation";

import { BUYER_INVOICES } from "@/components/buyer/fixtures";
import { InvoiceRef } from "@/components/shared/domain/status-badges";
import { StandaloneShell } from "@/components/shared/layout/standalone-shell";
import { Button } from "@/components/shared/ui/button";
import { Card } from "@/components/shared/ui/card";
import { InlineNotice } from "@/components/shared/ui/notice";
import { formatDate, formatNaira } from "@/lib/format";

export default async function Page({ params }: PageProps<"/confirm/[invoiceId]/review">) {
  const { invoiceId } = await params;
  const invoice = BUYER_INVOICES.find((item) => item.id === invoiceId);

  if (!invoice) {
    notFound();
  }

  return (
    <StandaloneShell>
      <div className="space-y-6">
        <h1 className="font-display text-foreground flex flex-wrap items-center gap-2 text-2xl font-semibold">
          Confirm <InvoiceRef id={invoice.id} />
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

        <label className="flex items-start gap-3 text-sm leading-6">
          <input type="checkbox" defaultChecked className="accent-accent-400 mt-1 size-4" />
          <span>
            I confirm {invoice.supplierName} delivered the goods described, and that{" "}
            {formatNaira(invoice.amount)} is genuinely owed, payable by{" "}
            {formatDate(invoice.dueDate)}.
          </span>
        </label>

        <InlineNotice>
          Your supplier has already been paid early by investors. On the due date, your payment goes
          to them instead — the amount and date don&apos;t change.
        </InlineNotice>

        <div className="grid gap-3 sm:grid-cols-2">
          <Button variant="danger">Decline</Button>
          <Button>Confirm &amp; accept</Button>
        </div>
      </div>
    </StandaloneShell>
  );
}
