import type { Route } from "next";
import type { UserRole } from "@/types";

// The nav in the exports is text-only — no icons in the sidebar or the
// admin tab row, and the mobile bottom bar uses a small dot per item.
export interface NavItem {
  label: string;
  href: Route;
}

// Order and labels from the nav rails on screens 04 (business), 15
// (buyer), 18 (investor), 26 (admin); landing links from screen 01.
export const ROLE_NAV: Record<Exclude<UserRole, "admin">, NavItem[]> = {
  business: [
    { label: "Dashboard", href: "/business/dashboard" },
    { label: "Invoices", href: "/business/invoices" },
    { label: "Wallet", href: "/business/wallet" },
    { label: "Settings", href: "/business/settings" },
  ],
  buyer: [
    { label: "Dashboard", href: "/buyer/dashboard" },
    { label: "Invoices to review", href: "/buyer/invoices" },
    { label: "Payment schedule", href: "/buyer/payment-schedule" },
    { label: "Settings", href: "/buyer/settings" },
  ],
  investor: [
    { label: "Portfolio", href: "/investor/portfolio" },
    { label: "Marketplace", href: "/investor/marketplace" },
    { label: "Whitelisting", href: "/investor/whitelisting" },
    { label: "Wallet", href: "/investor/wallet" },
    { label: "Settings", href: "/investor/settings" },
  ],
};

export const ADMIN_NAV: NavItem[] = [
  { label: "Overview", href: "/admin/overview" },
  { label: "Reserve pool", href: "/admin/reserve" },
  { label: "Provenance registry", href: "/admin/provenance" },
  { label: "Ledger", href: "/admin/ledger" },
  { label: "Whitelisting", href: "/admin/whitelisting" },
];

export const LANDING_NAV: { label: string; href: Route }[] = [
  { label: "How it works", href: "/#how-it-works" },
  { label: "For businesses", href: "/#for-businesses" },
  { label: "For investors", href: "/#for-investors" },
];
