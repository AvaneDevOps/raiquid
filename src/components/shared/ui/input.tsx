import { forwardRef, type InputHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

/**
 * Minimal — DESIGN_SYSTEM.md's component inventory never planned for
 * forms, so there's no evidenced variant/size system to match here
 * (unlike Button/Badge). Styled from the tokens the docs do call out
 * for inputs: --color-border-strong for the border, font-sans (IBM
 * Plex Sans) for the text — see screens 05/12 for the visual reference.
 */
export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...props }, ref) {
    return (
      <input
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
  },
);
