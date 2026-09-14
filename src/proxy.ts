import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Same route groups this always gated: role areas plus /notifications
// (which renders inside whichever role shell the visitor is currently in
// — see docs/ROUTE_MAP.md). This is still a thin check — auth.protect()
// only confirms a session exists. The authoritative role check (does
// THIS session's role match THIS route) happens in each role's
// layout.tsx via getSessionUser(), same as before.
const isProtectedRoute = createRouteMatcher([
  "/business(.*)",
  "/buyer(.*)",
  "/investor(.*)",
  "/admin(.*)",
  "/notifications(.*)",
]);

export const proxy = clerkMiddleware(async (auth, request) => {
  if (isProtectedRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/business/:path*",
    "/buyer/:path*",
    "/investor/:path*",
    "/admin/:path*",
    "/notifications/:path*",
  ],
};
