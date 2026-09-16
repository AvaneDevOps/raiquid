import { auth } from "@clerk/nextjs/server";

import { InlineNotice } from "@/components/shared/ui/notice";
import { LedgerTable } from "@/components/admin/ledger-table";
import { adminService } from "@/services";
import type { OnChainEvent } from "@/types";

import { toEvent } from "./_lib/event";

// Screen 29-adminLedger, wired to real GET /admin/ledger — confirmed
// against the backend source (raiquid-api's
// AdminController/AdminService.getLedger), not guessed. See ./_lib/event.ts
// for the confirmed mapping and the chain-name correction (Ethereum
// Sepolia, not Base Sepolia — confirmed against raiquid-api's own config,
// not either disagreeing piece of frontend copy).
export default async function Page() {
  const { getToken } = await auth();
  const token = await getToken();

  let events: OnChainEvent[] = [];
  let loadError: string | null = null;
  try {
    const response = await adminService.get<{ data: Record<string, unknown>[] }>(
      "/admin/ledger",
      token,
    );
    events = response.data.map(toEvent);
  } catch (error) {
    loadError = error instanceof Error ? error.message : "Couldn't load the ledger.";
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-foreground text-3xl font-semibold">On-chain ledger</h1>
        <p className="text-muted-foreground mt-1">Ethereum Sepolia · Brickken sandbox</p>
      </div>

      {loadError ? (
        <InlineNotice tone="danger">{loadError}</InlineNotice>
      ) : (
        <LedgerTable events={events} />
      )}
    </div>
  );
}
