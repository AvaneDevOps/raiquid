import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

import { InvoiceRef } from "@/components/shared/domain/status-badges";
import { Card } from "@/components/shared/ui/card";
import { InlineNotice } from "@/components/shared/ui/notice";
import { buyerService, normalizeBuyerInvoices } from "@/services/buyer";
import { formatDate, formatNaira } from "@/lib/format";

import { PaymentForm } from "./_components/payment-form";

export default async function Page({ params }: PageProps<"/buyer/invoices/[invoiceId]/pay">) {
  const { invoiceId } = await params;
  const { getToken } = await auth();
  const token = await getToken();
  const payload = await buyerService.listInvoices<unknown>(token, { page: 1, pageSize: 100 });
  const invoice = normalizeBuyerInvoices(payload).find((item) => item.id === invoiceId);

  if (!invoice) notFound();

  return (
    <div className="max-w-2xl space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <InvoiceRef id={invoice.id} />
          <p className="text-muted-foreground mt-3">Due {formatDate(invoice.dueDate)}</p>
        </div>
        <span className="seal-chip text-muted-foreground font-mono text-xs">{invoice.status}</span>
      </div>

      <Card className="p-6">
        <div className="divide-border divide-y">
          <div className="flex items-center justify-between gap-4 pb-5">
            <span>Amount due</span>
            <span>{formatNaira(invoice.amount)}</span>
          </div>
          <div className="flex items-center justify-between gap-4 py-5">
            <span>Payee</span>
            <span className="text-right">{invoice.supplierName}</span>
          </div>
        </div>
      </Card>

      <InlineNotice>
        This payment is recorded through the Raiquid backend. No payment-account details are exposed
        by the current buyer API.
      </InlineNotice>

      <PaymentForm invoiceId={invoice.id} amount={invoice.amount} />
    </div>
  );
}
