import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { notFound } from "next/navigation";

import { InvoiceRef, InvoiceStatusBadge } from "@/components/shared/domain/status-badges";
import { Button } from "@/components/shared/ui/button";
import { Card } from "@/components/shared/ui/card";
import { InlineNotice } from "@/components/shared/ui/notice";
import { formatDate, formatNaira } from "@/lib/format";
import { ApiError, investorService } from "@/services";

import { toHolding, type PortfolioHolding } from "../_lib/holding";

// Screen 23-invRepay, wired to real GET /investor/portfolio/{id}. The
// route param is named [invoiceId] from the fixture era, but the value
// it actually needs — and gets, from the list page's own links — is the
// Holding's own id, not the invoice id; the real single-GET endpoint
// takes the holding id (confirmed against raiquid-api's
// InvestorService.getPortfolioHolding). Buyer name is "—" — same gap as
// the list page, GET /investor/portfolio doesn't include invoice.buyer.
export default async function Page({ params }: PageProps<"/investor/portfolio/[invoiceId]">) {
  const { invoiceId: holdingId } = await params;

  const { getToken } = await auth();
  const token = await getToken();

  let holding: PortfolioHolding;
  try {
    const raw = await investorService.get<Record<string, unknown>>(
      `/investor/portfolio/${holdingId}`,
      token,
    );
    holding = toHolding(raw);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    return (
      <InlineNotice tone="danger">
        {error instanceof Error ? error.message : "Couldn't load this holding."}
      </InlineNotice>
    );
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
