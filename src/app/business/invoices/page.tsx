import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import type { paths } from "@/types/api-generated";
import { businessService, normalizeBusinessInvoices } from "@/services/business";
import { Button } from "@/components/shared/ui/button";
import { formatNaira } from "@/lib/format";

import { InvoiceFilterTabs } from "./_components/invoice-filter-tabs";
import { InvoiceListTable } from "./_components/invoice-list-table";

const FILTER_STATUSES = ["awaiting_acceptance", "funding", "repaid", "overdue"] as const;

type BusinessInvoiceListQuery = paths["/business/invoices"]["get"]["parameters"]["query"];
type BusinessInvoiceListStatus = NonNullable<BusinessInvoiceListQuery>["status"];

export default async function Page({ searchParams }: PageProps<"/business/invoices">) {
  const { getToken } = await auth();
  const token = await getToken();
  const { status } = await searchParams;

  const activeFilter =
    typeof status === "string" &&
    FILTER_STATUSES.includes(status as (typeof FILTER_STATUSES)[number])
      ? (status as (typeof FILTER_STATUSES)[number])
      : null;

  const apiStatus: BusinessInvoiceListStatus =
    activeFilter === "awaiting_acceptance" ? "submitted" : (activeFilter ?? undefined);

  const invoicesPayload = await businessService.listInvoices<unknown>(token, {
    page: 1,
    pageSize: 100,
    ...(apiStatus ? { status: apiStatus } : {}),
  });

  const invoices = normalizeBusinessInvoices(invoicesPayload);
  const totalFinanced = invoices.reduce((sum, invoice) => sum + invoice.fundedAmount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-display text-foreground text-3xl font-semibold">Invoices</h1>
          <p className="text-muted-foreground mt-1">
            {invoices.length} total · {formatNaira(totalFinanced)} financed in the returned invoices
          </p>
        </div>

        <Button asChild size="lg">
          <Link href="/business/invoices/new">Upload invoice</Link>
        </Button>
      </div>

      <InvoiceFilterTabs active={activeFilter} />

      <InvoiceListTable invoices={invoices} />
    </div>
  );
}
