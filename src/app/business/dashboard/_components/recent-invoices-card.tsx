import Link from "next/link";

import { InvoiceStatusBadge } from "@/components/shared/domain/status-badges";
import { Card, CardHeader, CardTitle } from "@/components/shared/ui/card";
import { formatNaira } from "@/lib/format";
import type { Invoice } from "@/types";

/**
 * Dashboard-only for now (colocated under business/dashboard/_components).
 * /business/invoices (screen 10-bizList) will likely want a similar table,
 * but probably with more columns/actions — promote to src/components/business/
 * only once that page confirms it can reuse this exact shape, per
 * CONTRIBUTING.md #4 (don't pre-emptively share).
 *
 * Both the desktop <table> and the mobile stacked list are always in the
 * DOM, toggled by Tailwind breakpoint classes only — same pattern as
 * Sidebar/BottomTabBar, to avoid any JS-based responsive switching.
 */
export function RecentInvoicesCard({ invoices }: { invoices: Invoice[] }) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>Recent invoices</CardTitle>
        <Link
          href="/business/invoices"
          className="text-accent-400 text-sm font-medium hover:underline"
        >
          View all
        </Link>
      </CardHeader>

      {/* Desktop */}
      <table className="hidden w-full text-sm md:table">
        <thead>
          <tr className="border-border text-muted-foreground border-b text-left">
            <th className="px-5 py-3 font-normal">Invoice</th>
            <th className="px-5 py-3 font-normal">Buyer</th>
            <th className="px-5 py-3 font-normal">Amount</th>
            <th className="px-5 py-3 font-normal">Status</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr key={invoice.id} className="border-border border-b last:border-0">
              <td className="text-foreground px-5 py-4 font-mono">{invoice.id}</td>
              <td className="text-foreground px-5 py-4">{invoice.buyerName}</td>
              <td className="text-foreground px-5 py-4">{formatNaira(invoice.amount)}</td>
              <td className="px-5 py-4">
                <InvoiceStatusBadge status={invoice.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile */}
      <div className="divide-border divide-y md:hidden">
        {invoices.map((invoice) => (
          <dl key={invoice.id} className="space-y-2 px-5 py-4">
            <div className="flex items-center justify-between gap-4">
              <dt className="text-muted-foreground text-sm">Invoice</dt>
              <dd className="text-foreground font-mono text-sm">{invoice.id}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-muted-foreground text-sm">Buyer</dt>
              <dd className="text-foreground text-sm font-medium">{invoice.buyerName}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-muted-foreground text-sm">Amount</dt>
              <dd className="text-foreground text-sm">{formatNaira(invoice.amount)}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-muted-foreground text-sm">Status</dt>
              <dd>
                <InvoiceStatusBadge status={invoice.status} />
              </dd>
            </div>
          </dl>
        ))}
      </div>
    </Card>
  );
}
