import Link from "next/link";
import type { Route } from "next";
import { notFound } from "next/navigation";

import { INVESTOR_INVOICE_GOODS, INVESTOR_MARKETPLACE_LISTINGS } from "@/components/investor";
import { InvoiceRef, InvoiceStatusBadge } from "@/components/shared/domain/status-badges";
import { Button } from "@/components/shared/ui/button";

import { BuyerProvenanceCard, ProtectionCard } from "./_components/buyer-detail-cards";
import { FundingProgressCard, InvoiceDetailsCard } from "./_components/invoice-detail-cards";

// Screen 20-invDetail. Data below is dummy (see
// src/components/investor/index.ts) until a real API exists — see
// docs/RAIQUID_CONTEXT.md, "Open decisions".
export default async function Page({ params }: PageProps<"/investor/marketplace/[invoiceId]">) {
  const { invoiceId } = await params;
  const listing = INVESTOR_MARKETPLACE_LISTINGS.find((candidate) => candidate.id === invoiceId);

  if (!listing) {
    notFound();
  }

  const goods = INVESTOR_INVOICE_GOODS[listing.id] ?? listing.description;

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
          <BuyerProvenanceCard buyerId={listing.buyerId} provenanceTier={listing.provenanceTier} />
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
