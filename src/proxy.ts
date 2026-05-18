import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_PATHS = new Set<string>(["/", "/login", "/register"]);

/**
 * Next 16 Proxy (formerly Middleware). Runs before route resolution.
 *
 * Today this only logs and passes through, because session lives in localStorage
 * (see features/auth/store.ts) which Proxy cannot read. Once BE issues
 * `refreshToken` as an httpOnly cookie, flip ENABLE_SERVER_GUARD to true to
 * gain optimistic server-side redirects.
 */
const ENABLE_SERVER_GUARD = false;

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  if (ENABLE_SERVER_GUARD) {
    const isPublic = PUBLIC_PATHS.has(pathname);
    const hasSession = request.cookies.has("refreshToken");

    if (!isPublic && !hasSession) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
    if (isPublic && hasSession && pathname !== "/") {
      const url = request.nextUrl.clone();
      url.pathname = "/chat";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
