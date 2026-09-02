"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Hexagon } from "lucide-react";
import { ROLE_NAV } from "@/lib/nav-config";
import type { UserRole } from "@/types";
import type { SessionUser } from "@/components/shared/layout/session-user";
import { UserSummary } from "@/components/shared/layout/user-summary";
import { cn } from "@/lib/utils";

type RoleWithNav = Exclude<UserRole, "admin">;

/**
 * Desktop-only left nav rail (`hidden md:flex`). The mobile equivalent
 * is <BottomTabBar>; both read the same ROLE_NAV entry so they can't
 * drift. Kept in the DOM at every breakpoint — visibility is CSS only.
 *
 * Takes `role` (not a nav array) so the icon components never have to
 * cross the server→client boundary.
 */
export function Sidebar({ role, user }: { role: RoleWithNav; user: SessionUser }) {
  const pathname = usePathname();
  const items = ROLE_NAV[role];

  return (
    <aside className="border-border bg-surface hidden w-60 shrink-0 flex-col border-r md:flex">
      <div className="flex h-16 items-center gap-2 px-5">
        <Hexagon className="text-accent-400 size-5 shrink-0" strokeWidth={1.75} />
        <span className="font-display text-foreground text-lg font-semibold">Raiquid</span>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-2">
        {items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-surface-raised text-foreground font-medium"
                  : "text-muted-foreground hover:bg-surface-raised hover:text-foreground",
              )}
            >
              <Icon className="size-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-border border-t p-4">
        <UserSummary user={user} />
      </div>
    </aside>
  );
}
