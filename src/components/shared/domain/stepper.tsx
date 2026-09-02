import { Fragment } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StepperStep {
  key: string;
  label: string;
}

// currentIndex is the in-progress step; lower indices render complete. Pass steps.length for all-complete.
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
                  state === "complete" && "border-success bg-success text-bg",
                  state === "current" && "border-accent-500 bg-accent-500 text-bg",
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
                  i < currentIndex ? "bg-success" : "bg-border-strong",
                )}
              />
            )}
          </Fragment>
        );
      })}
    </ol>
  );
}
