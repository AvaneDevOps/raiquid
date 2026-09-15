import { notFound } from "next/navigation";

import { BUYER_INVOICES, BUYER_PAYMENT_ACCOUNT } from "@/components/buyer/fixtures";
import { InvoiceRef } from "@/components/shared/domain/status-badges";
import { Button } from "@/components/shared/ui/button";
import { Card } from "@/components/shared/ui/card";
import { InlineNotice } from "@/components/shared/ui/notice";
import { formatNaira } from "@/lib/format";

export default async function Page({ params }: PageProps<"/buyer/invoices/[invoiceId]/pay">) {
  const { invoiceId } = await params;
  const invoice = BUYER_INVOICES.find((item) => item.id === invoiceId);

  if (!invoice) {
    notFound();
  }

  return (
    <div className="max-w-2xl space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <InvoiceRef id={invoice.id} />
          <p className="text-muted-foreground mt-3">Due today</p>
        </div>
        <span className="seal-chip text-muted-foreground font-mono text-xs">Due today</span>
      </div>

      <Card className="p-6">
        <div className="divide-border divide-y">
          <div className="flex items-center justify-between gap-4 pb-5">
            <span>Amount due</span>
            <span>{formatNaira(invoice.amount)}</span>
          </div>
          <div className="flex items-center justify-between gap-4 py-5">
            <span>Payee</span>
            <span className="text-right">Raiquid settlement account</span>
          </div>
        </div>
      </Card>

      <div>
        <p className="text-muted-foreground mb-2 text-sm">Payment method</p>
        <div className="border-border-strong bg-surface-raised rounded-lg border px-4 py-3">
          Bank transfer — {BUYER_PAYMENT_ACCOUNT.bankName} ••••{" "}
          {BUYER_PAYMENT_ACCOUNT.accountNumberLast4}
        </div>
      </div>

      <InlineNotice>
        This is a simulated repayment for the sandbox environment. No real funds move.
      </InlineNotice>

      <Button size="lg">Confirm payment (sandbox)</Button>
    </div>
  );
}
