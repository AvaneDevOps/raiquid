import Link from "next/link";

import { getSessionUser } from "@/components/shared/layout/session-user";
import { Button } from "@/components/shared/ui/button";
import { StatCard } from "@/components/shared/ui/card";
import { BUSINESS_INVOICES, BUSINESS_STATS } from "@/components/business/fixtures";
import { formatNaira } from "@/lib/format";

import { RecentInvoicesCard } from "./_components/recent-invoices-card";

/**
 * "Good morning/afternoon/evening" — small enough to keep local for now.
 * Promote to src/lib/ if a second role's dashboard wants the same greeting.
 */
function getDaypartGreeting(date: Date = new Date()): string {
  const hour = date.getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

// Screen 04-bizDashboard. Data below is dummy (see
// src/components/business/fixtures.ts) until a real API exists — see
// docs/RAIQUID_CONTEXT.md, "Open decisions".
export default async function Page() {
  const user = await getSessionUser("business");
  const firstName = user.name.split(" ")[0];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-display text-foreground text-3xl font-semibold">
            {getDaypartGreeting()}, {firstName}
          </h1>
          <p className="text-muted-foreground mt-1">Here&apos;s where things stand today.</p>
        </div>
        <Button asChild size="lg">
          <Link href="/business/invoices/new">Upload invoice</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Active invoices"
          value={String(BUSINESS_STATS.activeInvoicesCount)}
          caption={`${formatNaira(BUSINESS_STATS.activeInvoicesAmountInProgress)} in progress`}
        />
        <StatCard
          label="Total financed"
          value={formatNaira(BUSINESS_STATS.totalFinanced)}
          caption={`since ${BUSINESS_STATS.totalFinancedSince}`}
          emphasize
        />
        <StatCard
          label="Avg. time to cash"
          value={`${BUSINESS_STATS.avgDaysToCash} days`}
          caption="from buyer acceptance"
        />
      </div>

      {/* BUSINESS_INVOICES is ordered most-recent-first — see fixtures.ts */}
      <RecentInvoicesCard invoices={BUSINESS_INVOICES.slice(0, 3)} />
    </div>
  );
}
