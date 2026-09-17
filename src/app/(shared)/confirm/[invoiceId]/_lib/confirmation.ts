import {
  confirmService,
  normalizeConfirmation,
  type ConfirmationInvoice,
} from "@/services/confirm";

export type Confirmation = ConfirmationInvoice;

export async function getConfirmation(invoiceId: string): Promise<Confirmation> {
  const payload = await confirmService.getConfirmation<unknown>(invoiceId);

  return normalizeConfirmation(payload, invoiceId);
}
