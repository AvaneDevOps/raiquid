import type { LucideIcon } from "lucide-react";
import type { UserRole } from "@/types";

/**
 * Single source of truth for role-based navigation — must drive both the
 * desktop sidebar and the mobile bottom-tab bar so the two breakpoints
 * can't drift apart. TODO: fill in per docs/ROUTE_MAP.md.
 */
export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const ROLE_NAV: Record<Exclude<UserRole, "admin">, NavItem[]> = {
  business: [],
  buyer: [],
  investor: [],
};

export const ADMIN_NAV: NavItem[] = [];

export const MARKETING_NAV: { label: string; href: string }[] = [];
