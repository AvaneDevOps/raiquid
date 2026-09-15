import { buyerService } from "@/services";

// This is a magic-link route — GET /confirm/{invoiceId} takes no auth
// header (see src/types/api-generated.ts, ConfirmController_getConfirmation)
// and no token is passed. The response body isn't documented in the
// generated types (no schema), but the shape is confirmed against the
// backend source (raiquid-api's BuyerService.getConfirmation): a Prisma
// Invoice with `include: { buyer: true, business: true }`, so the
// supplier is the nested raw.business.legalName, not a flat
// supplierName/businessName field. There is no proofOfDeliveryUrl field
// anywhere on the Invoice model — that's a real, permanent gap, not a
// mapping guess.
export interface Confirmation {
  id: string;
  supplierName: string;
  amount: number;
  dueDate: string;
  description: string;
  proofOfDeliveryUrl?: string;
}

interface BusinessRef {
  legalName?: string;
}

function toConfirmation(raw: Record<string, unknown>, invoiceId: string): Confirmation {
  const business = raw.business as BusinessRef | undefined;
  return {
    id: String(raw.id ?? invoiceId),
    supplierName: business?.legalName ?? "Your supplier",
    amount: Number(raw.amount ?? 0),
    dueDate: String(raw.dueDate ?? ""),
    description: String(raw.description ?? ""),
    proofOfDeliveryUrl:
      typeof raw.proofOfDeliveryUrl === "string" ? raw.proofOfDeliveryUrl : undefined,
  };
}

export function getConfirmation(invoiceId: string): Promise<Confirmation> {
  return buyerService
    .get<Record<string, unknown>>(`/confirm/${invoiceId}`, null)
    .then((raw) => toConfirmation(raw, invoiceId));
}
