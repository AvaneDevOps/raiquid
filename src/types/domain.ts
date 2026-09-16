/**
 * Raiquid domain model.
 *
 * Source of truth: reverse-engineered from the 31 approved screen designs
 * (desktop + mobile exports, Aug 2026). If product copy or a status name
 * changes in Figma, update it here FIRST, then propagate to the UI.
 * Nothing under src/app should redefine these unions locally — import
 * from "@/types".
 */

// ---------------------------------------------------------------------------
// Actors
// ---------------------------------------------------------------------------

/** The four account kinds. Chosen at sign-up in (standalone)/auth. */
export type UserRole = "business" | "buyer" | "investor" | "admin";

export interface Business {
  id: string;
  name: string;
  contactName: string;
  contactEmail: string;
  phone?: string;
  payoutAccount?: BankAccount;
}

export interface Buyer {
  id: string;
  companyName: string;
  billingEmail: string;
  provenanceTier: ProvenanceTier;
  onTimePaymentRate: number; // 0-100
  acceptanceRate: number; // 0-100
  invoicesFinanced: number;
  memberSince: string; // ISO date
}

export interface Investor {
  id: string;
  fullName: string;
  email: string;
  countryOfResidence: string;
  isDiasporaInvestor?: boolean;
  whitelistStatus: WhitelistStatus;
}

export interface BankAccount {
  bankName: string;
  accountNumberLast4: string;
  accountHolderName: string;
}

// ---------------------------------------------------------------------------
// Provenance (Raiquid's buyer-trust scoring system)
// ---------------------------------------------------------------------------

/**
 * Progressive trust tier for buyers, unlocked by a track record of on-time
 * payments. Determines reserve contribution and pricing shown to investors.
 * Order matters: Quarried < Carried < Anchored.
 */
export type ProvenanceTier = "quarried" | "carried" | "anchored";

export const PROVENANCE_TIER_ORDER: ProvenanceTier[] = ["quarried", "carried", "anchored"];

// ---------------------------------------------------------------------------
// Invoice lifecycle
// ---------------------------------------------------------------------------

/**
 * The 5-stage lifecycle shown on the invoice detail stepper
 * (screens 06-09: bizPending -> bizTokenized -> bizFunding -> bizPayout).
 * Statuses are sequential and one-directional, except "overdue", which
 * branches off "funded" when the due date passes unpaid.
 */
export type InvoiceStatus =
  | "submitted" // Sent to buyer, awaiting confirmation
  | "awaiting_acceptance" // list/table label for "submitted"
  | "tokenized" // Buyer accepted; minted on-chain, listed to investors
  | "funding" // Live on marketplace, partially funded
  | "funded" // 100% funded, awaiting due date
  | "repaid" // Buyer paid, investors settled, token burned
  | "overdue"; // Past due date without repayment

export interface Invoice {
  id: string; // e.g. "RQ-INV-4471"
  tokenId?: string; // e.g. "RQ-INV-4471-T1" — present once tokenized
  businessId: string;
  buyerId: string;
  buyerName: string;
  amount: number; // NGN
  dueDate: string; // ISO date
  submittedAt: string; // ISO date
  description: string;
  proofOfDeliveryUrl?: string;
  status: InvoiceStatus;
  expectedReturnPct: number; // e.g. 11.5
  fundedAmount: number;
  fundingInvestorCount: number;
  platformFeePct: number; // e.g. 3
  reserveContributionPct: number; // e.g. 1
}

// ---------------------------------------------------------------------------
// Investing
// ---------------------------------------------------------------------------

export type WhitelistStatus = "identity_submitted" | "in_review" | "whitelisted";

export interface Holding {
  tokenId: string;
  invoiceId: string;
  buyerName: string;
  investedAmount: number;
  status: InvoiceStatus;
  dueDate: string;
  returnAmount?: number;
  closedAt?: string; // set once burned/repaid
}

// ---------------------------------------------------------------------------
// Wallet & ledger
// ---------------------------------------------------------------------------

export type WalletTransactionType = "deposit" | "withdrawal" | "invested" | "repayment";

export type PayoutStatus = "received" | "pending" | "failed";

export interface BusinessPayout {
  id: string;
  date: string;
  invoiceId: string;
  amount: number;
  status: PayoutStatus;
}

export interface PendingBusinessPayout extends BusinessPayout {
  status: "pending";
  invoiceStatus: InvoiceStatus;
}

export interface BusinessWallet {
  totalReceived: number;
  pendingPayout?: PendingBusinessPayout;
  payoutAccount: BankAccount;
  payoutHistory: BusinessPayout[];
}

export interface WalletTransaction {
  id: string;
  date: string; // ISO date
  type: WalletTransactionType;
  amount: number; // signed: negative for outflows
  reference: string; // invoice id or "Bank transfer"
}

/** On-chain action types surfaced in the admin ledger (screen 29). */
export type OnChainAction = "mint" | "whitelist" | "transfer" | "burn";

export type OnChainStatus = "confirmed" | "pending" | "failed";

export interface OnChainEvent {
  id: string;
  timestamp: string; // ISO datetime
  action: OnChainAction;
  tokenAddressShort: string; // e.g. "0x7f3a...c091"
  network: "Base Sepolia"; // Brickken sandbox network; single value today
  status: OnChainStatus;
}

// ---------------------------------------------------------------------------
// Platform / admin
// ---------------------------------------------------------------------------

export interface ReservePoolSnapshot {
  currentBalance: number;
  contributionRatePct: number; // per financed invoice
  coverageRatioPct: number; // of total value financed
  claimsPaid: number;
}

export interface PlatformOverview {
  totalValueFinanced: number;
  activeInvoices: number;
  onTimeRepaymentRatePct: number;
  activeInvestors: number;
}

export interface ProvenanceRegistryEntry {
  buyerId: string;
  buyerName: string;
  tier: ProvenanceTier;
  acceptanceRatePct: number;
  onTimeRatePct: number | null; // null when no repayments yet ("—" in UI)
  invoicesFinanced: number;
  memberSince: string; // ISO date
}

// ---------------------------------------------------------------------------
// Notifications
// ---------------------------------------------------------------------------

export type NotificationTone = "positive" | "informational" | "warning";

export interface AppNotification {
  id: string;
  tone: NotificationTone;
  message: string; // may reference an invoice id; render via <InvoiceRef>
  occurredAt: string; // ISO datetime
  readAt?: string;
}

// ---------------------------------------------------------------------------
// Business verification
// ---------------------------------------------------------------------------

export type BusinessVerificationStatus = "documents_submitted" | "under_review" | "verified";

/** Per-document status on the verification checklist (screen 03). */
export type DocumentCheckStatus = "received" | "in_review";

export interface DocumentCheck {
  label: string;
  status: DocumentCheckStatus;
}
<<<<<<< HEAD

export interface BusinessVerification {
  businessName: string;
  status: BusinessVerificationStatus;
  documentChecks: DocumentCheck[];
}
=======
>>>>>>> 126c1250105090cfeb3f5a136297e976271e7075
