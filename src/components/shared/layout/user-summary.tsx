import type { SessionUser } from "@/components/shared/layout/session-user";
import { cn } from "@/lib/utils";

export function UserSummary({ user, className }: { user: SessionUser; className?: string }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span className="border-border-strong bg-surface-raised text-accent-400 flex size-9 shrink-0 items-center justify-center rounded-full border font-mono text-xs font-medium">
        {user.initials}
      </span>
      <span className="min-w-0">
        <span className="text-foreground block truncate text-sm font-medium">{user.name}</span>
        <span className="text-muted-foreground block truncate text-xs">{user.subtitle}</span>
      </span>
    </div>
  );
}
