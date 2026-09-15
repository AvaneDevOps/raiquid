import { env } from "@/lib/env";
import { getSignInUrl, isUnauthorizedError, withProvisioningRetry } from "./handle-api-error";

// The Clerk session token for this call, or null for an unauthenticated
// request. There is no shared/ambient fallback — every call site must
// supply its own, fetched fresh at call time (client components:
// useAuth().getToken(); server components/actions/route handlers:
// (await auth()).getToken()). A module-level token would be shared across
// every concurrent request this server process handles, so one user's
// token could end up on another user's request.
export type ApiToken = string | null;

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

class ApiClient {
  constructor(private readonly baseUrl: string) {}

  private async request<T>(path: string, token: ApiToken, init: RequestInit = {}): Promise<T> {
    const attempt = async (): Promise<T> => {
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
    };

    try {
      // A "not provisioned yet" 403 is expected right after signup and
      // clears itself once the Clerk webhook catches up — retry with
      // backoff instead of failing the caller's very first request after
      // signing up. Anything else (a healthy response, a 401, any other
      // error) resolves or rethrows on this first attempt; see
      // withProvisioningRetry's own comment in handle-api-error.ts.
      return await withProvisioningRetry(attempt);
    } catch (error) {
      // The session itself is bad — no amount of retrying fixes that.
      // Send the browser to sign in, then still reject below so the
      // caller doesn't treat the failed call as having produced data.
      if (isUnauthorizedError(error) && typeof window !== "undefined") {
        window.location.assign(
          getSignInUrl(`${window.location.pathname}${window.location.search}`),
        );
      }
      throw error;
    }
  }

  get<T>(path: string, token: ApiToken, init?: RequestInit) {
    return this.request<T>(path, token, { ...init, method: "GET" });
  }

  post<T>(path: string, body: unknown, token: ApiToken, init?: RequestInit) {
    return this.request<T>(path, token, {
      ...init,
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  put<T>(path: string, body: unknown, token: ApiToken, init?: RequestInit) {
    return this.request<T>(path, token, {
      ...init,
      method: "PUT",
      body: JSON.stringify(body),
    });
  }

  patch<T>(path: string, body: unknown, token: ApiToken, init?: RequestInit) {
    return this.request<T>(path, token, {
      ...init,
      method: "PATCH",
      body: JSON.stringify(body),
    });
  }

  delete<T>(path: string, token: ApiToken, init?: RequestInit) {
    return this.request<T>(path, token, { ...init, method: "DELETE" });
  }
}

export const apiClient = new ApiClient(env.NEXT_PUBLIC_API_BASE_URL);
