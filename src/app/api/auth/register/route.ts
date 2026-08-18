import { NextRequest, NextResponse } from "next/server";
import { createUser, findUserByEmail, createUserSession, USER_COOKIE } from "@/lib/userauth";
import { getSettings } from "@/lib/settings";

export const runtime = "nodejs";

function secureFlag(req: NextRequest): boolean {
  const proto = req.headers.get("x-forwarded-proto") || (req.nextUrl.protocol === "https:" ? "https" : "http");
  return proto === "https";
}

export async function POST(req: NextRequest) {
  // Feature-gated: registration only works when the admin enabled auth.
  if (!getSettings().authEnabled) {
    return NextResponse.json({ error: "Registration is disabled" }, { status: 403 });
  }

  let body: { email?: string; username?: string; password?: string; confirm?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const email = (body.email || "").trim().toLowerCase();
  const username = (body.username || "").trim();
  const password = body.password || "";
  const confirm = body.confirm || "";

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return NextResponse.json({ error: "Enter a valid email" }, { status: 400 });
  if (username.length < 3) return NextResponse.json({ error: "Username must be at least 3 characters" }, { status: 400 });
  if (password.length < 8) return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
  if (!/[a-z]/i.test(password) || !/[0-9]/.test(password)) return NextResponse.json({ error: "Password must include letters and numbers" }, { status: 400 });
  if (password !== confirm) return NextResponse.json({ error: "Passwords do not match" }, { status: 400 });

  if (findUserByEmail(email)) return NextResponse.json({ error: "That email is already registered" }, { status: 409 });

  const user = createUser(email, username, password);
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
