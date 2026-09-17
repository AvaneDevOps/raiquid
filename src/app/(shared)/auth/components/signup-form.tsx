"use client";

import { type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button, Input, InlineNotice, PasswordInput } from "@/components/shared/ui";
import { SECOND_FIELD, type SignupRole } from "@/app/(shared)/auth/layout/constants";
import { RolePicker } from "./role-picker";

export function SignupForm({
  role,
  onRoleChange,
  onSubmit,
  pending,
  error,
  canSubmit,
}: {
  role: SignupRole;
  onRoleChange: (role: SignupRole) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  pending: boolean;
  error?: string;
  canSubmit: boolean;
}) {
  const fields = [
    {
      id: "fullName",
      label: "Full name",
      placeholder: "Kennedy Okonkwo",
      autoComplete: "name",
    },
    {
      id: "secondField",
      label: SECOND_FIELD[role].label,
      placeholder: SECOND_FIELD[role].placeholder,
      autoComplete: "organization",
    },
    {
      id: "signupEmail",
      label: "Email address",
      placeholder: "kennedy@okonkwotextiles.com",
      type: "email",
      name: "email",
      autoComplete: "email",
    },
    {
      id: "signupPassword",
      label: "Password",
      placeholder: "******************",
      type: "password",
      name: "password",
      autoComplete: "new-password",
    },
  ];

  return (
    <>
      <RolePicker role={role} onChange={onRoleChange} />

      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        {fields.map((field, i) => (
          <motion.div
            key={field.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05, duration: 0.2 }}
          >
            <label htmlFor={field.id} className="text-foreground mb-1.5 block text-sm">
              {field.label}
            </label>
            {field.type === "password" ? (
              <PasswordInput
                id={field.id}
                name={field.name}
                placeholder={field.placeholder}
                required
                autoComplete={field.autoComplete}
              />
            ) : (
              <Input
                id={field.id}
                name={field.name ?? field.id}
                type={field.type ?? "text"}
                placeholder={field.placeholder}
                required={field.id !== "secondField"}
                autoComplete={field.autoComplete}
              />
            )}
          </motion.div>
        ))}

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

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.2 }}
        >
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={pending || !canSubmit}
          >
            {pending ? "Creating account…" : "Create account"}
          </Button>
        </motion.div>

        {/* Clerk's bot sign-up protection widget. Must exist in the
            DOM before signUp.create() is called — normally invisible,
            only shows a challenge for traffic Clerk flags as risky. */}
        <div id="clerk-captcha" data-cl-theme="dark" data-cl-size="flexible" />
      </form>

      <p className="text-muted-foreground mt-4 text-center text-xs">
        By continuing you agree to Raiquid&apos;s sandbox terms.
      </p>
    </>
  );
}
