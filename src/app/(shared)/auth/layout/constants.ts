import type { UserRole } from "@/types";

export type SignupRole = Extract<UserRole, "business" | "investor" | "buyer">;

export const SIGNUP_ROLES: { role: SignupRole; label: string }[] = [
  { role: "business", label: "Business" },
  { role: "investor", label: "Investor" },
  { role: "buyer", label: "Buyer" },
];

export const SECOND_FIELD: Record<SignupRole, { label: string; placeholder: string }> = {
  business: { label: "Business name", placeholder: "Kennedy Textiles & Supplies" },
  investor: { label: "Country of residence", placeholder: "e.g. United Kingdom" },
  buyer: { label: "Company name", placeholder: "e.g. Bakare Distribution Co." },
};

export const RESEND_COOLDOWN_SECONDS = 30;
