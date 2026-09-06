import type { ReactNode } from "react";

import { InvoiceRef, InvoiceStatusBadge } from "@/components/shared/domain/status-badges";
import type { InvoiceStatus } from "@/types";

/**
 * Subtitle varies by state (screens 06-09 each show different copy
 * here), so it's passed in rather than computed from the status alone.
 */
export function InvoiceDetailHeader({
  invoiceId,
  status,
  subtitle,
}: {
  invoiceId: string;
  status: InvoiceStatus;
  subtitle?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-start gap-4 sm:flex-row sm:justify-between">
      <div>
        <InvoiceRef id={invoiceId} />
        {subtitle ? <p className="text-muted-foreground mt-3">{subtitle}</p> : null}
      </div>
      <InvoiceStatusBadge status={status} />
    </div>
  );
}
