import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Centered icon + heading + body + optional CTA. Used for "No invoices
 * yet" and the other zero-data states (screen 31).
 */
export function EmptyState({
  title,
  description,
  action,
  icon,
  className,
}: {
  title: string;
  description: string;
  action?: ReactNode;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "border-border flex flex-col items-center gap-3 rounded-xl border border-dashed px-6 py-12 text-center",
        className,
      )}
    >
      {icon ? <div className="text-muted-foreground [&_svg]:size-6">{icon}</div> : null}
      <h3 className="font-display text-foreground text-lg font-medium">{title}</h3>
      <p className="text-muted-foreground max-w-sm text-sm">{description}</p>
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}

export type NoticeTone = "info" | "danger" | "success";

const noticeTone: Record<NoticeTone, { box: string; dot: string }> = {
  info: { box: "border-border-strong bg-surface-raised text-foreground", dot: "bg-accent-400" },
  danger: { box: "border-danger-muted bg-danger/10 text-foreground", dot: "bg-danger" },
  success: {
    box: "border-success-muted bg-success/10 text-foreground",
    dot: "bg-success",
  },
};

/**
 * Dot + copy callout. The sandbox / "simulated, no real funds move"
 * disclaimer that sits on every money-moving action is an `info`
 * InlineNotice — see screens 03/05/13/14/16/18/21/31 for real copy.
 */
export function InlineNotice({
  tone = "info",
  children,
  className,
}: {
  tone?: NoticeTone;
  children: ReactNode;
  className?: string;
}) {
  const styles = noticeTone[tone];
  return (
    <div
      className={cn("flex items-start gap-3 rounded-lg border p-3 text-sm", styles.box, className)}
    >
      <span className={cn("mt-1.5 size-1.5 shrink-0 rounded-full", styles.dot)} />
      <div className="[&_a]:text-accent-400 [&_a]:underline">{children}</div>
    </div>
  );
}
