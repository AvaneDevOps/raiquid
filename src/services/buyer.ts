import { apiClient } from "./client";

export const buyerService = {
  get<TResponse>(path: string) {
    return apiClient.get<TResponse>(path);
  },
  post<TResponse>(path: string, data: unknown) {
    return apiClient.post<TResponse>(path, data);
  },
};
