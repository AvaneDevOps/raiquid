"use client";

import { useState, type FormEvent } from "react";
import { useSignUp } from "@clerk/nextjs";
import { splitName } from "../utils";
import { RESEND_COOLDOWN_SECONDS, type SignupRole } from "@/app/(shared)/auth/layout/constants";
import { useCoolDown } from "./use-cooldown";

export function useSignupFlow() {
  const { signUp } = useSignUp();

  const [role, setRole] = useState<SignupRole>("business");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string>();
  // True once verification has succeeded and finalize() is in flight —
  // keeps the "verify-email" view up so we don't flash back to the
  // signup form before the redirect effect fires.
  const [finalizing, setFinalizing] = useState(false);
  const [editingEmail, setEditingEmail] = useState(false);
  const [code, setCode] = useState("");
  const [resendPending, setResendPending] = useState(false);
  const resendCoolDown = useCoolDown(RESEND_COOLDOWN_SECONDS);

  // Reactive off the signUp signal, not separate state: true exactly when
  // create() left the attempt needing an email code and nothing else —
  // see docs/guides/development/custom-flows/authentication/email-password.
  const needsEmailVerification =
    !!signUp &&
    signUp.status === "missing_requirements" &&
    signUp.unverifiedFields.includes("email_address") &&
    signUp.missingFields.length === 0;

  async function handleSignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!signUp) return;

    setPending(true);
    setError(undefined);

    const data = new FormData(event.currentTarget);
    const { firstName, lastName } = splitName(String(data.get("fullName") ?? ""));
    const secondField = String(data.get("secondField") ?? "");

    // The role-specific second field (business name / country of residence /
    // company name) is the subtitle shown under the user's name on mobile —
    // persist it so getSessionUser() can read it back from Clerk metadata.
    const subtitle = role === "investor" ? `Diaspora Investor · ${secondField}` : secondField;

    const { error: createError } = await signUp.create({
      emailAddress: String(data.get("email") ?? ""),
      password: String(data.get("password") ?? ""),
      firstName,
      lastName,
      unsafeMetadata: { role, subtitle },
    });

    if (createError) {
      setError(createError.longMessage ?? createError.message);
      setPending(false);
      return;
    }

    if (signUp.status === "complete") {
      setFinalizing(true);
      const { error: finalizeError } = await signUp.finalize();
      if (finalizeError) {
        setError(finalizeError.longMessage ?? finalizeError.message);
        setPending(false);
        setFinalizing(false);
      }
      // On success the redirect effect in the page fires once useUser() sees the new session.
      return;
    }

    if (
      signUp.status === "missing_requirements" &&
      signUp.unverifiedFields.includes("email_address") &&
      signUp.missingFields.length === 0
    ) {
      const { error: sendError } = await signUp.verifications.sendEmailCode();
      if (sendError) {
        setError(sendError.longMessage ?? sendError.message);
      }
      // Either way, `needsEmailVerification` above now flips the view to
      // the code-entry step — nothing else to do here.
      setPending(false);
      return;
    }

    // A missing_requirements/abandoned case other than email verification
    // (e.g. a field this form doesn't collect). Don't fake success.
    setError(
      "Your account needs a step this form doesn't support yet. Contact support to finish setting it up.",
    );
    setPending(false);
  }

  async function handleVerifyEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!signUp || code.length !== 6) return;

    setPending(true);
    setError(undefined);

    const { error: verifyError } = await signUp.verifications.verifyEmailCode({ code });

    if (verifyError) {
      setError(verifyError.longMessage ?? verifyError.message);
      setPending(false);
      return;
    }

    if (signUp.status !== "complete") {
      setError(
        "That code didn't finish setting up your account. Double-check it, or request a new one.",
      );
      setPending(false);
      return;
    }

    setFinalizing(true);
    const { error: finalizeError } = await signUp.finalize();
    if (finalizeError) {
      setError(finalizeError.longMessage ?? finalizeError.message);
      setPending(false);
      setFinalizing(false);
    }
    // On success the redirect effect in the page fires once useUser() sees the new session.
  }

  async function handleResendCode() {
    if (!signUp || resendPending || resendCoolDown.remaining > 0) return;
    setResendPending(true);
    setError(undefined);
    const { error: sendError } = await signUp.verifications.sendEmailCode();
    setResendPending(false);
    if (sendError) {
      setError(sendError.longMessage ?? sendError.message);
      return;
    }
    resendCoolDown.start();
  }

  async function handleUpdateEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!signUp) return;

    setPending(true);
    setError(undefined);

    const data = new FormData(event.currentTarget);
    const newEmail = String(data.get("newEmail") ?? "");

    const { error: updateError } = await signUp.update({ emailAddress: newEmail });
    if (updateError) {
      setError(updateError.longMessage ?? updateError.message);
      setPending(false);
      return;
    }

    const { error: sendError } = await signUp.verifications.sendEmailCode();
    setPending(false);
    if (sendError) {
      setError(sendError.longMessage ?? sendError.message);
      return;
    }

    resendCoolDown.start();
    setEditingEmail(false);
  }

  // Used on tab switches to clear stale error/edit state without touching
  // anything Clerk-side.
  function reset() {
    setError(undefined);
    setEditingEmail(false);
  }

  return {
    signUp,
    role,
    setRole,
    pending,
    error,
    setError,
    finalizing,
    editingEmail,
    setEditingEmail,
    code,
    setCode,
    resendPending,
    resendCoolDown,
    needsEmailVerification,
    handleSignup,
    handleVerifyEmail,
    handleResendCode,
    handleUpdateEmail,
    reset,
  };
}
