"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
// Direct path, not the shared/layout barrel: that barrel also re-exports
// session-user.tsx, which imports @clerk/nextjs/server (marked
// server-only) — pulling it into this Client Component's bundle breaks
// the build. See the barrel's own file for the full export list.
import { LandingHeader } from "@/components/shared/layout/landing-header";
import { ROLE_HOME } from "@/lib/role-home";
import { isUserRole } from "@/lib/user-role";

import { useSignupFlow } from "../auth/cooldown/hooks/use-signup-flows";
import { useLoginFlow } from "../auth/cooldown/hooks/use-login-flow";
import { AuthTabs } from "./components/auth-tabs";
import { SignupForm } from "./components/signup-form";
import { LoginForm } from "./components/login-form";
import { LoginVerifyView } from "./components/login-verify-view";
import { CheckEmailView } from "./components/check-email-view";
import { EditEmailView } from "./components/edit-email-view";
import { FinalizingSignupView } from "./components/finalizing-signup-view";

// Verified against docs/screens/mobile/02-auth.png (Business role state):
// segmented Sign up / Log in tab (Sign up active by default), a
// "Continuing as" role picker (Business/Investor/Buyer — no Admin, which
// tracks: admin isn't self-serve), Full name + role-specific second field +
// Email + Password, "Create account", and a sandbox-terms footer line.
// The email-verification step below has no screen export to match against
// — styled to fit the same card, not to any specific screen.
//
// NOT verified: the Investor/Buyer field sets below — I only have the
// Business-selected export. "Country of residence" (investor) and
// "Company name" (buyer) are inferred from the Investor/Buyer shapes in
// domain.ts, not confirmed against an export.
//
// The second field's value (business name / country of residence / company
// name) is stored in Clerk unsafeMetadata as `subtitle` and surfaced under
// the user's name on mobile — see getSessionUser() in session-user.tsx.
// There's still no backend profile endpoint to refresh it from; see
// docs/COMPLIANCE_AUDIT.md.

export default function AuthPage() {
  const router = useRouter();
  const { isSignedIn, user } = useUser();

  const [mode, setMode] = useState<"signup" | "login">("signup");

  const signup = useSignupFlow();
  const login = useLoginFlow();

  const view: "signup" | "login" | "verify-email" =
    signup.needsEmailVerification || signup.finalizing ? "verify-email" : mode;

  // Shared by both flows: once finalize() actually activates a session,
  // useUser() reflects it — redirect to that role's home from one place
  // rather than duplicating the redirect after both signUp and signIn.
  useEffect(() => {
    if (!isSignedIn || !user) return;
    const role = user.unsafeMetadata.role;
    router.replace(isUserRole(role) ? ROLE_HOME[role] : "/");
  }, [isSignedIn, user, router]);

  // Tab switches must also reset the login code-step state, otherwise
  // loginNeedsCode / stale errors linger when the user comes back.
  function switchMode(next: "signup" | "login") {
    setMode(next);
    login.reset();
    signup.reset();
  }

  return (
    <>
      <LandingHeader />
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
        <motion.div
          layout
          className="border-border bg-surface w-full max-w-md rounded-xl border p-8"
        >
          {view !== "verify-email" && <AuthTabs mode={mode} onSwitch={switchMode} />}

          <AnimatePresence mode="wait">
            {view === "signup" ? (
              <motion.div
                key="signup"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="mt-6"
              >
                <SignupForm
                  role={signup.role}
                  onRoleChange={signup.setRole}
                  onSubmit={signup.handleSignup}
                  pending={signup.pending}
                  error={signup.error}
                  canSubmit={!!signup.signUp}
                />
              </motion.div>
            ) : view === "verify-email" ? (
              <motion.div
                key="verify-email"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="mt-6"
              >
                {signup.finalizing ? (
                  <FinalizingSignupView />
                ) : signup.editingEmail ? (
                  <EditEmailView
                    defaultEmail={signup.signUp?.emailAddress ?? undefined}
                    pending={signup.pending}
                    error={signup.error}
                    onSubmit={signup.handleUpdateEmail}
                    onCancel={() => {
                      signup.setEditingEmail(false);
                      signup.setError(undefined);
                    }}
                  />
                ) : (
                  <CheckEmailView
                    email={signup.signUp?.emailAddress ?? undefined}
                    code={signup.code}
                    onCodeChange={signup.setCode}
                    onSubmit={signup.handleVerifyEmail}
                    pending={signup.pending}
                    error={signup.error}
                    onResend={signup.handleResendCode}
                    resendPending={signup.resendPending}
                    resendCooldown={signup.resendCoolDown.remaining}
                    onEditEmail={() => {
                      signup.setEditingEmail(true);
                      signup.setError(undefined);
                    }}
                  />
                )}
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
                {login.needsCode ? (
                  <LoginVerifyView
                    identifier={login.signIn?.identifier ?? undefined}
                    code={login.code}
                    onCodeChange={login.setCode}
                    onSubmit={login.handleVerifyLoginCode}
                    pending={login.pending}
                    error={login.error}
                    onResend={login.handleResendLoginCode}
                    resendPending={login.resendPending}
                    resendCooldown={login.resendCoolDown.remaining}
                    onBack={login.reset}
                  />
                ) : (
                  <LoginForm
                    onSubmit={login.handleLogin}
                    pending={login.pending}
                    error={login.error}
                    canSubmit={!!login.signIn}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  );
}
