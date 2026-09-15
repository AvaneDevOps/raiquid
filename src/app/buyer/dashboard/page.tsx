import Link from "next/link";

import { BUYER_DASHBOARD_COPY, BUYER_INVOICES, BUYER_PROFILE } from "@/components/buyer/fixtures";
import { ProvenanceTierBadge } from "@/components/shared/domain/status-badges";
import { Card, CardTitle } from "@/components/shared/ui/card";
import { formatDate, formatNaira } from "@/lib/format";

export default function Page() {
  const invoice = BUYER_INVOICES.find((item) => item.id === "RQ-INV-4471");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-foreground text-3xl font-semibold sm:text-4xl">
          {BUYER_PROFILE.companyName}
        </h1>
        <p className="text-muted-foreground mt-2 text-base sm:text-lg">
          Your payment record, and what it unlocks for your suppliers.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle>Provenance</CardTitle>
              <p className="font-display text-accent-400 mt-7 text-4xl font-medium">
                {BUYER_PROFILE.onTimePaymentRate}%
              </p>
            </div>
            <ProvenanceTierBadge tier={BUYER_PROFILE.provenanceTier} />
          </div>
          <p className="text-muted-foreground mt-2 font-mono text-sm">
            on-time payment rate · 14 of 15 invoices
          </p>
        </Card>

        <Card className="p-6">
          <CardTitle>What Anchored tier unlocks</CardTitle>
          <p className="text-muted-foreground mt-5 max-w-xl text-base leading-7">
            {BUYER_DASHBOARD_COPY[BUYER_PROFILE.provenanceTier]}
          </p>
        </Card>
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
              <span className="text-foreground">Okonkwo Textiles</span>
              <span className="text-foreground">{formatNaira(invoice.amount)}</span>
              <span className="text-foreground">{formatDate(invoice.dueDate)}</span>
              <span className="seal-chip text-muted-foreground font-mono text-xs">
                64 days left
              </span>
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
                <span className="text-foreground">Okonkwo Textiles</span>
                <span className="text-muted-foreground">Amount</span>
                <span className="text-foreground">{formatNaira(invoice.amount)}</span>
                <span className="text-muted-foreground">Due</span>
                <span className="text-foreground">{formatDate(invoice.dueDate)}</span>
              </div>
              <span className="seal-chip text-muted-foreground inline-flex font-mono text-xs">
                64 days left
              </span>
            </div>
          </>
        ) : (
          <p className="text-muted-foreground mt-6 text-sm">No upcoming payments.</p>
        )}
      </Card>
    </div>
  );
}
