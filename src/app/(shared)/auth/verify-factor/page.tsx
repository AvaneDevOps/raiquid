"use client";

import { useRouter } from "next/navigation";
import { LandingHeader } from "@/components/shared/layout";
import { Button } from "@/components/shared/ui";

/**
 * Login needed a second factor / extra verification step. Clerk's hosted
 * factor flow isn't embedded in the custom /auth UI, so this page explains
 * the handoff and sends the user back to sign in (or to /post-auth once
 * the factor is done in another tab).
 */
export default function VerifyFactorPage() {
  const router = useRouter();

  return (
    <>
      <LandingHeader />
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
        <div className="border-border bg-surface w-full max-w-md rounded-xl border p-8">
          <h1 className="font-display text-foreground text-xl font-semibold">
            Extra verification needed
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Your account needs one more verification step. Complete it, then continue — we&apos;ll
            take you to your workspace.
          </p>
          <div className="mt-6 space-y-3">
            <Button
              type="button"
              variant="primary"
              size="lg"
              className="w-full"
              onClick={() => router.push("/post-auth")}
            >
              I&apos;ve verified — continue
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="lg"
              className="w-full"
              onClick={() => router.push("/auth")}
            >
              Back to sign in
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
