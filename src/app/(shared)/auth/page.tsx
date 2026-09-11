"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useSignUp, useSignIn } from "@clerk/nextjs/legacy";
import { LandingHeader } from "@/components/shared/layout";
import { Button, Input, InlineNotice } from "@/components/shared/ui";
import { cn } from "@/lib/utils";
import { ROLE_HOME } from "@/lib/demo-accounts";
import type { UserRole } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

// Screen 02-auth (docs/screens/mobile/02-auth.png, Business role state):
// segmented Sign up / Log in tab (Sign up active by default), a
// "Continuing as" role picker (Business/Investor/Buyer — no Admin, which
// tracks: admin isn't self-serve), Full name + role-specific second field +
// Email + Password, "Create account", and a sandbox-terms footer line.
// Auth provider is Clerk: sign-up stores `role` (+ display subtitle) in
// unsafeMetadata, then /auth/complete-role promotes it to publicMetadata
// server-side so getSessionUser() can route-guard by role.

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

function clerkErrorMessage(error: unknown, fallback: string): string {
  if (typeof error === "object" && error !== null && "errors" in error) {
    const errors = (error as { errors?: { longMessage?: string; message?: string }[] }).errors;
    const first = errors?.[0];
    if (first?.longMessage) return first.longMessage;
    if (first?.message) return first.message;
  }
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

export default function AuthPage() {
  const router = useRouter();
  const { isLoaded: signUpLoaded, signUp, setActive: setSignUpActive } = useSignUp();
  const { isLoaded: signInLoaded, signIn, setActive: setSignInActive } = useSignIn();
  const [mode, setMode] = useState<"signup" | "login">("signup");
  const [signupRole, setSignupRole] = useState<SignupRole>("business");
  const [signupError, setSignupError] = useState<string | undefined>();
  const [signupPending, setSignupPending] = useState(false);
  const [loginError, setLoginError] = useState<string | undefined>();
  const [loginPending, setLoginPending] = useState(false);

  async function handleSignUp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!signUpLoaded || !signUp) {
      setSignupError("Secure sign-up is still loading. Wait a moment, then try again.");
      return;
    }
    setSignupError(undefined);
    setSignupPending(true);

    const formData = new FormData(event.currentTarget);
    const fullName = String(formData.get("fullName") ?? "").trim();
    const secondField = String(formData.get("secondField") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    if (!fullName || !email || !password) {
      setSignupError("Enter your name, email, and password.");
      setSignupPending(false);
      return;
    }

    try {
      const [firstName, ...rest] = fullName.split(" ").filter(Boolean);
      const result = await signUp.create({
        firstName: firstName ?? fullName,
        lastName: rest.length > 0 ? rest.join(" ") : undefined,
        emailAddress: email,
        password,
        unsafeMetadata: { role: signupRole, subtitle: secondField },
      });

      if (result.status === "complete") {
        if (!result.createdSessionId) {
          setSignupError("Account created — please sign in to continue.");
          setSignupPending(false);
          return;
        }
        await setSignUpActive({ session: result.createdSessionId });
        const response = await fetch("/auth/complete-role", { method: "POST" });
        if (!response.ok) {
          setSignupError("Account created, but saving your role failed. Try signing in.");
          setSignupPending(false);
          return;
        }
        router.push(ROLE_HOME[signupRole]);
        router.refresh();
        return;
      }

      // Email verification required — trigger the code email, then hand off
      // to the verify page. prepare is best-effort: even if it throws (e.g.
      // already prepared), the verify page offers a resend, so still route.
      try {
        await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      } catch (prepareError) {
        console.error("prepareEmailAddressVerification failed:", prepareError);
      }
      setSignupPending(false);
      router.push(`/auth/verify-email?email=${encodeURIComponent(email)}`);
    } catch (error) {
      console.error("signUp.create failed:", error);
      setSignupError(clerkErrorMessage(error, "Could not create your account."));
      setSignupPending(false);
    }
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!signInLoaded || !signIn) {
      setLoginError("Secure sign-in is still loading. Wait a moment, then try again.");
      return;
    }
    setLoginError(undefined);
    setLoginPending(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    if (!email || !password) {
      setLoginError("Enter an email and password.");
      setLoginPending(false);
      return;
    }

    try {
      const result = await signIn.create({ identifier: email, password });

      if (result.status === "complete") {
        if (!result.createdSessionId) {
          setLoginError("Signed in — please continue to your workspace.");
          setLoginPending(false);
          router.push("/post-auth");
          router.refresh();
          return;
        }
        await setSignInActive({ session: result.createdSessionId });
        router.push("/post-auth");
        router.refresh();
        return;
      }

      // MFA / verification needed — hand off to Clerk's factor page.
      router.push("/auth/verify-factor");
    } catch (error) {
      console.error("signIn.create failed:", error);
      setLoginError(clerkErrorMessage(error, "Incorrect email or password."));
      setLoginPending(false);
    }
  }

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

                <form onSubmit={handleSignUp} className="mt-6 space-y-4">
                  {[
                    {
                      id: "fullName",
                      label: "Full name",
                      placeholder: "Kennedy Okonkwo",
                      autoComplete: "name",
                    },
                    {
                      id: "secondField",
                      label: SECOND_FIELD[signupRole].label,
                      placeholder: SECOND_FIELD[signupRole].placeholder,
                      autoComplete: "organization",
                    },
                    {
                      id: "signupEmail",
                      label: "Email address",
                      placeholder: "kennedy@okonkwotextiles.com",
                      type: "email",
                      name: "email",
                      autoComplete: "email",
                    },
                    {
                      id: "signupPassword",
                      label: "Password",
                      placeholder: "******************",
                      type: "password",
                      name: "password",
                      autoComplete: "new-password",
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
                        required
                        autoComplete={field.autoComplete}
                      />
                    </motion.div>
                  ))}

                  <AnimatePresence>
                    {signupError ? (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto", x: [0, -4, 4, -4, 4, 0] }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <InlineNotice tone="danger">{signupError}</InlineNotice>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>

                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35, duration: 0.2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      className="w-full hover:cursor-pointer"
                      disabled={signupPending}
                    >
                      {signupPending ? "Creating account…" : "Create account"}
                    </Button>
                  </motion.div>
                </form>

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
                <form onSubmit={handleLogin} className="space-y-4">
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
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      className="w-full hover:cursor-pointer"
                      disabled={loginPending}
                    >
                      {loginPending ? "Signing in…" : "Sign in"}
                    </Button>
                  </motion.div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  );
}
