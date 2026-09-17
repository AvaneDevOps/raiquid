"use client";

import { type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button, Input, InlineNotice, PasswordInput } from "@/components/shared/ui";

const FIELDS = [
  {
    id: "email",
    label: "Email Address",
    type: "email",
    name: "email",
    placeholder: "johnkennedy@gmail.com",
    autoComplete: "email",
  },
  {
    id: "password",
    label: "Password",
    type: "password",
    name: "password",
    placeholder: "******************",
    autoComplete: "current-password",
  },
] as const;

export function LoginForm({
  onSubmit,
  pending,
  error,
  canSubmit,
}: {
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  pending: boolean;
  error?: string;
  canSubmit: boolean;
}) {
  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      {FIELDS.map((field, i) => (
        <motion.div
          key={field.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06, duration: 0.2 }}
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
              name={field.id}
              type={field.type}
              placeholder={field.placeholder}
              required
              autoComplete={field.autoComplete}
            />
          )}
        </motion.div>
      ))}

      <AnimatePresence>
        {error ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto", x: [0, -4, 4, -4, 4, 0] }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <InlineNotice tone="danger">{error}</InlineNotice>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <motion.div whileTap={{ scale: 0.98 }}>
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full hover:cursor-pointer"
          disabled={pending || !canSubmit}
        >
          {pending ? "Signing in…" : "Sign in"}
        </Button>
      </motion.div>
    </form>
  );
}
