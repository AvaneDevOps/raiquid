import type { InvoiceStatus, ProvenanceTier, WhitelistStatus, OnChainStatus } from "@/types";

// TODO: implement, driven by src/lib/domain-display.ts.
// See docs/DESIGN_SYSTEM.md, "Domain status badges".
export function InvoiceStatusBadge(props: { status: InvoiceStatus }) {
  return null;
}

export function ProvenanceTierBadge(props: { tier: ProvenanceTier }) {
  return null;
}

export function WhitelistStatusBadge(props: { status: WhitelistStatus }) {
  return null;
}

export function OnChainStatusBadge(props: { status: OnChainStatus }) {
  return null;
}

export function InvoiceRef(props: { id: string }) {
  return null;
}
