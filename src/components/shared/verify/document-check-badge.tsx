import { Badge, type BadgeTone } from "@/components/shared/ui/badge";
import type { DocumentCheckStatus } from "@/types";

// Colocated with the verify route, not status-badges.tsx — used only on
// this one screen (screen 03), unlike the domain badges that back several
// screens each. "Received" (green) / "In review" (amber).
const DOCUMENT_CHECK_META: Record<DocumentCheckStatus, { label: string; tone: BadgeTone }> = {
  received: { label: "Received", tone: "green" },
  in_review: { label: "In review", tone: "amber" },
};

export function DocumentCheckBadge({
  status,
  className,
}: {
  status: DocumentCheckStatus;
  className?: string;
}) {
  const meta = DOCUMENT_CHECK_META[status];
  return (
    <Badge tone={meta.tone} className={className}>
      {meta.label}
    </Badge>
  );
}
