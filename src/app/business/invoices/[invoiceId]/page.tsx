import { notFound } from "next/navigation";

import { BUSINESS_INVOICES } from "@/components/business/fixtures";
import { formatDate } from "@/lib/format";

import { AwaitingAcceptanceView } from "./_components/awaiting-acceptance-view";
import { FundingView } from "./_components/funding-view";
import { INVOICE_ACCEPTED_AT } from "./_components/fixtures";
import { InvoiceDetailHeader } from "./_components/invoice-header";
import { PayoutView } from "./_components/payout-view";
import { TokenizedView } from "./_components/tokenized-view";

// Screens 06-09 (bizPending/Tokenized/Funding/Payout) — one page, 5
// InvoiceStatus states via the stepper. "funded"/"repaid"/"overdue" all
// share PayoutView — see that file's comment for why.
export default async function Page({ params }: PageProps<"/business/invoices/[invoiceId]">) {
  const { invoiceId } = await params;
  const invoice = BUSINESS_INVOICES.find((candidate) => candidate.id === invoiceId);

  if (!invoice) {
    notFound();
  }

  const acceptedAt = INVOICE_ACCEPTED_AT[invoice.id];

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
      subtitle = undefined; // funded/repaid/overdue: no subtitle, matches screen 09
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
