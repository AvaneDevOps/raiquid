// TODO: implement. See docs/ROUTE_MAP.md for the source screen reference
// and docs/RAIQUID_CONTEXT.md for domain/business context.
"use client";

import { useState, useActionState } from "react";
import { useFormStatus } from "react-dom";
import { authenticate } from "./actions";
import { DEMO_ACCOUNTS } from "@/lib/demo-accounts";
import { LandingHeader } from "@/components/shared/layout";
import { Button, Input, InlineNotice } from "@/components/shared/ui";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

// Verified against docs/screens/mobile/02-auth.png (Business role state):
// segmented Sign up / Log in tab (Sign up active by default), a
// "Continuing as" role picker (Business/Investor/Buyer — no Admin, which
// tracks: admin isn't self-serve), Full name + role-specific second field +
// Email + Password, "Create account", and a sandbox-terms footer line.
//
// NOT verified: the Investor/Buyer field sets below — I only have the
// Business-selected export. "Country of residence" (investor) and
// "Company name" (buyer) are inferred from the Investor/Buyer shapes in
// domain.ts, not confirmed against an export. Swap these if the real
// Investor/Buyer states differ. Button/Input/InlineNotice prop names are
// still inferred from the DESIGN_SYSTEM.md component table, not from
// viewing their source.

type SignupRole = Extract<UserRole, "business" | "investor" | "buyer">;

const SIGNUP_ROLES: { role: SignupRole; label: string }[] = [
  { role: "business", label: "Business" },
  { role: "investor", label: "Investor" },
  { role: "buyer", label: "Buyer" },
];

const SECOND_FIELD: Record<SignupRole, { label: string; placeholder: string }> = {
  business: { label: "Business name", placeholder: "Kennedy Textiles & Supplies" },
  investor: { label: "Country of residence", placeholder: "e.g. United Kingdom" },
  buyer: { label: "Company name", placeholder: "e.g. Bakare Distribution Co." },
};

function LoginSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      variant="primary"
      size="lg"
      className="w-full hover:cursor-pointer"
      disabled={pending}
    >
      {pending ? "Signing in…" : "Sign in"}
    </Button>
  );
}

export default function AuthPage() {
  const [mode, setMode] = useState<"signup" | "login">("signup");
  const [signupRole, setSignupRole] = useState<SignupRole>("business");
  const [loginError, loginAction] = useActionState(authenticate, undefined);

  return (
    <>
      <LandingHeader />
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
        <motion.div
          layout
          className="border-border bg-surface w-full max-w-md rounded-xl border p-8"
        >
          {/* Sign up / Log in segmented tab with sliding pill */}
          <div className="bg-surface-raised relative flex rounded-lg p-1">
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={cn(
                "relative z-10 flex-1 cursor-pointer rounded-md py-2.5 text-sm font-semibold transition-colors duration-200",
                mode === "signup"
                  ? "text-accent-400"
                  : "hover:text-foreground text-muted-foreground",
              )}
            >
              {mode === "signup" && (
                <motion.span
                  layoutId="authTabPill"
                  className="bg-surface absolute inset-0 -z-10 rounded-md shadow-sm"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
              Sign up
            </button>
            <button
              type="button"
              onClick={() => setMode("login")}
              className={cn(
                "relative z-10 flex-1 cursor-pointer rounded-md py-2.5 text-sm font-semibold transition-colors duration-200",
                mode === "login"
                  ? "text-accent-400"
                  : "hover:text-foreground text-muted-foreground",
              )}
            >
              {mode === "login" && (
                <motion.span
                  layoutId="authTabPill"
                  className="bg-surface absolute inset-0 -z-10 rounded-md shadow-sm"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
              Log in
            </button>
          </div>

          <AnimatePresence mode="wait">
            {mode === "signup" ? (
              <motion.div
                key="signup"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="mt-6"
              >
                <p className="text-muted-foreground mb-2 text-sm">Continuing as</p>
                <motion.div layout className="flex gap-2">
                  {SIGNUP_ROLES.map(({ role, label }, i) => (
                    <motion.button
                      key={role}
                      type="button"
                      onClick={() => setSignupRole(role)}
                      whileTap={{ scale: 0.96 }}
                      whileHover={{ scale: 1.02 }}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.2 }}
                      className={cn(
                        "flex-1 cursor-pointer rounded-lg border px-3 py-2.5 text-sm font-semibold transition-colors",
                        signupRole === role
                          ? "border-accent-400 bg-accent-500 text-bg"
                          : "border-border text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {label}
                    </motion.button>
                  ))}
                </motion.div>

                {/* Disabled per product decision: no backend to persist real
              accounts yet — see README-AUTH-NAV.md. Fields match the
              export but the form doesn't submit. */}
                <form className="mt-6 space-y-4">
                  {[
                    { id: "fullName", label: "Full name", placeholder: "Kennedy Okonkwo" },
                    {
                      id: "secondField",
                      label: SECOND_FIELD[signupRole].label,
                      placeholder: SECOND_FIELD[signupRole].placeholder,
                    },
                    {
                      id: "signupEmail",
                      label: "Email address",
                      placeholder: "kennedy@okonkwotextiles.com",
                      type: "email",
                      name: "email",
                    },
                    {
                      id: "signupPassword",
                      label: "Password",
                      placeholder: "******************",
                      type: "password",
                      name: "password",
                    },
                  ].map((field, i) => (
                    <motion.div
                      key={field.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + i * 0.05, duration: 0.2 }}
                    >
                      <label htmlFor={field.id} className="text-foreground mb-1.5 block text-sm">
                        {field.label}
                      </label>
                      <Input
                        id={field.id}
                        name={field.name ?? field.id}
                        type={field.type ?? "text"}
                        placeholder={field.placeholder}
                        disabled
                      />
                    </motion.div>
                  ))}

                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35, duration: 0.2 }}
                  >
                    <Button type="submit" variant="primary" size="lg" className="w-full" disabled>
                      Create account
                    </Button>
                  </motion.div>
                </form>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <InlineNotice tone="info" className="mt-4">
                    Sandbox demo — account creation isn&apos;t wired up yet.{" "}
                    <button
                      type="button"
                      onClick={() => setMode("login")}
                      className="text-accent-400 font-medium hover:underline"
                    >
                      Use a demo account
                    </button>{" "}
                    instead.
                  </InlineNotice>
                </motion.div>

                <p className="text-muted-foreground mt-4 text-center text-xs">
                  By continuing you agree to Raiquid&apos;s sandbox terms.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="mt-6"
              >
                <form action={loginAction} className="space-y-4">
                  {[
                    {
                      id: "email",
                      label: "Email Address",
                      type: "email",
                      placeholder: "johnkennedy@gmail.com",
                      autoComplete: "email",
                    },
                    {
                      id: "password",
                      label: "Password",
                      type: "password",
                      placeholder: "******************",
                      autoComplete: "current-password",
                    },
                  ].map((field, i) => (
                    <motion.div
                      key={field.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06, duration: 0.2 }}
                    >
                      <label htmlFor={field.id} className="text-foreground mb-1.5 block text-sm">
                        {field.label}
                      </label>
                      <Input
                        id={field.id}
                        name={field.id}
                        type={field.type}
                        placeholder={field.placeholder}
                        required
                        autoComplete={field.autoComplete}
                      />
                    </motion.div>
                  ))}

                  <AnimatePresence>
                    {loginError ? (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto", x: [0, -4, 4, -4, 4, 0] }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <InlineNotice tone="danger">{loginError}</InlineNotice>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>

                  <motion.div whileTap={{ scale: 0.98 }}>
                    <LoginSubmitButton />
                  </motion.div>
                </form>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.25 }}
                  className="border-border mt-6 border-t pt-4"
                >
                  <p className="text-muted-foreground text-xs">Demo accounts (sandbox only):</p>
                  <ul className="text-muted-foreground mt-2 space-y-1 font-mono text-xs">
                    {DEMO_ACCOUNTS.map((account, i) => (
                      <motion.li
                        key={account.email}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + i * 0.05 }}
                      >
                        {account.role}: {account.email} / {account.password}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  );
}
