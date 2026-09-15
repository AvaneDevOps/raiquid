import type { ReactNode } from "react";
import { RoleShell } from "@/components/shared/layout/role-shell";
import { getSessionUser } from "@/components/shared/layout/session-user";

export default async function Layout({ children }: { children: ReactNode }) {
  const user = await getSessionUser("investor");
  return (
    <RoleShell role="investor" user={user}>
      {children}
    </RoleShell>
  );
}
