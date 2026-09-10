import Link from "next/link";

import { BUYER_INVOICES } from "@/components/buyer/fixtures";
import { InvoiceStatusBadge } from "@/components/shared/domain/status-badges";
import { Button } from "@/components/shared/ui/button";
import { Card, CardTitle } from "@/components/shared/ui/card";
import { formatDate, formatNaira } from "@/lib/format";

export default function Page() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-foreground text-3xl font-semibold">Invoices to review</h1>
        <p className="text-muted-foreground mt-1">
          Confirm the invoices your suppliers say are genuinely owed.
        </p>
      </div>

      <Card className="overflow-hidden">
        <div className="p-6">
          <CardTitle>Awaiting your confirmation</CardTitle>
        </div>
        <div className="hidden md:block">
          <div className="border-border text-muted-foreground grid grid-cols-[1fr_1.5fr_1fr_1fr_1fr_auto] gap-4 border-y px-6 py-3 text-sm">
            <span>Invoice</span>
            <span>Supplier</span>
            <span>Amount</span>
            <span>Due</span>
            <span>Status</span>
            <span />
          </div>
          {BUYER_INVOICES.map((invoice) => (
            <div
              key={invoice.id}
              className="grid grid-cols-[1fr_1.5fr_1fr_1fr_1fr_auto] items-center gap-4 px-6 py-5"
            >
              <span className="text-accent-400 font-mono text-sm">{invoice.id}</span>
              <span className="text-foreground">{invoice.supplierName}</span>
              <span className="text-foreground">{formatNaira(invoice.amount)}</span>
              <span className="text-foreground">{formatDate(invoice.dueDate)}</span>
              <InvoiceStatusBadge status={invoice.status} />
              <Button asChild size="sm">
                <Link href={`/confirm/${invoice.id}`}>Review</Link>
              </Button>
            </div>
          ))}
        </div>
        <div className="divide-border divide-y md:hidden">
          {BUYER_INVOICES.map((invoice) => (
            <div key={invoice.id} className="space-y-4 p-5">
              <div className="flex items-start justify-between gap-3">
                <span className="text-accent-400 font-mono text-sm">{invoice.id}</span>
                <InvoiceStatusBadge status={invoice.status} />
              </div>
              <div className="grid grid-cols-[5.5rem_1fr] gap-y-2 text-sm">
                <span className="text-muted-foreground">Supplier</span>
                <span className="text-foreground">{invoice.supplierName}</span>
                <span className="text-muted-foreground">Amount</span>
                <span className="text-foreground">{formatNaira(invoice.amount)}</span>
                <span className="text-muted-foreground">Due</span>
                <span className="text-foreground">{formatDate(invoice.dueDate)}</span>
              </div>
              <Button asChild className="w-full">
                <Link href={`/confirm/${invoice.id}`}>Review &amp; respond</Link>
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
