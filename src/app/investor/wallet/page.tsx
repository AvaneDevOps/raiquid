import { auth } from "@clerk/nextjs/server";

import { InlineNotice } from "@/components/shared/ui/notice";
import { investorService } from "@/services";
import type { WalletTransaction } from "@/types";

import { toHolding } from "../portfolio/_lib/holding";
import { WalletOverview } from "./_components/wallet-overview";
import { WalletTransactionHistory } from "./_components/transaction-history";
import { toTransaction } from "./_lib/transactions";

interface WalletResponse {
  balance: number;
  transactions: Record<string, unknown>[];
}

// Screen 24-invWallet. Balance and transaction history both wired to
// real GET /investor/wallet (confirmed against raiquid-api's
// InvestorService.getWallet: { balance, currency, transactions }) and a
// real deposit form (POST /investor/wallet/deposit) in
// ./_components/wallet-overview.tsx.
//
// "Locked in active invoices" and "Total returned to date" used to sit
// on INVESTOR_PORTFOLIO_STATS next to these real transactions, visibly
// disagreeing with them — now both derived for real, from two different
// sources chosen deliberately, not interchangeably:
//   - Locked amount needs GET /investor/portfolio (../portfolio/_lib/
//     holding.ts) — the wallet's own transactions have no status field,
//     so there's no way to tell an active "invested" debit from a
//     repaid one using wallet data alone; the portfolio response has
//     invoice.status per holding, which the wallet doesn't.
//   - Total returned sums this same GET /investor/wallet response's
//     real "repayment" transactions, rather than a second portfolio
//     computation — keeping it consistent with the transaction list
//     rendered right below it on this same page (same underlying fact
//     either way: a repayment WalletTransaction's amount is set to the
//     exact same value as the matching Holding.repaidAmount).
export default async function Page() {
  const { getToken } = await auth();
  const token = await getToken();

  let balance = 0;
  let transactions: WalletTransaction[] = [];
  let lockedAmount = 0;
  let lockedCount = 0;
  let totalReturned = 0;
  let loadError: string | null = null;
  try {
    const [wallet, portfolio] = await Promise.all([
      investorService.get<WalletResponse>("/investor/wallet", token),
      investorService.get<{ data: Record<string, unknown>[] }>(
        "/investor/portfolio?pageSize=100",
        token,
      ),
    ]);

    balance = wallet.balance;
    transactions = wallet.transactions.map((raw) => toTransaction(raw));
    totalReturned = transactions
      .filter((transaction) => transaction.type === "repayment")
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    const activeHoldings = portfolio.data.map(toHolding).filter((h) => h.status !== "repaid");
    lockedAmount = activeHoldings.reduce((sum, h) => sum + h.investedAmount, 0);
    lockedCount = activeHoldings.length;
  } catch (error) {
    loadError = error instanceof Error ? error.message : "Couldn't load your wallet.";
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {loadError ? (
        <InlineNotice tone="danger">{loadError}</InlineNotice>
      ) : (
        <>
          <WalletOverview
            initialBalance={balance}
            lockedAmount={lockedAmount}
            lockedCount={lockedCount}
            totalReturned={totalReturned}
          />
          <WalletTransactionHistory transactions={transactions} />
        </>
      )}

      <InlineNotice tone="info">
        Simulated environment — this runs on the Ethereum Sepolia sandbox and no real funds move.
      </InlineNotice>
    </div>
  );
}
