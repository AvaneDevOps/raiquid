import { NextResponse, type NextRequest } from "next/server";
import type { UserRole } from "@/types";

/**
 * Route-protection seam (Next.js 16's `proxy.ts` — the renamed, Node.js
 * runtime successor to `middleware.ts`; see
 * https://nextjs.org/docs/app/api-reference/file-conventions/proxy).
 *
 * Auth provider is now Auth.js v5 (JWT session strategy, see src/auth.ts).
 * Per current Next.js guidance this stays a "thin proxy": an optimistic
 * check only (is there a session cookie at all), good enough to fast-
 * redirect obviously-unauthenticated requests. The authoritative role
 * check — does THIS session's role match THIS route — happens in each
 * role's layout.tsx via getSessionUser() (see session-user.tsx), which is
 * a Server Component and can safely call auth() to verify the JWT. Do not
 * upgrade this file to call auth() directly even though proxy.ts runs on
 * the Node.js runtime and technically could — that was a deliberate
 * separation, not a limitation being worked around.
 */
const ROLE_PREFIXES: Record<string, UserRole> = {
  "/business": "business",
  "/buyer": "buyer",
  "/investor": "investor",
  "/admin": "admin",
};

// Routes that require *some* authenticated session but aren't role-gated
// (e.g. /notifications renders inside whichever role shell the visitor is
// currently in — see docs/ROUTE_MAP.md).
const AUTH_ONLY_PREFIXES = ["/notifications"];

// Auth.js's default JWT session cookie name: unprefixed in dev, __Secure-
// prefixed once served over https in production. Check both so this works
// locally and once deployed without an env-specific branch here.
const SESSION_COOKIE_NAMES = ["authjs.session-token", "__Secure-authjs.session-token"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isRoleGated = Object.keys(ROLE_PREFIXES).some((prefix) => pathname.startsWith(prefix));
  const isAuthOnly = AUTH_ONLY_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  if (!isRoleGated && !isAuthOnly) {
    return NextResponse.next();
  }

  const hasSession = SESSION_COOKIE_NAMES.some((name) => request.cookies.has(name));

  if (!hasSession) {
    const redirectUrl = new URL("/auth", request.url);
    redirectUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/business/:path*",
    "/buyer/:path*",
    "/investor/:path*",
    "/admin/:path*",
    "/notifications/:path*",
  ],
};
