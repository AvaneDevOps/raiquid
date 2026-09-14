import type { ReactNode } from "react";
import { RoleShell } from "@/components/shared/layout/role-shell";
import { getSessionUser } from "@/components/shared/layout/session-user";

export default async function Layout({ children }: { children: ReactNode }) {
  const user = await getSessionUser("buyer");
  return (
    <RoleShell role="buyer" user={user}>
      {children}
    </RoleShell>
  );
}
