"use client";

import { Suspense, useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSignUp } from "@clerk/nextjs/legacy";
import { LandingHeader } from "@/components/shared/layout";
import { Button, Input, InlineNotice } from "@/components/shared/ui";
import { ROLE_HOME } from "@/lib/demo-accounts";
import type { UserRole } from "@/types";

const VALID_ROLES: UserRole[] = ["business", "buyer", "investor", "admin"];

function isUserRole(value: unknown): value is UserRole {
  return typeof value === "string" && (VALID_ROLES as string[]).includes(value);
}

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

/**
 * Completes a sign-up that required email verification: the user types the
 * 6-digit email code, we confirm it with
 * signUp.attemptEmailAddressVerification, then promote unsafeMetadata.role
 * to publicMetadata via /auth/complete-role and route to the role home.
 * Sign-ups that are already complete (email-link flow) auto-finish.
 */
function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoaded, signUp, setActive } = useSignUp();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [pending, setPending] = useState(false);
  const [resendPending, setResendPending] = useState(false);
  const [resendMessage, setResendMessage] = useState<string | undefined>();
  const autoCompleted = useRef(false);

  useEffect(() => {
    async function complete() {
      if (autoCompleted.current || !isLoaded || !signUp || signUp.status !== "complete") return;
      autoCompleted.current = true;
      try {
        await setActive({ session: signUp.createdSessionId });
        const role = signUp.unsafeMetadata?.role;
        await fetch("/auth/complete-role", { method: "POST" });
        router.push(isUserRole(role) ? ROLE_HOME[role] : "/post-auth");
        router.refresh();
      } catch (completeError) {
        autoCompleted.current = false;
        console.error("auto-complete signup failed:", completeError);
      }
    }
    void complete();
  }, [isLoaded, signUp, setActive, router]);

  async function handleVerify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isLoaded || !signUp) {
      setError("Verification is still loading. Wait a moment, then try again.");
      return;
    }
    const trimmed = code.trim();
    if (!trimmed) {
      setError("Enter the 6-digit code from your email.");
      return;
    }
    setError(undefined);
    setResendMessage(undefined);
    setPending(true);

    try {
      const attempt = await signUp.attemptEmailAddressVerification({ code: trimmed });

      if (attempt.status === "complete") {
        if (!attempt.createdSessionId) {
          router.push("/post-auth");
          router.refresh();
          return;
        }
        await setActive({ session: attempt.createdSessionId });
        const role = attempt.unsafeMetadata?.role;
        const response = await fetch("/auth/complete-role", { method: "POST" });
        if (response.ok && isUserRole(role)) {
          router.push(ROLE_HOME[role]);
        } else {
          router.push("/post-auth");
        }
        router.refresh();
        return;
      }

      setError("That code wasn't enough — check your email for the latest code and try again.");
      setPending(false);
    } catch (verifyError) {
      console.error("attemptEmailAddressVerification failed:", verifyError);
      setError(clerkErrorMessage(verifyError, "That code didn't work. Check it and try again."));
      setPending(false);
    }
  }

  async function handleResend() {
    if (!isLoaded || !signUp) {
      setError("Verification is still loading. Wait a moment, then try again.");
      return;
    }
    setError(undefined);
    setResendMessage(undefined);
    setResendPending(true);

    try {
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setResendMessage("A new code is on its way — check your inbox.");
    } catch (resendError) {
      console.error("resend verification code failed:", resendError);
      setError(clerkErrorMessage(resendError, "Could not resend the code. Try again."));
    } finally {
      setResendPending(false);
    }
  }

  const emailHint = searchParams.get("email") ?? signUp?.emailAddress ?? undefined;

  return (
    <>
      <LandingHeader />
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
        <div className="border-border bg-surface w-full max-w-md rounded-xl border p-8">
          <h1 className="font-display text-foreground text-xl font-semibold">Check your email</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            {emailHint
              ? `We sent a 6-digit code to ${emailHint}. Enter it below to finish creating your account.`
              : "We sent a 6-digit code to your email. Enter it below to finish creating your account."}
          </p>
          <form onSubmit={handleVerify} className="mt-6 space-y-4">
            <div>
              <label htmlFor="code" className="text-foreground mb-1.5 block text-sm">
                Verification code
              </label>
              <Input
                id="code"
                name="code"
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="123456"
                maxLength={6}
                required
                value={code}
                onChange={(event) => setCode(event.target.value)}
              />
            </div>
            {error ? <InlineNotice tone="danger">{error}</InlineNotice> : null}
            {resendMessage ? <InlineNotice tone="success">{resendMessage}</InlineNotice> : null}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full hover:cursor-pointer"
              disabled={pending}
            >
              {pending ? "Verifying…" : "Verify & continue"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="lg"
              className="w-full hover:cursor-pointer"
              onClick={handleResend}
              disabled={resendPending}
            >
              {resendPending ? "Sending…" : "Resend code"}
            </Button>
          </form>
          <Button
            type="button"
            variant="ghost"
            size="lg"
            className="mt-2 w-full hover:cursor-pointer"
            onClick={() => router.push("/auth")}
          >
            Back to sign in
          </Button>
        </div>
      </div>
    </>
  );
}

/**
 * useSearchParams() needs a Suspense boundary for static prerendering — it
 * only supplies the ?email= hint passed from /auth.
 */
export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <>
          <LandingHeader />
          <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
            <p className="text-muted-foreground text-sm">Loading verification…</p>
          </div>
        </>
      }
    >
      <VerifyEmailForm />
    </Suspense>
  );
}
