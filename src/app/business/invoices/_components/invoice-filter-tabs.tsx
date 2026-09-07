import type { Route } from "next";
import Link from "next/link";

import { cn } from "@/lib/utils";

/**
 * Same seal-chip shape and mono font as the status Badge components,
 * reused directly via the shared CSS utility (not through <Badge>,
 * since this is an interactive filter control, not a status display —
 * see status-badges.tsx for the "only place status ever renders" rule
 * this intentionally doesn't go through).
 *
 * Query-param driven (real navigation, not client-side JS filtering) —
 * matches how a real API would take a status filter.
 */
const FILTERS = [
  { label: "All", value: null },
  { label: "Awaiting acceptance", value: "awaiting_acceptance" },
  { label: "Funding", value: "funding" },
  { label: "Repaid", value: "repaid" },
  { label: "Overdue", value: "overdue" },
] as const;

export function InvoiceFilterTabs({ active }: { active: string | null }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {FILTERS.map((filter) => {
        const isActive = filter.value === active;
        // Ternary between two differently-shaped literals widens to plain
        // `string` — Route is itself a union of literal patterns, so this
        // is the standard escape hatch, not a type-safety bypass: the
        // runtime value genuinely is one of Route's literal shapes.
        const href = (
          filter.value ? `/business/invoices?status=${filter.value}` : "/business/invoices"
        ) as Route;

        return (
          <Link
            key={filter.label}
            href={href}
            className={cn(
              "seal-chip shrink-0 border px-3 py-1.5 font-mono text-xs whitespace-nowrap transition-colors",
              isActive
                ? "border-accent-400 text-accent-400"
                : "border-border text-muted-foreground hover:border-border-strong hover:text-foreground",
            )}
          >
            {filter.label}
          </Link>
        );
      })}
    </div>
  );
}
