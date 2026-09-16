import { Button } from "@/components/shared/ui/button";
import { StatCard } from "@/components/shared/ui/card";
import { InlineNotice } from "@/components/shared/ui/notice";
import {
  INVESTOR_HOLDINGS,
  INVESTOR_PORTFOLIO_STATS,
  INVESTOR_WALLET_BALANCE,
  INVESTOR_WALLET_TRANSACTIONS,
} from "@/components/investor";
import { formatNaira } from "@/lib/format";

import { WalletTransactionHistory } from "./_components/transaction-history";

// Screen 24-invWallet. Data below is dummy (see
// src/components/investor/index.ts) until a real API exists — see
// docs/RAIQUID_CONTEXT.md, "Open decisions".
export default function Page() {
  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-display text-foreground text-3xl font-semibold">Wallet</h1>
          <p className="text-muted-foreground mt-1">Available balance and transaction history</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" title="Withdrawals aren't available yet">
            Withdraw
          </Button>
          <Button title="Deposits aren't available yet">Deposit</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Available balance"
          value={formatNaira(INVESTOR_WALLET_BALANCE)}
          emphasize
        />
        <StatCard
          label="Locked in active invoices"
          value={formatNaira(INVESTOR_PORTFOLIO_STATS.totalInvested)}
          caption={`across ${INVESTOR_HOLDINGS.length} holdings`}
        />
        <StatCard
          label="Total returned to date"
          value={formatNaira(INVESTOR_PORTFOLIO_STATS.totalReturned)}
        />
      </div>

      <WalletTransactionHistory transactions={INVESTOR_WALLET_TRANSACTIONS} />

      <InlineNotice tone="info">
        Simulated environment — this runs on the Base Sepolia sandbox and no real funds move.
      </InlineNotice>
    </div>
  );
}
