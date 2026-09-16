import { auth } from "@clerk/nextjs/server";

import { PROVENANCE_TIER_ORDER } from "@/types";
import type { MarketplaceListing } from "@/components/investor";
import { EmptyState, InlineNotice } from "@/components/shared/ui/notice";
import { investorService } from "@/services";

import { toListing } from "./_lib/listing";
import { MarketplaceCard } from "./_components/marketplace-card";
import { MarketplaceSortTabs, type MarketplaceSort } from "./_components/marketplace-sort-tabs";

const VALID_SORTS: MarketplaceSort[] = ["return", "due-date", "buyer-tier"];

function isMarketplaceSort(value: unknown): value is MarketplaceSort {
  return typeof value === "string" && VALID_SORTS.includes(value as MarketplaceSort);
}

// Screen 19-invMarketplace, wired to GET /investor/marketplace. Response
// shape confirmed against the backend source, not guessed — see
// ./_lib/listing.ts for the mapping (shared with the detail screen).
export default async function Page({ searchParams }: PageProps<"/investor/marketplace">) {
  const { sort } = await searchParams;
  const activeSort: MarketplaceSort = isMarketplaceSort(sort) ? sort : "return";

  const { getToken } = await auth();
  const token = await getToken();

  let listings: MarketplaceListing[] = [];
  let total = 0;
  let loadError: string | null = null;
  try {
    const response = await investorService.get<{
      data: Record<string, unknown>[];
      total: number;
    }>("/investor/marketplace", token);
    listings = response.data.map(toListing);
    total = response.total;
  } catch (error) {
    loadError = error instanceof Error ? error.message : "Couldn't load the marketplace.";
  }

  const sorted = [...listings].sort((a, b) => {
    switch (activeSort) {
      case "due-date":
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      case "buyer-tier":
        return (
          PROVENANCE_TIER_ORDER.indexOf(b.provenanceTier) -
          PROVENANCE_TIER_ORDER.indexOf(a.provenanceTier)
        );
      case "return":
      default:
        return b.expectedReturnPct - a.expectedReturnPct;
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="font-display text-foreground text-3xl font-semibold">Marketplace</h1>
          {!loadError && (
            <p className="text-muted-foreground mt-1">{total} invoices open for funding</p>
          )}
        </div>
        <MarketplaceSortTabs active={activeSort} />
      </div>

      {loadError ? (
        <InlineNotice tone="danger">{loadError}</InlineNotice>
      ) : sorted.length === 0 ? (
        <EmptyState
          title="No invoices open for funding"
          description="Check back once more invoices are tokenized and listed."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {sorted.map((listing) => (
            <MarketplaceCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
}
