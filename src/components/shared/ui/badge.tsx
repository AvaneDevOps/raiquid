import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type BadgeTone = "amber" | "green" | "red" | "neutral";

// inset box-shadow, not border: clip-path clips it to the chamfered polygon
const toneClass: Record<BadgeTone, string> = {
  amber: "text-accent-400 shadow-[inset_0_0_0_1px_var(--color-accent-500)]",
  green: "text-success shadow-[inset_0_0_0_1px_var(--color-success)]",
  red: "text-danger shadow-[inset_0_0_0_1px_var(--color-danger)]",
  neutral: "text-muted-foreground shadow-[inset_0_0_0_1px_var(--color-border-strong)]",
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
}

export function Badge({ tone = "neutral", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "seal-chip inline-flex items-center gap-1.5 px-2.5 py-1 font-mono text-xs leading-none font-medium tracking-wide normal-case uppercase",
        toneClass[tone],
        className,
      )}
      {...props}
    />
  );
}
