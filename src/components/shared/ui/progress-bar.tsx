import { cn } from "@/lib/utils";

/**
 * Minted-gold horizontal fill bar — invoice funding %, reserve-pool
 * coverage, etc. `percent` is clamped to 0–100.
 */
export function ProgressBar({
  percent,
  className,
  label,
}: {
  percent: number;
  className?: string;
  label?: string;
}) {
  const clamped = Math.max(0, Math.min(100, Number.isFinite(percent) ? percent : 0));
  return (
    <div
      className={cn("bg-surface-raised h-2 w-full overflow-hidden rounded-full", className)}
      role="progressbar"
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <div
        className="from-accent-400 to-accent-600 h-full rounded-full bg-linear-to-r transition-[width]"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
