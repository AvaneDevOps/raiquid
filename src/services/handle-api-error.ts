import { ApiError } from "./client";

// Exact string from the integration guide, section 2.2 — the backend
// replies with this when a Clerk session is valid but the signup webhook
// hasn't created the backend's own User record yet. Not present in
// src/types/api-generated.ts (the OpenAPI doc doesn't type error bodies),
// so this is a plain string match, not a generated type — it'll silently
// stop matching if the backend ever rewords the message.
export const NOT_PROVISIONED_MESSAGE = "User is not provisioned yet";

// A 401 means the session itself is bad (missing/expired token) — the
// caller should send the user to sign in again.
export function isUnauthorizedError(error: unknown): error is ApiError {
  return error instanceof ApiError && error.status === 401;
}

// A 403 with this exact message means the Clerk session is valid but
// provisioning hasn't caught up yet, right after signup. Expected,
// transient — retry, don't treat it as a failure.
export function isNotProvisionedError(error: unknown): error is ApiError {
  return (
    error instanceof ApiError && error.status === 403 && error.message === NOT_PROVISIONED_MESSAGE
  );
}

export interface ProvisioningRetryOptions {
  /** Total attempts including the first call. Default 4. */
  attempts?: number;
  /** Delay before the first retry; doubles each attempt after. Default 1000ms. */
  baseDelayMs?: number;
}

// Retries a "not provisioned yet" 403 with exponential backoff — default
// 4 attempts at ~1s/2s/4s (≈7s of waiting total, "a few seconds" per the
// integration guide) before giving up and rethrowing. Anything else
// (including a 401 — see isUnauthorizedError) rethrows immediately; the
// caller decides what "give up and show an error" looks like.
export async function withProvisioningRetry<T>(
  fn: () => Promise<T>,
  { attempts = 4, baseDelayMs = 1000 }: ProvisioningRetryOptions = {},
): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (!isNotProvisionedError(error) || attempt >= attempts - 1) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, baseDelayMs * 2 ** attempt));
    }
  }
}

// Builds the sign-in redirect target, matching src/proxy.ts's own
// callbackUrl convention. Framework-agnostic on purpose: `redirect()`
// from next/navigation only works in Server Components/Actions/Route
// Handlers and during a Client Component's render (not inside an event
// handler — see the Next.js docs for redirect()); a Client Component
// event handler should instead call `router.push(getSignInUrl(...))`.
export function getSignInUrl(callbackPath?: string): string {
  if (!callbackPath) return "/auth";
  return `/auth?callbackUrl=${encodeURIComponent(callbackPath)}`;
}
