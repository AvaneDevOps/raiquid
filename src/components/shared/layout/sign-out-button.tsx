"use client";

import { useState } from "react";
import { useClerk } from "@clerk/nextjs";
import { Button } from "@/components/shared/ui/button";
import { SquareArrowRightExit } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export function SignOutButton() {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { signOut } = useClerk();

  async function handleConfirmSignOut() {
    await signOut({ redirectUrl: "/auth" });
  }

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => setShowConfirmation(true)}
        className="text-muted-foreground hover:text-foreground shrink-0"
      >
        <SquareArrowRightExit strokeWidth={1.5} />
        Sign out
      </Button>

      <AnimatePresence>
        {showConfirmation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="bg-bg/75 fixed inset-0 z-50 flex items-center justify-center px-4 backdrop-blur-[2px]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="sign-out-title"
            aria-describedby="sign-out-description"
            onClick={() => setShowConfirmation(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              onClick={(event) => event.stopPropagation()}
              className="border-border-strong bg-surface-raised w-full max-w-md border shadow-2xl"
            >
              <div className="border-border border-b px-6 py-4">
                <div className="flex items-center gap-3">
                  <span className="seal-chip bg-danger-muted text-danger flex h-8 w-8 shrink-0 items-center justify-center">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="h-4 w-4"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v4m0 4h.01M10.3 3.8 2.7 18a2 2 0 0 0 1.7 3h15.2a2 2 0 0 0 1.7-3L13.7 3.8a2 2 0 0 0-3.4 0Z"
                      />
                    </svg>
                  </span>
                  <div>
                    <p className="text-danger font-mono text-[10px] tracking-[0.18em] uppercase">
                      Session action
                    </p>
                    <h2 id="sign-out-title" className="font-display text-foreground mt-0.5 text-lg">
                      Sign out of RAIQUID?
                    </h2>
                  </div>
                </div>
              </div>

              <div className="px-6 py-5">
                <p id="sign-out-description" className="text-muted-foreground text-sm leading-6">
                  You&apos;re about to sign out of your RAIQUID account. You&apos;ll need to sign in
                  again to access your workspace and account information.
                </p>
              </div>

              <div className="border-border flex items-center justify-end gap-3 border-t px-6 py-4">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowConfirmation(false)}
                >
                  Stay signed in
                </Button>
                <Button type="button" variant="danger" size="sm" onClick={handleConfirmSignOut}>
                  Sign out
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
