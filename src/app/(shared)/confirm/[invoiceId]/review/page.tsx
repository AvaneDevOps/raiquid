<<<<<<< HEAD
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

=======
import { notFound } from "next/navigation";

import { BUYER_INVOICES } from "@/components/buyer/fixtures";
>>>>>>> 126c1250105090cfeb3f5a136297e976271e7075
import { InvoiceRef } from "@/components/shared/domain/status-badges";
import { StandaloneShell } from "@/components/shared/layout/standalone-shell";
import { Button } from "@/components/shared/ui/button";
import { Card } from "@/components/shared/ui/card";
import { InlineNotice } from "@/components/shared/ui/notice";
<<<<<<< HEAD
import {
  confirmService,
  normalizeConfirmation,
  type ConfirmationInvoice,
} from "@/services/confirm";
import { formatDate, formatNaira } from "@/lib/format";

export default function Page({ params }: PageProps<"/confirm/[invoiceId]/review">) {
  const router = useRouter();
  const [invoice, setInvoice] = useState<ConfirmationInvoice | null>(null);
  const [accepted, setAccepted] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void params.then(async ({ invoiceId }) => {
      try {
        setInvoice(
          normalizeConfirmation(await confirmService.getConfirmation(invoiceId), invoiceId),
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "The invoice could not be loaded.");
      }
    });
  }, [params]);

  async function submit(accept: boolean) {
    if (!invoice) return;
    setSubmitting(true);
    setError(null);
    try {
      await confirmService.submitReview(invoice.id, { accept });
      router.push(`/confirm/${invoice.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Your response could not be submitted.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!invoice) {
    return (
      <StandaloneShell>
        <div className="space-y-4">
          {error ? (
            <InlineNotice tone="danger">{error}</InlineNotice>
          ) : (
            <p className="text-muted-foreground">Loading invoice…</p>
          )}
        </div>
      </StandaloneShell>
    );
=======
import { formatDate, formatNaira } from "@/lib/format";

export default async function Page({ params }: PageProps<"/confirm/[invoiceId]/review">) {
  const { invoiceId } = await params;
  const invoice = BUYER_INVOICES.find((item) => item.id === invoiceId);

  if (!invoice) {
    notFound();
>>>>>>> 126c1250105090cfeb3f5a136297e976271e7075
  }

  return (
    <StandaloneShell>
      <div className="space-y-6">
        <h1 className="font-display text-foreground flex flex-wrap items-center gap-2 text-2xl font-semibold">
          Confirm <InvoiceRef id={invoice.id} />
        </h1>
<<<<<<< HEAD
=======

>>>>>>> 126c1250105090cfeb3f5a136297e976271e7075
        <Card className="p-5">
          <div className="divide-border divide-y">
            <div className="flex items-center justify-between gap-5 py-4 first:pt-0">
              <span>From</span>
              <span className="text-right">{invoice.supplierName}</span>
            </div>
            <div className="flex items-center justify-between gap-5 py-4">
              <span>Amount owed</span>
              <span>{formatNaira(invoice.amount)}</span>
            </div>
<<<<<<< HEAD
            <div className="flex items-center justify-between gap-5 last:pb-0">
=======
            <div className="flex items-center justify-between gap-5 py-4 last:pb-0">
>>>>>>> 126c1250105090cfeb3f5a136297e976271e7075
              <span>Payable on</span>
              <span>{formatDate(invoice.dueDate)}</span>
            </div>
          </div>
        </Card>
<<<<<<< HEAD
        <label className="flex items-start gap-3 text-sm leading-6">
          <input
            type="checkbox"
            checked={accepted}
            onChange={(event) => setAccepted(event.target.checked)}
            className="accent-accent-400 mt-1 size-4"
          />
          <span>I confirm the goods/services were delivered and the amount is genuinely owed.</span>
        </label>
        {error ? <InlineNotice tone="danger">{error}</InlineNotice> : null}
        <InlineNotice>
          Your response is recorded against this invoice in the Raiquid backend.
        </InlineNotice>
        <div className="grid gap-3 sm:grid-cols-2">
          <Button variant="danger" onClick={() => submit(false)} disabled={submitting}>
            Decline
          </Button>
          <Button onClick={() => submit(accepted)} disabled={submitting || !accepted}>
            Confirm &amp; accept
          </Button>
=======

        <label className="flex items-start gap-3 text-sm leading-6">
          <input type="checkbox" defaultChecked className="accent-accent-400 mt-1 size-4" />
          <span>
            I confirm {invoice.supplierName} delivered the goods described, and that{" "}
            {formatNaira(invoice.amount)} is genuinely owed, payable by{" "}
            {formatDate(invoice.dueDate)}.
          </span>
        </label>

        <InlineNotice>
          Your supplier has already been paid early by investors. On the due date, your payment goes
          to them instead — the amount and date don&apos;t change.
        </InlineNotice>

        <div className="grid gap-3 sm:grid-cols-2">
          <Button variant="danger">Decline</Button>
          <Button>Confirm &amp; accept</Button>
>>>>>>> 126c1250105090cfeb3f5a136297e976271e7075
        </div>
      </div>
    </StandaloneShell>
  );
}
