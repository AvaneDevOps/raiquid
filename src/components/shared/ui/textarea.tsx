import { forwardRef, type TextareaHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

// See input.tsx for why this is minimal rather than variant-driven.
export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea({ className, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={cn(
        "border-border-strong bg-surface-raised text-foreground w-full rounded-lg border px-4 py-2.5",
        "placeholder:text-muted-foreground",
        "focus-visible:ring-accent-400 outline-none focus-visible:ring-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
});
