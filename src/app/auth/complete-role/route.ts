import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { UserRole } from "@/types";

const VALID_ROLES: UserRole[] = ["business", "buyer", "investor", "admin"];

function isUserRole(value: unknown): value is UserRole {
  return typeof value === "string" && (VALID_ROLES as string[]).includes(value);
}

/**
 * Promotes the role chosen on /auth ("Continuing as" picker, stored in
 * unsafeMetadata at sign-up time) into publicMetadata, which is the
 * server-readable source getSessionUser() guards on. Called once right
 * after the sign-up session is activated.
 */
export async function POST() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  if (isUserRole(user.publicMetadata?.role)) {
    return NextResponse.json({ ok: true, already: true });
  }

  const pendingRole = user.unsafeMetadata?.role;
  const subtitle = user.unsafeMetadata?.subtitle;

  if (!isUserRole(pendingRole)) {
    return NextResponse.json({ error: "Pick a role first." }, { status: 400 });
  }

  const client = await clerkClient();
  await client.users.updateUser(userId, {
    publicMetadata: {
      ...user.publicMetadata,
      role: pendingRole,
      subtitle: typeof subtitle === "string" ? subtitle : "",
    },
    unsafeMetadata: {},
  });

  return NextResponse.json({ ok: true, role: pendingRole });
}
