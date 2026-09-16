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
<<<<<<< HEAD
export async function getAuthenticatedSessionUser(): Promise<SessionUser> {
=======
export async function getSessionUser(role: UserRole): Promise<SessionUser> {
>>>>>>> 126c1250105090cfeb3f5a136297e976271e7075
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

<<<<<<< HEAD
=======
  if (sessionRole !== role) {
    redirect(ROLE_HOME[sessionRole]);
  }

>>>>>>> 126c1250105090cfeb3f5a136297e976271e7075
  const name =
    [user.firstName, user.lastName].filter(Boolean).join(" ") ||
    user.username ||
    user.primaryEmailAddress?.emailAddress ||
    "Account";

<<<<<<< HEAD
  return {
    name,
    subtitle: user.primaryEmailAddress?.emailAddress ?? "",
=======
  // Subtitle is written to unsafeMetadata at signup (business name / "Diaspora
  // Investor · {country}" / buyer company name). Admins don't sign up, so they
  // keep the email fallback. No backend profile endpoint exists yet to source
  // a refreshed subtitle from — see docs/COMPLIANCE_AUDIT.md.
  const subtitle = user.unsafeMetadata.subtitle || user.primaryEmailAddress?.emailAddress || "";

  return {
    name,
    subtitle,
>>>>>>> 126c1250105090cfeb3f5a136297e976271e7075
    role: sessionRole,
    initials: initialsFrom(user.firstName, user.lastName, name),
  };
}
<<<<<<< HEAD

export async function getSessionUser(role: UserRole): Promise<SessionUser> {
  const user = await getAuthenticatedSessionUser();

  if (user.role !== role) {
    redirect(ROLE_HOME[user.role]);
  }

  return user;
}
=======
>>>>>>> 126c1250105090cfeb3f5a136297e976271e7075
