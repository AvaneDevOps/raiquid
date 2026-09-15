import type { ReactNode } from "react";
import { AdminShell } from "@/components/shared/layout/admin-shell";
import { RoleShell } from "@/components/shared/layout/role-shell";
import { getAuthenticatedSessionUser } from "@/components/shared/layout/session-user";

export default async function Layout({ children }: { children: ReactNode }) {
  const user = await getAuthenticatedSessionUser();

  if (user.role === "admin") {
    return <AdminShell>{children}</AdminShell>;
  }

  return (
    <RoleShell role={user.role} user={user}>
      {children}
    </RoleShell>
  );
}
