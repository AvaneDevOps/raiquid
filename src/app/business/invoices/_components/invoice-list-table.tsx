import { InvoiceStatusBadge } from "@/components/shared/domain/status-badges";
import { Card } from "@/components/shared/ui/card";
import { EmptyState } from "@/components/shared/ui/notice";
import { formatDate, formatNaira } from "@/lib/format";
import type { Invoice } from "@/types";

/**
 * Route-local for now (colocated under business/invoices/_components/)
 * per CONTRIBUTING.md #4. Similar in spirit to the dashboard's
 * RecentInvoicesCard but not the same component — this one has a Due
 * date column, no card header/title, and no row-count limit — so it
 * wasn't promoted alongside it.
 *
 * Both the desktop <table> and the mobile stacked list are always in
 * the DOM, toggled by Tailwind breakpoint classes only — same pattern
 * as Sidebar/BottomTabBar, to avoid any JS-based responsive switching.
 */
export function InvoiceListTable({ invoices }: { invoices: Invoice[] }) {
  if (invoices.length === 0) {
    return (
      <EmptyState
        title="No invoices match this filter"
        description="Try a different status, or check back once you've uploaded more invoices."
      />
    );
  }

  return (
    <Card>
      {/* Desktop */}
      <table className="hidden w-full text-sm md:table">
        <thead>
          <tr className="border-border text-muted-foreground border-b text-left">
            <th className="px-5 py-3 font-normal">Invoice</th>
            <th className="px-5 py-3 font-normal">Buyer</th>
            <th className="px-5 py-3 font-normal">Amount</th>
            <th className="px-5 py-3 font-normal">Due date</th>
            <th className="px-5 py-3 font-normal">Status</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr key={invoice.id} className="border-border border-b last:border-0">
              <td className="text-foreground px-5 py-4 font-mono">{invoice.id}</td>
              <td className="text-foreground px-5 py-4">{invoice.buyerName}</td>
              <td className="text-foreground px-5 py-4">{formatNaira(invoice.amount)}</td>
              <td className="text-foreground px-5 py-4">{formatDate(invoice.dueDate)}</td>
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
              <dt className="text-muted-foreground text-sm">Due date</dt>
              <dd className="text-foreground text-sm">{formatDate(invoice.dueDate)}</dd>
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
