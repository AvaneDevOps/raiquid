import { type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button, InlineNotice, OTPInput } from "@/components/shared/ui";

export function CheckEmailView({
  email,
  code,
  onCodeChange,
  onSubmit,
  pending,
  error,
  onResend,
  resendPending,
  resendCooldown,
  onEditEmail,
}: {
  email?: string;
  code: string;
  onCodeChange: (code: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  pending: boolean;
  error?: string;
  onResend: () => void;
  resendPending: boolean;
  resendCooldown: number;
  onEditEmail: () => void;
}) {
  return (
    <>
      <p className="text-foreground text-lg font-semibold">Check your email</p>
      <p className="text-muted-foreground mt-1.5 text-sm">
        We sent a code to <span className="text-foreground">{email}</span>. Enter it below to finish
        creating your account.
      </p>

      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <label htmlFor="code" className="text-foreground mb-1.5 block text-sm">
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
            {pending ? "Verifying…" : "Verify email"}
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
        onClick={onEditEmail}
        className="text-muted-foreground hover:text-foreground mt-2 block w-full text-center text-xs"
      >
        Wrong email? Fix it
      </button>
    </>
  );
}
