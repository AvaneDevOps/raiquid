"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Hexagon } from "lucide-react";
import { ROLE_NAV } from "@/lib/nav-config";
import type { UserRole } from "@/types";
import type { SessionUser } from "@/components/shared/layout/session-user";
import { UserSummary } from "@/components/shared/layout/user-summary";
<<<<<<< HEAD
import { SignOutButton } from "@/components/shared/layout/sign-out-button";
=======
import { SignOutButton } from "@/components/shared/ui/sign-out-button";
>>>>>>> 126c1250105090cfeb3f5a136297e976271e7075
import { cn } from "@/lib/utils";

type RoleWithNav = Exclude<UserRole, "admin">;

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
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "block rounded-lg px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-surface-raised text-accent-400 font-medium"
                  : "text-muted-foreground hover:bg-surface-raised hover:text-foreground",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

<<<<<<< HEAD
      <div className="border-border border-t p-4">
        <UserSummary user={user} action={<SignOutButton />} />
=======
      <div className="p-4">
        <SignOutButton />
      </div>

      <div className="border-border border-t p-4">
        <UserSummary user={user} />
>>>>>>> 126c1250105090cfeb3f5a136297e976271e7075
      </div>
    </aside>
  );
}
