import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE, computeAdminSessionToken } from "@/lib/admin-session";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const cookie = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;

    // computeAdminSessionToken() throws if ADMIN_SESSION_SECRET is unset
    // (crypto.subtle.importKey rejects an empty key) — treat that the same
    // as "not authenticated" instead of crashing the whole request with a 500.
    let expected: string | null = null;
    try {
      expected = await computeAdminSessionToken();
    } catch {
      expected = null;
    }

    if (!expected || !cookie || cookie !== expected) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
