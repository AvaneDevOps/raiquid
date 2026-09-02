import type { Route } from "next";
import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  FileText,
  Wallet,
  Settings,
  ClipboardCheck,
  CalendarClock,
  Briefcase,
  Store,
  ShieldCheck,
  Landmark,
  ScrollText,
} from "lucide-react";
import type { UserRole } from "@/types";

/**
 * Single source of truth for role-based navigation. Drives BOTH the
 * desktop <Sidebar> and the mobile <BottomTabBar> (and the admin
 * top-tab row) so the breakpoints can't drift apart — add or reorder
 * items here, never in a component.
 *
 * Item order and labels are taken from the nav rails on screens 04
 * (business), 15 (buyer), 18 (investor) and 26 (admin); the landing
 * links from screen 01.
 */
export interface NavItem {
  label: string;
  href: Route;
  icon: LucideIcon;
}

export const ROLE_NAV: Record<Exclude<UserRole, "admin">, NavItem[]> = {
  business: [
    { label: "Dashboard", href: "/business/dashboard", icon: LayoutDashboard },
    { label: "Invoices", href: "/business/invoices", icon: FileText },
    { label: "Wallet", href: "/business/wallet", icon: Wallet },
    { label: "Settings", href: "/business/settings", icon: Settings },
  ],
  buyer: [
    { label: "Dashboard", href: "/buyer/dashboard", icon: LayoutDashboard },
    { label: "Invoices to review", href: "/buyer/invoices", icon: ClipboardCheck },
    { label: "Payment schedule", href: "/buyer/payment-schedule", icon: CalendarClock },
    { label: "Settings", href: "/buyer/settings", icon: Settings },
  ],
  investor: [
    { label: "Portfolio", href: "/investor/portfolio", icon: Briefcase },
    { label: "Marketplace", href: "/investor/marketplace", icon: Store },
    { label: "Whitelisting", href: "/investor/whitelisting", icon: ShieldCheck },
    { label: "Wallet", href: "/investor/wallet", icon: Wallet },
    { label: "Settings", href: "/investor/settings", icon: Settings },
  ],
};

export const ADMIN_NAV: NavItem[] = [
  { label: "Overview", href: "/admin/overview", icon: LayoutDashboard },
  { label: "Reserve pool", href: "/admin/reserve", icon: Landmark },
  { label: "Provenance registry", href: "/admin/provenance", icon: ShieldCheck },
  { label: "Ledger", href: "/admin/ledger", icon: ScrollText },
];

/** Header/footer links on the public (landing) pages (screen 01). */
export const LANDING_NAV: { label: string; href: Route }[] = [
  { label: "How it works", href: "/how-it-works" },
  { label: "For businesses", href: "/for-businesses" },
  { label: "For investors", href: "/for-investors" },
];
