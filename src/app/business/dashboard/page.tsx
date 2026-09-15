import Link from "next/link";
import { auth } from "@clerk/nextjs/server";

import { getSessionUser } from "@/components/shared/layout/session-user";
import { Button } from "@/components/shared/ui/button";
import { StatCard } from "@/components/shared/ui/card";
import { businessService, normalizeBusinessInvoices } from "@/services/business";
import { formatNaira } from "@/lib/format";

import { RecentInvoicesCard } from "./_components/recent-invoices-card";

function getDaypartGreeting(date: Date = new Date()): string {
  const hour = date.getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default async function Page() {
  const user = await getSessionUser("business");
  const { getToken } = await auth();
  const token = await getToken();
  const payload = await businessService.listInvoices<unknown>(token, { page: 1, pageSize: 100 });
  const invoices = normalizeBusinessInvoices(payload);

  const activeInvoices = invoices.filter(
    (invoice) => invoice.status !== "repaid" && invoice.status !== "overdue",
  );
  const financed = invoices.reduce((sum, invoice) => sum + invoice.fundedAmount, 0);
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
          value={String(activeInvoices.length)}
          caption={`${formatNaira(activeInvoices.reduce((sum, invoice) => sum + invoice.amount, 0))} in progress`}
        />
        <StatCard
          label="Total financed"
          value={formatNaira(financed)}
          caption="from returned invoices"
          emphasize
        />
        <StatCard label="Invoices" value={String(invoices.length)} caption="returned by the API" />
      </div>

      <RecentInvoicesCard invoices={invoices.slice(0, 3)} />
    </div>
  );
}
