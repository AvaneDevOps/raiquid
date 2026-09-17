"use client";

import { useState, type FormEvent } from "react";
import { useSignIn } from "@clerk/nextjs";
import { RESEND_COOLDOWN_SECONDS } from "@/app/(shared)/auth/layout/constants";
import { useCoolDown } from "./use-cooldown";

export function useLoginFlow() {
  const { signIn } = useSignIn();

  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string>();
  // True when Clerk requires an email code to establish device trust
  // (signing in from a new browser). Flips the login view to code entry.
  const [needsCode, setNeedsCode] = useState(false);
  const [code, setCode] = useState("");
  const [resendPending, setResendPending] = useState(false);
  const resendCoolDown = useCoolDown(RESEND_COOLDOWN_SECONDS);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!signIn) return;

    setPending(true);
    setError(undefined);

    const data = new FormData(event.currentTarget);

    const { error: signInError } = await signIn.password({
      identifier: String(data.get("email") ?? ""),
      password: String(data.get("password") ?? ""),
    });

    if (signInError) {
      setError(signInError.longMessage ?? signInError.message);
      setPending(false);
      return;
    }

    if (signIn.status === "complete") {
      const { error: finalizeError } = await signIn.finalize();
      if (finalizeError) {
        setError(finalizeError.longMessage ?? finalizeError.message);
        setPending(false);
      }
      // On success the redirect effect in the page fires once useUser() sees the new session.
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
          setError(sendError.longMessage ?? sendError.message);
          setPending(false);
          return;
        }
        setNeedsCode(true);
        setPending(false);
        return;
      }
    }

    setError("This account needs an extra verification step that this form doesn't handle yet.");
    setPending(false);
  }

  async function handleVerifyLoginCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!signIn || code.length !== 6) return;

    setPending(true);
    setError(undefined);

    const { error: verifyError } = await signIn.mfa.verifyEmailCode({ code });

    if (verifyError) {
      setError(verifyError.longMessage ?? verifyError.message);
      setPending(false);
      return;
    }

    if (signIn.status !== "complete") {
      setError("That code didn't work. Double-check it, or request a new one.");
      setPending(false);
      return;
    }

    const { error: finalizeError } = await signIn.finalize();
    if (finalizeError) {
      setError(finalizeError.longMessage ?? finalizeError.message);
      setPending(false);
    }
    // Redirect happens via the existing effect in the page.
  }

  async function handleResendLoginCode() {
    if (!signIn || resendPending || resendCoolDown.remaining > 0) return;
    setResendPending(true);
    setError(undefined);
    const { error: sendError } = await signIn.mfa.sendEmailCode();
    setResendPending(false);
    if (sendError) {
      setError(sendError.longMessage ?? sendError.message);
      return;
    }
    resendCoolDown.start();
  }

  // Used on tab switches and "back to sign in" to drop the code-entry
  // step and any stale error.
  function reset() {
    setNeedsCode(false);
    setError(undefined);
  }

  return {
    signIn,
    pending,
    error,
    needsCode,
    code,
    setCode,
    resendPending,
    resendCoolDown,
    handleLogin,
    handleVerifyLoginCode,
    handleResendLoginCode,
    reset,
  };
}
