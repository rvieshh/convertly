import { NextRequest, NextResponse } from "next/server";
import {
  verifyAdmin,
  createSession,
  AUTH_COOKIE,
  checkRateLimit,
  recordLoginFailure,
  clearLoginFailures,
} from "@/lib/auth";
import { logActivity } from "@/lib/stats";

export const runtime = "nodejs";

function clientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function POST(req: NextRequest) {
  const ip = clientIp(req);
  const rl = checkRateLimit(ip);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: `Too many attempts. Try again in ${Math.ceil(rl.retryMs / 60000)} min.` },
      { status: 429 },
    );
  }

  let body: { identifier?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const identifier = (body.identifier || "").trim();
  const password = body.password || "";
  if (!identifier || !password) {
    return NextResponse.json({ error: "Username/email and password required" }, { status: 400 });
  }

  const admin = verifyAdmin(identifier, password);
  if (!admin) {
    recordLoginFailure(ip);
    logActivity("auth", `Failed admin login for "${identifier}"`);
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  clearLoginFailures(ip);
  const token = await createSession();
  logActivity("auth", "Admin logged in");

  const res = NextResponse.json({ ok: true, mustChange: admin.must_change === 1 });
  res.cookies.set(AUTH_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 12 * 60 * 60,
  });
  return res;
}
