import type { Route } from "next";
import type { UserRole } from "@/types";
import {
  type LucideIcon,
  LayoutDashboard,
  FileText,
  Wallet,
  Settings,
  CalendarDays,
  Briefcase,
  ShoppingBasket,
  Shield,
} from "lucide-react";

// Each ROLE_NAV item carries an icon so the desktop sidebar and the mobile
// bottom-tab bar share one source of truth — no icon map duplicated between
// the two. The admin tab row is intentionally text-only; ADMIN_NAV below
// omits `icon`, so the field is optional.
export interface NavItem {
  label: string;
  href: Route;
  icon?: LucideIcon;
}

// Order and labels from the nav rails on screens 04 (business), 15
// (buyer), 18 (investor), 26 (admin); landing links from screen 01.
export const ROLE_NAV: Record<Exclude<UserRole, "admin">, NavItem[]> = {
  business: [
    { label: "Dashboard", href: "/business/dashboard", icon: LayoutDashboard },
    { label: "Invoices", href: "/business/invoices", icon: FileText },
    { label: "Wallet", href: "/business/wallet", icon: Wallet },
    { label: "Settings", href: "/business/settings", icon: Settings },
  ],
  buyer: [
    { label: "Dashboard", href: "/buyer/dashboard", icon: LayoutDashboard },
    { label: "Invoices to review", href: "/buyer/invoices", icon: FileText },
    { label: "Payment schedule", href: "/buyer/payment-schedule", icon: CalendarDays },
    { label: "Settings", href: "/buyer/settings", icon: Settings },
  ],
  investor: [
    { label: "Portfolio", href: "/investor/portfolio", icon: Briefcase },
    { label: "Marketplace", href: "/investor/marketplace", icon: ShoppingBasket },
    { label: "Whitelisting", href: "/investor/whitelisting", icon: Shield },
    { label: "Wallet", href: "/investor/wallet", icon: Wallet },
    { label: "Settings", href: "/investor/settings", icon: Settings },
  ],
};

export const ADMIN_NAV: NavItem[] = [
  { label: "Overview", href: "/admin/overview" },
  { label: "Reserve pool", href: "/admin/reserve" },
  { label: "Provenance registry", href: "/admin/provenance" },
  { label: "Ledger", href: "/admin/ledger" },
];

export const LANDING_NAV: { label: string; href: Route }[] = [
  { label: "How it works", href: "/#how-it-works" },
  { label: "For businesses", href: "/#for-businesses" },
  { label: "For investors", href: "/#for-investors" },
];
