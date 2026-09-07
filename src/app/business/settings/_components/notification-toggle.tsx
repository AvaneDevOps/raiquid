"use client";

import { cn } from "@/lib/utils";

/**
 * Visually matches the seal-chip shape used by status Badges, but this
 * is a clickable control, not a status display — reuses the shared
 * seal-chip CSS utility directly rather than <Badge>, same reasoning
 * as invoice-filter-tabs.tsx. Local state only; no backend to persist
 * to yet (see docs/RAIQUID_CONTEXT.md, "Open decisions").
 */
export function NotificationToggle({
  isOn,
  onToggle,
  label,
}: {
  isOn: boolean;
  onToggle: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={isOn}
      aria-label={label}
      onClick={onToggle}
      className={cn(
        "seal-chip border px-3 py-1 font-mono text-xs transition-colors",
        isOn
          ? "border-success text-success"
          : "border-border-strong text-muted-foreground hover:text-foreground",
      )}
    >
      {isOn ? "On" : "Off"}
    </button>
  );
}
