"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useSignUp, useSignIn, useUser } from "@clerk/nextjs";
// Direct path, not the shared/layout barrel: that barrel also re-exports
// session-user.tsx, which imports @clerk/nextjs/server (marked
// server-only) — pulling it into this Client Component's bundle breaks
// the build. See the barrel's own file for the full export list.
import { LandingHeader } from "@/components/shared/layout/landing-header";
import { Button, Input, InlineNotice, PasswordInput } from "@/components/shared/ui";
import { cn } from "@/lib/utils";
import { ROLE_HOME } from "@/lib/role-home";
import { isUserRole } from "@/lib/user-role";
import type { UserRole } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

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

function splitName(fullName: string): { firstName: string; lastName?: string } {
  const [firstName, ...rest] = fullName.trim().split(/\s+/);
  return rest.length ? { firstName, lastName: rest.join(" ") } : { firstName };
}

const RESEND_COOLDOWN_SECONDS = 30;

function useCoolDown(seconds: number) {
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    if (remaining <= 0) return;
    const timer = setInterval(() => setRemaining((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(timer);
  }, [remaining]);

  return { remaining, start: () => setRemaining(seconds) };
}

export default function AuthPage() {
  const router = useRouter();
  const { isSignedIn, user } = useUser();
  const { signUp } = useSignUp();
  const { signIn } = useSignIn();

  const [mode, setMode] = useState<"signup" | "login">("signup");
  const [signupRole, setSignupRole] = useState<SignupRole>("business");
  const [signupPending, setSignupPending] = useState(false);
  const [signupError, setSignupError] = useState<string>();
  // True once verification has succeeded and finalize() is in flight —
  // keeps the "verify-email" view up so we don't flash back to the
  // signup form before the redirect effect fires.
  const [finalizingSignup, setFinalizingSignup] = useState(false);
  const [loginPending, setLoginPending] = useState(false);
  const [loginError, setLoginError] = useState<string>();
  // True when Clerk requires an email code to establish device trust
  // (signing in from a new browser). Flips the login view to code entry.
  const [loginNeedsCode, setLoginNeedsCode] = useState(false);
  const [resendPending, setResendPending] = useState(false);
  const signupResendCoolDown = useCoolDown(RESEND_COOLDOWN_SECONDS);
  const [loginResendPending, setLoginResendPending] = useState(false);
  const loginResendCoolDown = useCoolDown(RESEND_COOLDOWN_SECONDS);

  // Reactive off the signUp signal, not separate state: true exactly when
  // create() left the attempt needing an email code and nothing else —
  // see docs/guides/development/custom-flows/authentication/email-password.
  const needsEmailVerification =
    !!signUp &&
    signUp.status === "missing_requirements" &&
    signUp.unverifiedFields.includes("email_address") &&
    signUp.missingFields.length === 0;

  const view: "signup" | "login" | "verify-email" =
    needsEmailVerification || finalizingSignup ? "verify-email" : mode;

  // Shared by both flows: once finalize() actually activates a session,
  // useUser() reflects it — redirect to that role's home from one place
  // rather than duplicating the redirect after both signUp and signIn.
  useEffect(() => {
    if (!isSignedIn || !user) return;
    const role = user.unsafeMetadata.role;
    router.replace(isUserRole(role) ? ROLE_HOME[role] : "/");
  }, [isSignedIn, user, router]);

  async function handleSignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!signUp) return;

    setSignupPending(true);
    setSignupError(undefined);

    const data = new FormData(event.currentTarget);
    const { firstName, lastName } = splitName(String(data.get("fullName") ?? ""));
    const secondField = String(data.get("secondField") ?? "");

    // The role-specific second field (business name / country of residence /
    // company name) is the subtitle shown under the user's name on mobile —
    // persist it so getSessionUser() can read it back from Clerk metadata.
    const subtitle = signupRole === "investor" ? `Diaspora Investor · ${secondField}` : secondField;

    const { error } = await signUp.create({
      emailAddress: String(data.get("email") ?? ""),
      password: String(data.get("password") ?? ""),
      firstName,
      lastName,
      unsafeMetadata: { role: signupRole, subtitle },
    });

    if (error) {
      setSignupError(error.longMessage ?? error.message);
      setSignupPending(false);
      return;
    }

    if (signUp.status === "complete") {
      setFinalizingSignup(true);
      const { error: finalizeError } = await signUp.finalize();
      if (finalizeError) {
        setSignupError(finalizeError.longMessage ?? finalizeError.message);
        setSignupPending(false);
        setFinalizingSignup(false);
      }
      // On success the useEffect above redirects once useUser() sees the new session.
      return;
    }

    if (
      signUp.status === "missing_requirements" &&
      signUp.unverifiedFields.includes("email_address") &&
      signUp.missingFields.length === 0
    ) {
      const { error: sendError } = await signUp.verifications.sendEmailCode();
      if (sendError) {
        setSignupError(sendError.longMessage ?? sendError.message);
      }
      // Either way, `needsEmailVerification` above now flips the view to
      // the code-entry step — nothing else to do here.
      setSignupPending(false);
      return;
    }

    // A missing_requirements/abandoned case other than email verification
    // (e.g. a field this form doesn't collect). Don't fake success.
    setSignupError(
      "Your account needs a step this form doesn't support yet. Contact support to finish setting it up.",
    );
    setSignupPending(false);
  }

  async function handleVerifyEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!signUp) return;

    setSignupPending(true);
    setSignupError(undefined);

    const data = new FormData(event.currentTarget);
    const { error } = await signUp.verifications.verifyEmailCode({
      code: String(data.get("code") ?? ""),
    });

    if (error) {
      setSignupError(error.longMessage ?? error.message);
      setSignupPending(false);
      return;
    }

    if (signUp.status !== "complete") {
      setSignupError(
        "That code didn't finish setting up your account. Double-check it, or request a new one.",
      );
      setSignupPending(false);
      return;
    }

    setFinalizingSignup(true);
    const { error: finalizeError } = await signUp.finalize();
    if (finalizeError) {
      setSignupError(finalizeError.longMessage ?? finalizeError.message);
      setSignupPending(false);
      setFinalizingSignup(false);
    }
    // On success the useEffect above redirects once useUser() sees the new session.
  }

  async function handleResendCode() {
    if (!signUp) return;
    setSignupError(undefined);
    const { error } = await signUp.verifications.sendEmailCode();
    if (error) setSignupError(error.longMessage ?? error.message);
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!signIn) return;

    setLoginPending(true);
    setLoginError(undefined);

    const data = new FormData(event.currentTarget);

    const { error } = await signIn.password({
      identifier: String(data.get("email") ?? ""),
      password: String(data.get("password") ?? ""),
    });

    if (error) {
      setLoginError(error.longMessage ?? error.message);
      setLoginPending(false);
      return;
    }

    if (signIn.status === "complete") {
      const { error: finalizeError } = await signIn.finalize();
      if (finalizeError) {
        setLoginError(finalizeError.longMessage ?? finalizeError.message);
        setLoginPending(false);
      }
      // On success the useEffect above redirects once useUser() sees the new session.
      return;
    }

    // New device: Clerk requires an email code to establish device trust,
    // even when MFA is disabled. Handle it instead of erroring out.
    if (signIn.status === "needs_client_trust") {
      const emailCodeFactor = signIn.supportedSecondFactors?.find(
        (factor: { strategy: string }) => factor.strategy === "email_code",
      );
      if (emailCodeFactor) {
        const { error: sendError } = await signIn.mfa.sendEmailCode();
        if (sendError) {
          setLoginError(sendError.longMessage ?? sendError.message);
          setLoginPending(false);
          return;
        }
        setLoginNeedsCode(true);
        setLoginPending(false);
        return;
      }
    }

    setLoginError(
      "This account needs an extra verification step that this form doesn't handle yet.",
    );
    setLoginPending(false);
  }

  async function handleVerifyLoginCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!signIn) return;

    setLoginPending(true);
    setLoginError(undefined);

    const data = new FormData(event.currentTarget);
    const { error } = await signIn.mfa.verifyEmailCode({
      code: String(data.get("code") ?? ""),
    });

    if (error) {
      setLoginError(error.longMessage ?? error.message);
      setLoginPending(false);
      return;
    }

    if (signIn.status !== "complete") {
      setLoginError("That code didn't work. Double-check it, or request a new one.");
      setLoginPending(false);
      return;
    }

    const { error: finalizeError } = await signIn.finalize();
    if (finalizeError) {
      setLoginError(finalizeError.longMessage ?? finalizeError.message);
      setLoginPending(false);
    }
    // Redirect happens via the existing useEffect.
  }

  async function handleResendLoginCode() {
    if (!signIn) return;
    setLoginError(undefined);
    const { error } = await signIn.mfa.sendEmailCode();
    if (error) setLoginError(error.longMessage ?? error.message);
  }

  // Tab switches must also reset the login code-step state, otherwise
  // loginNeedsCode / stale errors linger when the user comes back.
  function switchMode(next: "signup" | "login") {
    setMode(next);
    setLoginNeedsCode(false);
    setLoginError(undefined);
    setSignupError(undefined);
  }

  return (
    <>
      <LandingHeader />
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
        <motion.div
          layout
          className="border-border bg-surface w-full max-w-md rounded-xl border p-8"
        >
          {view !== "verify-email" && (
            // Sign up / Log in segmented tab with sliding pill
            <div className="bg-surface-raised relative flex rounded-lg p-1">
              <button
                type="button"
                onClick={() => switchMode("signup")}
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
                onClick={() => switchMode("login")}
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
          )}

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

                <form className="mt-6 space-y-4" onSubmit={handleSignup}>
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
                      {field.type === "password" ? (
                        <PasswordInput
                          id={field.id}
                          name={field.name}
                          placeholder={field.placeholder}
                          required
                          autoComplete={field.autoComplete}
                        />
                      ) : (
                        <Input
                          id={field.id}
                          name={field.name ?? field.id}
                          type={field.type ?? "text"}
                          placeholder={field.placeholder}
                          required={field.id !== "secondField"}
                          autoComplete={field.autoComplete}
                        />
                      )}
                    </motion.div>
                  ))}

                  <AnimatePresence>
                    {signupError ? (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
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
                  >
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      className="w-full"
                      disabled={signupPending || !signUp}
                    >
                      {signupPending ? "Creating account…" : "Create account"}
                    </Button>
                  </motion.div>

                  {/* Clerk's bot sign-up protection widget. Must exist in the
                      DOM before signUp.create() is called — normally invisible,
                      only shows a challenge for traffic Clerk flags as risky. */}
                  <div id="clerk-captcha" data-cl-theme="dark" data-cl-size="flexible" />
                </form>

                <p className="text-muted-foreground mt-4 text-center text-xs">
                  By continuing you agree to Raiquid&apos;s sandbox terms.
                </p>
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
                {finalizingSignup ? (
                  <div className="py-6 text-center">
                    <p className="text-foreground text-lg font-semibold">Setting up your account</p>
                    <p className="text-muted-foreground mt-1.5 text-sm">
                      This will just take a moment...
                    </p>
                  </div>
                ) : (
                  <>
                    <p className="text-foreground text-lg font-semibold">Check your email</p>
                    <p className="text-muted-foreground mt-1.5 text-sm">
                      We sent a code to{" "}
                      <span className="text-foreground">{signUp?.emailAddress}</span>. Enter it
                      below to finish creating your account.
                    </p>

                    <form className="mt-6 space-y-4" onSubmit={handleVerifyEmail}>
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                        <label htmlFor="code" className="text-foreground mb-1.5 block text-sm">
                          Verification code
                        </label>
                        <Input
                          id="code"
                          name="code"
                          type="text"
                          inputMode="numeric"
                          autoComplete="one-time-code"
                          placeholder="123456"
                          required
                        />
                      </motion.div>

                      <AnimatePresence>
                        {signupError ? (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <InlineNotice tone="danger">{signupError}</InlineNotice>
                          </motion.div>
                        ) : null}
                      </AnimatePresence>

                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                        <Button
                          type="submit"
                          variant="primary"
                          size="lg"
                          className="w-full"
                          disabled={signupPending}
                        >
                          {signupPending ? "Verifying…" : "Verify email"}
                        </Button>
                      </motion.div>
                    </form>

                    <button
                      type="button"
                      onClick={handleResendCode}
                      className="text-accent-400 mt-4 block text-center text-xs hover:underline"
                    >
                      I didn&apos;t get a code — send it again
                    </button>
                  </>
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
                {loginNeedsCode ? (
                  <>
                    <p className="text-foreground text-lg font-semibold">Verify it&apos;s you</p>
                    <p className="text-muted-foreground mt-1.5 text-sm">
                      We sent a code to your email to confirm this new device. Enter it below to
                      finish signing in.
                    </p>

                    <form className="mt-6 space-y-4" onSubmit={handleVerifyLoginCode}>
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                        <label htmlFor="loginCode" className="text-foreground mb-1.5 block text-sm">
                          Verification code
                        </label>
                        <Input
                          id="loginCode"
                          name="code"
                          type="text"
                          inputMode="numeric"
                          autoComplete="one-time-code"
                          placeholder="123456"
                          required
                        />
                      </motion.div>

                      <AnimatePresence>
                        {loginError ? (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <InlineNotice tone="danger">{loginError}</InlineNotice>
                          </motion.div>
                        ) : null}
                      </AnimatePresence>

                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                        <Button
                          type="submit"
                          variant="primary"
                          size="lg"
                          className="w-full"
                          disabled={loginPending || !signIn}
                        >
                          {loginPending ? "Verifying…" : "Verify and sign in"}
                        </Button>
                      </motion.div>
                    </form>

                    <button
                      type="button"
                      onClick={handleResendLoginCode}
                      className="text-accent-400 mt-4 block text-center text-xs hover:underline"
                    >
                      I didn&apos;t get a code — send it again
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setLoginNeedsCode(false);
                        setLoginError(undefined);
                      }}
                      className="text-muted-foreground hover:text-foreground mt-3 block w-full text-center text-xs"
                    >
                      Back to sign in
                    </button>
                  </>
                ) : (
                  <form className="space-y-4" onSubmit={handleLogin}>
                    {[
                      {
                        id: "email",
                        label: "Email Address",
                        type: "email",
                        name: "email",
                        placeholder: "johnkennedy@gmail.com",
                        autoComplete: "email",
                      },
                      {
                        id: "password",
                        label: "Password",
                        type: "password",
                        name: "password",
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
                        {field.type === "password" ? (
                          <PasswordInput
                            id={field.id}
                            name={field.name}
                            placeholder={field.placeholder}
                            required
                            autoComplete={field.autoComplete}
                          />
                        ) : (
                          <Input
                            id={field.id}
                            name={field.id}
                            type={field.type}
                            placeholder={field.placeholder}
                            required
                            autoComplete={field.autoComplete}
                          />
                        )}
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
                        disabled={loginPending || !signIn}
                      >
                        {loginPending ? "Signing in…" : "Sign in"}
                      </Button>
                    </motion.div>
                  </form>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  );
}
