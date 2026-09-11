import { redirect } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";
import { ROLE_HOME } from "@/lib/demo-accounts";
import type { UserRole } from "@/types";

const VALID_ROLES: UserRole[] = ["business", "buyer", "investor", "admin"];

function isUserRole(value: unknown): value is UserRole {
  return typeof value === "string" && (VALID_ROLES as string[]).includes(value);
}

/**
 * Post-login landing: sends a freshly signed-in user to their role home.
 * Sign-up pushes ROLE_HOME directly (role is known from the picker); login
 * doesn't know the role client-side, so it lands here instead and the
 * server reads publicMetadata.role.
 */
export default async function PostAuthPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/auth");
  }

  const user = await currentUser();

  if (!user) {
    redirect("/auth");
  }

  const role = user.publicMetadata?.role;

  if (!isUserRole(role)) {
    redirect("/auth");
  }

  redirect(ROLE_HOME[role]);
}
