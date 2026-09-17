import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

import { formatDate } from "@/lib/format";
import { ApiError, businessService } from "@/services";
import type { Invoice } from "@/types";

import { AwaitingAcceptanceView } from "./_components/awaiting-acceptance-view";
import { FundingView } from "./_components/funding-view";
import { InvoiceDetailHeader } from "./_components/invoice-header";
import { PayoutView } from "./_components/payout-view";
import { TokenizedView } from "./_components/tokenized-view";
import { toAcceptedAt, toInvoice, toMintEvent } from "./_lib/invoice";

export default async function Page({ params }: PageProps<"/business/invoices/[invoiceId]">) {
  const { invoiceId } = await params;

  const { getToken } = await auth();
  const token = await getToken();

  let invoice: Invoice;
  let acceptedAt: string | undefined;
  let mintEvent: ReturnType<typeof toMintEvent>;

  try {
    const raw = await businessService.get<Record<string, unknown>>(
      `/business/invoices/${invoiceId}`,
      token,
    );
    invoice = toInvoice(raw);
    acceptedAt = toAcceptedAt(raw);
    mintEvent = toMintEvent(raw);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  }

  let subtitle: string | undefined;
  switch (invoice.status) {
    case "submitted":
    case "awaiting_acceptance":
      subtitle = `Submitted ${formatDate(invoice.submittedAt)}`;
      break;
    case "tokenized":
      subtitle = acceptedAt
        ? `Accepted by ${invoice.buyerName} on ${formatDate(acceptedAt)}`
        : undefined;
      break;
    case "funding":
      subtitle = acceptedAt ? `Listed ${formatDate(acceptedAt)}` : undefined;
      break;
    default:
      subtitle = undefined;
  }

  return (
    <div>
      <InvoiceDetailHeader invoiceId={invoice.id} status={invoice.status} subtitle={subtitle} />

      {(invoice.status === "submitted" || invoice.status === "awaiting_acceptance") && (
        <AwaitingAcceptanceView invoice={invoice} />
      )}
      {invoice.status === "tokenized" && <TokenizedView invoice={invoice} mintEvent={mintEvent} />}
      {invoice.status === "funding" && <FundingView invoice={invoice} />}
      {(invoice.status === "funded" ||
        invoice.status === "repaid" ||
        invoice.status === "overdue") && <PayoutView invoice={invoice} />}
    </div>
  );
}
