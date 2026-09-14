import type { WalletTransaction, WalletTransactionType } from "@/types";

import { Card } from "@/components/shared/ui/card";
import { formatDate, formatNaira } from "@/lib/format";

const TRANSACTION_TYPE_LABEL: Record<WalletTransactionType, string> = {
  invested: "Invested",
  repayment: "Repayment",
  deposit: "Deposit",
  withdrawal: "Withdrawal",
};

function formatSignedNaira(amount: number): string {
  if (amount === 0) return formatNaira(0);
  const sign = amount > 0 ? "+" : "";
  return `${sign}${formatNaira(amount)}`;
}

export function WalletTransactionHistory({ transactions }: { transactions: WalletTransaction[] }) {
  return (
    <Card>
      <h2 className="text-foreground px-5 pt-5 text-lg font-semibold sm:px-7 sm:pt-7">
        Transaction history
      </h2>

      {transactions.length === 0 ? (
        <p className="text-muted-foreground px-5 py-8 text-center text-sm sm:px-7">
          No transactions yet — deposits, investments, and repayments will show up here.
        </p>
      ) : (
        <>
          {/* Desktop */}
          <table className="mt-4 hidden w-full text-sm md:table">
            <thead>
              <tr className="border-border text-muted-foreground border-b text-left">
                <th className="px-5 py-3 font-normal sm:pl-7">Date</th>
                <th className="px-5 py-3 font-normal">Type</th>
                <th className="px-5 py-3 font-normal">Amount</th>
                <th className="px-5 py-3 font-normal sm:pr-7">Reference</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="border-border border-b last:border-0">
                  <td className="text-muted-foreground px-5 py-4 font-mono sm:pl-7">
                    {formatDate(transaction.date)}
                  </td>
                  <td className="text-foreground px-5 py-4">
                    {TRANSACTION_TYPE_LABEL[transaction.type]}
                  </td>
                  <td className="text-foreground px-5 py-4 font-mono">
                    {formatSignedNaira(transaction.amount)}
                  </td>
                  <td className="text-muted-foreground px-5 py-4 font-mono sm:pr-7">
                    {transaction.reference}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile */}
          <div className="divide-border mt-4 divide-y md:hidden">
            {transactions.map((transaction) => (
              <dl key={transaction.id} className="space-y-2 px-5 py-4">
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-muted-foreground text-sm">Date</dt>
                  <dd className="text-muted-foreground font-mono text-sm">
                    {formatDate(transaction.date)}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-muted-foreground text-sm">Type</dt>
                  <dd className="text-foreground text-sm font-medium">
                    {TRANSACTION_TYPE_LABEL[transaction.type]}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-muted-foreground text-sm">Amount</dt>
                  <dd className="text-foreground font-mono text-sm">
                    {formatSignedNaira(transaction.amount)}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-muted-foreground text-sm">Reference</dt>
                  <dd className="text-muted-foreground font-mono text-sm">
                    {transaction.reference}
                  </dd>
                </div>
              </dl>
            ))}
          </div>
        </>
      )}
    </Card>
  );
}
