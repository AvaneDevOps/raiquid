"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ADMIN_NAV } from "@/lib/nav-config";
import { cn } from "@/lib/utils";

/**
 * The /admin shell: a "Raiquid / platform" breadcrumb over a horizontal
 * tab row (Overview / Reserve pool / Provenance registry / Ledger).
 * Deliberately identical at both breakpoints — on mobile the tab row
 * scrolls horizontally rather than collapsing to a bottom bar.
 */
export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen">
      <header className="border-border bg-surface border-b">
        <div className="flex h-14 items-center px-4 md:px-8">
          <span className="text-muted-foreground font-mono text-sm">
            <span className="text-foreground">Raiquid</span> / platform
          </span>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-2 md:px-6">
          {ADMIN_NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "shrink-0 border-b-2 px-3 py-3 text-sm whitespace-nowrap transition-colors",
                  active
                    ? "border-accent-400 text-foreground"
                    : "text-muted-foreground hover:text-foreground border-transparent",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>

      <main className="px-4 py-6 md:px-8 md:py-8">{children}</main>
    </div>
  );
}
