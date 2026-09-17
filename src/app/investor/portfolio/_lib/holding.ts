import type { Holding, InvoiceStatus } from "@/types";

// GET /investor/portfolio(/:id) response, confirmed against the backend
// source (raiquid-api's InvestorController/InvestorService
// .getPortfolio/.getPortfolioHolding): a Prisma Holding with
// `include: { invoice: true }` — NOT invoice.buyer, so there is no real
// buyer name available from this endpoint at all (not a guess, not
// fabricated — genuinely absent). id here is the Holding's own database
// id, distinct from invoiceId — the real single-holding GET takes this
// id, not the invoice id, despite the route folder being named
// [invoiceId] (a pre-existing naming choice from the fixture era, not
// changed here). tokenId maps to invoice.brickkenTokenSymbol, falling
// back to the invoice id if not minted yet. returnAmount/closedAt map to
// the real repaidAmount/invoice.repaidAt fields.
export interface PortfolioHolding extends Holding {
  id: string;
}

interface InvoiceRef {
  id?: string;
  status?: InvoiceStatus;
  dueDate?: string;
  brickkenTokenSymbol?: string;
  repaidAt?: string;
}

export function toHolding(raw: Record<string, unknown>): PortfolioHolding {
  const invoice = raw.invoice as InvoiceRef | undefined;
  const repaidAmount = Number(raw.repaidAmount ?? 0);
  const status = invoice?.status ?? "funding";

  return {
    id: String(raw.id ?? ""),
    tokenId: invoice?.brickkenTokenSymbol ?? invoice?.id ?? String(raw.invoiceId ?? ""),
    invoiceId: String(raw.invoiceId ?? ""),
    buyerName: "—",
    investedAmount: Number(raw.amount ?? 0),
    status,
    dueDate: invoice?.dueDate ?? "",
    returnAmount: repaidAmount > 0 ? repaidAmount : undefined,
    closedAt: status === "repaid" ? invoice?.repaidAt : undefined,
  };
}
