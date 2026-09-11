import type { UserRole } from "@/types";

export const USER_ROLES: UserRole[] = ["business", "buyer", "investor", "admin"];

export function isUserRole(value: unknown): value is UserRole {
  return typeof value === "string" && USER_ROLES.includes(value as UserRole);
}
