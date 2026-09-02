import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/**
 * The generic chip primitive. Every status / tier / token-id chip in the
 * app is a <Badge> (or wraps one) — never style a bespoke pill.
 *
 * Shape: the "seal chip" silhouette (top-left + bottom-right corners
 * sliced at 45°) via the `seal-chip` utility in globals.css, applied
 * here so every tone and every wrapper inherits it automatically.
 *
 * Style per the screen exports: a 1px tone-coloured stroke that follows
 * the chamfer (an inset box-shadow, which `clip-path` clips to the
 * polygon) + tone-coloured mono text, no fill.
 *
 * Status-specific rendering goes through the domain components in
 * shared/domain/status-badges.tsx — a raw <Badge tone="green">Repaid</Badge>
 * in a page is a bug.
 */
export type BadgeTone = "amber" | "green" | "red" | "neutral";

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
        "seal-chip inline-flex items-center gap-1.5 px-2.5 py-1 font-mono text-xs leading-none font-medium tracking-wide uppercase",
        toneClass[tone],
        className,
      )}
      {...props}
    />
  );
}
