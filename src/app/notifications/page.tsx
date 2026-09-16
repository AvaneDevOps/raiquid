// TODO: implement. See docs/ROUTE_MAP.md for the source screen reference
// and docs/RAIQUID_CONTEXT.md for domain/business context.
import { Card } from "@/components/shared/ui/card";
import { EmptyState } from "@/components/shared/ui/notice";

import { NotificationRow } from "@/components/notification//notification-row";
import { NOTIFICATIONS_FIXTURE } from "@/components/notification/fixtures";

// Screen 30-notifications. Data below is dummy (see
// src/app/notifications/_lib/fixtures.ts) until a real API exists — see
// docs/RAIQUID_CONTEXT.md, "Open decisions".
export default function Page() {
  return (
    <div className="space-y-8">
      <h1 className="font-display text-foreground text-3xl font-semibold">Notifications</h1>

      {NOTIFICATIONS_FIXTURE.length === 0 ? (
        <EmptyState
          title="No notifications yet"
          description="Updates about your invoices, funding, and payments will show up here."
        />
      ) : (
        <Card>
          <div className="divide-border divide-y">
            {NOTIFICATIONS_FIXTURE.map((notification) => (
              <NotificationRow key={notification.id} notification={notification} />
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
