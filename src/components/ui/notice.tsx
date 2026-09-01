import type { ReactNode } from "react";

// TODO: implement. See docs/DESIGN_SYSTEM.md, "Empty state" and "Inline notice".
export function EmptyState(props: { title: string; description: string; action?: ReactNode }) {
  return null;
}

export type NoticeTone = "info" | "danger" | "success";

export function InlineNotice(props: { tone?: NoticeTone; children: ReactNode }) {
  return null;
}
