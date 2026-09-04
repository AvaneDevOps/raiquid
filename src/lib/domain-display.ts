import type { InvoiceStatus, ProvenanceTier, WhitelistStatus, OnChainStatus } from "@/types";

export type BadgeTone = "amber" | "green" | "red" | "neutral";

type Meta<T extends string> = Record<T, { label: string; tone: BadgeTone }>;

// Tones verified against screens 04/06/07/08/09/10. tokenized, funded and
// repaid are green (a completed milestone); overdue is red; the rest amber.
export const INVOICE_STATUS_META: Meta<InvoiceStatus> = {
  submitted: { label: "Submitted", tone: "amber" },
  awaiting_acceptance: { label: "Awaiting acceptance", tone: "amber" },
  tokenized: { label: "Tokenized", tone: "green" },
  funding: { label: "Funding", tone: "amber" },
  funded: { label: "Funded", tone: "green" },
  repaid: { label: "Repaid", tone: "green" },
  overdue: { label: "Overdue", tone: "red" },
};

// Screens 06/15/20 show "Carried tier"; the registry (28) drops "tier"
// because that column is already headed "Tier".
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

// Stepper milestones (screens 06-08), distinct from the status enum.
export const INVOICE_LIFECYCLE_STEPS: { key: string; label: string }[] = [
  { key: "submitted", label: "Submitted" },
  { key: "buyer_review", label: "Buyer review" },
  { key: "tokenized", label: "Tokenized" },
  { key: "funded", label: "Funded" },
  { key: "repaid", label: "Repaid" },
];

// currentIndex into INVOICE_LIFECYCLE_STEPS per status (screens 06/07/08);
// repaid is past the last index so every step reads as done.
export const INVOICE_STATUS_STEP_INDEX: Record<InvoiceStatus, number> = {
  submitted: 1,
  awaiting_acceptance: 1,
  tokenized: 2,
  funding: 3,
  funded: 4,
  repaid: 5,
  overdue: 4,
};

// Investor whitelisting flow (screen 18). The business verification flow
// (screen 03) is a separate 3-stage stepper — Documents submitted /
// Under review / Verified — with no domain model yet.
export const WHITELIST_STEPS: { key: string; label: string }[] = [
  { key: "identity_submitted", label: "Identity submitted" },
  { key: "in_review", label: "In review" },
  { key: "whitelisted", label: "Whitelisted" },
];
