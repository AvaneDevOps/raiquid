import { OnChainStatusBadge } from "@/components/shared/domain/status-badges";
import type { RecentActivityItem } from "@/components/admin/fixtures";
import { Card, CardHeader, CardTitle } from "@/components/shared/ui/card";

const ACTION_LABEL: Record<RecentActivityItem["action"], string> = {
  mint: "Mint",
  whitelist: "Whitelist",
  transfer: "Transfer",
  burn: "Burn",
};

// Screen 26-adminOverview: action is plain mono text here (an amber chip
// only in the ledger, screen 29 — see docs/DESIGN_SYSTEM.md). Token id is
// rendered as a raw mono string, not an InvoiceRef chip, per the same doc's
// rule for ids inside a table/list row.
export function RecentActivityCard({ items }: { items: RecentActivityItem[] }) {
  return (
    <Card className="p-7">
      <CardTitle>Recent on-chain activity</CardTitle>

      <div className="md:divide-border md:divide-y">
        {items.map((item) => (
          <div key={item.id} className="items-center justify-between gap-4 px-5 py-5 md:flex">
            <div className="min-w-0">
              <p className="text-muted-foreground font-mono text-sm">{ACTION_LABEL[item.action]}</p>
            </div>
            <div>
              <p className="text-foreground mt-1 font-mono text-sm">{item.tokenId}</p>
            </div>
            <OnChainStatusBadge status={item.status} className="mt-2 md:mt-0" />
          </div>
        ))}
      </div>
    </Card>
  );
}
