import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

import { Button } from "@/components/shared/ui/button";
import { InlineNotice } from "@/components/shared/ui/notice";
import { businessService } from "@/services/business";
import type { Invoice, InvoiceStatus } from "@/types";

import { InvoiceFilterTabs } from "./_components/invoice-filter-tabs";
import { InvoiceListTable } from "./_components/invoice-list-table";

// Screen 10-bizList, wired to GET /business/invoices. Response shape
// confirmed against the backend source (raiquid-api's
// BusinessService.listInvoices), not guessed: { data, page, pageSize,
// total }, where each row is a Prisma Invoice with `include: { buyer:
// true }` — so the buyer's name is the nested raw.buyer.legalName, not a
// flat buyerName/buyerLegalName field. The rest of the domain Invoice
// type is filled with placeholders InvoiceListTable never reads — the
// real backend has no yield/funding-progress fields yet.
interface BuyerRef {
  legalName?: string;
}

function toInvoice(raw: Record<string, unknown>): Invoice {
  const buyer = raw.buyer as BuyerRef | undefined;
  return {
    id: String(raw.id ?? ""),
    businessId: String(raw.businessId ?? ""),
    buyerId: String(raw.buyerId ?? ""),
    buyerName: buyer?.legalName ?? "—",
    amount: Number(raw.amount ?? 0),
    dueDate: String(raw.dueDate ?? ""),
    submittedAt: String(raw.createdAt ?? ""),
    description: String(raw.description ?? ""),
    status: (raw.status as InvoiceStatus) ?? "submitted",
    expectedReturnPct: 0,
    fundedAmount: 0,
    fundingInvestorCount: 0,
    platformFeePct: 0,
    reserveContributionPct: 0,
  };
}

// Screen 10-bizList. See docs/RAIQUID_CONTEXT.md, "Open decisions".
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
