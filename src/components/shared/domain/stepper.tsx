import { Fragment } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Numbered-circles-joined-by-a-line progress tracker. Generic over a
 * `steps` array — the same component renders the 5-stage invoice
 * lifecycle (INVOICE_LIFECYCLE_STEPS) and the 3-stage whitelisting flow
 * (WHITELIST_STEPS) from src/lib/domain-display.ts. Don't build a second
 * stepper.
 *
 * `currentIndex` is the zero-based index of the in-progress step;
 * everything before it renders as complete.
 */
export interface StepperStep {
  key: string;
  label: string;
}

export function Stepper({
  steps,
  currentIndex,
  className,
}: {
  steps: StepperStep[];
  currentIndex: number;
  className?: string;
}) {
  return (
    <ol className={cn("flex items-start overflow-x-auto", className)}>
      {steps.map((step, i) => {
        const state: "complete" | "current" | "upcoming" =
          i < currentIndex ? "complete" : i === currentIndex ? "current" : "upcoming";
        const isLast = i === steps.length - 1;

        return (
          <Fragment key={step.key}>
            <li className="flex min-w-18 shrink-0 flex-col items-center gap-2 text-center">
              <span
                className={cn(
                  "flex size-8 items-center justify-center rounded-full border text-sm font-medium",
                  state === "complete" && "border-accent-500 bg-accent-500 text-bg",
                  state === "current" &&
                    "border-accent-400 text-accent-400 ring-accent-400/30 ring-2",
                  state === "upcoming" && "border-border-strong text-muted-foreground",
                )}
              >
                {state === "complete" ? <Check className="size-4" /> : i + 1}
              </span>
              <span
                className={cn(
                  "max-w-28 text-xs",
                  state === "upcoming" ? "text-muted-foreground" : "text-foreground",
                )}
              >
                {step.label}
              </span>
            </li>
            {!isLast && (
              <span
                aria-hidden
                className={cn(
                  "mt-4 h-px min-w-6 flex-1",
                  i < currentIndex ? "bg-accent-500" : "bg-border-strong",
                )}
              />
            )}
          </Fragment>
        );
      })}
    </ol>
  );
}
