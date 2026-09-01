import type { ReactNode } from "react";
import type { NavItem } from "@/lib/nav-config";
import type { SessionUser } from "@/components/shared/layout/session-user";

// TODO: implement — composes Sidebar + BottomTabBar for business/buyer/investor.
// See docs/DESIGN_SYSTEM.md, "RoleShell".
export function RoleShell(props: { items: NavItem[]; user: SessionUser; children: ReactNode }) {
  return props.children;
}
