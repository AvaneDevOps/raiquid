import { auth } from "@clerk/nextjs/server";

import { businessService, normalizeBusinessWallet } from "@/services/business";
import { Button } from "@/components/shared/ui/button";
import { Card, StatCard } from "@/components/shared/ui/card";
import { formatNaira } from "@/lib/format";

import { PayoutHistory } from "./_components/payout-history";

export default async function Page() {
  const { getToken } = await auth();
  const token = await getToken();
  const payload = await businessService.getWallet<unknown>(token);
  const wallet = normalizeBusinessWallet(payload);
  const { payoutAccount, pendingPayout } = wallet;

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="font-display text-foreground text-3xl font-semibold">Wallet</h1>
        <p className="text-muted-foreground mt-1">Where your invoice payouts land</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Total received"
          value={formatNaira(wallet.totalReceived)}
          caption="all-time"
          emphasize
        />
        <StatCard
          label="Pending payout"
          value={formatNaira(pendingPayout?.amount ?? 0)}
          caption={
            pendingPayout
              ? `${pendingPayout.invoiceId} · ${pendingPayout.invoiceStatus}`
              : "No pending payouts"
          }
        />
        <StatCard
          label="Connected account"
          value={
            payoutAccount.bankName
              ? `${payoutAccount.bankName} •••• ${payoutAccount.accountNumberLast4}`
              : "Not configured"
          }
        />
      </div>

      <Card className="flex items-center justify-between gap-4 p-5 sm:p-7">
        <div className="min-w-0 flex-1">
          <h2 className="text-foreground text-lg font-semibold">Payout account</h2>
          <p className="text-muted-foreground mt-1 font-mono text-sm">
            {payoutAccount.bankName || "Not configured"} ••••{" "}
            {payoutAccount.accountNumberLast4 || "----"}
            {payoutAccount.accountHolderName ? ` · ${payoutAccount.accountHolderName}` : ""}
          </p>
        </div>
        <Button
          variant="secondary"
          className="shrink-0"
          disabled
          title="Payout account changes are not available through the current API"
        >
          Change account
        </Button>
      </Card>

      <PayoutHistory payouts={wallet.payoutHistory} />
    </div>
  );
}
