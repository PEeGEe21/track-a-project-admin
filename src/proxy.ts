import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

function isTokenExpired(token: string): boolean {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return true;

    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const payload = JSON.parse(jsonPayload);
    const currentTime = Math.floor(Date.now() / 1000);

    return !payload.exp || payload.exp < currentTime;
  } catch {
    return true;
  }
}

export async function proxy(request: NextRequest) {
  const accessToken = request.cookies.get("admin_access_token")?.value || null;
  const pathname = request.nextUrl.pathname;

  const isAuthPage = pathname.startsWith("/auth");
  const isValidAuth = accessToken && !isTokenExpired(accessToken);

  if (isAuthPage && isValidAuth) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (isAuthPage && !isValidAuth) {
    return NextResponse.next();
  }

  if (!isValidAuth && !isAuthPage) {
    const response = NextResponse.redirect(new URL("/auth/sign-in", request.url));
    response.cookies.delete("admin_access_token");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/organizations/:path*",
    "/modules/:path*",
    "/users/:path*",
    "/settings/:path*",
    "/auth/:path*",
  ],
};
