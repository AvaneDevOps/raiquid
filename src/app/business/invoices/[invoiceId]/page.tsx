import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

import { formatDate } from "@/lib/format";
import { businessService, normalizeBusinessInvoices } from "@/services/business";

import { AwaitingAcceptanceView } from "./_components/awaiting-acceptance-view";
import { FundingView } from "./_components/funding-view";
import { InvoiceDetailHeader } from "./_components/invoice-header";
import { PayoutView } from "./_components/payout-view";
import { TokenizedView } from "./_components/tokenized-view";

export default async function Page({ params }: PageProps<"/business/invoices/[invoiceId]">) {
  const { invoiceId } = await params;
  const { getToken } = await auth();
  const token = await getToken();
  const payload = await businessService.getInvoice<unknown>(invoiceId, token);
  const invoices = normalizeBusinessInvoices([payload]);
  const invoice = invoices[0];

  if (!invoice || invoice.id !== invoiceId) {
    notFound();
  }

  let subtitle: string | undefined;
  switch (invoice.status) {
    case "submitted":
    case "awaiting_acceptance":
      subtitle = invoice.submittedAt ? `Submitted ${formatDate(invoice.submittedAt)}` : undefined;
      break;
    case "tokenized":
    case "funding":
      subtitle = invoice.buyerName ? `Accepted by ${invoice.buyerName}` : undefined;
      break;
    default:
      break;
  }

  return (
    <div>
      <InvoiceDetailHeader invoiceId={invoice.id} status={invoice.status} subtitle={subtitle} />

      {(invoice.status === "submitted" || invoice.status === "awaiting_acceptance") && (
        <AwaitingAcceptanceView invoice={invoice} />
      )}
      {invoice.status === "tokenized" && <TokenizedView invoice={invoice} />}
      {invoice.status === "funding" && <FundingView invoice={invoice} />}
      {(invoice.status === "funded" ||
        invoice.status === "repaid" ||
        invoice.status === "overdue") && <PayoutView invoice={invoice} />}
    </div>
  );
}
