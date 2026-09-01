import type { UserRole } from "@/types";

/**
 * Minimal shape every shell needs to render its user card / greeting.
 * Not wired to real auth yet — see docs/RAIQUID_CONTEXT.md, "Open
 * decisions". TODO: implement getSessionUser() once an auth provider is
 * chosen.
 */
export interface SessionUser {
  name: string;
  subtitle: string;
  role: UserRole;
  initials: string;
}

export async function getSessionUser(role: UserRole): Promise<SessionUser> {
  throw new Error("Not implemented");
}
