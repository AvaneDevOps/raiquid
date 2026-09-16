<<<<<<< HEAD
// TODO: implement. See docs/ROUTE_MAP.md for the source screen reference
// and docs/RAIQUID_CONTEXT.md for domain/business context.
export default function Page() {
  return null;
=======
import Link from "next/link";
import type { Route } from "next";

import { InvoiceRef, InvoiceStatusBadge } from "@/components/shared/domain/status-badges";
import { Button } from "@/components/shared/ui/button";
import { Card, StatCard } from "@/components/shared/ui/card";
import { EmptyState } from "@/components/shared/ui/notice";
import { INVESTOR_HOLDINGS, INVESTOR_PORTFOLIO_STATS } from "@/components/investor";
import { formatDate, formatNaira, formatPercent } from "@/lib/format";

// Screen 22-invPortfolio. Data below is dummy (see
// src/components/investor/index.ts) until a real API exists — see
// docs/RAIQUID_CONTEXT.md, "Open decisions".
export default function Page() {
  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-display text-foreground text-3xl font-semibold">Portfolio</h1>
          <p className="text-muted-foreground mt-1">
            {INVESTOR_PORTFOLIO_STATS.invoicesCount} invoices since {INVESTOR_PORTFOLIO_STATS.since}
          </p>
        </div>
        <Button asChild size="lg">
          <Link href="/investor/marketplace">Browse marketplace</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Total invested"
          value={formatNaira(INVESTOR_PORTFOLIO_STATS.totalInvested)}
          caption={`across ${INVESTOR_PORTFOLIO_STATS.invoicesCount} invoices`}
          emphasize
        />
        <StatCard
          label="Total returned"
          value={formatNaira(INVESTOR_PORTFOLIO_STATS.totalReturned)}
          caption="principal + return settled"
        />
        <StatCard
          label="Avg. return"
          value={formatPercent(INVESTOR_PORTFOLIO_STATS.avgReturnPct)}
          caption={`${INVESTOR_PORTFOLIO_STATS.activeHoldingsCount} active holdings`}
        />
      </div>

      {INVESTOR_HOLDINGS.length === 0 ? (
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
              {INVESTOR_HOLDINGS.map((holding) => (
                <tr key={holding.tokenId} className="border-border border-b last:border-0">
                  <td className="px-5 py-4">
                    <Link
                      href={`/investor/portfolio/${holding.invoiceId}` as Route}
                      className="text-accent-400 font-mono hover:underline"
                    >
                      <InvoiceRef id={holding.invoiceId} />
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
            {INVESTOR_HOLDINGS.map((holding) => (
              <dl key={holding.tokenId} className="space-y-2 px-5 py-4">
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-muted-foreground text-sm">Invoice</dt>
                  <dd>
                    <Link
                      href={`/investor/portfolio/${holding.invoiceId}` as Route}
                      className="text-accent-400 font-mono text-sm hover:underline"
                    >
                      <InvoiceRef id={holding.invoiceId} />
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
>>>>>>> 126c1250105090cfeb3f5a136297e976271e7075
}
