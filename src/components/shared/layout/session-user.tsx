import "server-only";
import { redirect } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";
import { ROLE_HOME } from "@/lib/demo-accounts";
import type { UserRole } from "@/types";

export interface SessionUser {
  name: string;
  subtitle: string;
  role: UserRole;
  initials: string;
}

const VALID_ROLES: UserRole[] = ["business", "buyer", "investor", "admin"];

function isUserRole(value: unknown): value is UserRole {
  return typeof value === "string" && (VALID_ROLES as string[]).includes(value);
}

function initialsFor(name: string): string {
  const parts = name.split(" ").filter(Boolean);
  if (parts.length === 0) return "RQ";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

/**
 * The authoritative session + role check for a route group's layout.
 *
 * Auth provider is Clerk. The user's Raiquid role lives in
 * `publicMetadata.role` (set at sign-up from the "Continuing as" picker on
 * /auth, see src/app/(shared)/auth/page.tsx). Display fields fall back to
 * the Clerk profile (full name / email) when role metadata hasn't filled
 * them in.
 *
 * Behavior:
 *  - no session at all -> redirect to /auth
 *  - session present but no/invalid role -> redirect to /auth (they must
 *    complete role selection before entering a role shell)
 *  - session present but wrong role (e.g. a buyer hitting /business/*)
 *    -> redirect to that user's own home, not an error page
 *  - session present and role matches -> return the SessionUser, same
 *    shape as always, so RoleShell/AdminShell/Sidebar/BottomTabBar need
 *    no changes.
 */
export async function getSessionUser(role: UserRole): Promise<SessionUser> {
  const { userId } = await auth();

  if (!userId) {
    redirect("/auth");
  }

  const user = await currentUser();

  if (!user) {
    redirect("/auth");
  }

  const storedRole = (user.publicMetadata as Record<string, unknown> | undefined)?.role;

  if (!isUserRole(storedRole)) {
    redirect("/auth");
  }

  if (storedRole !== role) {
    redirect(ROLE_HOME[storedRole]);
  }

  const name =
    user.fullName ?? [user.firstName, user.lastName].filter(Boolean).join(" ") ?? "Unknown";
  const subtitle =
    (user.publicMetadata as Record<string, unknown> | undefined)?.subtitle != null
      ? String((user.publicMetadata as Record<string, unknown>).subtitle)
      : (user.primaryEmailAddress?.emailAddress ?? "");

  return {
    name: name || "Unknown",
    subtitle,
    role: storedRole,
    initials: initialsFor(name || "Unknown"),
  };
}
