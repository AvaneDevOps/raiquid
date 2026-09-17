import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import type { Route } from "next";
import { notFound } from "next/navigation";

import { InvoiceRef, InvoiceStatusBadge } from "@/components/shared/domain/status-badges";
import { Button } from "@/components/shared/ui/button";
import { InlineNotice } from "@/components/shared/ui/notice";
import { ApiError, investorService } from "@/services";
import type { MarketplaceListing } from "@/components/investor";

import { toBuyerProvenance, toListing } from "../_lib/listing";
import { BuyerProvenanceCard, ProtectionCard } from "./_components/buyer-detail-cards";
import { FundingProgressCard, InvoiceDetailsCard } from "./_components/invoice-detail-cards";

// Screen 20-invDetail, wired to GET /investor/marketplace/{id} — confirmed
// against the backend source (raiquid-api's
// InvestorController.getMarketplaceListing / InvestorService
// .getMarketplaceListing), not guessed: a Prisma Invoice with
// `include: { buyer: true, business: true }` (business is unused — this
// screen never displays the supplier, only the buyer). 404s
// ("Listing not found" — not open for investment, or doesn't exist) map to
// notFound(); every other error renders inline rather than crashing the
// page. See ../_lib/listing.ts for the buyer/reputation mapping shared
// with the list screen.
export default async function Page({ params }: PageProps<"/investor/marketplace/[invoiceId]">) {
  const { invoiceId } = await params;

  const { getToken } = await auth();
  const token = await getToken();

  let listing: MarketplaceListing;
  let goods: string;
  let provenance: ReturnType<typeof toBuyerProvenance>;
  try {
    const raw = await investorService.get<Record<string, unknown>>(
      `/investor/marketplace/${invoiceId}`,
      token,
    );
    listing = toListing(raw);
    provenance = toBuyerProvenance(raw);
    goods = listing.description;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    return (
      <InlineNotice tone="danger">
        {error instanceof Error ? error.message : "Couldn't load this listing."}
      </InlineNotice>
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <InvoiceRef id={listing.id} />
          <p className="text-muted-foreground mt-3">{listing.buyerName}</p>
        </div>
        <InvoiceStatusBadge className="w-fit" status={listing.status} />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="space-y-4">
          <InvoiceDetailsCard listing={listing} goods={goods} />
          <FundingProgressCard listing={listing} />
        </div>
        <div className="space-y-4">
          <BuyerProvenanceCard provenanceTier={listing.provenanceTier} {...provenance} />
          <ProtectionCard />
        </div>
      </div>

      <Button asChild size="lg" className="mt-8 w-full sm:w-auto">
        <Link href={`/investor/marketplace/${listing.id}/fund` as Route}>
          Invest in this invoice
        </Link>
      </Button>
    </div>
  );
}
