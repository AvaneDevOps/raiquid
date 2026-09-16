import { auth } from "@clerk/nextjs/server";

import type { RecentActivityItem } from "@/components/admin/fixtures";
import { Card, CardTitle, StatCard } from "@/components/shared/ui/card";
import { InlineNotice } from "@/components/shared/ui/notice";
import { formatNaira, formatNumber, formatPercent } from "@/lib/format";
import { adminService } from "@/services";

import { RecentActivityCard } from "@/components/admin/recent-activity-card";
import { toEvent } from "../ledger/_lib/event";

interface OverviewResponse {
  totalValueFinanced: number;
  activeInvoices: number;
  onTimeRepaymentRate: number | null;
  activeInvestors: number;
}

interface ReserveResponse {
  reserveBalance: number;
  totalValueFinanced: number;
  coverageRatio: number | null;
}

// Screen 26-adminOverview, wired to real GET /admin/overview and
// GET /admin/reserve (confirmed against the backend source — both are
// server-computed aggregates, nothing mocked). "Recent on-chain activity"
// reuses GET /admin/ledger's most recent page — that endpoint's own
// ordering (createdAt desc) already is exactly "recent activity," no
// separate feed exists or is needed.
export default async function Page() {
  const { getToken } = await auth();
  const token = await getToken();

  let totalValueFinanced = 0;
  let activeInvoices = 0;
  let onTimeRepaymentRatePct = 0;
  let activeInvestors = 0;
  let reserveBalance = 0;
  let coverageRatioPct = 0;
  let recentActivity: RecentActivityItem[] = [];
  let loadError: string | null = null;

  try {
    const [overview, reserve, ledger] = await Promise.all([
      adminService.get<OverviewResponse>("/admin/overview", token),
      adminService.get<ReserveResponse>("/admin/reserve", token),
      adminService.get<{ data: Record<string, unknown>[] }>("/admin/ledger?pageSize=5", token),
    ]);
    totalValueFinanced = overview.totalValueFinanced;
    activeInvoices = overview.activeInvoices;
    onTimeRepaymentRatePct = (overview.onTimeRepaymentRate ?? 0) * 100;
    activeInvestors = overview.activeInvestors;
    reserveBalance = reserve.reserveBalance;
    coverageRatioPct = (reserve.coverageRatio ?? 0) * 100;
    recentActivity = ledger.data.map(toEvent).map((event) => ({
      id: event.id,
      action: event.action,
      tokenId: event.tokenAddressShort,
      status: event.status,
    }));
  } catch (error) {
    loadError = error instanceof Error ? error.message : "Couldn't load the platform overview.";
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-foreground text-3xl font-semibold">Platform overview</h1>
        <p className="text-muted-foreground mt-1">Live sandbox metrics</p>
      </div>

      {loadError ? <InlineNotice tone="danger">{loadError}</InlineNotice> : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total value financed" value={formatNaira(totalValueFinanced)} />
        <StatCard label="Active invoices" value={String(activeInvoices)} />
        <StatCard
          label="On-time repayment rate"
          value={formatPercent(onTimeRepaymentRatePct, 0)}
          emphasize
        />
        <StatCard label="Active investors" value={formatNumber(activeInvestors)} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="p-7">
          <CardTitle>Reserve pool</CardTitle>

          <div className="py-5">
            <p className="font-display text-foreground text-3xl leading-none font-medium">
              {formatNaira(reserveBalance)}
            </p>
            <p className="text-muted-foreground mt-1.5 text-sm">
              {formatPercent(coverageRatioPct)} of total value financed
            </p>
          </div>
        </Card>

        <RecentActivityCard items={recentActivity} />
      </div>
    </div>
  );
}
