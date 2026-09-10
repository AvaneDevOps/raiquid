import { apiClient } from "./client";

export const notificationsService = {
  get<TResponse>(path: string) {
    return apiClient.get<TResponse>(path);
  },
  patch<TResponse>(path: string, data: unknown) {
    return apiClient.patch<TResponse>(path, data);
  },
};
