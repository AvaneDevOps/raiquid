import type { AppNotification, NotificationTone } from "@/types";

import { formatRelativeTime } from "@/lib/format-relative-time";

// Screen 30-notifications. Dot color per tone (positive=green,
// informational=amber, warning=red) — see docs/DESIGN_SYSTEM.md,
// "Notifications". Same three tones as InlineNotice, different values
// ("positive"/"informational"/"warning" vs "info"/"success"/"danger"),
// so this isn't a reuse of that component's tone prop.
const DOT_CLASS: Record<NotificationTone, string> = {
  positive: "bg-success",
  informational: "bg-accent-400",
  warning: "bg-danger",
};

// Invoice ids inside the message render as plain inline mono text, not an
// InvoiceRef chip (verified against the export — see the corrected
// comment on AppNotification in src/types/domain.ts). Split on the id
// pattern and mono-style just those pieces. Two separate regexes: the
// global one drives split() (keeps captured groups in the result array);
// the non-global one is for matching a single part — reusing a /g regex
// across repeated .test() calls is stateful (lastIndex persists) and
// unreliable, so this avoids that trap rather than risking it.
const INVOICE_ID_SPLIT = /(RQ-INV-\d+)/g;
const INVOICE_ID_EXACT = /^RQ-INV-\d+$/;

function renderMessage(message: string) {
  return message.split(INVOICE_ID_SPLIT).map((part, i) =>
    INVOICE_ID_EXACT.test(part) ? (
      <span key={i} className="font-mono">
        {part}
      </span>
    ) : (
      part
    ),
  );
}

export function NotificationRow({ notification }: { notification: AppNotification }) {
  return (
    <div className="flex gap-3 px-5 py-4">
      <span className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${DOT_CLASS[notification.tone]}`} />
      <div>
        <p className="text-foreground text-sm">{renderMessage(notification.message)}</p>
        <p className="text-muted-foreground mt-1 font-mono text-xs">
          {formatRelativeTime(notification.occurredAt)}
        </p>
      </div>
    </div>
  );
}
