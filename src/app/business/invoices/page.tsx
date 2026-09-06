// TODO: implement. See docs/ROUTE_MAP.md for the source screen reference
// and docs/RAIQUID_CONTEXT.md for domain/business context.
import Link from "next/link";

import { BUSINESS_INVOICES, BUSINESS_STATS } from "@/components/business/fixtures";
import { Button } from "@/components/shared/ui/button";
import { formatNaira } from "@/lib/format";

import { InvoiceFilterTabs } from "./_components/invoice-filter-tabs";
import { InvoiceListTable } from "./_components/invoice-list-table";

// Screen 10-bizList. Data is dummy (see src/components/business/fixtures.ts)
// until a real API exists — see docs/RAIQUID_CONTEXT.md, "Open decisions".
export default async function Page({ searchParams }: PageProps<"/business/invoices">) {
  const { status } = await searchParams;
  const activeFilter = typeof status === "string" ? status : null;

  const filteredInvoices = activeFilter
    ? BUSINESS_INVOICES.filter((invoice) => invoice.status === activeFilter)
    : BUSINESS_INVOICES;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-display text-foreground text-3xl font-semibold">Invoices</h1>
          <p className="text-muted-foreground mt-1">
            {BUSINESS_STATS.totalInvoicesCount} total · {formatNaira(BUSINESS_STATS.totalFinanced)}{" "}
            financed to date
          </p>
        </div>
        <Button asChild size="lg">
          <Link href="/business/invoices/new">Upload invoice</Link>
        </Button>
      </div>

      <InvoiceFilterTabs active={activeFilter} />

      <InvoiceListTable invoices={filteredInvoices} />
    </div>
  );
}
