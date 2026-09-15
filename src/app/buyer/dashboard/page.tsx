import Link from "next/link";
import { auth } from "@clerk/nextjs/server";

import { Card, CardTitle } from "@/components/shared/ui/card";
import { buyerService, normalizeBuyerInvoices } from "@/services/buyer";
import { formatDate, formatNaira } from "@/lib/format";

export default async function Page() {
  const { getToken } = await auth();
  const token = await getToken();
  const payload = await buyerService.getPaymentSchedule<unknown>(token);
  const invoices = normalizeBuyerInvoices(payload);
  const invoice = invoices[0];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-foreground text-3xl font-semibold sm:text-4xl">
          Payment dashboard
        </h1>
        <p className="text-muted-foreground mt-2 text-base sm:text-lg">
          Your upcoming obligations and supplier invoices.
        </p>
      </div>

      <Card className="p-6">
        <CardTitle>Upcoming payments</CardTitle>
        {invoice ? (
          <>
            <div className="border-border text-muted-foreground mt-6 hidden grid-cols-[1fr_1.5fr_1fr_1fr_auto] gap-4 border-b pb-3 text-sm md:grid">
              <span>Invoice</span>
              <span>Supplier</span>
              <span>Amount</span>
              <span>Due</span>
              <span />
            </div>
            <div className="mt-4 hidden grid-cols-[1fr_1.5fr_1fr_1fr_auto] items-center gap-4 md:grid">
              <Link
                href={`/buyer/invoices/${invoice.id}/pay`}
                className="text-accent-400 font-mono text-sm hover:underline"
              >
                {invoice.id}
              </Link>
              <span className="text-foreground">{invoice.supplierName}</span>
              <span className="text-foreground">{formatNaira(invoice.amount)}</span>
              <span className="text-foreground">{formatDate(invoice.dueDate)}</span>
              <span className="seal-chip text-muted-foreground font-mono text-xs">Upcoming</span>
            </div>
            <div className="mt-6 space-y-4 md:hidden">
              <div className="grid grid-cols-[7rem_1fr] gap-y-3 text-sm">
                <span className="text-muted-foreground font-mono">Invoice</span>
                <Link
                  href={`/buyer/invoices/${invoice.id}/pay`}
                  className="text-accent-400 font-mono hover:underline"
                >
                  {invoice.id}
                </Link>
                <span className="text-muted-foreground">Supplier</span>
                <span className="text-foreground">{invoice.supplierName}</span>
                <span className="text-muted-foreground">Amount</span>
                <span className="text-foreground">{formatNaira(invoice.amount)}</span>
                <span className="text-muted-foreground">Due</span>
                <span className="text-foreground">{formatDate(invoice.dueDate)}</span>
              </div>
            </div>
          </>
        ) : (
          <p className="text-muted-foreground mt-6 text-sm">No upcoming payments.</p>
        )}
      </Card>

      <Card className="p-6">
        <CardTitle>Provenance</CardTitle>
        <p className="text-muted-foreground mt-4 text-sm">
          Provenance tier and payment-history aggregates are not exposed by the current buyer API
          response.
        </p>
      </Card>
    </div>
  );
}
