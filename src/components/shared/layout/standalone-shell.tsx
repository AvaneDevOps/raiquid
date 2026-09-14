import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

// Chromeless centered card on the plain background — the magic-link
// confirm screens (13/14). Auth and verify (02/03) instead sit under
// the marketing <LandingHeader>, so they don't use this.
export function StandaloneShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div
        className={cn("border-border bg-surface w-full max-w-lg rounded-xl border p-6", className)}
      >
        {children}
      </div>
    </main>
  );
}
