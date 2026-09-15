import type { AppNotification } from "@/types";

const now = Date.now();

export const NOTIFICATION_FIXTURES: AppNotification[] = [
  {
    id: "notification-1",
    tone: "positive",
    message: "Distify Distribution Ltd accepted your invoice RQ-INV-4471",
    occurredAt: new Date(now - 45 * 60_000).toISOString(),
  },
  {
    id: "notification-2",
    tone: "informational",
    message: "Invoice RQ-INV-4471 is now 62% funded",
    occurredAt: new Date(now - 2 * 60 * 60_000).toISOString(),
  },
  {
    id: "notification-3",
    tone: "warning",
    message: "Payment of ₦2,000,000 is due from Distify Distribution Ltd in 3 days",
    occurredAt: new Date(now - 24 * 60 * 60_000).toISOString(),
  },
  {
    id: "notification-4",
    tone: "positive",
    message: "You earned ₦18,400 on RQ-INV-4471",
    occurredAt: new Date(now - 2 * 24 * 60 * 60_000).toISOString(),
  },
];
