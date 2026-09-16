import type { AppNotification, NotificationTone } from "@/types";
import type { paths } from "@/types/api-generated";

import { apiClient, type ApiToken } from "./client";

type NotificationListQuery = paths["/notifications"]["get"]["parameters"]["query"];

function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null ? (value as Record<string, unknown>) : {};
}

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function asNotificationTone(value: unknown): NotificationTone | null {
  return value === "positive" || value === "informational" || value === "warning" ? value : null;
}

export function normalizeNotifications(payload: unknown): AppNotification[] {
  const root = asRecord(payload);
  const data = Array.isArray(root.data) ? root.data : [];

  return data.flatMap((item) => {
    const notification = asRecord(item);

    const id = asString(notification.id);
    const message = asString(notification.message);
    const occurredAt = asString(notification.occurredAt);
    const tone = asNotificationTone(notification.tone);

    if (!id || !message || !occurredAt || !tone) {
      return [];
    }

    const readAt = asString(notification.readAt);

    return [
      {
        id,
        tone,
        message,
        occurredAt,
        ...(readAt ? { readAt } : {}),
      },
    ];
  });
}

export const notificationsService = {
  list<TResponse = unknown>(token: ApiToken, query?: NotificationListQuery): Promise<TResponse> {
    const params = new URLSearchParams();

    if (query?.page !== undefined) {
      params.set("page", String(query.page));
    }

    if (query?.pageSize !== undefined) {
      params.set("pageSize", String(query.pageSize));
    }

    if (query?.unreadOnly !== undefined) {
      params.set("unreadOnly", String(query.unreadOnly));
    }

    const queryString = params.toString();
    const path = queryString ? `/notifications?${queryString}` : "/notifications";

    return apiClient.get<TResponse>(path, token);
  },

  markRead<TResponse = unknown>(id: string, token: ApiToken): Promise<TResponse> {
    return apiClient.patch<TResponse>(`/notifications/${id}/read`, {}, token);
  },
};
