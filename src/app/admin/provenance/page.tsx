import { auth } from "@clerk/nextjs/server";

import { InlineNotice } from "@/components/shared/ui/notice";
import { ProvenanceRegistryTable } from "@/components/admin/provenance-registry-table";
import { adminService } from "@/services";
import type { ProvenanceRegistryEntry, ProvenanceTier } from "@/types";

interface BuyerRow {
  id: string;
  legalName: string;
  provenanceTier: ProvenanceTier;
  acceptanceRate: string | number;
  onTimePaymentRate: string | number;
  invoicesFinancedCount: number;
}

interface ProvenanceResponse {
  buyers: BuyerRow[];
}

// Screen 28-adminProvenance, wired to real GET /admin/provenance
// (confirmed against the backend source: buyers, keyed off real Buyer
// rows). acceptanceRate/onTimePaymentRate are real 0..1 decimals, scaled
// to percentages — they read 0 for every buyer today per raiquid-api's
// own admitted gap (computing them was deferred), not fabricated here.
// memberSince has no real backing — getProvenance's own `select` doesn't
// include Buyer.createdAt — left blank rather than guessed. See
// docs/RAIQUID_CONTEXT.md, "Open decisions".
function toEntry(buyer: BuyerRow): ProvenanceRegistryEntry {
  return {
    buyerId: buyer.id,
    buyerName: buyer.legalName,
    tier: buyer.provenanceTier,
    acceptanceRatePct: Number(buyer.acceptanceRate) * 100,
    onTimeRatePct: Number(buyer.onTimePaymentRate) * 100,
    invoicesFinanced: buyer.invoicesFinancedCount,
    memberSince: "",
  };
}

export default async function Page() {
  const { getToken } = await auth();
  const token = await getToken();

  let entries: ProvenanceRegistryEntry[] = [];
  let loadError: string | null = null;
  try {
    const response = await adminService.get<ProvenanceResponse>("/admin/provenance", token);
    entries = response.buyers.map(toEntry);
  } catch (error) {
    loadError = error instanceof Error ? error.message : "Couldn't load the provenance registry.";
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-foreground text-3xl font-semibold">Provenance registry</h1>
        <p className="text-muted-foreground mt-1">Every buyer&apos;s record, in the open</p>
      </div>

      {loadError ? (
        <InlineNotice tone="danger">{loadError}</InlineNotice>
      ) : (
        <ProvenanceRegistryTable entries={entries} />
      )}
    </div>
  );
}
