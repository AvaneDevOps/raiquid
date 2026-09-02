import type { InvoiceStatus, ProvenanceTier, WhitelistStatus, OnChainStatus } from "@/types";

export type BadgeTone = "amber" | "green" | "red" | "neutral";

type Meta<T extends string> = Record<T, { label: string; tone: BadgeTone }>;

// Only funded and tokenized are checked against a screen export; the rest is inferred.
export const INVOICE_STATUS_META: Meta<InvoiceStatus> = {
  submitted: { label: "Submitted", tone: "amber" },
  awaiting_acceptance: { label: "Awaiting acceptance", tone: "amber" },
  // amber, not green — a past pass misread this screen's InlineNotice as the badge
  tokenized: { label: "Tokenized", tone: "amber" },
  funding: { label: "Funding", tone: "amber" },
  funded: { label: "Funded", tone: "green" },
  repaid: { label: "Repaid", tone: "green" },
  overdue: { label: "Overdue", tone: "red" },
};

export const PROVENANCE_TIER_META: Meta<ProvenanceTier> = {
  quarried: { label: "Quarried tier", tone: "neutral" },
  carried: { label: "Carried tier", tone: "amber" },
  anchored: { label: "Anchored tier", tone: "green" },
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

// stepper milestones — not 1:1 with the status enum
export const INVOICE_LIFECYCLE_STEPS: { key: string; label: string }[] = [
  { key: "submitted", label: "Submitted" },
  { key: "buyer_review", label: "Buyer review" },
  { key: "tokenized", label: "Tokenized" },
  { key: "funded", label: "Funded" },
  { key: "repaid", label: "Repaid" },
];

// currentIndex into INVOICE_LIFECYCLE_STEPS per status; repaid is past the last index so all steps read as done.
export const INVOICE_STATUS_STEP_INDEX: Record<InvoiceStatus, number> = {
  submitted: 1,
  awaiting_acceptance: 1,
  tokenized: 2,
  funding: 3,
  funded: 4,
  repaid: 5,
  overdue: 4,
};

// Labels not verified against a screen export.
export const WHITELIST_STEPS: { key: string; label: string }[] = [
  { key: "identity_submitted", label: "Identity" },
  { key: "in_review", label: "Review" },
  { key: "whitelisted", label: "Whitelisted" },
];
