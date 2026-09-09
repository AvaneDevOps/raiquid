// TODO: implement. See docs/ROUTE_MAP.md for the source screen reference
// and docs/RAIQUID_CONTEXT.md for domain/business context.
import { ADMIN_RESERVE_BALANCE_GROWTH, ADMIN_RESERVE_SNAPSHOT } from "@/components/admin/fixtures";
import { StatCard } from "@/components/shared/ui/card";
import { formatNaira, formatPercent } from "@/lib/format";

import { BalanceGrowthCard } from "./_components/balance-growth-card";
import { ClaimsPaidCard } from "./_components/claims-paid-card";

// Screen 27-adminReserve. Data below is dummy (see
// src/components/admin/fixtures.ts) until a real API exists — see
// docs/RAIQUID_CONTEXT.md, "Open decisions".
export default function Page() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-foreground text-3xl font-semibold">Reserve pool</h1>
        <p className="text-muted-foreground mt-1">
          Shared fund that covers investors if a buyer defaults
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Current balance"
          value={formatNaira(ADMIN_RESERVE_SNAPSHOT.currentBalance)}
          emphasize
        />
        <StatCard
          label="Contribution rate"
          value={formatPercent(ADMIN_RESERVE_SNAPSHOT.contributionRatePct)}
          caption="per financed invoice"
        />
        <StatCard
          label="Coverage ratio"
          value={formatPercent(ADMIN_RESERVE_SNAPSHOT.coverageRatioPct)}
          caption="of total value financed"
        />
      </div>

      <BalanceGrowthCard data={ADMIN_RESERVE_BALANCE_GROWTH} />

      <ClaimsPaidCard claimsPaid={ADMIN_RESERVE_SNAPSHOT.claimsPaid} />
    </div>
  );
}
