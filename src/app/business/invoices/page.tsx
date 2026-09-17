import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

import { Button } from "@/components/shared/ui/button";
import { InlineNotice } from "@/components/shared/ui/notice";
import { businessService } from "@/services/business";
import type { Invoice } from "@/types";

import { InvoiceFilterTabs } from "./_components/invoice-filter-tabs";
import { InvoiceListTable } from "./_components/invoice-list-table";
import { toInvoice } from "../_lib/invoice";

// Screen 10-bizList, wired to GET /business/invoices — see
// ../_lib/invoice.ts for the confirmed mapping (shared with the
// dashboard). See docs/RAIQUID_CONTEXT.md, "Open decisions".
export default async function Page({ searchParams }: PageProps<"/business/invoices">) {
  const { status } = await searchParams;
  const activeFilter = typeof status === "string" ? status : null;

  const { getToken } = await auth();
  const token = await getToken();

  let invoices: Invoice[] = [];
  let total = 0;
  let loadError: string | null = null;
  try {
    const path = activeFilter
      ? `/business/invoices?status=${encodeURIComponent(activeFilter)}`
      : "/business/invoices";
    const response = await businessService.get<{
      data: Record<string, unknown>[];
      total: number;
    }>(path, token);
    invoices = response.data.map(toInvoice);
    total = response.total;
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
