"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ROLE_NAV } from "@/lib/nav-config";
import type { UserRole } from "@/types";
import { cn } from "@/lib/utils";

type RoleWithNav = Exclude<UserRole, "admin">;

export function BottomTabBar({ role }: { role: RoleWithNav }) {
  const pathname = usePathname();
  const items = ROLE_NAV[role];

  return (
    <nav className="border-border bg-surface fixed inset-x-0 bottom-0 z-40 flex border-t md:hidden">
      {items.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex flex-1 flex-col items-center gap-1.5 px-1 py-2.5 text-xs",
              active ? "text-accent-400 font-medium" : "text-muted-foreground",
            )}
          >
            {/* the exports use a small dot per tab, not an icon (mobile screen 04) */}
            <span
              className={cn(
                "size-1.5 shrink-0 rounded-full",
                active ? "bg-accent-400" : "bg-muted-foreground",
              )}
            />
            <span className="max-w-full truncate">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
