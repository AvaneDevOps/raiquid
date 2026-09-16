import type { WalletTransaction, WalletTransactionType } from "@/types";

// GET /investor/wallet's `transactions` array — real WalletTransaction
// rows, confirmed against raiquid-api's schema. amount is always stored
// positive; the +/- sign shown in the UI is a display concept the
// backend itself computes the same way for balance (walletBalance in
// src/common/wallet-balance.ts): deposit/repayment are credits, invested/
// withdrawal are debits. reference has no single real field — invoiceId
// when the transaction is invoice-linked, else the free-text description
// (e.g. a deposit has neither, so this falls back to "—").
const CREDIT_TYPES = new Set<WalletTransactionType>(["deposit", "repayment"]);

interface RawTransaction {
  id?: string;
  type?: string;
  amount?: string | number;
  createdAt?: string;
  invoiceId?: string;
  description?: string;
}

export function toTransaction(raw: RawTransaction): WalletTransaction {
  const type = (raw.type as WalletTransactionType) ?? "deposit";
  const magnitude = Number(raw.amount ?? 0);
  return {
    id: String(raw.id ?? ""),
    date: String(raw.createdAt ?? ""),
    type,
    amount: CREDIT_TYPES.has(type) ? magnitude : -magnitude,
    reference: raw.invoiceId ?? raw.description ?? "—",
  };
}
