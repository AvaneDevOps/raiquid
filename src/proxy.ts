import { NextResponse, type NextRequest } from "next/server";
import type { UserRole } from "@/types";

/**
 * Route-protection seam (Next.js 16's `proxy.ts` — the renamed, Node.js
 * runtime successor to `middleware.ts`; see
 * https://nextjs.org/docs/app/api-reference/file-conventions/proxy).
 *
 * There is no auth provider decided yet (see docs/RAIQUID_CONTEXT.md,
 * "Open decisions"), so this only encodes the ROUTE -> REQUIRED ROLE
 * mapping today and passes every request through unmodified.
 *
 * Per current Next.js guidance, keep this a "thin proxy": an optimistic
 * check only (e.g. "is there a session cookie at all"), good enough to
 * fast-redirect obviously-unauthenticated requests. Do NOT put database
 * lookups, cryptographic verification, or real authorization decisions
 * here — do that in a Server Component / data-access layer, since proxy
 * checks are not a substitute for authoritative auth checks.
 */
const ROLE_PREFIXES: Record<string, UserRole> = {
  "/business": "business",
  "/buyer": "buyer",
  "/investor": "investor",
  "/admin": "admin",
};

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const requiredRole = Object.entries(ROLE_PREFIXES).find(([prefix]) =>
    pathname.startsWith(prefix),
  )?.[1];

  if (!requiredRole) {
    return NextResponse.next();
  }

  // TODO(auth): optimistic cookie-presence check only. Authoritative
  // role verification belongs in the route's Server Component / DAL.
  // const hasSession = request.cookies.has("session");
  // if (!hasSession) return NextResponse.redirect(new URL("/auth", request.url));

  return NextResponse.next();
}

export const config = {
  matcher: ["/business/:path*", "/buyer/:path*", "/investor/:path*", "/admin/:path*"],
};
