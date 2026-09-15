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
