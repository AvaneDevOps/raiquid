"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { SIGNUP_ROLES, type SignupRole } from "@/app/(shared)/auth/layout/constants";

export function RolePicker({
  role,
  onChange,
}: {
  role: SignupRole;
  onChange: (role: SignupRole) => void;
}) {
  return (
    <>
      <p className="text-muted-foreground mb-2 text-sm">Continuing as</p>
      <motion.div layout className="flex gap-2">
        {SIGNUP_ROLES.map(({ role: candidate, label }, i) => (
          <motion.button
            key={candidate}
            type="button"
            onClick={() => onChange(candidate)}
            whileTap={{ scale: 0.96 }}
            whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.2 }}
            className={cn(
              "flex-1 cursor-pointer rounded-lg border px-3 py-2.5 text-sm font-semibold transition-colors",
              role === candidate
                ? "border-accent-400 bg-accent-500 text-bg"
                : "border-border text-muted-foreground hover:text-foreground",
            )}
          >
            {label}
          </motion.button>
        ))}
      </motion.div>
    </>
  );
}
