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
 * Status-specific rendering goes through the domain components in
 * shared/domain/status-badges.tsx — a raw <Badge tone="green">Repaid</Badge>
 * in a page is a bug.
 */
export type BadgeTone = "amber" | "green" | "red" | "neutral";

const toneClass: Record<BadgeTone, string> = {
  amber: "bg-accent-500/12 text-accent-400",
  green: "bg-success/12 text-success",
  red: "bg-danger/12 text-danger",
  neutral: "bg-surface-raised text-muted-foreground",
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
}

export function Badge({ tone = "neutral", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "seal-chip inline-flex items-center gap-1.5 px-2.5 py-1 font-mono text-[11px] leading-none font-medium tracking-wide uppercase",
        toneClass[tone],
        className,
      )}
      {...props}
    />
  );
}
