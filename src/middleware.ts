import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

// Edge middleware: only JWT verification (jose is edge-safe). DB/bcrypt work
// happens in Node route handlers. Protects every /access/admin/* page except
// the login route.
const SECRET = new TextEncoder().encode(
  process.env.AUTH_JWT_SECRET || "dev-insecure-secret-change-me",
);
const COOKIE = "convertly_admin";

async function isAuthed(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get(COOKIE)?.value;
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload.role === "admin";
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isLogin = pathname === "/access/admin/login";
  const authed = await isAuthed(req);

  if (pathname.startsWith("/access/admin")) {
    if (isLogin) {
      // Already logged in? skip the login page.
      if (authed) {
        return NextResponse.redirect(new URL("/access/admin/dashboard", req.url));
      }
      return NextResponse.next();
    }
    // Any other admin page requires a valid session.
    if (!authed) {
      return NextResponse.redirect(new URL("/access/admin/login", req.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/access/admin/:path*"],
};
