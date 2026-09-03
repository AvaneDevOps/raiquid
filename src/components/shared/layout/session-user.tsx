import type { UserRole } from "@/types";

export interface SessionUser {
  name: string;
  subtitle: string;
  role: UserRole;
  initials: string;
}

// TEMPORARY: auth isn't wired — returns a placeholder so the shells render. Replace with the real session lookup.
export async function getSessionUser(role: UserRole): Promise<SessionUser> {
  return { name: "Preview user", subtitle: "Auth not wired up", initials: "--", role };
}
