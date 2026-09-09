"use client";

import Link from "next/link";
import { Check } from "lucide-react";

import { Button } from "@/components/shared/ui/button";
import { computeFinancingBreakdown } from "@/lib/finance";
import { formatNaira, formatPercent } from "@/lib/format";
import type { Invoice } from "@/types";
import { useRevealOnScroll } from "./use-reveal";

/**
 * "For businesses" section of the homepage (screen 01-landing).
 *
 * Lives in src/components/landing/ per CONTRIBUTING.md #3 — landing-
 * area component, not route-colocated, since (landing)/page.tsx
 * composes the whole continuous homepage from sections like this one.
 *
 * "use client" is needed for the scroll-reveal effect (see
 * how-it-works-section.tsx for the same note). Visual embellishment
 * only — no new colors, existing accent/success tokens at low opacity.
 */

const CHECKLIST = [
  "Upload invoices and have buyers accept them digitally",
  "Receive most of the invoice value before the due date",
  "Track funding progress and payment status in real time",
  "Build a provenance record that improves your terms over time",
];

/**
 * The "Example financing estimate" card takes the same field shape as
 * the real `Invoice` domain type (amount + the two fee percentages), so
 * once a real invoice is available this can be fed directly without
 * remapping field names. Everything below is illustrative dummy data
 * until a backend exists — see docs/RAIQUID_CONTEXT.md, "Open decisions".
 */
type FinancingEstimateInput = Pick<Invoice, "amount" | "platformFeePct" | "reserveContributionPct">;

const EXAMPLE_ESTIMATE: FinancingEstimateInput = {
  amount: 2_000_000,
  platformFeePct: 3,
  reserveContributionPct: 1,
};

interface ForBusinessesSectionProps {
  estimate?: FinancingEstimateInput;
}

export function ForBusinessesSection({ estimate = EXAMPLE_ESTIMATE }: ForBusinessesSectionProps) {
  const { platformFee, reserveContribution, netAmount } = computeFinancingBreakdown(
    estimate.amount,
    estimate.platformFeePct,
    estimate.reserveContributionPct,
  );
  const { ref: textRef, isVisible: textVisible } = useRevealOnScroll<HTMLDivElement>();
  const { ref: cardRef, isVisible: cardVisible } = useRevealOnScroll<HTMLDivElement>();

  return (
    <section
      id="for-businesses"
      className="border-border relative overflow-hidden border-t py-20 md:py-24"
    >
      {/* Ambient background glow — decorative only, sits behind all content. */}
      <div
        aria-hidden
        className="bg-accent-500/10 pointer-events-none absolute -top-24 right-[8%] -z-10 size-[30rem] rounded-full blur-3xl"
      />

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 lg:grid-cols-2 lg:items-start">
        <div
          ref={textRef}
          className={`transition-all duration-700 ease-out motion-reduce:translate-x-0 motion-reduce:opacity-100 ${
            textVisible ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"
          }`}
        >
          <p className="text-muted-foreground text-sm font-medium tracking-widest uppercase">
            For businesses
          </p>
          <h2 className="font-display text-foreground mt-4 text-4xl font-semibold md:text-5xl">
            Stop waiting 90 days to get paid.
          </h2>
          <p className="text-muted-foreground mt-6 max-w-md text-lg leading-relaxed">
            You&apos;ve delivered the goods. The work is done. You shouldn&apos;t have to wait
            months for cash that&apos;s already owed to you.
          </p>

          <ul className="mt-8 space-y-3">
            {CHECKLIST.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <Check className="text-success mt-1 size-4 shrink-0" aria-hidden />
                <span className="text-foreground">{item}</span>
              </li>
            ))}
          </ul>

          {/*
            Screen 02-auth shows role selection happening on that page
            itself, so no query param is assumed here — if /auth later
            wants to pre-select "business" via a param, that's a
            decision for whoever builds it.
          */}
          <span className="relative mt-8 inline-block">
            <span
              aria-hidden
              className="bg-accent-500/25 absolute -inset-3 -z-10 rounded-full blur-xl"
            />
            <Button asChild size="lg">
              <Link href="/auth">Apply as a business</Link>
            </Button>
          </span>
        </div>

        <div
          ref={cardRef}
          className={`border-border bg-surface rounded-xl border p-6 transition-all delay-150 duration-700 ease-out motion-reduce:translate-x-0 motion-reduce:opacity-100 ${
            cardVisible ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"
          }`}
        >
          <h3 className="text-foreground font-semibold">Example financing estimate</h3>

          <dl className="mt-6 space-y-4">
            <div className="border-border flex items-baseline justify-between border-b pb-4">
              <dt className="text-muted-foreground text-sm">Invoice value</dt>
              <dd className="text-foreground text-lg">{formatNaira(estimate.amount)}</dd>
            </div>
            <div className="border-border flex items-baseline justify-between border-b pb-4">
              <dt className="text-muted-foreground text-sm">
                Platform fee ({formatPercent(estimate.platformFeePct, 0)})
              </dt>
              <dd className="text-danger text-lg">−{formatNaira(platformFee)}</dd>
            </div>
            <div className="border-border flex items-baseline justify-between border-b pb-4">
              <dt className="text-muted-foreground text-sm">
                Reserve contribution ({formatPercent(estimate.reserveContributionPct, 0)})
              </dt>
              <dd className="text-danger text-lg">−{formatNaira(reserveContribution)}</dd>
            </div>

            <div className="border-success/30 bg-success-muted/20 flex items-center justify-between rounded-lg border px-4 py-4">
              <dt className="text-success font-semibold">You receive early</dt>
              <dd className="font-display text-success text-xl font-semibold">
                {formatNaira(netAmount)}
              </dd>
            </div>
          </dl>

          <p className="text-muted-foreground mt-4 font-mono text-xs">
            Actual amounts vary based on buyer tier and invoice terms.
          </p>
        </div>
      </div>
    </section>
  );
}
