// TODO: implement. See docs/ROUTE_MAP.md for the source screen reference
// and docs/RAIQUID_CONTEXT.md for domain/business context.
import { ADMIN_LEDGER_EVENTS } from "@/components/admin/fixtures";

import { LedgerTable } from "../../../components/admin/ledger-table";

// Screen 29-adminLedger. Data below is dummy (see
// src/components/admin/fixtures.ts) until a real API exists — see
// docs/RAIQUID_CONTEXT.md, "Open decisions".
export default function Page() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-foreground text-3xl font-semibold">On-chain ledger</h1>
        <p className="text-muted-foreground mt-1">Base Sepolia · Brickken sandbox</p>
      </div>

      <LedgerTable events={ADMIN_LEDGER_EVENTS} />
    </div>
  );
}
