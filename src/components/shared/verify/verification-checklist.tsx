import { Card, CardHeader, CardTitle } from "@/components/shared/ui/card";
import type { DocumentCheck } from "@/types";

import { DocumentCheckBadge } from "./document-check-badge";

// Screen 03-verify, "What we're checking" card. Desktop puts the label and
// badge on the same line; mobile stacks the badge below the label,
// left-aligned (verified against the mobile export) — same flex-col ->
// md:flex-row pattern already used for the admin ledger/overview rows.
export function VerificationChecklistCard({ checks }: { checks: DocumentCheck[] }) {
  return (
    <Card className="p-6">
      <CardTitle className="pb-3 pl-3">What we&apos;re checking</CardTitle>

      <div className="divide-border divide-y">
        {checks.map((check) => (
          <div
            key={check.label}
            className="flex flex-col gap-2 px-5 py-4 md:flex-row md:justify-between md:gap-4"
          >
            <p className="text-foreground text-sm">{check.label}</p>
            <DocumentCheckBadge status={check.status} className="shrink-0 self-start" />
          </div>
        ))}
      </div>
    </Card>
  );
}
