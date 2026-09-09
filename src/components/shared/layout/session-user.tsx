import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { ROLE_HOME } from "@/lib/demo-accounts";
import type { UserRole } from "@/types";

export interface SessionUser {
  name: string;
  subtitle: string;
  role: UserRole;
  initials: string;
}

/**
 * The authoritative session + role check for a route group's layout.
 *
 * src/proxy.ts only does an optimistic cookie-presence check (see its
 * comments) — this is the real check, meant to be called once at the top
 * of each role's layout.tsx, same as before auth was wired up:
 *
 *   const user = await getSessionUser("business");
 *
 * Behavior:
 *  - no session at all -> redirect to /auth
 *  - session present but wrong role (e.g. a buyer hitting /business/*)
 *    -> redirect to that user's own home, not an error page — don't leak
 *       that the route exists, just bounce them somewhere valid.
 *  - session present and role matches -> return the SessionUser, same
 *    shape as always, so RoleShell/AdminShell/Sidebar/BottomTabBar need
 *    no changes.
 */
export async function getSessionUser(role: UserRole): Promise<SessionUser> {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth");
  }

  if (session.user.role !== role) {
    redirect(ROLE_HOME[session.user.role]);
  }

  return {
    name: session.user.name ?? "Unknown",
    subtitle: session.user.subtitle as string,
    role: session.user.role as UserRole,
    initials: session.user.initials as string,
  };
}
