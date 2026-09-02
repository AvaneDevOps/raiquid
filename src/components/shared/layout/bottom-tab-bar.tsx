"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ROLE_NAV } from "@/lib/nav-config";
import type { UserRole } from "@/types";
import { cn } from "@/lib/utils";

type RoleWithNav = Exclude<UserRole, "admin">;

// takes `role`, not a nav array, so the icon components never cross the server→client boundary
export function BottomTabBar({ role }: { role: RoleWithNav }) {
  const pathname = usePathname();
  const items = ROLE_NAV[role];

  return (
    <nav className="border-border bg-surface fixed inset-x-0 bottom-0 z-40 flex border-t md:hidden">
      {items.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex flex-1 flex-col items-center gap-1 px-1 py-2 text-[10px]",
              active ? "text-accent-400" : "text-muted-foreground",
            )}
          >
            <Icon className="size-5 shrink-0" />
            <span className="max-w-full truncate">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
