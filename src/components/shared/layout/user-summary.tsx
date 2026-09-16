<<<<<<< HEAD
import type { ReactNode } from "react";
import type { SessionUser } from "@/components/shared/layout/session-user";
import { cn } from "@/lib/utils";

export function UserSummary({
  user,
  className,
  action,
}: {
  user: SessionUser;
  className?: string;

  action?: ReactNode;
}) {
  return (
    <div
      className={cn(
        action ? "flex flex-col items-stretch gap-3" : "flex items-center gap-3",
        className,
      )}
    >
=======
import type { SessionUser } from "@/components/shared/layout/session-user";
import { cn } from "@/lib/utils";

export function UserSummary({ user, className }: { user: SessionUser; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {/* User summary */}
>>>>>>> 126c1250105090cfeb3f5a136297e976271e7075
      <div className="flex min-w-0 items-center gap-3">
        <span className="border-border-strong bg-surface-raised text-accent-400 flex size-9 shrink-0 items-center justify-center rounded-full border font-mono text-xs font-medium">
          {user.initials}
        </span>
<<<<<<< HEAD
        <span className="min-w-0">
          <span className="text-foreground block truncate text-sm font-medium">{user.name}</span>
          <span className="text-muted-foreground block truncate text-xs">{user.subtitle}</span>
        </span>
      </div>
      {action ? <div className="w-full">{action}</div> : null}
=======

        <span className="min-w-0">
          <span className="text-foreground block truncate text-sm font-medium">{user.name}</span>

          <span className="text-muted-foreground block truncate text-xs">{user.subtitle}</span>
        </span>
      </div>
>>>>>>> 126c1250105090cfeb3f5a136297e976271e7075
    </div>
  );
}
