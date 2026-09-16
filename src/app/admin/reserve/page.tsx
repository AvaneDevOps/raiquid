import { auth } from "@clerk/nextjs/server";

import { Card, CardTitle, StatCard } from "@/components/shared/ui/card";
import { EmptyState, InlineNotice } from "@/components/shared/ui/notice";
import { formatNaira, formatPercent } from "@/lib/format";
import { adminService } from "@/services";

import { ClaimsPaidCard } from "@/components/admin/claims-paid-card";

interface ReserveResponse {
  reserveBalance: number;
  coverageRatio: number | null;
}

// Screen 27-adminReserve, wired to real GET /admin/reserve (confirmed
// against the backend source: reserveBalance and coverageRatio are both
// server-computed, and claims is *always* an empty array — "No
// ReservePool or claims model exists," per raiquid-api's own code
// comment — which is exactly the zero-claims state ClaimsPaidCard already
// renders, now backed for real rather than assumed). Contribution rate
// has no single platform-wide value — it's set per invoice by the
// buyer's provenance tier (PROVENANCE_FEE_SCHEDULE), not a flat rate, so
// it's shown as honest text instead of a fabricated flat percentage. The
// balance-growth chart is an empty state — no historical time-series
// endpoint exists to back it. See docs/RAIQUID_CONTEXT.md, "Open
// decisions".
export default async function Page() {
  const { getToken } = await auth();
  const token = await getToken();

  let reserveBalance = 0;
  let coverageRatioPct = 0;
  let loadError: string | null = null;
  try {
    const response = await adminService.get<ReserveResponse>("/admin/reserve", token);
    reserveBalance = response.reserveBalance;
    coverageRatioPct = (response.coverageRatio ?? 0) * 100;
  } catch (error) {
    loadError = error instanceof Error ? error.message : "Couldn't load the reserve pool.";
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-foreground text-3xl font-semibold">Reserve pool</h1>
        <p className="text-muted-foreground mt-1">
          Shared fund that covers investors if a buyer defaults
        </p>
      </div>

      {loadError ? <InlineNotice tone="danger">{loadError}</InlineNotice> : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Current balance" value={formatNaira(reserveBalance)} emphasize />
        <StatCard
          label="Contribution rate"
          value="Varies by buyer tier"
          caption="set per invoice, not platform-wide"
        />
        <StatCard
          label="Coverage ratio"
          value={formatPercent(coverageRatioPct)}
          caption="of total value financed"
        />
      </div>

      <Card className="p-5">
        <CardTitle>Balance growth</CardTitle>
        <EmptyState
          title="Not available yet"
          description="Historical reserve balance isn't tracked over time yet — there's no endpoint for it."
        />
      </Card>

      <ClaimsPaidCard claimsPaid={0} />
    </div>
  );
}
