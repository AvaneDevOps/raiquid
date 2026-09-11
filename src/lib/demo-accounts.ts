import type { Route } from "next";
import type { UserRole } from "@/types";

export interface RoleAccount {
  role: UserRole;
  name: string;
  subtitle: string;
  initials: string;
}

export const ROLE_HOME: Record<UserRole, Route> = {
  business: "/business/dashboard",
  buyer: "/buyer/dashboard",
  investor: "/investor/portfolio",
  admin: "/admin/overview",
};
