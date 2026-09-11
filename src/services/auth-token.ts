import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";
import { configureApiTokenProvider } from "./client";

/**
 * Wire the Clerk session token into the API client. Mount once inside a
 * client component under <ClerkProvider> — the integration guide
 * authenticates backend requests with Clerk-issued bearer tokens.
 */
export function ClerkApiTokenProvider({ children }: { children: React.ReactNode }) {
  const { getToken, isSignedIn } = useAuth();

  useEffect(() => {
    configureApiTokenProvider(async () => {
      if (!isSignedIn) return null;
      try {
        return await getToken();
      } catch {
        return null;
      }
    });
  }, [getToken, isSignedIn]);

  return children;
}

export { configureApiTokenProvider };
