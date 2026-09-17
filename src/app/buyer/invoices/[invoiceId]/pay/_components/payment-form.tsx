"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";

import { Button } from "@/components/shared/ui/button";
import { Input } from "@/components/shared/ui/input";
import { InlineNotice } from "@/components/shared/ui/notice";
import { buyerService } from "@/services/buyer";

export function PaymentForm({ invoiceId, amount }: { invoiceId: string; amount: number }) {
  const { getToken } = useAuth();
  const [reference, setReference] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [paid, setPaid] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submitPayment() {
    setSubmitting(true);
    setError(null);

    try {
      const token = await getToken();

      await buyerService.payInvoice(
        invoiceId,
        {
          amount,
          paymentReference: reference || undefined,
        },
        token,
      );

      setPaid(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment could not be recorded.");
    } finally {
      setSubmitting(false);
    }
  }

  if (paid) {
    return <InlineNotice tone="success">Payment recorded successfully.</InlineNotice>;
  }

  return (
    <div className="space-y-4">
      {error ? <InlineNotice tone="danger">{error}</InlineNotice> : null}

      <Input
        value={reference}
        onChange={(event) => setReference(event.target.value)}
        placeholder="Optional payment reference"
      />

      <Button size="lg" onClick={submitPayment} disabled={submitting}>
        {submitting ? "Recording payment…" : "Confirm payment"}
      </Button>
    </div>
  );
}
