import type { Route } from "next";
import Link from "next/link";

import { cn } from "@/lib/utils";

/**
 * Sort control for the marketplace (screen 19-invMarketplace).
 *
 * Same seal-chip silhouette + mono font as the business invoice filter tabs
 * (reused directly via the shared CSS utility, not through <Badge>, since
 * this is an interactive control, not a status display).
 *
 * Query-param driven (real navigation, not client-side JS filtering) —
 * matches how a real API would take a sort key.
 */
const SORTS = [
  { label: "Return", value: "return" },
  { label: "Due date", value: "due-date" },
  { label: "Buyer tier", value: "buyer-tier" },
] as const;

export type MarketplaceSort = (typeof SORTS)[number]["value"];

export function MarketplaceSortTabs({ active }: { active: MarketplaceSort }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {SORTS.map((sort) => {
        const isActive = sort.value === active;
        const href = (
          sort.value === "return"
            ? "/investor/marketplace"
            : `/investor/marketplace?sort=${sort.value}`
        ) as Route;

        return (
          <Link
            key={sort.value}
            href={href}
            aria-current={isActive ? "true" : undefined}
            className={cn(
              "seal-chip shrink-0 border px-3 py-1.5 font-mono text-xs whitespace-nowrap transition-colors",
              isActive
                ? "border-accent-400 text-accent-400"
                : "border-border text-muted-foreground hover:border-border-strong hover:text-foreground",
            )}
          >
            {isActive ? `Sort: ${sort.label}` : sort.label}
          </Link>
        );
      })}
    </div>
  );
}
