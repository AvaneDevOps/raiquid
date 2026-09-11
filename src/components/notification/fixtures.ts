import type { AppNotification } from "@/types";

// Screen 30-notifications. occurredAt values are computed relative to
// module-load time, not hardcoded ISO strings — a fixed date would show
// the right relative label ("Today", "Yesterday") only on the day this
// file was written, then silently go stale. This way "Today · 09:14" (or
// whatever time) is accurate whenever the app is actually run.
const now = Date.now();
const hoursAgo = (h: number) => new Date(now - h * 60 * 60 * 1000).toISOString();
const daysAgo = (d: number) => new Date(now - d * 24 * 60 * 60 * 1000).toISOString();

export const NOTIFICATIONS_FIXTURE: AppNotification[] = [
  {
    id: "notif_1",
    tone: "positive",
    message: "Distify Distribution Ltd accepted your invoice RQ-INV-4471",
    occurredAt: hoursAgo(3),
  },
  {
    id: "notif_2",
    tone: "informational",
    message: "Invoice RQ-INV-4471 is now 62% funded",
    occurredAt: hoursAgo(4),
  },
  {
    id: "notif_3",
    tone: "warning",
    message: "Payment of ₦2,000,000 is due from Distify Distribution Ltd in 3 days",
    occurredAt: daysAgo(1),
  },
  {
    id: "notif_4",
    tone: "positive",
    message: "You earned ₦18,400 on RQ-INV-4471",
    occurredAt: daysAgo(2),
  },
];
