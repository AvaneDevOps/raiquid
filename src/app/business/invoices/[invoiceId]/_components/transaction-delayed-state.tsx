import { Badge } from "@/components/shared/ui/badge";
import { Button } from "@/components/shared/ui/button";
import { Card } from "@/components/shared/ui/card";
import { InlineNotice } from "@/components/shared/ui/notice";

export function TransactionDelayedState({
  invoiceId,
  transactionId,
  onCheckStatus,
}: {
  invoiceId: string;
  transactionId: string;
  onCheckStatus: () => void;
}) {
  return (
    <Card className="p-5 md:p-7">
      <h2 className="text-foreground text-base font-semibold">Transaction delayed</h2>

      <InlineNotice tone="danger" className="mt-4">
        We&apos;re still waiting on network confirmation for <strong>{invoiceId}&apos;s</strong>{" "}
        mint transaction. This can take a few minutes on the sandbox testnet.
      </InlineNotice>

      <dl className="divide-border mt-6 divide-y text-sm">
        <div className="flex items-center justify-between gap-6 py-4 first:pt-0">
          <dt className="text-foreground">Transaction</dt>
          <dd className="text-muted-foreground font-mono">{transactionId}</dd>
        </div>
        <div className="flex items-center justify-between gap-6 py-4 last:pb-0">
          <dt className="text-foreground">Status</dt>
          <dd>
            <Badge tone="amber">Pending confirmation</Badge>
          </dd>
        </div>
      </dl>

      <div className="mt-6">
        <Button variant="secondary" onClick={onCheckStatus}>
          Check status
        </Button>
      </div>

      <p className="text-muted-foreground mt-5 font-mono text-xs leading-5">
        Your invoice data is saved — nothing is lost if this takes longer than expected.
      </p>
    </Card>
  );
}
