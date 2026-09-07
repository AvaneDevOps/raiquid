import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

// Centered content only, no self-border — screen 31 sits it inside a Card.
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
    <div className={cn("flex flex-col items-center gap-3 px-6 py-12 text-center", className)}>
      {icon ? <div className="text-muted-foreground [&_svg]:size-6">{icon}</div> : null}
      <h3 className="font-display text-foreground text-xl font-medium">{title}</h3>
      <p className="text-muted-foreground max-w-sm text-sm">{description}</p>
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}

export type NoticeTone = "info" | "danger" | "success";

// Per screens 03/06/07/16/31: dot, border tint, faint fill and body text
// are all the tone colour.
const noticeTone: Record<NoticeTone, string> = {
  info: "border-accent-500/40 bg-accent-500/10 text-accent-400",
  danger: "border-danger/40 bg-danger/10 text-danger",
  success: "border-success/40 bg-success/10 text-success",
};

const noticeDot: Record<NoticeTone, string> = {
  info: "bg-accent-400",
  danger: "bg-danger",
  success: "bg-success",
};

export function InlineNotice({
  tone = "info",
  children,
  className,
}: {
  tone?: NoticeTone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg border p-3 text-sm",
        noticeTone[tone],
        className,
      )}
    >
      <span className={cn("mt-1.5 size-1.5 shrink-0 rounded-full", noticeDot[tone])} />
      <div className="[&_strong]:text-foreground [&_a]:underline">{children}</div>
    </div>
  );
}
