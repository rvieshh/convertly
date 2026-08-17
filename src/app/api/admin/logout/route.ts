import { NextResponse } from "next/server";
import { AUTH_COOKIE } from "@/lib/auth";
import { logActivity } from "@/lib/stats";

export const runtime = "nodejs";

export async function POST() {
  logActivity("auth", "Admin logged out");
  const res = NextResponse.json({ ok: true });
  res.cookies.set(AUTH_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}
