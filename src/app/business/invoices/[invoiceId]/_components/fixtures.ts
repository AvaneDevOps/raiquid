/**
 * Route-local (colocated under [invoiceId]/_components/) per
 * CONTRIBUTING.md #4 — promote if a second route needs the same shapes.
 *
 * These fill in details the core Invoice type doesn't carry (the
 * accepted/listed timestamp, per-investor funding breakdown) rather
 * than proposing changes to src/types/domain.ts (tech-director-owned)
 * for what's currently a single detail page's display needs. If a
 * second screen needs the same joins, that's the signal to promote
 * these into real fields/types instead.
 *
 * (BUYER_SUMMARIES used to live here too — moved to
 * src/components/business/fixtures.ts once /business/invoices/new
 * needed the same buyer track-record data.)
 */

/**
 * The moment the buyer accepted (screen 07's "Accepted by ... on 27 Aug
 * 2026", also used for screen 08's "Listed 27 Aug 2026" — tokenization
 * and marketplace listing happen together). Only present once an
 * invoice has actually been accepted (tokenized or later).
 */
export const INVOICE_ACCEPTED_AT: Record<string, string> = {
  "RQ-INV-4471": "2026-08-27",
};

/**
 * Named top contributors for the "Contributing investors" card (screen
 * 08) — anonymized to initials, matching what a business sees (never
 * full investor identity). "+N others" is computed in the component
 * from the invoice's own fundedAmount/fundingInvestorCount, not stored
 * here, so it can never drift out of sync with the invoice total.
 */
export const TOP_CONTRIBUTORS: Record<string, { initials: string; amount: number }[]> = {
  "RQ-INV-4471": [
    { initials: "E. N.", amount: 150_000 },
    { initials: "A. T.", amount: 80_000 },
  ],
};
