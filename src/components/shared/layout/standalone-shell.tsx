import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Thin header, no nav, one centered card on a plain background. Used by
 * the (shared) route group — auth, verify, magic-link confirm — and
 * reachable before authentication.
 */
export function StandaloneShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-border flex h-14 items-center justify-center border-b">
        <span className="font-display text-foreground text-lg font-semibold">Raiquid</span>
      </header>
      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <div
          className={cn(
            "border-border bg-surface w-full max-w-md rounded-xl border p-6",
            className,
          )}
        >
          {children}
        </div>
      </main>
    </div>
  );
}
