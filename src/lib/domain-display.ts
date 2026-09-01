import type { InvoiceStatus, ProvenanceTier, WhitelistStatus, OnChainStatus } from "@/types";

/**
 * Single place that maps each domain enum to a display label + visual
 * tone (amber/green/red/neutral). TODO: fill in — see
 * docs/RAIQUID_CONTEXT.md for the label/tone observed in each screen.
 */
export type BadgeTone = "amber" | "green" | "red" | "neutral";

export const INVOICE_STATUS_META: Record<InvoiceStatus, { label: string; tone: BadgeTone }> =
  {} as Record<InvoiceStatus, { label: string; tone: BadgeTone }>;

export const PROVENANCE_TIER_META: Record<ProvenanceTier, { label: string; tone: BadgeTone }> =
  {} as Record<ProvenanceTier, { label: string; tone: BadgeTone }>;

export const WHITELIST_STATUS_META: Record<WhitelistStatus, { label: string; tone: BadgeTone }> =
  {} as Record<WhitelistStatus, { label: string; tone: BadgeTone }>;

export const ONCHAIN_STATUS_META: Record<OnChainStatus, { label: string; tone: BadgeTone }> =
  {} as Record<OnChainStatus, { label: string; tone: BadgeTone }>;

export const INVOICE_LIFECYCLE_STEPS: { key: string; label: string }[] = [];
