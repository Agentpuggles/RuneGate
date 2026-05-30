import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getIronSession } from "iron-session";

interface SessionData {
  userId: string;
  username: string;
  isLoggedIn: boolean;
}

const sessionOptions = {
  password: process.env.SESSION_SECRET || "runegate-super-secret-key-change-in-production-rune-gate-32chars",
  cookieName: process.env.SESSION_COOKIE_NAME || "runegate_session",
};

const publicPaths = ["/login", "/api/auth/login"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow static files and public paths
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/games/") || // game HTML files
    pathname.startsWith("/audio/") ||
    publicPaths.some((p) => pathname.startsWith(p))
  ) {
    return NextResponse.next();
  }

  // Check session for everything else
  const response = NextResponse.next();
  const session = await getIronSession<SessionData>(request, response, sessionOptions);

  if (!session.isLoggedIn) {
    // API routes return 401
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // Pages redirect to login
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
