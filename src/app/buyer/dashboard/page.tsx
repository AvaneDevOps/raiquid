import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

import { BUYER_DASHBOARD_COPY } from "@/components/buyer/fixtures";
import { ProvenanceTierBadge } from "@/components/shared/domain/status-badges";
import { Card, CardTitle } from "@/components/shared/ui/card";
import { InlineNotice } from "@/components/shared/ui/notice";
import { daysUntil, formatDate, formatNaira, formatPercent } from "@/lib/format";
import { buyerService } from "@/services";
import type { ProvenanceTier } from "@/types";

import { toBuyerInvoice } from "../_lib/invoice";

interface SettingsResponse {
  legalName?: string;
  provenanceTier?: ProvenanceTier;
  onTimePaymentRate?: string | number;
}

// Screen 14-buyDashboard, wired to real GET /buyer/settings (for the
// company name/tier/on-time rate) and GET /buyer/payment-schedule (for
// the soonest upcoming payment) — confirmed against the backend source.
// onTimePaymentRate is a real field (0..1 decimal, scaled to a percentage
// here) but reads 0 for every buyer today per raiquid-api's own admitted
// gap (computing it was deferred) — same as elsewhere, not fabricated.
// "14 of 15 invoices" and the per-tier unlock copy stay as-is: the former
// has no backing count fields, the latter is static marketing copy keyed
// by the real tier, not data.
export default async function Page() {
  const { getToken } = await auth();
  const token = await getToken();

  let companyName = "";
  let provenanceTier: ProvenanceTier = "quarried";
  let onTimePaymentRate = 0;
  let upcoming: ReturnType<typeof toBuyerInvoice> | null = null;
  let loadError: string | null = null;

  try {
    const [settings, schedule] = await Promise.all([
      buyerService.get<SettingsResponse>("/buyer/settings", token),
      buyerService.get<Record<string, unknown>[]>("/buyer/payment-schedule", token),
    ]);
    companyName = settings.legalName ?? "";
    provenanceTier = settings.provenanceTier ?? "quarried";
    onTimePaymentRate = Number(settings.onTimePaymentRate ?? 0) * 100;
    upcoming = schedule.length > 0 ? toBuyerInvoice(schedule[0]) : null;
  } catch (error) {
    loadError = error instanceof Error ? error.message : "Couldn't load your dashboard.";
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-foreground text-3xl font-semibold sm:text-4xl">
          {companyName || "Your dashboard"}
        </h1>
        <p className="text-muted-foreground mt-2 text-base sm:text-lg">
          Your payment record, and what it unlocks for your suppliers.
        </p>
      </div>

      {loadError ? <InlineNotice tone="danger">{loadError}</InlineNotice> : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle>Provenance</CardTitle>
              <p className="font-display text-accent-400 mt-7 text-4xl font-medium">
                {formatPercent(onTimePaymentRate, 0)}
              </p>
            </div>
            <ProvenanceTierBadge tier={provenanceTier} />
          </div>
          <p className="text-muted-foreground mt-2 font-mono text-sm">on-time payment rate</p>
        </Card>

        <Card className="p-6">
          <CardTitle>What {provenanceTier} tier unlocks</CardTitle>
          <p className="text-muted-foreground mt-5 max-w-xl text-base leading-7">
            {BUYER_DASHBOARD_COPY[provenanceTier]}
          </p>
        </Card>
      </div>

      <Card className="p-6">
        <CardTitle>Upcoming payments</CardTitle>
        {upcoming ? (
          <>
            <div className="border-border text-muted-foreground mt-6 hidden grid-cols-[1fr_1.5fr_1fr_1fr_auto] gap-4 border-b pb-3 text-sm md:grid">
              <span>Invoice</span>
              <span>Supplier</span>
              <span>Amount</span>
              <span>Due</span>
              <span />
            </div>
            <div className="mt-4 hidden grid-cols-[1fr_1.5fr_1fr_1fr_auto] items-center gap-4 md:grid">
              <Link
                href={`/buyer/invoices/${upcoming.id}/pay`}
                className="text-accent-400 font-mono text-sm hover:underline"
              >
                {upcoming.id}
              </Link>
              <span className="text-foreground">{upcoming.supplierName}</span>
              <span className="text-foreground">{formatNaira(upcoming.amount)}</span>
              <span className="text-foreground">{formatDate(upcoming.dueDate)}</span>
              <span className="seal-chip text-muted-foreground font-mono text-xs">
                {Math.max(0, daysUntil(upcoming.dueDate))} days left
              </span>
            </div>
            <div className="mt-6 space-y-4 md:hidden">
              <div className="grid grid-cols-[7rem_1fr] gap-y-3 text-sm">
                <span className="text-muted-foreground font-mono">Invoice</span>
                <Link
                  href={`/buyer/invoices/${upcoming.id}/pay`}
                  className="text-accent-400 font-mono hover:underline"
                >
                  {upcoming.id}
                </Link>
                <span className="text-muted-foreground">Supplier</span>
                <span className="text-foreground">{upcoming.supplierName}</span>
                <span className="text-muted-foreground">Amount</span>
                <span className="text-foreground">{formatNaira(upcoming.amount)}</span>
                <span className="text-muted-foreground">Due</span>
                <span className="text-foreground">{formatDate(upcoming.dueDate)}</span>
              </div>
              <span className="seal-chip text-muted-foreground inline-flex font-mono text-xs">
                {Math.max(0, daysUntil(upcoming.dueDate))} days left
              </span>
            </div>
          </>
        ) : (
          <p className="text-muted-foreground mt-6 text-sm">No upcoming payments.</p>
        )}
      </Card>
    </div>
  );
}
