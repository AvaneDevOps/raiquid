"use client";

import { useState, type FormEvent } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

import { Button } from "@/components/shared/ui/button";
import { Card } from "@/components/shared/ui/card";
import { Input } from "@/components/shared/ui/input";
import { InlineNotice } from "@/components/shared/ui/notice";
import { ApiError, investorService } from "@/services";

// Screen not built yet (stub) — wired directly to
// POST /investor/marketplace/{id}/fund (FundInvoiceDto { amount }) instead
// of a fixture, since none existed. Minimal on purpose: no listing detail
// fetched here, just the amount input and submit this flow actually needs.
export default function Page() {
  const { invoiceId } = useParams<{ invoiceId: string }>();
  const { getToken } = useAuth();

  const [amountDisplay, setAmountDisplay] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function handleAmountChange(rawValue: string) {
    const digitsOnly = rawValue.replace(/[^\d]/g, "");
    setAmountDisplay(digitsOnly ? Number(digitsOnly).toLocaleString("en-US") : "");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const amount = Number(amountDisplay.replace(/,/g, ""));
    if (!(amount > 0)) {
      setError("Enter a valid amount to invest.");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const token = await getToken();
      await investorService.post(`/investor/marketplace/${invoiceId}/fund`, { amount }, token);
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-md space-y-6">
      <div>
        <h1 className="font-display text-foreground text-3xl font-semibold">Invest</h1>
        <p className="text-muted-foreground mt-1 font-mono text-sm">{invoiceId}</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="space-y-6 p-6">
          <div>
            <label htmlFor="amount" className="text-muted-foreground text-sm">
              Amount to invest (₦)
            </label>
            <Input
              id="amount"
              className="mt-2"
              inputMode="numeric"
              value={amountDisplay}
              onChange={(event) => handleAmountChange(event.target.value)}
              disabled={submitted || submitting}
              aria-invalid={Boolean(error)}
            />
          </div>
        </Card>

        {error ? (
          <InlineNotice tone="danger" className="mt-6">
            {error}
          </InlineNotice>
        ) : submitted ? (
          <InlineNotice tone="success" className="mt-6">
            Investment submitted.
          </InlineNotice>
        ) : null}

        <Button type="submit" size="lg" className="mt-6 w-full" disabled={submitted || submitting}>
          {submitting ? "Submitting…" : submitted ? "Invested" : "Invest"}
        </Button>
      </form>
    </div>
  );
}
