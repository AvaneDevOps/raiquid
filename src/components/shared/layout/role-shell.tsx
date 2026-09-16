import type { ReactNode } from "react";
import { Hexagon } from "lucide-react";
import type { UserRole } from "@/types";
import type { SessionUser } from "@/components/shared/layout/session-user";
import { Sidebar } from "@/components/shared/layout/sidebar";
import { BottomTabBar } from "@/components/shared/layout/bottom-tab-bar";
import { UserSummary } from "@/components/shared/layout/user-summary";
import { PageReveal } from "@/components/shared/layout/page-reveal";

type RoleWithNav = Exclude<UserRole, "admin">;

// Sidebar and BottomTabBar are both always mounted; CSS alone toggles which one shows.
export function RoleShell({
  role,
  user,
  children,
}: {
  role: RoleWithNav;
  user: SessionUser;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar role={role} user={user} />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="border-border bg-surface flex h-14 items-center justify-between border-b px-4 md:hidden">
          <span className="font-display text-foreground inline-flex items-center gap-2 text-base font-semibold">
            <Hexagon className="text-accent-400 size-4 shrink-0" strokeWidth={1.75} />
            Raiquid
          </span>
          <UserSummary user={user} />
        </header>

        <main className="flex-1 px-4 pt-6 pb-24 md:px-8 md:py-8">
          <PageReveal>{children}</PageReveal>
        </main>

        <BottomTabBar role={role} />
      </div>
    </div>
  );
}
