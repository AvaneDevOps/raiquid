import { env } from "@/lib/env";

export type ApiTokenProvider = () => Promise<string | null>;

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

let tokenProvider: ApiTokenProvider = async () => null;

export function configureApiTokenProvider(provider: ApiTokenProvider) {
  tokenProvider = provider;
}

class ApiClient {
  constructor(private readonly baseUrl: string) {}

  private async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const token = await tokenProvider();
    const headers = new Headers(init.headers);

    headers.set("Accept", "application/json");
    if (init.body && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    const response = await fetch(new URL(path, `${this.baseUrl}/`).toString(), {
      ...init,
      headers,
    });

    const contentType = response.headers.get("content-type") ?? "";
    const payload = contentType.includes("application/json")
      ? await response.json()
      : await response.text();

    if (!response.ok) {
      const message =
        typeof payload === "object" && payload !== null && "message" in payload
          ? String(payload.message)
          : `API request failed with status ${response.status}`;

      throw new ApiError(message, response.status, payload);
    }

    return payload as T;
  }

  get<T>(path: string, init?: RequestInit) {
    return this.request<T>(path, { ...init, method: "GET" });
  }

  post<T>(path: string, body: unknown, init?: RequestInit) {
    return this.request<T>(path, {
      ...init,
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  put<T>(path: string, body: unknown, init?: RequestInit) {
    return this.request<T>(path, {
      ...init,
      method: "PUT",
      body: JSON.stringify(body),
    });
  }

  patch<T>(path: string, body: unknown, init?: RequestInit) {
    return this.request<T>(path, {
      ...init,
      method: "PATCH",
      body: JSON.stringify(body),
    });
  }

  delete<T>(path: string, init?: RequestInit) {
    return this.request<T>(path, { ...init, method: "DELETE" });
  }
}

export const apiClient = new ApiClient(env.NEXT_PUBLIC_API_BASE_URL);
