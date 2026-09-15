import { auth } from "@clerk/nextjs/server";

import { PROVENANCE_TIER_ORDER } from "@/types";
import type { MarketplaceListing } from "@/components/investor";
import { EmptyState, InlineNotice } from "@/components/shared/ui/notice";
import { investorService } from "@/services";

import { MarketplaceCard } from "./_components/marketplace-card";
import { MarketplaceSortTabs, type MarketplaceSort } from "./_components/marketplace-sort-tabs";

const VALID_SORTS: MarketplaceSort[] = ["return", "due-date", "buyer-tier"];

function isMarketplaceSort(value: unknown): value is MarketplaceSort {
  return typeof value === "string" && VALID_SORTS.includes(value as MarketplaceSort);
}

// Screen 19-invMarketplace, wired to GET /investor/marketplace. Response
// shape confirmed against the backend source (raiquid-api's
// InvestorService.listMarketplace), not guessed: { data, page, pageSize,
// total }, each row a Prisma Invoice with `include: { buyer: true }` — buyer
// name and provenance tier both come off the nested raw.buyer object
// (legalName, provenanceTier), not flat fields. amount, dueDate, status,
// fundedAmount, platformFeePct, reserveContributionPct and description are
// all real fields too. expectedReturnPct and fundingInvestorCount have no
// backing field anywhere on the real schema yet — placeholder 0 below,
// same gap as the other yield/fee fields noted in
// docs/RAIQUID_CONTEXT.md, "Open decisions".
interface BuyerRef {
  legalName?: string;
  provenanceTier?: MarketplaceListing["provenanceTier"];
}

function toListing(raw: Record<string, unknown>): MarketplaceListing {
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
    status: (raw.status as MarketplaceListing["status"]) ?? "tokenized",
    expectedReturnPct: 0,
    fundedAmount: Number(raw.fundedAmount ?? 0),
    fundingInvestorCount: 0,
    platformFeePct: Number(raw.platformFeePct ?? 0),
    reserveContributionPct: Number(raw.reserveContributionPct ?? 0),
    provenanceTier: buyer?.provenanceTier ?? "quarried",
  };
}

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
