import type { Buyer, Invoice, ProvenanceTier } from "@/types";

export interface BuyerInvoice extends Invoice {
  supplierName: string;
}

export const BUYER_PROFILE: Buyer = {
  id: "buyer_1",
  companyName: "Distify Distribution Ltd",
  billingEmail: "accounts@distify.com",
  provenanceTier: "carried",
  onTimePaymentRate: 92,
  acceptanceRate: 100,
  invoicesFinanced: 15,
  memberSince: "2026-03-01",
};

export const BUYER_INVOICES: BuyerInvoice[] = [
  {
    id: "RQ-INV-4471",
    businessId: "biz_2",
    buyerId: "buyer_1",
    buyerName: "Distify Distribution Ltd",
    supplierName: "Okonkwo Textiles & Supplies",
    amount: 2_000_000,
    dueDate: "2026-10-30",
    submittedAt: "2026-08-25",
    description: "400 units, woven fabric",
    proofOfDeliveryUrl: "#",
    status: "awaiting_acceptance",
    expectedReturnPct: 11.5,
    fundedAmount: 0,
    fundingInvestorCount: 0,
    platformFeePct: 3,
    reserveContributionPct: 1,
  },
];

export const BUYER_PAYMENT_ACCOUNT = {
  bankName: "GTBank",
  accountNumberLast4: "7710",
};

export const BUYER_SETTINGS = {
  authorizedContacts: [
    {
      name: "Tunde Bakare",
      role: "Finance Lead",
      permission: "Can accept invoices",
      tone: "green" as const,
    },
    {
      name: "Chioma Eze",
      role: "Operations",
      permission: "View only",
      tone: "neutral" as const,
    },
  ],
  notifications: [
    {
      key: "invoice_confirmation",
      label: "New invoice awaiting confirmation",
      defaultOn: true,
    },
    {
      key: "payment_due",
      label: "Payment due reminders",
      defaultOn: true,
    },
  ],
};

export const BUYER_DASHBOARD_COPY: Record<ProvenanceTier, string> = {
  quarried:
    "Build your payment record to unlock lower reserve contributions and faster financing for the suppliers who send you invoices.",
  carried:
    "Lower reserve contributions and faster financing for the suppliers who send you invoices — one more on-time payment away.",
  anchored:
    "Your track record unlocks the lowest reserve contributions and fastest financing for the suppliers who send you invoices.",
};
