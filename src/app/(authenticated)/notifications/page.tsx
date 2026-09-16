import { auth } from "@clerk/nextjs/server";

import { notificationsService, normalizeNotifications } from "@/services/notifications";

import { NotificationList } from "./_components/notification-list";

export const metadata = {
  title: "Notifications",
};

export default async function Page() {
  const { getToken } = await auth();
  const token = await getToken();

  const payload = await notificationsService.list(token);
  const notifications = normalizeNotifications(payload);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8">
      <h1 className="font-display text-foreground text-3xl font-semibold">Notifications</h1>
      <NotificationList notifications={notifications} />
    </div>
  );
}
