import { PayoutStatusBadge } from "@/components/shared/domain/status-badges";
import { formatDate, formatNaira } from "@/lib/format";
import type { BusinessPayout } from "@/types";

export function PayoutHistory({ payouts }: { payouts: BusinessPayout[] }) {
  return (
    <section className="border-border bg-surface rounded-xl border p-5 sm:p-7">
      <h2 className="text-foreground text-lg font-semibold">Payout history</h2>

      <div className="mt-6 hidden md:block">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-border border-b">
              <th className="text-muted-foreground px-4 pb-3 text-sm font-normal">Date</th>
              <th className="text-muted-foreground px-4 pb-3 text-sm font-normal">Invoice</th>
              <th className="text-muted-foreground px-4 pb-3 text-sm font-normal">Amount</th>
              <th className="text-muted-foreground px-4 pb-3 text-sm font-normal">Status</th>
            </tr>
          </thead>
          <tbody>
            {payouts.map((payout) => (
              <tr key={payout.id} className="border-border border-b last:border-b-0">
                <td className="text-muted-foreground px-4 py-4 font-mono text-sm">
                  {formatDate(payout.date)}
                </td>
                <td className="text-muted-foreground px-4 py-4 font-mono text-sm">
                  {payout.invoiceId}
                </td>
                <td className="text-foreground px-4 py-4 text-sm">{formatNaira(payout.amount)}</td>
                <td className="px-4 py-4">
                  <PayoutStatusBadge status={payout.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 space-y-5 md:hidden">
        {payouts.map((payout, index) => (
          <div key={payout.id} className={index > 0 ? "border-border border-t pt-5" : undefined}>
            <dl className="grid grid-cols-[96px_1fr] gap-x-4 gap-y-3 font-mono text-sm">
              <dt className="text-muted-foreground">Date</dt>
              <dd className="text-muted-foreground">{formatDate(payout.date)}</dd>

              <dt className="text-muted-foreground">Invoice</dt>
              <dd className="text-muted-foreground">{payout.invoiceId}</dd>

              <dt className="text-muted-foreground">Amount</dt>
              <dd className="text-foreground">{formatNaira(payout.amount)}</dd>

              <dt className="text-muted-foreground">Status</dt>
              <dd>
                <PayoutStatusBadge status={payout.status} />
              </dd>
            </dl>
          </div>
        ))}
      </div>
    </section>
  );
}
