import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

import { getSessionUser } from "@/components/shared/layout/session-user";
import { Button } from "@/components/shared/ui/button";
import { StatCard } from "@/components/shared/ui/card";
import { InlineNotice } from "@/components/shared/ui/notice";
import { formatNaira } from "@/lib/format";
import { businessService } from "@/services";
import type { Invoice } from "@/types";

import { RecentInvoicesCard } from "./_components/recent-invoices-card";
import { isActive, toInvoice } from "../_lib/invoice";

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

// Screen 04-bizDashboard, wired to real GET /business/invoices — see
// ../_lib/invoice.ts for the mapping (shared with business/invoices) and
// the real "active" definition. "Total financed" and "Avg. time to
// cash" are removed entirely — no backing endpoint exists for either
// (the former needs a stats aggregate, the latter needs
// acceptedAt-to-payout timing nobody's computed) — see
// docs/RAIQUID_CONTEXT.md, "Open decisions".
export default async function Page() {
  const user = await getSessionUser("business");
  const firstName = user.name.split(" ")[0];

  const { getToken } = await auth();
  const token = await getToken();

  let invoices: Invoice[] = [];
  let loadError: string | null = null;
  try {
    const response = await businessService.get<{ data: Record<string, unknown>[] }>(
      "/business/invoices?pageSize=100",
      token,
    );
    invoices = response.data.map(toInvoice);
  } catch (error) {
    loadError = error instanceof Error ? error.message : "Couldn't load your invoices.";
  }

  const activeInvoices = invoices.filter(isActive);
  const activeInvoicesAmount = activeInvoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const recent = invoices.slice(0, 3);

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

      {loadError ? <InlineNotice tone="danger">{loadError}</InlineNotice> : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Active invoices"
          value={String(activeInvoices.length)}
          caption={`${formatNaira(activeInvoicesAmount)} in progress`}
        />
      </div>

      <RecentInvoicesCard invoices={recent} />
    </div>
  );
}
