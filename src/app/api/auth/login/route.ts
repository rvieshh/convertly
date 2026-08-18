import { NextRequest, NextResponse } from "next/server";
import { verifyUser, createUserSession, USER_COOKIE } from "@/lib/userauth";
import { getSettings } from "@/lib/settings";

export const runtime = "nodejs";

function secureFlag(req: NextRequest): boolean {
  const proto = req.headers.get("x-forwarded-proto") || (req.nextUrl.protocol === "https:" ? "https" : "http");
  return proto === "https";
}

export async function POST(req: NextRequest) {
  if (!getSettings().authEnabled) {
    return NextResponse.json({ error: "Login is disabled" }, { status: 403 });
  }

  let body: { email?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const email = (body.email || "").trim().toLowerCase();
  const password = body.password || "";
  if (!email || !password) return NextResponse.json({ error: "Email and password required" }, { status: 400 });

  const user = verifyUser(email, password);
  if (!user) return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });

  const token = await createUserSession(user);
  const res = NextResponse.json({ ok: true, username: user.username });
  res.cookies.set(USER_COOKIE, token, {
    httpOnly: true,
    secure: secureFlag(req),
    sameSite: "lax",
    path: "/",
    maxAge: 30 * 24 * 60 * 60,
  });
  return res;
}
