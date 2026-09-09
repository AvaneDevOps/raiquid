// TODO: implement. See docs/ROUTE_MAP.md for the source screen reference
// and docs/RAIQUID_CONTEXT.md for domain/business context.
import {
  ADMIN_OVERVIEW,
  ADMIN_RECENT_ACTIVITY,
  ADMIN_RESERVE_SNAPSHOT,
} from "@/components/admin/fixtures";
import { Card, CardHeader, CardTitle, StatCard } from "@/components/shared/ui/card";
import { formatNaira, formatNumber, formatPercent } from "@/lib/format";

import { RecentActivityCard } from "../../../components/admin/recent-activity-card";

// Screen 26-adminOverview. Data below is dummy (see
// src/components/admin/fixtures.ts) until a real API exists — see
// docs/RAIQUID_CONTEXT.md, "Open decisions".
export default function Page() {
  const reservePoolShare = formatPercent(ADMIN_RESERVE_SNAPSHOT.coverageRatioPct);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-foreground text-3xl font-semibold">Platform overview</h1>
        <p className="text-muted-foreground mt-1">Live sandbox metrics</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total value financed"
          value={formatNaira(ADMIN_OVERVIEW.totalValueFinanced)}
        />
        <StatCard label="Active invoices" value={String(ADMIN_OVERVIEW.activeInvoices)} />
        <StatCard
          label="On-time repayment rate"
          value={formatPercent(ADMIN_OVERVIEW.onTimeRepaymentRatePct, 0)}
          emphasize
        />
        <StatCard label="Active investors" value={formatNumber(ADMIN_OVERVIEW.activeInvestors)} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="p-7">
          <CardTitle>Reserve pool</CardTitle>

          <div className="py-5">
            <p className="font-display text-foreground text-3xl leading-none font-medium">
              {formatNaira(ADMIN_RESERVE_SNAPSHOT.currentBalance)}
            </p>
            <p className="text-muted-foreground mt-1.5 text-sm">
              {reservePoolShare} of total value financed
            </p>
          </div>
        </Card>

        <RecentActivityCard items={ADMIN_RECENT_ACTIVITY} />
      </div>
    </div>
  );
}
