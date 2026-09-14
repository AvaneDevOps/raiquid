"use client";

import { cn } from "@/lib/utils";

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
        "seal-chip focus-visible:ring-accent-400 inline-flex min-w-11 items-center justify-center px-2.5 py-1 font-mono text-xs font-medium outline-none focus-visible:ring-2",
        isOn
          ? "text-success shadow-[inset_0_0_0_1px_var(--color-success)]"
          : "text-muted-foreground shadow-[inset_0_0_0_1px_var(--color-border-strong)]",
      )}
    >
      {isOn ? "On" : "Off"}
    </button>
  );
}
