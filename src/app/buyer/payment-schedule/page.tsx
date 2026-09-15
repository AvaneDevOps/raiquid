import Link from "next/link";
import { auth } from "@clerk/nextjs/server";

import { Button } from "@/components/shared/ui/button";
import { Card, CardTitle } from "@/components/shared/ui/card";
import { buyerService, normalizeBuyerInvoices } from "@/services/buyer";
import { formatDate, formatNaira } from "@/lib/format";

export default async function Page() {
  const { getToken } = await auth();
  const token = await getToken();
  const payload = await buyerService.getPaymentSchedule<unknown>(token);
  const invoices = normalizeBuyerInvoices(payload);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-foreground text-3xl font-semibold">Payment schedule</h1>
        <p className="text-muted-foreground mt-1">
          Keep track of what you owe and when each payment is due.
        </p>
      </div>

      <Card className="p-6">
        <CardTitle>Upcoming payments</CardTitle>
        {invoices.length === 0 ? (
          <p className="text-muted-foreground mt-6 text-sm">No upcoming payments.</p>
        ) : (
          <>
            <div className="border-border text-muted-foreground mt-6 hidden grid-cols-[1fr_1.5fr_1fr_1fr_auto] gap-4 border-b pb-3 text-sm md:grid">
              <span>Invoice</span>
              <span>Supplier</span>
              <span>Amount</span>
              <span>Due</span>
              <span />
            </div>
            <div className="mt-4 hidden space-y-4 md:block">
              {invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="grid grid-cols-[1fr_1.5fr_1fr_1fr_auto] items-center gap-4"
                >
                  <span className="text-accent-400 font-mono text-sm">{invoice.id}</span>
                  <span>{invoice.supplierName}</span>
                  <span>{formatNaira(invoice.amount)}</span>
                  <span>{formatDate(invoice.dueDate)}</span>
                  <Button asChild size="sm">
                    <Link href={`/buyer/invoices/${invoice.id}/pay`}>Pay</Link>
                  </Button>
                </div>
              ))}
            </div>
            <div className="mt-6 space-y-5 md:hidden">
              {invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="border-border space-y-4 border-b pb-5 last:border-b-0"
                >
                  <div className="grid grid-cols-[5.5rem_1fr] gap-y-3 text-sm">
                    <span className="text-muted-foreground font-mono">Invoice</span>
                    <span className="text-accent-400 font-mono">{invoice.id}</span>
                    <span className="text-muted-foreground">Supplier</span>
                    <span>{invoice.supplierName}</span>
                    <span className="text-muted-foreground">Amount</span>
                    <span>{formatNaira(invoice.amount)}</span>
                    <span className="text-muted-foreground">Due</span>
                    <span>{formatDate(invoice.dueDate)}</span>
                  </div>
                  <Button asChild className="w-full">
                    <Link href={`/buyer/invoices/${invoice.id}/pay`}>Make payment</Link>
                  </Button>
                </div>
              ))}
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
