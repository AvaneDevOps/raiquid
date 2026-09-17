import type { AppNotification } from "@/types";
import { cn } from "@/lib/utils";

const toneClass: Record<AppNotification["tone"], string> = {
  positive: "bg-success",
  informational: "bg-accent-400",
  warning: "bg-danger",
};

function formatRelativeTime(isoDateTime: string, now: Date): string {
  const occurredAt = new Date(isoDateTime);
  if (Number.isNaN(occurredAt.getTime())) return isoDateTime;

  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);
  const startOfOccurredDay = new Date(occurredAt);
  startOfOccurredDay.setHours(0, 0, 0, 0);
  const dayDifference = Math.round(
    (startOfToday.getTime() - startOfOccurredDay.getTime()) / 86_400_000,
  );

  if (dayDifference === 0) {
    return `Today · ${occurredAt.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })}`;
  }

  if (dayDifference === 1) return "Yesterday";
  if (dayDifference > 1 && dayDifference < 7) return `${dayDifference} days ago`;

  return occurredAt.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: occurredAt.getFullYear() === now.getFullYear() ? undefined : "numeric",
  });
}

function NotificationMessage({ message }: { message: string }) {
  const parts = message.split(/(RQ-INV-\d+)/g);

  return (
    <p className="text-foreground text-sm leading-6">
      {parts.map((part, index) =>
        /^RQ-INV-\d+$/.test(part) ? (
          <span key={`${part}-${index}`} className="text-muted-foreground font-mono">
            {part}
          </span>
        ) : (
          <span key={`${part}-${index}`}>{part}</span>
        ),
      )}
    </p>
  );
}

export function NotificationList({ notifications }: { notifications: AppNotification[] }) {
  const now = new Date();

  return (
    <div className="border-border bg-surface w-full max-w-2xl rounded-xl border px-7 py-2 md:px-8">
      {notifications.map((notification) => (
        <article
          key={notification.id}
          className={cn("border-border flex gap-4 border-b py-5 last:border-b-0")}
        >
          <span
            aria-hidden="true"
            className={cn("mt-2 size-2 shrink-0 rounded-full", toneClass[notification.tone])}
          />
          <div className="min-w-0 space-y-1">
            <NotificationMessage message={notification.message} />
            <time
              className="text-muted-foreground font-mono text-xs"
              dateTime={notification.occurredAt}
            >
              {formatRelativeTime(notification.occurredAt, now)}
            </time>
          </div>
        </article>
      ))}
    </div>
  );
}
