"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

import { MIN_INVESTMENT } from "@/components/investor";
import { InvoiceRef } from "@/components/shared/domain/status-badges";
import { Button } from "@/components/shared/ui/button";
import { Card } from "@/components/shared/ui/card";
import { Input } from "@/components/shared/ui/input";
import { InlineNotice } from "@/components/shared/ui/notice";
import { formatNaira } from "@/lib/format";
import { ApiError, investorService } from "@/services";

interface WalletResponse {
  balance: number;
}

// Screen 21-invFund, wired to POST /investor/marketplace/{id}/fund
// (FundInvoiceDto { amount }) — the real invoiceId comes from the route,
// not a fixture lookup. Wallet balance is now a real GET /investor/wallet
// fetch on mount, matching what the backend itself enforces (fundInvoice
// checks the investor's real wallet balance server-side too — this is a
// convenience check, not the authoritative one). MIN_INVESTMENT stays a
// fixture — it's a UI floor, not fabricated backend data. The original
// share% / projected-return / total breakdown needed the real invoice's
// amount and expectedReturnPct — the latter is now backed by the real
// investorYieldPct field (see ../../_lib/listing.ts), but getting the
// former still means a GET /investor/marketplace/{id} fetch that was
// never built here. Rather than compute those numbers against an
// unrelated hardcoded fixture invoice next to the real invoiceId (wrong
// and misleading), that block is dropped. See docs/RAIQUID_CONTEXT.md,
// "Open decisions".
export default function Page() {
  const { invoiceId } = useParams<{ invoiceId: string }>();
  const { getToken } = useAuth();

  const [amountDisplay, setAmountDisplay] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [walletError, setWalletError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const token = await getToken();
        const response = await investorService.get<WalletResponse>("/investor/wallet", token);
        if (active) setWalletBalance(response.balance);
      } catch (err) {
        if (active) {
          setWalletError(
            err instanceof ApiError ? err.message : "Couldn't load your wallet balance.",
          );
        }
      }
    })();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fetch once on mount
  }, []);

  function handleAmountChange(rawValue: string) {
    const digits = rawValue.replace(/[^\d]/g, "");
    setAmountDisplay(digits ? Number(digits).toLocaleString("en-US") : "");
    setError(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const amount = Number(amountDisplay.replace(/,/g, ""));

    if (!(amount > 0)) {
      setError("Enter a valid amount to invest.");
      return;
    }
    if (amount < MIN_INVESTMENT) {
      setError(`Minimum investment is ${formatNaira(MIN_INVESTMENT)}.`);
      return;
    }
    if (walletBalance !== null && amount > walletBalance) {
      setError("Insufficient wallet balance for this amount.");
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
    <div className="w-full max-w-xl">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="font-display text-foreground text-3xl font-semibold">Fund</h1>
        <InvoiceRef id={invoiceId} />
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="mt-8 space-y-6 p-6">
          <div>
            <label htmlFor="amount" className="text-muted-foreground text-sm">
              Amount to invest (min {formatNaira(MIN_INVESTMENT)})
            </label>
            <Input
              id="amount"
              inputMode="numeric"
              value={amountDisplay}
              onChange={(event) => handleAmountChange(event.target.value)}
              disabled={submitted || submitting}
              aria-invalid={Boolean(error)}
              className="mt-2"
            />
          </div>
        </Card>

        <Card className="mt-4 flex items-center justify-between gap-4 p-5">
          <p className="text-muted-foreground text-sm">Wallet balance</p>
          <p className="text-muted-foreground font-mono text-sm">
            {walletBalance === null ? "Loading…" : formatNaira(walletBalance)}
          </p>
        </Card>

        {walletError ? (
          <InlineNotice tone="danger" className="mt-4">
            {walletError}
          </InlineNotice>
        ) : null}

        <InlineNotice tone="info" className="mt-4">
          Funds are simulated sandbox tokens for this build. A small share of your return, not the
          amount you invest, is what the platform takes as a fee.
        </InlineNotice>

        {error ? (
          <InlineNotice tone="danger" className="mt-4">
            {error}
          </InlineNotice>
        ) : submitted ? (
          <InlineNotice tone="success" className="mt-4">
            Investment submitted.
          </InlineNotice>
        ) : null}

        <Button type="submit" size="lg" className="mt-6 w-full" disabled={submitted || submitting}>
          {submitting ? "Submitting…" : submitted ? "Invested" : "Confirm & fund"}
        </Button>
      </form>
    </div>
  );
}
