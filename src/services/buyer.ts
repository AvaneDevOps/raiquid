import { apiClient, type ApiToken } from "./client";

export const buyerService = {
  get<TResponse>(path: string, token: ApiToken) {
    return apiClient.get<TResponse>(path, token);
  },
  post<TResponse>(path: string, data: unknown, token: ApiToken) {
    return apiClient.post<TResponse>(path, data, token);
  },
  patch<TResponse>(path: string, data: unknown, token: ApiToken) {
    return apiClient.patch<TResponse>(path, data, token);
  },
};
