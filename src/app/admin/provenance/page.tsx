// TODO: implement. See docs/ROUTE_MAP.md for the source screen reference
// and docs/RAIQUID_CONTEXT.md for domain/business context.
import { ADMIN_PROVENANCE_REGISTRY } from "@/components/admin/fixtures";

import { ProvenanceRegistryTable } from "./_components/provenance-registry-table";

// Screen 28-adminProvenance. Data below is dummy (see
// src/components/admin/fixtures.ts) until a real API exists — see
// docs/RAIQUID_CONTEXT.md, "Open decisions".
export default function Page() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-foreground text-3xl font-semibold">Provenance registry</h1>
        <p className="text-muted-foreground mt-1">Every buyer&apos;s record, in the open</p>
      </div>

      <ProvenanceRegistryTable entries={ADMIN_PROVENANCE_REGISTRY} />
    </div>
  );
}
