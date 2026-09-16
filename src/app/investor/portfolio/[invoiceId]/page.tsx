import Link from "next/link";
import { notFound } from "next/navigation";

import { INVESTOR_HOLDINGS } from "@/components/investor";
import { InvoiceRef, InvoiceStatusBadge } from "@/components/shared/domain/status-badges";
import { Button } from "@/components/shared/ui/button";
import { Card } from "@/components/shared/ui/card";
import { formatDate, formatNaira } from "@/lib/format";

// Screen 23-invRepay. Data below is dummy (see
// src/components/investor/index.ts) until a real API exists — see
// docs/RAIQUID_CONTEXT.md, "Open decisions".
// The export shows the repaid receipt (principal + return, token chip in
// the closed/burned green tone, "Closed (burned)" as plain text). Holdings
// that are still funding/overdue render an interim position view in the
// same cards so every row on /investor/portfolio has a detail page.
export default async function Page({ params }: PageProps<"/investor/portfolio/[invoiceId]">) {
  const { invoiceId } = await params;
  const holding = INVESTOR_HOLDINGS.find((candidate) => candidate.invoiceId === invoiceId);

  if (!holding) {
    notFound();
  }

  if (holding.status !== "repaid") {
    return (
      <div className="w-full max-w-xl">
        <Card className="p-6 text-center sm:p-8">
          <p className="text-muted-foreground text-sm">Repaid to your wallet</p>
          <p className="font-display text-accent-400 mt-2 text-5xl font-semibold">
            {formatNaira(holding.investedAmount)}
          </p>
          <p className="text-muted-foreground mt-2 font-mono text-sm">
            Due {formatDate(holding.dueDate)}
          </p>
        </Card>

        <Card className="mt-4 px-6">
          <dl className="divide-border divide-y">
            <div className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between">
              <dt className="text-foreground text-sm">Token</dt>
              <dd>
                <InvoiceRef id={holding.tokenId} />
              </dd>
            </div>
            <div className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between">
              <dt className="text-foreground text-sm">Status</dt>
              <dd>
                <InvoiceStatusBadge status={holding.status} />
              </dd>
            </div>
            <div className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between">
              <dt className="text-foreground text-sm">Buyer</dt>
              <dd className="text-foreground text-sm">{holding.buyerName}</dd>
            </div>
          </dl>
        </Card>

        <Button variant="ghost" asChild className="mt-6">
          <Link href="/investor/portfolio">Back to portfolio</Link>
        </Button>
      </div>
    );
  }

  const returnAmount = holding.returnAmount ?? 0;

  return (
    <div className="mx-auto w-full max-w-xl">
      <Card className="p-6 text-center sm:p-8">
        <p className="text-muted-foreground text-sm">Repaid to your wallet</p>
        <p className="font-display text-accent-400 mt-2 text-5xl font-semibold">
          {formatNaira(returnAmount)}
        </p>
        <p className="text-muted-foreground mt-2 font-mono text-sm">
          Principal {formatNaira(holding.investedAmount)} + return {formatNaira(returnAmount)}
        </p>
      </Card>

      <Card className="mt-4 px-6">
        <dl className="divide-border divide-y">
          <div className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between">
            <dt className="text-foreground text-sm">Token</dt>
            <dd>
              <InvoiceRef id={holding.tokenId} tone="green" />
            </dd>
          </div>
          <div className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between">
            <dt className="text-foreground text-sm">Status</dt>
            <dd className="text-foreground text-sm">Closed (burned)</dd>
          </div>
          <div className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between">
            <dt className="text-foreground text-sm">Buyer</dt>
            <dd className="text-foreground text-sm">{holding.buyerName}</dd>
          </div>
        </dl>
      </Card>

      <Button variant="ghost" asChild className="mt-6">
        <Link href="/investor/portfolio">Back to portfolio</Link>
      </Button>
    </div>
  );
}
