"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

import { BUYER_PAYMENT_ACCOUNT } from "@/components/buyer/fixtures";
import { InvoiceRef } from "@/components/shared/domain/status-badges";
import { Button } from "@/components/shared/ui/button";
import { Card } from "@/components/shared/ui/card";
import { InlineNotice } from "@/components/shared/ui/notice";
import { formatDate, formatNaira } from "@/lib/format";
import { ApiError, buyerService } from "@/services";

import { toBuyerInvoice, type BuyerInvoice } from "../../../_lib/invoice";

// Screen 17-buyPay, wired to POST /buyer/invoices/{id}/pay (PayInvoiceDto
// { amount }) — confirmed against raiquid-api's pay-invoice.dto.ts and
// BuyerService.payInvoice: the amount must exactly equal the invoice's
// amount (no partial repayment), so it's shown read-only rather than as
// an editable input. There's no single-invoice GET for buyers (only
// listInvoices/getPaymentSchedule) — this fetches the full list and finds
// the one it needs, same data GET /buyer/invoices already returns.
// Payment method (bank account) stays on the BUYER_PAYMENT_ACCOUNT
// fixture — no real backing (buyers have no bank-account field on the
// schema).
export default function Page() {
  const { invoiceId } = useParams<{ invoiceId: string }>();
  const { getToken } = useAuth();

  const [invoice, setInvoice] = useState<BuyerInvoice | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [notFoundHere, setNotFoundHere] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const token = await getToken();
        const response = await buyerService.get<{ data: Record<string, unknown>[] }>(
          "/buyer/invoices",
          token,
        );
        const found = response.data.map(toBuyerInvoice).find((item) => item.id === invoiceId);
        if (!active) return;
        if (!found) {
          setNotFoundHere(true);
        } else {
          setInvoice(found);
        }
      } catch (error) {
        if (active) {
          setLoadError(error instanceof Error ? error.message : "Couldn't load this invoice.");
        }
      }
    })();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fetch once on mount
  }, [invoiceId]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!invoice) return;

    setPaying(true);
    setPayError(null);
    try {
      const token = await getToken();
      await buyerService.post(
        `/buyer/invoices/${invoice.id}/pay`,
        { amount: invoice.amount },
        token,
      );
      setPaid(true);
    } catch (error) {
      setPayError(error instanceof ApiError ? error.message : "Something went wrong. Try again.");
    } finally {
      setPaying(false);
    }
  }

  if (notFoundHere) {
    return <InlineNotice tone="danger">Invoice not found.</InlineNotice>;
  }
  if (loadError) {
    return <InlineNotice tone="danger">{loadError}</InlineNotice>;
  }
  if (!invoice) {
    return <p className="text-muted-foreground text-sm">Loading…</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <InvoiceRef id={invoice.id} />
          <p className="text-muted-foreground mt-3">Due {formatDate(invoice.dueDate)}</p>
        </div>
      </div>

      <Card className="p-6">
        <div className="divide-border divide-y">
          <div className="flex items-center justify-between gap-4 pb-5">
            <span>Amount due</span>
            <span>{formatNaira(invoice.amount)}</span>
          </div>
          <div className="flex items-center justify-between gap-4 py-5">
            <span>Payee</span>
            <span className="text-right">Raiquid settlement account</span>
          </div>
        </div>
      </Card>

      <div>
        <p className="text-muted-foreground mb-2 text-sm">Payment method</p>
        <div className="border-border-strong bg-surface-raised rounded-lg border px-4 py-3">
          Bank transfer — {BUYER_PAYMENT_ACCOUNT.bankName} ••••{" "}
          {BUYER_PAYMENT_ACCOUNT.accountNumberLast4}
        </div>
      </div>

      <InlineNotice>
        This is a simulated repayment for the sandbox environment. No real funds move.
      </InlineNotice>

      {payError ? <InlineNotice tone="danger">{payError}</InlineNotice> : null}
      {paid ? <InlineNotice tone="success">Payment recorded.</InlineNotice> : null}

      <Button type="submit" size="lg" disabled={paying || paid}>
        {paying ? "Submitting…" : paid ? "Paid" : "Confirm payment (sandbox)"}
      </Button>
    </form>
  );
}
