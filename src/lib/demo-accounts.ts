import type { UserRole } from "@/types";
import type { Route } from "next";

export interface DemoAccount {
  email: string;
  password: string;
  role: UserRole;
  name: string;
  subtitle: string;
  initials: string;
}

export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    email: "business@raiquid.dev",
    password: "raiquid-demo",
    role: "business",
    name: "Adaeze Okonkwo",
    subtitle: "Okonkwo Textiles & Supplies",
    initials: "AO",
  },
  {
    email: "buyer@raiquid.dev",
    password: "raiquid-demo",
    role: "buyer",
    name: "Tunde Bakare",
    subtitle: "Bakare Distribution Co.",
    initials: "TB",
  },
  {
    email: "investor@raiquid.dev",
    password: "raiquid-demo",
    role: "investor",
    name: "Emeka Nwosu",
    subtitle: "Diaspora investor · London",
    initials: "EN",
  },
  {
    email: "admin@raiquid.dev",
    password: "raiquid-demo",
    role: "admin",
    name: "Raiquid Ops",
    subtitle: "Platform admin",
    initials: "RO",
  },
];

export const ROLE_HOME: Record<UserRole, Route> = {
  business: "/business/dashboard",
  buyer: "/buyer/dashboard",
  investor: "/investor/portfolio",
  admin: "/admin/overview",
};

export function findDemoAccount(email: string, password: string): DemoAccount | null {
  const account = DEMO_ACCOUNTS.find(
    (a) => a.email.toLowerCase() === email.toLowerCase() && a.password === password,
  );
  return account ?? null;
}
