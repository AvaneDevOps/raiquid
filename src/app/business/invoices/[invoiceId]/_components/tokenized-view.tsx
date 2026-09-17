import { Stepper } from "@/components/shared/domain/stepper";
import { Card } from "@/components/shared/ui/card";
import { InlineNotice } from "@/components/shared/ui/notice";
import { ProgressBar } from "@/components/shared/ui/progress-bar";
import { INVOICE_LIFECYCLE_STEPS, INVOICE_STATUS_STEP_INDEX } from "@/lib/domain-display";
import { formatNaira } from "@/lib/format";
import type { Invoice } from "@/types";

import type { MintEvent } from "../_lib/invoice";

export function TokenizedView({ invoice, mintEvent }: { invoice: Invoice; mintEvent?: MintEvent }) {
  const percentFunded = invoice.amount > 0 ? (invoice.fundedAmount / invoice.amount) * 100 : 0;

  return (
    <>
      <Stepper
        steps={INVOICE_LIFECYCLE_STEPS}
        currentIndex={INVOICE_STATUS_STEP_INDEX[invoice.status]}
        className="mt-8"
      />

      <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-foreground font-semibold">Token</h3>
          {invoice.tokenId ? (
            <p className="border-accent-500 text-accent-400 mt-4 inline-block rounded border px-3 py-1 font-mono text-sm">
              {invoice.tokenId}
            </p>
          ) : null}
          <p className="text-muted-foreground mt-4 font-mono text-sm">
            Minted on Ethereum Sepolia · {mintEvent?.status ?? "pending"}
          </p>
        </Card>

        <Card className="p-6">
          <h3 className="text-foreground font-semibold">Listed for funding</h3>
          <p className="text-muted-foreground mt-4 font-mono text-sm">
            {formatNaira(invoice.fundedAmount)} of {formatNaira(invoice.amount)} raised
          </p>
          <ProgressBar percent={percentFunded} className="mt-3" />
        </Card>
      </div>

      <InlineNotice tone="success" className="mt-6">
        Your invoice is now live on the investor marketplace. You&apos;ll be notified as funding
        comes in.
      </InlineNotice>
    </>
  );
}
