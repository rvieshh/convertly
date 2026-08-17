import { NextRequest, NextResponse } from "next/server";
import { verifySession, AUTH_COOKIE, updateAdminCredentials, getAdmin } from "@/lib/auth";

export const runtime = "nodejs";

// Guard: valid admin session required.
async function guard(req: NextRequest): Promise<boolean> {
  return verifySession(req.cookies.get(AUTH_COOKIE)?.value);
}

function validPassword(p: string): string | null {
  if (p.length < 8) return "Password must be at least 8 characters";
  if (!/[a-z]/i.test(p) || !/[0-9]/.test(p)) return "Password must include letters and numbers";
  return null;
}

// GET: whether the admin still must change default credentials.
export async function GET(req: NextRequest) {
  if (!(await guard(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const admin = getAdmin();
  return NextResponse.json({ mustChange: admin?.must_change === 1, username: admin?.username, email: admin?.email });
}

// POST: change username/email/password (used by the forced first-login setup
// and by the settings page later).
export async function POST(req: NextRequest) {
  if (!(await guard(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: { username?: string; email?: string; password?: string; confirm?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const username = (body.username || "").trim();
  const email = (body.email || "").trim();
  const password = body.password || "";
  const confirm = body.confirm || "";

  if (username.length < 3) return NextResponse.json({ error: "Username must be at least 3 characters" }, { status: 400 });
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return NextResponse.json({ error: "Enter a valid email" }, { status: 400 });
  const pwErr = validPassword(password);
  if (pwErr) return NextResponse.json({ error: pwErr }, { status: 400 });
  if (password !== confirm) return NextResponse.json({ error: "Passwords do not match" }, { status: 400 });

  updateAdminCredentials(username, email, password);
  return NextResponse.json({ ok: true });
}
