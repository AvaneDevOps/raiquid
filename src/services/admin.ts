import { apiClient } from "./client";

export const adminService = {
  get<TResponse>(path: string) {
    return apiClient.get<TResponse>(path);
  },
  post<TResponse>(path: string, data: unknown) {
    return apiClient.post<TResponse>(path, data);
  },
};
