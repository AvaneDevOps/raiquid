"use client";

import { useState } from "react";
import { BUSINESS_INVOICES } from "@/components/business/fixtures";
import { INVESTOR_WALLET_BALANCE, MIN_INVESTMENT } from "@/components/investor";
import { InvoiceRef } from "@/components/shared/domain/status-badges";
import { Button } from "@/components/shared/ui/button";
import { Card } from "@/components/shared/ui/card";
import { Input } from "@/components/shared/ui/input";
import { InlineNotice } from "@/components/shared/ui/notice";
import { formatNaira, formatPercent } from "@/lib/format";

// Screen 21-invFund. Dummy invoice + wallet until a real API exists.
// Math: share = amount / invoice.amount; return = amount * expectedReturnPct;
// total = amount + return (fee comes off the return, per the sandbox notice).
export default function Page() {
  const invoice = BUSINESS_INVOICES.find((c) => c.id === "RQ-INV-4471")!;
  const [amountDisplay, setAmountDisplay] = useState("150,000");
  const [error, setError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const amount = Number(amountDisplay.replace(/,/g, ""));
  const valid = Number.isFinite(amount) && amount > 0;
  const tooSmall = valid && amount < MIN_INVESTMENT;
  const tooBig = valid && amount > INVESTOR_WALLET_BALANCE;
  const ok = valid && !tooSmall && !tooBig;
  const share = invoice.amount > 0 && valid ? (amount / invoice.amount) * 100 : 0;
  const projected = ok ? (amount * invoice.expectedReturnPct) / 100 : 0;
  const total = ok ? amount + projected : 0;

  function onChange(raw: string) {
    const digits = raw.replace(/[^\d]/g, "");
    setAmountDisplay(digits ? Number(digits).toLocaleString("en-US") : "");
    setError(null);
    setConfirmed(false);
  }

  function onConfirm() {
    if (!valid) return setError("Enter an amount to invest.");
    if (tooSmall) return setError(`Minimum investment is ${formatNaira(MIN_INVESTMENT)}.`);
    if (tooBig) return setError("Insufficient wallet balance for this amount.");
    setError(null);
    setConfirmed(true);
  }

  return (
    <div className="w-full max-w-xl">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="font-display text-foreground text-3xl font-semibold">Fund</h1>
        <InvoiceRef id={invoice.id} />
      </div>
      <Card className="mt-8 space-y-6 p-6">
        <div>
          <label htmlFor="amount" className="text-muted-foreground text-sm">
            Amount to invest (min {formatNaira(MIN_INVESTMENT)})
          </label>
          <Input
            id="amount"
            inputMode="numeric"
            value={amountDisplay}
            onChange={(e) => onChange(e.target.value)}
            aria-invalid={Boolean(error)}
            className="mt-2"
          />
          {error ? <p className="text-danger mt-1 text-sm">{error}</p> : null}
        </div>
        <dl className="divide-border divide-y">
          <div className="flex items-baseline justify-between gap-4 py-4 first:pt-0">
            <dt className="text-foreground text-sm">Your share of this invoice</dt>
            <dd className="text-foreground font-mono text-sm">{formatPercent(share)}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-4 py-4">
            <dt className="text-foreground text-sm">Projected return at maturity</dt>
            <dd className="text-accent-400 font-mono text-sm">{formatNaira(projected)}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-4 py-4 last:pb-0">
            <dt className="text-foreground text-sm font-semibold">Total you&apos;ll receive</dt>
            <dd className="text-foreground font-mono text-sm font-semibold">
              {formatNaira(total)}
            </dd>
          </div>
        </dl>
      </Card>
      <Card className="mt-4 flex items-center justify-between gap-4 p-5">
        <p className="text-muted-foreground text-sm">Wallet balance</p>
        <p className="text-muted-foreground font-mono text-sm">
          {formatNaira(INVESTOR_WALLET_BALANCE)}
        </p>
      </Card>
      <InlineNotice tone="info" className="mt-4">
        Funds are simulated sandbox tokens for this build. A small share of your return, not the
        amount you invest, is what the platform takes as a fee.
      </InlineNotice>
      {confirmed ? (
        <InlineNotice tone="success" className="mt-4">
          Funding {formatNaira(amount)} confirmed — in the full product this would now move sandbox
          tokens. No backend exists yet, so nothing was actually funded.
        </InlineNotice>
      ) : null}
      <Button size="lg" className="mt-6" onClick={onConfirm}>
        Confirm &amp; fund
      </Button>
    </div>
  );
}
