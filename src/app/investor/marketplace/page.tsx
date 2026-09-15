import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

import { InvoiceStatusBadge } from "@/components/shared/domain/status-badges";
import { Button } from "@/components/shared/ui/button";
import { Card } from "@/components/shared/ui/card";
import { EmptyState, InlineNotice } from "@/components/shared/ui/notice";
import { formatDate, formatNaira } from "@/lib/format";
import { investorService } from "@/services";
import type { InvoiceStatus } from "@/types";

// Screen not built yet (stub) — wired directly to GET /investor/marketplace
// instead of a fixture, since none existed. Response shape confirmed
// against the backend source (raiquid-api's InvestorService.listMarketplace),
// not guessed: { data, page, pageSize, total }, each row a Prisma Invoice
// with `include: { buyer: true }` — buyer name is the nested
// raw.buyer.legalName, not a flat buyerName/buyerLegalName field. Minimal
// on purpose: no pagination UI, no styling beyond the existing shared
// primitives — see docs/RAIQUID_CONTEXT.md, "Open decisions".
interface MarketplaceListing {
  id: string;
  buyerName: string;
  amount: number;
  dueDate: string;
  status: InvoiceStatus;
}

interface BuyerRef {
  legalName?: string;
}

function toListing(raw: Record<string, unknown>): MarketplaceListing {
  const buyer = raw.buyer as BuyerRef | undefined;
  return {
    id: String(raw.id ?? ""),
    buyerName: buyer?.legalName ?? "—",
    amount: Number(raw.amount ?? 0),
    dueDate: String(raw.dueDate ?? ""),
    status: (raw.status as InvoiceStatus) ?? "tokenized",
  };
}

export default async function Page() {
  const { getToken } = await auth();
  const token = await getToken();

  let listings: MarketplaceListing[] = [];
  let loadError: string | null = null;
  try {
    const response = await investorService.get<{ data: Record<string, unknown>[] }>(
      "/investor/marketplace",
      token,
    );
    listings = response.data.map(toListing);
  } catch (error) {
    loadError = error instanceof Error ? error.message : "Couldn't load the marketplace.";
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-foreground text-3xl font-semibold">Marketplace</h1>
        <p className="text-muted-foreground mt-1">Invoices open for investment right now.</p>
      </div>

      {loadError ? (
        <InlineNotice tone="danger">{loadError}</InlineNotice>
      ) : listings.length === 0 ? (
        <EmptyState
          title="Nothing open for investment right now"
          description="Check back once a business's invoice has been confirmed by its buyer and listed."
        />
      ) : (
        <Card>
          <div className="divide-border divide-y">
            {listings.map((listing) => (
              <div
                key={listing.id}
                className="flex flex-wrap items-center justify-between gap-4 px-5 py-4"
              >
                <div>
                  <p className="text-foreground font-mono text-sm">{listing.id}</p>
                  <p className="text-muted-foreground text-sm">{listing.buyerName}</p>
                </div>
                <div className="text-right">
                  <p className="text-foreground text-sm">{formatNaira(listing.amount)}</p>
                  <p className="text-muted-foreground text-sm">Due {formatDate(listing.dueDate)}</p>
                </div>
                <InvoiceStatusBadge status={listing.status} />
                <Button asChild size="sm">
                  <Link href={`/investor/marketplace/${listing.id}/fund`}>Invest</Link>
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
