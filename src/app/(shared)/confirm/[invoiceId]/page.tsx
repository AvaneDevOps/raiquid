import Link from "next/link";
import { notFound } from "next/navigation";

import { BUYER_INVOICES } from "@/components/buyer/fixtures";
import { Button } from "@/components/shared/ui/button";
import { Card } from "@/components/shared/ui/card";
import { StandaloneShell } from "@/components/shared/layout/standalone-shell";
import { formatDate, formatNaira } from "@/lib/format";

export default async function Page({ params }: PageProps<"/confirm/[invoiceId]">) {
  const { invoiceId } = await params;
  const invoice = BUYER_INVOICES.find((item) => item.id === invoiceId);

  if (!invoice) {
    notFound();
  }

  return (
    <StandaloneShell>
      <div className="space-y-6">
        <span className="seal-chip text-accent-400 font-mono text-xs">
          Invoice confirmation requested
        </span>
        <div>
          <h1 className="font-display text-foreground text-2xl leading-tight font-semibold">
            {invoice.supplierName} is asking you to confirm an invoice
          </h1>
          <p className="text-muted-foreground mt-3 leading-6">
            Confirming doesn&apos;t create a new obligation — it just verifies that the amount below
            is real and already owed.
          </p>
        </div>

        <Card className="p-5">
          <div className="divide-border divide-y">
            <div className="flex items-center justify-between gap-5 py-4 first:pt-0">
              <span>Amount</span>
              <span>{formatNaira(invoice.amount)}</span>
            </div>
            <div className="flex items-center justify-between gap-5 py-4">
              <span>Due date</span>
              <span>{formatDate(invoice.dueDate)}</span>
            </div>
            <div className="flex items-center justify-between gap-5 py-4">
              <span>Goods/services</span>
              <span className="text-right">{invoice.description}</span>
            </div>
            <div className="flex items-center justify-between gap-5 py-4 last:pb-0">
              <span>Proof of delivery</span>
              <a
                href={invoice.proofOfDeliveryUrl ?? "#"}
                className="text-accent-400 hover:underline"
              >
                View document
              </a>
            </div>
          </div>
        </Card>

        <Button asChild className="w-full" size="lg">
          <Link href={`/confirm/${invoice.id}/review`}>Review &amp; respond</Link>
        </Button>
      </div>
    </StandaloneShell>
  );
}
