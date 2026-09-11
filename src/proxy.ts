import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/business(.*)",
  "/buyer(.*)",
  "/investor(.*)",
  "/admin(.*)",
  "/notifications(.*)",
]);

/**
 * Route-protection seam (Next.js 16's `proxy.ts` — the renamed, Node.js
 * runtime successor to `middleware.ts`).
 *
 * Auth provider is Clerk (see src/app/layout.tsx <ClerkProvider> and
 * src/components/shared/layout/session-user.tsx). clerkMiddleware() populates
 * the request auth state; unauthenticated hits on protected routes bounce to
 * /auth. The authoritative role check — does THIS user's role match THIS
 * route — happens in each role's layout.tsx via getSessionUser(), which reads
 * Clerk's `role` from publicMetadata server-side.
 */
export default clerkMiddleware(async (auth, request) => {
  if (!isProtectedRoute(request)) {
    return NextResponse.next();
  }

  const { userId } = await auth();

  if (!userId) {
    const signInUrl = new URL("/auth", request.url);
    signInUrl.searchParams.set("redirect_url", request.url);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
