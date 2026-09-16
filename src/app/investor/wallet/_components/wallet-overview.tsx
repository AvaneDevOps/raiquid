"use client";

import { useState, type FormEvent } from "react";
import { useAuth } from "@clerk/nextjs";

import { Button } from "@/components/shared/ui/button";
import { Card, StatCard } from "@/components/shared/ui/card";
import { Input } from "@/components/shared/ui/input";
import { formatNaira } from "@/lib/format";
import { ApiError, investorService } from "@/services";

interface WalletResponse {
  balance: number;
}

// POST /investor/wallet/deposit (DepositDto — confirmed against
// raiquid-api's deposit.dto.ts): just { amount }, nothing else. The
// response already carries the fresh balance ({ balance, currency,
// transactions } — same shape as GET /investor/wallet), so no separate
// refetch after a successful deposit.
export function WalletOverview({
  initialBalance,
  lockedAmount,
  lockedCount,
  totalReturned,
}: {
  initialBalance: number;
  lockedAmount: number;
  lockedCount: number;
  totalReturned: number;
}) {
  const { getToken } = useAuth();
  const [balance, setBalance] = useState(initialBalance);
  const [showForm, setShowForm] = useState(false);
  const [amountDisplay, setAmountDisplay] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function handleAmountChange(rawValue: string) {
    const digits = rawValue.replace(/[^\d]/g, "");
    setAmountDisplay(digits ? Number(digits).toLocaleString("en-US") : "");
    setError(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const amount = Number(amountDisplay.replace(/,/g, ""));
    if (!(amount > 0)) {
      setError("Enter a valid amount to deposit.");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const token = await getToken();
      const response = await investorService.post<WalletResponse>(
        "/investor/wallet/deposit",
        { amount },
        token,
      );
      setBalance(response.balance);
      setAmountDisplay("");
      setShowForm(false);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-display text-foreground text-3xl font-semibold">Wallet</h1>
          <p className="text-muted-foreground mt-1">Available balance and transaction history</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" title="Withdrawals aren't available yet">
            Withdraw
          </Button>
          <Button onClick={() => setShowForm((prev) => !prev)}>
            {showForm ? "Cancel" : "Deposit"}
          </Button>
        </div>
      </div>

      {showForm ? (
        <form onSubmit={handleSubmit}>
          <Card className="space-y-4 p-4">
            <div>
              <label htmlFor="depositAmount" className="text-muted-foreground text-sm">
                Amount to deposit (₦)
              </label>
              <Input
                id="depositAmount"
                className="mt-2"
                inputMode="numeric"
                value={amountDisplay}
                onChange={(event) => handleAmountChange(event.target.value)}
                disabled={submitting}
                aria-invalid={Boolean(error)}
              />
              {error ? <p className="text-danger mt-1 text-sm">{error}</p> : null}
            </div>
            <Button type="submit" size="sm" disabled={submitting}>
              {submitting ? "Depositing…" : "Confirm deposit"}
            </Button>
          </Card>
        </form>
      ) : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Available balance" value={formatNaira(balance)} emphasize />
        <StatCard
          label="Locked in active invoices"
          value={formatNaira(lockedAmount)}
          caption={`across ${lockedCount} holdings`}
        />
        <StatCard label="Total returned to date" value={formatNaira(totalReturned)} />
      </div>
    </div>
  );
}
