import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

import { InvoiceStatusBadge } from "@/components/shared/domain/status-badges";
import { Button } from "@/components/shared/ui/button";
import { Card, CardTitle } from "@/components/shared/ui/card";
import { EmptyState, InlineNotice } from "@/components/shared/ui/notice";
import { formatDate, formatNaira } from "@/lib/format";
import { buyerService } from "@/services";

import { needsReview, toBuyerInvoice, type BuyerInvoice } from "../_lib/invoice";

// Screen 15-buyInvoices, wired to GET /buyer/invoices — see
// ../_lib/invoice.ts for the confirmed mapping. Only submitted/
// awaiting_acceptance rows get a Review link (to the real magic-link
// confirm flow, /confirm/{confirmToken} — not /confirm/{id}, a different
// value); anything already accepted has nothing left to review.
export default async function Page() {
  const { getToken } = await auth();
  const token = await getToken();

  let invoices: BuyerInvoice[] = [];
  let loadError: string | null = null;
  try {
    const response = await buyerService.get<{ data: Record<string, unknown>[] }>(
      "/buyer/invoices",
      token,
    );
    invoices = response.data.map(toBuyerInvoice);
  } catch (error) {
    loadError = error instanceof Error ? error.message : "Couldn't load your invoices.";
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-foreground text-3xl font-semibold">Invoices to review</h1>
        <p className="text-muted-foreground mt-1">
          Confirm the invoices your suppliers say are genuinely owed.
        </p>
      </div>

      {loadError ? (
        <InlineNotice tone="danger">{loadError}</InlineNotice>
      ) : invoices.length === 0 ? (
        <EmptyState
          title="No invoices yet"
          description="Invoices your suppliers send you will show up here."
        />
      ) : (
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
            {invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="grid grid-cols-[1fr_1.5fr_1fr_1fr_1fr_auto] items-center gap-4 px-6 py-5"
              >
                <span className="text-accent-400 font-mono text-sm">{invoice.id}</span>
                <span className="text-foreground">{invoice.supplierName}</span>
                <span className="text-foreground">{formatNaira(invoice.amount)}</span>
                <span className="text-foreground">{formatDate(invoice.dueDate)}</span>
                <InvoiceStatusBadge status={invoice.status} />
                {needsReview(invoice) && invoice.confirmToken ? (
                  <Button asChild size="sm">
                    <Link href={`/confirm/${invoice.confirmToken}`}>Review</Link>
                  </Button>
                ) : (
                  <span />
                )}
              </div>
            ))}
          </div>
          <div className="divide-border divide-y md:hidden">
            {invoices.map((invoice) => (
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
                {needsReview(invoice) && invoice.confirmToken ? (
                  <Button asChild className="w-full">
                    <Link href={`/confirm/${invoice.confirmToken}`}>Review &amp; respond</Link>
                  </Button>
                ) : null}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
