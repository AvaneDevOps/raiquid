import { type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button, Input, InlineNotice } from "@/components/shared/ui";

export function EditEmailView({
  defaultEmail,
  pending,
  error,
  onSubmit,
  onCancel,
}: {
  defaultEmail?: string;
  pending: boolean;
  error?: string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
}) {
  return (
    <>
      <p className="text-foreground text-lg font-semibold">Update your email</p>
      <p className="text-muted-foreground mt-1.5 text-sm">
        Enter the correct address and we&apos;ll send a new code there.
      </p>

      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <label htmlFor="newEmail" className="text-foreground mb-1.5 block text-sm">
            Email address
          </label>
          <Input
            id="newEmail"
            name="newEmail"
            type="email"
            defaultValue={defaultEmail ?? ""}
            placeholder="johnkennedy@gmail.com"
            autoComplete="email"
            required
          />
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

        <Button type="submit" variant="primary" size="lg" className="w-full" disabled={pending}>
          {pending ? "Updating…" : "Send code to this address"}
        </Button>
      </form>

      <button
        type="button"
        onClick={onCancel}
        className="text-muted-foreground hover:text-foreground mt-3 block w-full text-center text-xs"
      >
        Back
      </button>
    </>
  );
}
