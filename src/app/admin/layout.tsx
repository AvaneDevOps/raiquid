import type { ReactNode } from "react";
import { AdminShell } from "@/components/shared/layout/admin-shell";
import { getSessionUser } from "@/components/shared/layout/session-user";

export default async function Layout({ children }: { children: ReactNode }) {
  // getSessionUser gates access (no session -> /auth, wrong role -> their
  // own home) *and* returns the SessionUser the AdminShell renders in its
  // header via UserAccountMenu — which embeds the sign-out button the admin
  // panel was missing.
  const user = await getSessionUser("admin");
  return <AdminShell user={user}>{children}</AdminShell>;
}
