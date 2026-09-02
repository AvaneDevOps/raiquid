import type { ReactNode } from "react";
import { Hexagon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * No nav, one centered card on a plain background, a small wordmark
 * above it. Used by the (standalone) route group — auth, verify,
 * magic-link confirm — and reachable before authentication.
 */
export function StandaloneShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 py-10">
      <span className="font-display text-foreground inline-flex items-center gap-2 text-base font-semibold">
        <Hexagon className="text-accent-400 size-4 shrink-0" strokeWidth={1.75} />
        Raiquid
      </span>
      <div
        className={cn("border-border bg-surface w-full max-w-md rounded-xl border p-6", className)}
      >
        {children}
      </div>
    </main>
  );
}
