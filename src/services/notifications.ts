import { apiClient, type ApiToken } from "./client";

export const notificationsService = {
  get<TResponse>(path: string, token: ApiToken) {
    return apiClient.get<TResponse>(path, token);
  },
  patch<TResponse>(path: string, data: unknown, token: ApiToken) {
    return apiClient.patch<TResponse>(path, data, token);
  },
};
