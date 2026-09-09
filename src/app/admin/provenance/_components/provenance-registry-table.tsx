import { ProvenanceTierBadge } from "@/components/shared/domain/status-badges";
import { Card } from "@/components/shared/ui/card";
import { EmptyState } from "@/components/shared/ui/notice";
import { formatMonthYear } from "@/lib/format";
import type { ProvenanceRegistryEntry } from "@/types";

/**
 * Screen 28-adminProvenance. Same responsive pattern as
 * business/invoices/_components/invoice-list-table.tsx: a desktop <table>
 * and a mobile stacked <dl> list both always in the DOM, switched by
 * Tailwind breakpoint classes only (no JS matchMedia) — see
 * docs/DESIGN_SYSTEM.md, "Layout shells".
 *
 * ProvenanceTierBadge gets hideSuffix here — the column is already headed
 * "Tier", so the badge reads "Carried" rather than "Carried tier" (screens
 * 06/15/20 keep the suffix; this is the one place it's dropped).
 */
export function ProvenanceRegistryTable({ entries }: { entries: ProvenanceRegistryEntry[] }) {
  if (entries.length === 0) {
    return (
      <EmptyState
        title="No buyers yet"
        description="Buyer provenance records appear here once an invoice they're named on is confirmed."
      />
    );
  }

  return (
    <Card>
      {/* Desktop */}
      <table className="hidden w-full text-sm md:table">
        <thead>
          <tr className="border-border text-muted-foreground border-b text-left">
            <th className="px-5 py-3 font-normal">Buyer</th>
            <th className="px-5 py-3 font-normal">Tier</th>
            <th className="px-5 py-3 font-normal">Acceptance rate</th>
            <th className="px-5 py-3 font-normal">On-time rate</th>
            <th className="px-5 py-3 font-normal">Invoices financed</th>
            <th className="px-5 py-3 font-normal">Since</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.buyerId} className="border-border border-b last:border-0">
              <td className="text-foreground px-5 py-4">{entry.buyerName}</td>
              <td className="px-5 py-4">
                <ProvenanceTierBadge tier={entry.tier} hideSuffix />
              </td>
              <td className="text-foreground px-5 py-4">{entry.acceptanceRatePct}%</td>
              <td className="text-foreground px-5 py-4">
                {entry.onTimeRatePct === null ? "—" : `${entry.onTimeRatePct}%`}
              </td>
              <td className="text-foreground px-5 py-4">{entry.invoicesFinanced}</td>
              <td className="text-foreground px-5 py-4">{formatMonthYear(entry.memberSince)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile */}
      <div className="divide-border divide-y md:hidden">
        {entries.map((entry) => (
          <dl key={entry.buyerId} className="space-y-2 px-5 py-4">
            <div className="flex items-center justify-between gap-4">
              <dt className="text-muted-foreground text-sm">Buyer</dt>
              <dd className="text-foreground text-sm font-medium">{entry.buyerName}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-muted-foreground text-sm">Tier</dt>
              <dd>
                <ProvenanceTierBadge tier={entry.tier} hideSuffix />
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-muted-foreground text-sm">Acceptance rate</dt>
              <dd className="text-foreground text-sm">{entry.acceptanceRatePct}%</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-muted-foreground text-sm">On-time rate</dt>
              <dd className="text-foreground text-sm">
                {entry.onTimeRatePct === null ? "—" : `${entry.onTimeRatePct}%`}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-muted-foreground text-sm">Invoices financed</dt>
              <dd className="text-foreground text-sm">{entry.invoicesFinanced}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-muted-foreground text-sm">Since</dt>
              <dd className="text-foreground text-sm">{formatMonthYear(entry.memberSince)}</dd>
            </div>
          </dl>
        ))}
      </div>
    </Card>
  );
}
