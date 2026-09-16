"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Settings, X } from "lucide-react";
import { ROLE_NAV } from "@/lib/nav-config";
import type { Route } from "next";
import type { SessionUser } from "@/components/shared/layout/session-user";
import { UserSummary } from "@/components/shared/layout/user-summary";
import { SignOutButton } from "@/components/shared/ui/sign-out-button";
import { Button } from "@/components/shared/ui/button";
import { cn } from "@/lib/utils";

function settingsHrefFor(user: SessionUser): Route {
  if (user.role === "admin") {
    return "/admin/overview";
  }
  const settingsItem = ROLE_NAV[user.role].find((item) =>
    item.label.toLowerCase().includes("setting"),
  );
  return settingsItem?.href ?? (`/${user.role}/settings` as Route);
}

export function UserAccountMenu({ user, className }: { user: SessionUser; className?: string }) {
  const [open, setOpen] = useState(false);
  const settingsHref = settingsHrefFor(user);

  useEffect(() => {
    if (!open) {
      return;
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={`Open account menu for ${user.name}`}
        onClick={() => setOpen(true)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setOpen(true);
          }
        }}
        className={cn(
          "focus-visible:ring-accent-400 min-w-0 cursor-pointer rounded-lg transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:outline-none",
          className,
        )}
      >
        <UserSummary user={user} className="pointer-events-none" />
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="bg-bg/75 fixed inset-0 z-50 flex items-center justify-center px-4 backdrop-blur-[2px]"
            role="dialog"
            aria-modal="true"
            aria-label={`Account menu for ${user.name}`}
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              onClick={(event) => event.stopPropagation()}
              className="border-border-strong bg-surface-raised w-full max-w-sm border shadow-2xl"
            >
              <div className="border-border flex items-start gap-3 border-b px-5 py-4">
                <div className="min-w-0 flex-1">
                  <UserSummary user={user} />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  aria-label="Close account menu"
                  onClick={() => setOpen(false)}
                  className="text-muted-foreground hover:text-foreground -mt-1 -mr-2 size-8 shrink-0 px-0"
                >
                  <X strokeWidth={1.75} />
                </Button>
              </div>

              <div className="space-y-2 px-5 py-4">
                <Button asChild variant="secondary" size="md" className="w-full justify-start">
                  <Link href={settingsHref} onClick={() => setOpen(false)}>
                    <Settings strokeWidth={1.75} />
                    Settings
                  </Link>
                </Button>
                <SignOutButton className="h-10 w-full px-4 text-sm" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
