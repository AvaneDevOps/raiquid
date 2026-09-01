import type { HTMLAttributes } from "react";

// TODO: implement tone variants (amber/green/red/neutral).
// See docs/DESIGN_SYSTEM.md, "Badge / status pill".
export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: "amber" | "green" | "red" | "neutral";
}

export function Badge(props: BadgeProps) {
  return <span {...props} />;
}
