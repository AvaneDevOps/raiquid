"use client";

import { type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button, InlineNotice, OTPInput } from "@/components/shared/ui";

export function LoginVerifyView({
  identifier,
  code,
  onCodeChange,
  onSubmit,
  pending,
  error,
  onResend,
  resendPending,
  resendCooldown,
  onBack,
}: {
  identifier?: string;
  code: string;
  onCodeChange: (code: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  pending: boolean;
  error?: string;
  onResend: () => void;
  resendPending: boolean;
  resendCooldown: number;
  onBack: () => void;
}) {
  return (
    <>
      <p className="text-foreground text-lg font-semibold">Verify it&apos;s you</p>
      <p className="text-muted-foreground mt-1.5 text-sm">
        We sent a code to <span className="text-foreground">{identifier}</span> to confirm this new
        device. Enter it below to finish signing in.
      </p>

      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <label htmlFor="loginCode" className="text-foreground mb-1.5 block text-sm">
            Verification code
          </label>
          <OTPInput value={code} onChange={onCodeChange} />
        </motion.div>

        <AnimatePresence>
          {error ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <InlineNotice tone="danger">{error}</InlineNotice>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={pending || code.length !== 6}
          >
            {pending ? "Verifying…" : "Verify and sign in"}
          </Button>
        </motion.div>
      </form>

      <button
        type="button"
        onClick={onResend}
        disabled={resendPending || resendCooldown > 0}
        className="text-accent-400 disabled:text-muted-foreground mt-4 block w-full text-center text-xs hover:cursor-pointer hover:underline disabled:cursor-not-allowed disabled:no-underline"
      >
        {resendCooldown > 0
          ? `Resend available in ${resendCooldown}s`
          : resendPending
            ? "Sending..."
            : "Didn't get a code? — Resend code"}
      </button>

      <button
        type="button"
        onClick={onBack}
        className="text-muted-foreground hover:text-foreground mt-3 block w-full text-center text-xs hover:cursor-pointer"
      >
        Back to sign in
      </button>
    </>
  );
}
