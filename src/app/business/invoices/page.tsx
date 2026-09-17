import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

import { Button } from "@/components/shared/ui/button";
import { InlineNotice } from "@/components/shared/ui/notice";
import { businessService, normalizeBusinessInvoices } from "@/services/business";
import type { paths } from "@/types/api-generated";

import { InvoiceFilterTabs } from "./_components/invoice-filter-tabs";
import { InvoiceListTable } from "./_components/invoice-list-table";

const FILTER_STATUSES = ["awaiting_acceptance", "funding", "repaid", "overdue"] as const;

type BusinessInvoiceListQuery = paths["/business/invoices"]["get"]["parameters"]["query"];
type BusinessInvoiceListStatus = NonNullable<BusinessInvoiceListQuery>["status"];

export default async function Page({ searchParams }: PageProps<"/business/invoices">) {
  const { status } = await searchParams;

  const activeFilter =
    typeof status === "string" &&
    FILTER_STATUSES.includes(status as (typeof FILTER_STATUSES)[number])
      ? (status as (typeof FILTER_STATUSES)[number])
      : null;

  const apiStatus: BusinessInvoiceListStatus =
    activeFilter === "awaiting_acceptance" ? "submitted" : (activeFilter ?? undefined);

  const { getToken } = await auth();
  const token = await getToken();

  let invoices: ReturnType<typeof normalizeBusinessInvoices> = [];
  let total = 0;
  let loadError: string | null = null;

  try {
    const response = await businessService.listInvoices<unknown>(token, {
      page: 1,
      pageSize: 100,
      ...(apiStatus ? { status: apiStatus } : {}),
    });

    invoices = normalizeBusinessInvoices(response);

    total =
      typeof response === "object" &&
      response !== null &&
      "total" in response &&
      typeof response.total === "number"
        ? response.total
        : invoices.length;
  } catch (error) {
    loadError = error instanceof Error ? error.message : "Couldn't load invoices.";
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-display text-foreground text-3xl font-semibold">Invoices</h1>
          {!loadError && <p className="text-muted-foreground mt-1">{total} total</p>}
        </div>

        <Button asChild size="lg">
          <Link href="/business/invoices/new">Upload invoice</Link>
        </Button>
      </div>

      <InvoiceFilterTabs active={activeFilter} />

      {loadError ? (
        <InlineNotice tone="danger">{loadError}</InlineNotice>
      ) : (
        <InvoiceListTable invoices={invoices} />
      )}
    </div>
  );
}
