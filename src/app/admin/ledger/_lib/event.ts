import type { OnChainEvent } from "@/types";
import { truncateMiddle } from "@/lib/format";

// GET /admin/ledger response, confirmed against the backend source
// (raiquid-api's AdminController/AdminService.getLedger): a real Prisma
// OnChainEvent — { data, page, pageSize, total }. getLedger's findMany has
// no select restriction, so invoiceId comes through as-is (nullable on the
// schema — "loose links; on-chain identifiers may arrive before the
// off-chain row"). tokenAddress is the full address; tokenAddressShort is
// derived from it here via the existing truncateMiddle helper, not a
// separate real field. Network is hardcoded "Ethereum Sepolia" —
// confirmed directly against raiquid-api's config (BRICKKEN_CHAIN_ID
// defaults to 11155111), not either piece of frontend copy that
// previously disagreed with it.
export function toEvent(raw: Record<string, unknown>): OnChainEvent {
  const tokenAddress = typeof raw.tokenAddress === "string" ? raw.tokenAddress : undefined;
  return {
    id: String(raw.id ?? ""),
    invoiceId: typeof raw.invoiceId === "string" ? raw.invoiceId : undefined,
    timestamp: String(raw.occurredAt ?? raw.createdAt ?? ""),
    action: (raw.action as OnChainEvent["action"]) ?? "newTokenization",
    tokenAddressShort: tokenAddress ? truncateMiddle(tokenAddress) : "—",
    network: "Ethereum Sepolia",
    status: (raw.status as OnChainEvent["status"]) ?? "pending",
    txHash: typeof raw.txHash === "string" ? raw.txHash : undefined,
  };
}
