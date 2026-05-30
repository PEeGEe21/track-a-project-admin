import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { isJwtExpired } from "@/lib/auth-token";

export async function proxy(request: NextRequest) {
  const accessToken = request.cookies.get("admin_access_token")?.value || null;
  const pathname = request.nextUrl.pathname;

  const isAuthPage = pathname.startsWith("/auth");
  const isValidAuth = Boolean(accessToken && !isJwtExpired(accessToken));

  if (isAuthPage && isValidAuth) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (isAuthPage && !isValidAuth) {
    return NextResponse.next();
  }

  if (!isValidAuth && !isAuthPage) {
    const response = NextResponse.redirect(new URL("/auth/login", request.url));
    response.cookies.delete("admin_access_token");
    response.cookies.delete("admin_refresh_token");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/organizations/:path*",
    "/modules/:path*",
    "/users/:path*",
    "/plans/:path*",
    "/projects/:path*",
    "/reports/:path*",
    "/subscriptions/:path*",
    "/settings/:path*",
    "/auth/:path*",
  ],
};
