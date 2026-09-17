"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

type OTPInputProps = {
  value: string;
  onChange: (value: string) => void;
};

export function OTPInput({ value, onChange }: OTPInputProps) {
  const inputs = Array.from({ length: 6 });

  function handleChange(index: number, digit: string) {
    const cleanDigit = digit.replace(/\D/g, "").slice(-1);

    const next = value.split("");
    next[index] = cleanDigit;

    const newValue = next.join("").slice(0, 6);
    onChange(newValue);

    if (cleanDigit && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  }

  function handleKeyDown(index: number, event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace" && !value[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  }

  function handlePaste(event: React.ClipboardEvent<HTMLInputElement>) {
    event.preventDefault();

    const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);

    onChange(pasted);

    const nextIndex = Math.min(pasted.length, 5);
    document.getElementById(`otp-${nextIndex}`)?.focus();
  }

  return (
    <div className="flex justify-center gap-2">
      {inputs.map((_, index) => {
        const digit = value[index] ?? "";
        const isFilled = Boolean(digit);

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              delay: index * 0.04,
              duration: 0.2,
              ease: "easeOut",
            }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.input
              id={`otp-${index}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(event) => handleChange(index, event.target.value)}
              onKeyDown={(event) => handleKeyDown(index, event)}
              onPaste={handlePaste}
              autoComplete={index === 0 ? "one-time-code" : "off"}
              aria-label={`Verification code digit ${index + 1}`}
              animate={{
                scale: isFilled ? 1.04 : 1,
              }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 25,
              }}
              className={cn(
                "bg-surface h-10 w-10 rounded-md border",
                "text-foreground text-center text-sm font-semibold",
                "transition-colors outline-none",
                "border-border hover:border-border-strong",
                "focus:border-accent-400",
                "focus:ring-accent-400/30 focus:ring-1",
              )}
            />
          </motion.div>
        );
      })}
    </div>
  );
}
