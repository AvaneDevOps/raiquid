import { auth } from "@clerk/nextjs/server";

import { StatCard } from "@/components/shared/ui/card";
import { InlineNotice } from "@/components/shared/ui/notice";
import { formatNaira, truncateMiddle } from "@/lib/format";
import { businessService } from "@/services";
import type { BusinessPayout } from "@/types";

import { PayoutAccountCard } from "./_components/payout-account-card";
import { PayoutHistory } from "./_components/payout-history";

interface WalletResponse {
  balance: number;
}

interface SettingsResponse {
  payoutWalletAddress: string | null;
}

interface InvoiceRow {
  id: string;
  invoiceNumber: string;
  status: string;
  fundedAmount: number;
  repaidAt: string | null;
}

// Screen 11-bizWallet. "Total received" is real GET /business/wallet
// (unchanged from before). "Pending payout" and "Payout history" are now
// derived for real from GET /business/invoices — no new backend needed,
// same as instructed: pending = sum of fundedAmount across this
// business's "funded" (fully funded, not yet repaid) invoices; history =
// every "repaid" invoice, dated by the real repaidAt field. Fetches up to
// 100 invoices (the endpoint's own max pageSize) — an honest derivation
// from what's actually returned, not a full ledger-wide sum if a
// business somehow has more than that. payoutWalletAddress is confirmed
// exposed by GET /business/settings and accepted by PATCH's
// UpdateBusinessSettingsDto (read the DTO directly, not guessed) — wired
// for real display + edit in ./_components/payout-account-card.tsx.
export default async function Page() {
  const { getToken } = await auth();
  const token = await getToken();

  let totalReceived = 0;
  let pendingPayoutAmount = 0;
  let payoutHistory: BusinessPayout[] = [];
  let payoutWalletAddress: string | null = null;
  let loadError: string | null = null;

  try {
    const [wallet, invoices, settings] = await Promise.all([
      businessService.get<WalletResponse>("/business/wallet", token),
      businessService.get<{ data: InvoiceRow[] }>("/business/invoices?pageSize=100", token),
      businessService.get<SettingsResponse>("/business/settings", token),
    ]);

    totalReceived = wallet.balance;
    payoutWalletAddress = settings.payoutWalletAddress;

    pendingPayoutAmount = invoices.data
      .filter((invoice) => invoice.status === "funded")
      .reduce((sum, invoice) => sum + Number(invoice.fundedAmount ?? 0), 0);

    payoutHistory = invoices.data
      .filter((invoice) => invoice.status === "repaid")
      .map((invoice) => ({
        id: invoice.id,
        date: invoice.repaidAt ?? "",
        invoiceId: invoice.invoiceNumber,
        amount: Number(invoice.fundedAmount ?? 0),
        status: "received" as const,
      }));
  } catch (error) {
    loadError = error instanceof Error ? error.message : "Couldn't load your wallet.";
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="font-display text-foreground text-3xl font-semibold">Wallet</h1>
        <p className="text-muted-foreground mt-1">Where your invoice payouts land</p>
      </div>

      {loadError ? <InlineNotice tone="danger">{loadError}</InlineNotice> : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Total received"
          value={formatNaira(totalReceived)}
          caption="all-time"
          emphasize
        />
        <StatCard
          label="Pending payout"
          value={formatNaira(pendingPayoutAmount)}
          caption={pendingPayoutAmount > 0 ? "awaiting repayment" : "No pending payouts"}
        />
        <StatCard
          label="Connected account"
          value={payoutWalletAddress ? truncateMiddle(payoutWalletAddress) : "Not connected"}
        />
      </div>

      <PayoutAccountCard initialAddress={payoutWalletAddress} />

      <PayoutHistory payouts={payoutHistory} />
    </div>
  );
}
