"use client";

import { useState } from "react";
import { handleSignOut } from "@/app/(shared)/auth/actions";
import { SquareArrowRightExit } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Standalone sign-out control.
 *
 * This component provides a simple way to initiate the sign-out process.
 * It includes a confirmation dialog to prevent accidental sign-outs.
 *
 * is required. This can be placed in UserSummary, making it available
 * from both the Sidebar and BottomTabBar header, or on a role-specific
 * settings page—wherever it best fits the current layout.
 *
 * Not wired into UserSummary in this pass because that file was not
 * part of the changes. Its existing layout should determine the
 * appropriate placement rather than making assumptions here.
 */

export function SignOutButton() {
  const [showConfirmation, setShowConfirmation] = useState(false);

  async function handleConfirmSignOut() {
    await handleSignOut();
  }

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setShowConfirmation(true)}
        whileTap={{ scale: 0.96 }}
        className="w-fill seal-chip text-muted-foreground border-border-strong hover:border-danger hover:bg-surface-raised hover:text-foreground flex h-8 max-w-xs shrink-0 items-center justify-between gap-1 border px-1 text-xs whitespace-nowrap transition-colors hover:cursor-pointer"
      >
        <SquareArrowRightExit className="shrink-0" strokeWidth={1.5} size={17} />
        <span>Sign out</span>
      </motion.button>

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
              onClick={(e) => e.stopPropagation()}
              className="border-border-strong bg-surface-raised w-full max-w-md border shadow-2xl"
            >
              {/* Header accent */}
              <div className="border-border border-b px-6 py-4">
                <div className="flex items-center gap-3">
                  <motion.span
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 500, damping: 20 }}
                    className="seal-chip bg-danger-muted text-danger flex h-8 w-8 shrink-0 items-center justify-center"
                  >
                    <motion.svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="h-4 w-4"
                      aria-hidden="true"
                      animate={{ rotate: [0, -6, 6, -4, 4, 0] }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v4m0 4h.01M10.3 3.8 2.7 18a2 2 0 0 0 1.7 3h15.2a2 2 0 0 0 1.7-3L13.7 3.8a2 2 0 0 0-3.4 0Z"
                      />
                    </motion.svg>
                  </motion.span>

                  <motion.div
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.12, duration: 0.2 }}
                  >
                    <p className="text-danger font-mono text-[10px] tracking-[0.18em] uppercase">
                      Session action
                    </p>

                    <h2 id="sign-out-title" className="font-display text-foreground mt-0.5 text-lg">
                      Sign out of RAIQUID?
                    </h2>
                  </motion.div>
                </div>
              </div>

              {/* Body */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.18, duration: 0.2 }}
                className="px-6 py-5"
              >
                <p id="sign-out-description" className="text-muted-foreground text-sm leading-6">
                  You&apos;re about to sign out of your RAIQUID account. You&apos;ll need to sign in
                  again to access your workspace and account information.
                </p>
              </motion.div>

              {/* Actions */}
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.24, duration: 0.2 }}
                className="border-border flex items-center justify-end gap-3 border-t px-6 py-4"
              >
                <motion.button
                  type="button"
                  onClick={() => setShowConfirmation(false)}
                  whileTap={{ scale: 0.96 }}
                  className="text-muted-foreground hover:bg-surface hover:text-foreground px-4 py-2 text-xs font-medium transition-colors hover:cursor-pointer"
                >
                  Stay signed in
                </motion.button>

                <motion.button
                  type="button"
                  onClick={handleConfirmSignOut}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  className="seal-chip bg-danger text-bg hover:bg-danger/90 px-5 py-2 text-xs font-semibold transition-colors hover:cursor-pointer"
                >
                  Sign out
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
