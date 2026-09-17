import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import type { Route } from "next";

import { InvoiceRef, InvoiceStatusBadge } from "@/components/shared/domain/status-badges";
import { Button } from "@/components/shared/ui/button";
import { Card, StatCard } from "@/components/shared/ui/card";
import { EmptyState, InlineNotice } from "@/components/shared/ui/notice";
import { formatDate, formatNaira, formatPercent } from "@/lib/format";
import { investorService } from "@/services";

import { toHolding, type PortfolioHolding } from "./_lib/holding";

// Screen 22-invPortfolio. All three header stats and the table are now
// derived from the same real GET /investor/portfolio response — see
// ./_lib/holding.ts for the confirmed row mapping. Caps at the endpoint's
// own max pageSize (100), so sums below are an honest derivation from
// what's actually returned, not a guaranteed full total if an investor
// somehow has more holdings than that — the invoice count is the
// exception, using the response's own real `total` rather than the
// fetched page's length. Avg. return is always "—" — genuinely not
// derivable: confirmed against raiquid-api's BuyerService.payInvoice
// directly, holding.repaidAmount is set to exactly the original invested
// amount, with no separate yield/profit anywhere in the real repayment
// flow, so a "return %" computed from it would always read ~100% for any
// repaid holding — not a real return figure, just principal coming back.
// Buyer name column is "—" for every row — GET /investor/portfolio only
// includes the invoice, not invoice.buyer, so there's no real name
// available. See docs/RAIQUID_CONTEXT.md, "Open decisions".
export default async function Page() {
  const { getToken } = await auth();
  const token = await getToken();

  let holdings: PortfolioHolding[] = [];
  let total = 0;
  let loadError: string | null = null;
  try {
    const response = await investorService.get<{
      data: Record<string, unknown>[];
      total: number;
    }>("/investor/portfolio?pageSize=100", token);
    holdings = response.data.map(toHolding);
    total = response.total;
  } catch (error) {
    loadError = error instanceof Error ? error.message : "Couldn't load your portfolio.";
  }

  const totalInvested = holdings.reduce((sum, holding) => sum + holding.investedAmount, 0);
  const repaidHoldings = holdings.filter((holding) => holding.returnAmount !== undefined);
  const totalReturned = repaidHoldings.reduce(
    (sum, holding) => sum + (holding.returnAmount ?? 0),
    0,
  );
  // Not derivable, genuinely — BuyerService.payInvoice sets
  // holding.repaidAmount to exactly the original invested amount (confirmed
  // directly), with no separate yield/profit component anywhere in the
  // real repayment flow. A "return %" computed from repaidAmount/invested
  // would always be ~100% for any repaid holding, which doesn't mean "you
  // doubled your money" — it means principal came back with nothing
  // measurable on top. Showing that number would be more misleading than
  // showing nothing.
  const avgReturnPct: number | null = null;
  const activeHoldingsCount = holdings.filter((holding) => holding.status !== "repaid").length;

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-display text-foreground text-3xl font-semibold">Portfolio</h1>
          {!loadError && <p className="text-muted-foreground mt-1">{total} invoices</p>}
        </div>
        <Button asChild size="lg">
          <Link href="/investor/marketplace">Browse marketplace</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Total invested"
          value={formatNaira(totalInvested)}
          caption={`across ${total} invoices`}
          emphasize
        />
        <StatCard
          label="Total returned"
          value={formatNaira(totalReturned)}
          caption="principal + return settled"
        />
        <StatCard
          label="Avg. return"
          value={avgReturnPct === null ? "—" : formatPercent(avgReturnPct)}
          caption={`${activeHoldingsCount} active holdings`}
        />
      </div>

      {loadError ? (
        <InlineNotice tone="danger">{loadError}</InlineNotice>
      ) : holdings.length === 0 ? (
        <Card>
          <EmptyState
            title="No holdings yet"
            description="Once you fund an invoice it will show up here with its due date and status."
            action={
              <Button asChild variant="secondary">
                <Link href="/investor/marketplace">Browse marketplace</Link>
              </Button>
            }
          />
        </Card>
      ) : (
        <Card>
          {/* Desktop */}
          <table className="hidden w-full text-sm md:table">
            <thead>
              <tr className="border-border text-muted-foreground border-b text-left">
                <th className="px-5 py-3 font-normal">Invoice</th>
                <th className="px-5 py-3 font-normal">Buyer</th>
                <th className="px-5 py-3 font-normal">Invested</th>
                <th className="px-5 py-3 font-normal">Status</th>
                <th className="px-5 py-3 font-normal">Due date</th>
              </tr>
            </thead>
            <tbody>
              {holdings.map((holding) => (
                <tr key={holding.id} className="border-border border-b last:border-0">
                  <td className="px-5 py-4">
                    <Link
                      href={`/investor/portfolio/${holding.id}` as Route}
                      className="text-accent-400 font-mono hover:underline"
                    >
                      <InvoiceRef id={holding.tokenId} />
                    </Link>
                  </td>
                  <td className="text-foreground px-5 py-4">{holding.buyerName}</td>
                  <td className="text-foreground px-5 py-4">
                    {formatNaira(holding.investedAmount)}
                  </td>
                  <td className="px-5 py-4">
                    <InvoiceStatusBadge status={holding.status} />
                  </td>
                  <td className="text-foreground px-5 py-4">{formatDate(holding.dueDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile */}
          <div className="divide-border divide-y md:hidden">
            {holdings.map((holding) => (
              <dl key={holding.id} className="space-y-2 px-5 py-4">
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-muted-foreground text-sm">Invoice</dt>
                  <dd>
                    <Link
                      href={`/investor/portfolio/${holding.id}` as Route}
                      className="text-accent-400 font-mono text-sm hover:underline"
                    >
                      <InvoiceRef id={holding.tokenId} />
                    </Link>
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-muted-foreground text-sm">Buyer</dt>
                  <dd className="text-foreground text-sm font-medium">{holding.buyerName}</dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-muted-foreground text-sm">Invested</dt>
                  <dd className="text-foreground text-sm">{formatNaira(holding.investedAmount)}</dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-muted-foreground text-sm">Due date</dt>
                  <dd className="text-foreground text-sm">{formatDate(holding.dueDate)}</dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-muted-foreground text-sm">Status</dt>
                  <dd>
                    <InvoiceStatusBadge status={holding.status} />
                  </dd>
                </div>
              </dl>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
