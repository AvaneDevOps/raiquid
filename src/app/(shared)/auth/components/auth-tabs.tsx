"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const TABS = [
  { mode: "signup", label: "Sign up" },
  { mode: "login", label: "Log in" },
] as const;

export function AuthTabs({
  mode,
  onSwitch,
}: {
  mode: "signup" | "login";
  onSwitch: (mode: "signup" | "login") => void;
}) {
  return (
    <div className="bg-surface-raised relative flex rounded-lg p-1">
      {TABS.map((tab) => (
        <button
          key={tab.mode}
          type="button"
          onClick={() => onSwitch(tab.mode)}
          className={cn(
            "relative z-10 flex-1 cursor-pointer rounded-md py-2.5 text-sm font-semibold transition-colors duration-200",
            mode === tab.mode ? "text-accent-400" : "hover:text-foreground text-muted-foreground",
          )}
        >
          {mode === tab.mode && (
            <motion.span
              layoutId="authTabPill"
              className="bg-surface absolute inset-0 -z-10 rounded-md shadow-sm"
              transition={{ type: "spring", stiffness: 500, damping: 35 }}
            />
          )}
          {tab.label}
        </button>
      ))}
    </div>
  );
}
