import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/**
 * The one panel treatment used everywhere: rounded-xl, hairline border,
 * surface fill. Rounded corners — not the chamfered chip shape.
 */
export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("border-border bg-surface rounded-xl border", className)} {...props} />;
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("border-border flex flex-col gap-1 border-b p-5", className)} {...props} />
  );
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("font-display text-foreground text-lg leading-tight font-medium", className)}
      {...props}
    />
  );
}

/**
 * Label-over-large-figure stat ("Active invoices" / "3"). `emphasize`
 * tints the figure minted-gold — used for money the platform wants the
 * eye drawn to (e.g. "You receive early").
 */
export function StatCard({
  label,
  value,
  caption,
  emphasize = false,
  className,
}: {
  label: string;
  value: string;
  caption?: string;
  emphasize?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("border-border bg-surface rounded-xl border p-5", className)}>
      <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">{label}</p>
      <p
        className={cn(
          "font-display mt-2 text-3xl leading-none font-medium",
          emphasize ? "text-accent-400" : "text-foreground",
        )}
      >
        {value}
      </p>
      {caption ? <p className="text-muted-foreground mt-1.5 text-sm">{caption}</p> : null}
    </div>
  );
}
