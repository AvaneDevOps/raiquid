import { redirect } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";
import { ROLE_HOME } from "@/lib/role-home";
import { isUserRole } from "@/lib/user-role";
import type { UserRole } from "@/types";

export interface SessionUser {
  name: string;
  subtitle: string;
  role: UserRole;
  initials: string;
}

function initialsFrom(first: string | null, last: string | null, fallback: string): string {
  const fromName = [first?.[0], last?.[0]].filter(Boolean).join("").toUpperCase();
  return fromName || fallback.slice(0, 2).toUpperCase();
}

// The authoritative session + role check for a route group's layout, same
// call shape as before Clerk: const user = await getSessionUser("business").
//
//  - no session at all -> redirect to /auth
//  - session present but role metadata missing -> redirect to /auth (the
//    signup->provisioning webhook may not have caught up yet; see Part 6's
//    401/403 handling for the equivalent case on API calls)
//  - session present but wrong role (e.g. a buyer hitting /business/*)
//    -> redirect to that user's own home, not an error page
//  - session present and role matches -> return the SessionUser
export async function getSessionUser(role: UserRole): Promise<SessionUser> {
  const { userId } = await auth();
  if (!userId) {
    redirect("/auth");
  }

  const user = await currentUser();
  if (!user) {
    redirect("/auth");
  }

  const sessionRole = user.unsafeMetadata.role;
  if (!isUserRole(sessionRole)) {
    redirect("/auth");
  }

  if (sessionRole !== role) {
    redirect(ROLE_HOME[sessionRole]);
  }

  const name =
    [user.firstName, user.lastName].filter(Boolean).join(" ") ||
    user.username ||
    user.primaryEmailAddress?.emailAddress ||
    "Account";

  return {
    name,
    // No backend profile endpoint exists yet to source a real subtitle
    // (business name / buyer company / investor location) from — see
    // docs/COMPLIANCE_AUDIT.md. Falls back to the account's email.
    subtitle: user.primaryEmailAddress?.emailAddress ?? "",
    role: sessionRole,
    initials: initialsFrom(user.firstName, user.lastName, name),
  };
}
