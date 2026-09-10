import { OnChainStatusBadge } from "@/components/shared/domain/status-badges";
import { ONCHAIN_ACTION_META } from "@/lib/domain-display";
import type { RecentActivityItem } from "@/components/admin/fixtures";
import { Card, CardTitle } from "@/components/shared/ui/card";

export function RecentActivityCard({ items }: { items: RecentActivityItem[] }) {
  return (
    <Card className="p-7">
      <CardTitle>Recent on-chain activity</CardTitle>

      <div className="md:divide-border md:divide-y">
        {items.map((item) => (
          <div key={item.id} className="items-center justify-between gap-4 px-5 py-5 md:flex">
            <div className="min-w-0">
              <p className="text-muted-foreground font-mono text-sm">
                {ONCHAIN_ACTION_META[item.action].label}
              </p>
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
