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

export async function getAuthenticatedSessionUser(): Promise<SessionUser> {
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

  const name =
    [user.firstName, user.lastName].filter(Boolean).join(" ") ||
    user.username ||
    user.primaryEmailAddress?.emailAddress ||
    "Account";

  const subtitle = user.unsafeMetadata.subtitle || user.primaryEmailAddress?.emailAddress || "";

  return {
    name,
    subtitle,
    role: sessionRole,
    initials: initialsFrom(user.firstName, user.lastName, name),
  };
}

export async function getSessionUser(role: UserRole): Promise<SessionUser> {
  const user = await getAuthenticatedSessionUser();

  if (user.role !== role) {
    redirect(ROLE_HOME[user.role]);
  }

  return user;
}
