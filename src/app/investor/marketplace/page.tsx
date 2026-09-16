<<<<<<< HEAD
// TODO: implement. See docs/ROUTE_MAP.md for the source screen reference
// and docs/RAIQUID_CONTEXT.md for domain/business context.
export default function Page() {
  return null;
=======
import { PROVENANCE_TIER_ORDER } from "@/types";

import { INVESTOR_MARKETPLACE_LISTINGS, INVESTOR_MARKETPLACE_STATS } from "@/components/investor";
import { EmptyState } from "@/components/shared/ui/notice";

import { MarketplaceCard } from "./_components/marketplace-card";
import { MarketplaceSortTabs, type MarketplaceSort } from "./_components/marketplace-sort-tabs";

const VALID_SORTS: MarketplaceSort[] = ["return", "due-date", "buyer-tier"];

function isMarketplaceSort(value: unknown): value is MarketplaceSort {
  return typeof value === "string" && VALID_SORTS.includes(value as MarketplaceSort);
}

// Screen 19-invMarketplace. Data below is dummy (see
// src/components/investor/index.ts) until a real API exists — see
// docs/RAIQUID_CONTEXT.md, "Open decisions".
export default async function Page({ searchParams }: PageProps<"/investor/marketplace">) {
  const { sort } = await searchParams;
  const activeSort: MarketplaceSort = isMarketplaceSort(sort) ? sort : "return";

  const listings = [...INVESTOR_MARKETPLACE_LISTINGS].sort((a, b) => {
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
          <p className="text-muted-foreground mt-1">
            {INVESTOR_MARKETPLACE_STATS.openInvoicesCount} invoices open for funding
          </p>
        </div>
        <MarketplaceSortTabs active={activeSort} />
      </div>

      {listings.length === 0 ? (
        <EmptyState
          title="No invoices open for funding"
          description="Check back once more invoices are tokenized and listed."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {listings.map((listing) => (
            <MarketplaceCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
>>>>>>> 126c1250105090cfeb3f5a136297e976271e7075
}
