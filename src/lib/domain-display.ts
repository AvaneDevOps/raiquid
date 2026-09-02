import type { InvoiceStatus, ProvenanceTier, WhitelistStatus, OnChainStatus } from "@/types";

/**
 * Single place that maps each domain enum to a display label + visual
 * tone. Consumed only by the domain badge components in
 * src/components/shared/domain/status-badges.tsx — never inline a label
 * or a tone in a page.
 *
 * Tone vocabulary (see docs/DESIGN_SYSTEM.md colour tokens):
 *   amber   → in-progress / needs action  (minted-gold)
 *   green   → settled / confirmed / trusted (patina-green)
 *   red     → failed / overdue / declined  (rust-red)
 *   neutral → inert / entry-level          (stone)
 */
export type BadgeTone = "amber" | "green" | "red" | "neutral";

type Meta<T extends string> = Record<T, { label: string; tone: BadgeTone }>;

export const INVOICE_STATUS_META: Meta<InvoiceStatus> = {
  submitted: { label: "Submitted", tone: "amber" },
  awaiting_acceptance: { label: "Awaiting acceptance", tone: "amber" },
  tokenized: { label: "Tokenized", tone: "amber" },
  funding: { label: "Funding", tone: "amber" },
  funded: { label: "Funded", tone: "amber" },
  repaid: { label: "Repaid", tone: "green" },
  overdue: { label: "Overdue", tone: "red" },
};

export const PROVENANCE_TIER_META: Meta<ProvenanceTier> = {
  quarried: { label: "Quarried", tone: "neutral" },
  carried: { label: "Carried", tone: "amber" },
  anchored: { label: "Anchored", tone: "green" },
};

export const WHITELIST_STATUS_META: Meta<WhitelistStatus> = {
  identity_submitted: { label: "Identity submitted", tone: "amber" },
  in_review: { label: "In review", tone: "amber" },
  whitelisted: { label: "Whitelisted", tone: "green" },
};

export const ONCHAIN_STATUS_META: Meta<OnChainStatus> = {
  confirmed: { label: "Confirmed", tone: "green" },
  pending: { label: "Pending", tone: "amber" },
  failed: { label: "Failed", tone: "red" },
};

/**
 * The 5-stage lifecycle the invoice-detail stepper walks through
 * (screens 06–09). Sequential and one-directional; "overdue" is a
 * branch off "funded" and is shown as a status badge, not a step.
 */
export const INVOICE_LIFECYCLE_STEPS: { key: string; label: string }[] = [
  { key: "submitted", label: "Submitted" },
  { key: "tokenized", label: "Tokenized" },
  { key: "funding", label: "Funding" },
  { key: "funded", label: "Funded" },
  { key: "repaid", label: "Repaid" },
];

/**
 * The 3-stage identity / whitelisting flow (screens 03 and 18), reusing
 * the same <Stepper>.
 */
export const WHITELIST_STEPS: { key: string; label: string }[] = [
  { key: "identity_submitted", label: "Identity" },
  { key: "in_review", label: "Review" },
  { key: "whitelisted", label: "Whitelisted" },
];
