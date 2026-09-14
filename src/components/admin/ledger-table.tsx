"use client";

import { OnChainStatusBadge } from "@/components/shared/domain/status-badges";
import { Card } from "@/components/shared/ui/card";
import { EmptyState } from "@/components/shared/ui/notice";
import type { OnChainEvent } from "@/types";

import { formatTimestamp } from "@/lib/format-timestamp";
import { OnChainActionBadge } from "./on-chain-action-badge";

/**
 * Screen 29-adminLedger. Same responsive pattern as InvoiceListTable and
 * ProvenanceRegistryTable: a desktop <table> and a mobile stacked <dl>,
 * both always in the DOM, switched by Tailwind breakpoint classes only.
 *
 * tokenAddressShort is rendered as a raw mono string, not an InvoiceRef
 * chip — same "raw string in a table row" rule as the overview's token ids
 * (docs/DESIGN_SYSTEM.md). Action is OnChainActionBadge here (always amber)
 * — contrast with the overview, where the same labels are plain text.
 *
 * "Retry" (screen 29, failed row only) has no wired action yet — on-chain
 * integration is an open decision (docs/RAIQUID_CONTEXT.md) — so it's a
 * plain unstyled text button, not the shared Button component, matching
 * the export's chrome-less look.
 */
export function LedgerTable({ events }: { events: OnChainEvent[] }) {
  if (events.length === 0) {
    return (
      <EmptyState
        title="No on-chain activity yet"
        description="Mint, transfer, burn, and whitelist events will appear here as they happen in the sandbox."
      />
    );
  }

  return (
    <Card>
      {/* Desktop */}
      <table className="hidden w-full text-sm md:table">
        <thead>
          <tr className="border-border text-muted-foreground border-b text-left">
            <th className="px-5 py-3 font-normal">Timestamp</th>
            <th className="px-5 py-3 font-normal">Action</th>
            <th className="px-5 py-3 font-normal">Token</th>
            <th className="px-5 py-3 font-normal">Network</th>
            <th className="px-5 py-3 font-normal">Status</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id} className="border-border border-b last:border-0">
              <td className="text-foreground px-5 py-4 font-mono">
                {formatTimestamp(event.timestamp)}
              </td>
              <td className="px-5 py-4">
                <OnChainActionBadge action={event.action} />
              </td>
              <td className="text-foreground px-5 py-4 font-mono">{event.tokenAddressShort}</td>
              <td className="text-foreground px-5 py-4">{event.network}</td>
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <OnChainStatusBadge status={event.status} />
                  {event.status === "failed" ? (
                    <button
                      type="button"
                      className="text-foreground text-sm font-medium hover:underline"
                    >
                      Retry
                    </button>
                  ) : null}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile */}
      <div className="divide-border w-60 divide-y md:hidden">
        {events.map((event) => (
          <dl key={event.id} className="space-y-2 px-5 py-4">
            <div className="flex items-center justify-between gap-4">
              <dt className="text-muted-foreground text-sm">Timestamp</dt>
              <dd className="text-foreground font-mono text-sm">
                {formatTimestamp(event.timestamp)}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-muted-foreground text-sm">Action</dt>
              <dd>
                <OnChainActionBadge action={event.action} />
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-muted-foreground text-sm">Token</dt>
              <dd className="text-foreground font-mono text-sm">{event.tokenAddressShort}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-muted-foreground text-sm">Network</dt>
              <dd className="text-foreground text-sm">{event.network}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-muted-foreground text-sm">Status</dt>
              <dd className="flex items-center gap-3">
                <OnChainStatusBadge status={event.status} />
                {event.status === "failed" ? (
                  <button
                    type="button"
                    className="text-foreground text-sm font-medium hover:underline"
                  >
                    Retry
                  </button>
                ) : null}
              </dd>
            </div>
          </dl>
        ))}
      </div>
    </Card>
  );
}
