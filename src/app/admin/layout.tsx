import type { ReactNode } from "react";
import { AdminShell } from "@/components/shared/layout/admin-shell";
import { getSessionUser } from "@/components/shared/layout/session-user";

export default async function Layout({ children }: { children: ReactNode }) {
  // AdminShell takes no user prop today (no user slot in the exports —
  // wordmark + tabs only, see docs/DESIGN_SYSTEM.md's "Layout shells").
  // This call is the guard only: no session -> /auth, non-admin session ->
  // their own role home. Return value intentionally discarded.
  await getSessionUser("admin");
  return <AdminShell>{children}</AdminShell>;
}
