/**
 * Seeded demo accounts for the Credentials auth provider.
 *
 * TEMPORARY: there is no backend/database yet (see docs/RAIQUID_CONTEXT.md,
 * "Open decisions"). This mirrors the same "typed fixture until a real data
 * source exists" pattern used by src/components/business/fixtures.ts. When a
 * real user store exists, replace findDemoAccount's lookup with a real query
 * and this file goes away — nothing outside src/auth.ts and the /auth page
 * should import it.
 *
 * DEV-ONLY: passwords are plaintext for demo simplicity. Do not carry this
 * comparison pattern past the sandbox — a real account store needs hashed
 * passwords (bcrypt/argon2) and a timing-safe comparison.
 */
import type { UserRole } from "@/types";
import { Route } from "next";

export interface DemoAccount {
  email: string;
  password: string;
  role: UserRole;
  name: string;
  subtitle: string;
  initials: string;
}

// One seeded account per role. Investor persona matches the diaspora
// investor sample named in docs/RAIQUID_CONTEXT.md ("Emeka Nwosu ·
// Diaspora investor · London").
export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    email: "business@raiquid.dev",
    password: "raiquid-demo",
    role: "business",
    name: "Adaeze Okafor",
    subtitle: "Lagos Textiles Ltd.",
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
