import { NotificationList } from "./_components/notification-list";
import { NOTIFICATION_FIXTURES } from "./_components/fixtures";

export const metadata = {
  title: "Notifications",
};

export default function Page() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-8">
      <h1 className="font-display text-foreground text-3xl font-semibold">Notifications</h1>
      <NotificationList notifications={NOTIFICATION_FIXTURES} />
    </div>
  );
}
