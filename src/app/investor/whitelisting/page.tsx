import { Stepper } from "@/components/shared/domain/stepper";
import { Badge, type BadgeTone } from "@/components/shared/ui/badge";
import { Card } from "@/components/shared/ui/card";
import { InlineNotice } from "@/components/shared/ui/notice";
import { WHITELIST_STEPS } from "@/lib/domain-display";

interface SubmittedDocument {
  name: string;
  label: string;
  tone: BadgeTone;
}

// Screen 18-invWhitelist. Data below is dummy until a real API exists — see
// docs/RAIQUID_CONTEXT.md, "Open decisions". Document states are row-level
// labels only (not the WhitelistStatus domain enum), so they map directly to
// generic seal-chip tones: received = green, in review = amber.
const DOCUMENTS: SubmittedDocument[] = [
  {
    name: "Proof of identity",
    label: "Received",
    tone: "green",
  },
  {
    name: "Proof of address",
    label: "Received",
    tone: "green",
  },
  {
    name: "Source of funds declaration",
    label: "In review",
    tone: "amber",
  },
];

export default function WhitelistPage() {
  return (
    <div className="mx-auto w-full max-w-xl space-y-8">
      <div>
        <h1 className="font-display text-foreground text-3xl font-semibold">
          Getting you whitelisted
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Required before you can fund any invoice.
        </p>
      </div>

      <Stepper steps={WHITELIST_STEPS} currentIndex={1} />

      <Card className="p-6">
        <h2 className="text-foreground font-semibold">Documents submitted</h2>

        <dl className="divide-border mt-4 divide-y">
          {DOCUMENTS.map((document) => (
            <div
              key={document.name}
              className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
            >
              <dt className="text-foreground text-sm">{document.name}</dt>
              <dd>
                <Badge tone={document.tone}>{document.label}</Badge>
              </dd>
            </div>
          ))}
        </dl>
      </Card>

      <InlineNotice tone="info">
        You can browse the marketplace now — funding unlocks the moment whitelisting completes,
        usually within one business day.
      </InlineNotice>
    </div>
  );
}
