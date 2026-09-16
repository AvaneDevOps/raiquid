"use client";

import { cn } from "@/lib/utils";
import { Badge } from "./badge";

export function NotificationToggle({
  isOn,
  onToggle,
  label,
}: {
  isOn: boolean | undefined;
  onToggle: () => void;
  label: string;
}) {
  const on = Boolean(isOn);

  return (
    <Badge
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={onToggle}
      className={cn(
        "seal-chip w-fit cursor-pointer px-3 py-1 font-mono text-xs transition-colors",
        on
          ? "text-success shadow-[inset_0_0_0_1px_var(--color-success)]"
          : "text-muted-foreground hover:text-foreground shadow-[inset_0_0_0_1px_var(--color-border-strong)]",
      )}
    >
      {on ? "On" : "Off"}
    </Badge>
  );
}
