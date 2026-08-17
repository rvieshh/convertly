import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { db, now } from "./db";
import { logActivity } from "./stats";

const SECRET = new TextEncoder().encode(
  process.env.AUTH_JWT_SECRET || "dev-insecure-secret-change-me",
);
const COOKIE = "convertly_admin";
const SESSION_HOURS = 12;

export interface AdminRow {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  must_change: number;
  created_at: number;
  updated_at: number;
}

// Seed the single admin row from .env on first run. The default password is
// hashed immediately and must_change=1 forces a credential reset on first login.
export function ensureAdminSeeded() {
  const existing = db().prepare("SELECT id FROM admin WHERE id = 1").get();
  if (existing) return;
  const username = process.env.ADMIN_DEFAULT_USERNAME || "admin";
  const email = process.env.ADMIN_DEFAULT_EMAIL || "admin@example.com";
  const password = process.env.ADMIN_DEFAULT_PASSWORD || "changeme";
  const hash = bcrypt.hashSync(password, 12);
  const t = now();
  db()
    .prepare(
      "INSERT INTO admin(id, username, email, password_hash, must_change, created_at, updated_at) VALUES(1, ?, ?, ?, 1, ?, ?)",
    )
    .run(username, email, hash, t, t);
}

export function getAdmin(): AdminRow | undefined {
  ensureAdminSeeded();
  return db().prepare("SELECT * FROM admin WHERE id = 1").get() as AdminRow | undefined;
}

// Verify a login by username OR email + password.
export function verifyAdmin(identifier: string, password: string): AdminRow | null {
  const admin = getAdmin();
  if (!admin) return null;
  const idOk =
    identifier.toLowerCase() === admin.username.toLowerCase() ||
    identifier.toLowerCase() === admin.email.toLowerCase();
  if (!idOk) return null;
  if (!bcrypt.compareSync(password, admin.password_hash)) return null;
  return admin;
}

export function updateAdminCredentials(username: string, email: string, password: string) {
  const hash = bcrypt.hashSync(password, 12);
  db()
    .prepare(
      "UPDATE admin SET username = ?, email = ?, password_hash = ?, must_change = 0, updated_at = ? WHERE id = 1",
    )
    .run(username, email, hash, now());
  logActivity("admin", "Admin credentials updated");
}

// --- JWT session ---
export async function createSession(): Promise<string> {
  return await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_HOURS}h`)
    .sign(SECRET);
}

export async function verifySession(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload.role === "admin";
  } catch {
    return false;
  }
}

export const AUTH_COOKIE = COOKIE;

// --- brute-force rate limit (per IP) ---
const MAX_ATTEMPTS = 8;
const LOCK_MS = 15 * 60 * 1000;

export function checkRateLimit(ip: string): { allowed: boolean; retryMs: number } {
  const row = db().prepare("SELECT count, locked_until FROM login_attempts WHERE ip = ?").get(ip) as
    | { count: number; locked_until: number }
    | undefined;
  if (row && row.locked_until > now()) {
    return { allowed: false, retryMs: row.locked_until - now() };
  }
  return { allowed: true, retryMs: 0 };
}

export function recordLoginFailure(ip: string) {
  const row = db().prepare("SELECT count FROM login_attempts WHERE ip = ?").get(ip) as
    | { count: number }
    | undefined;
  const count = (row?.count ?? 0) + 1;
  const locked_until = count >= MAX_ATTEMPTS ? now() + LOCK_MS : 0;
  db()
    .prepare(
      "INSERT INTO login_attempts(ip, count, locked_until) VALUES(?, ?, ?) ON CONFLICT(ip) DO UPDATE SET count = ?, locked_until = ?",
    )
    .run(ip, count, locked_until, count, locked_until);
}

export function clearLoginFailures(ip: string) {
  db().prepare("DELETE FROM login_attempts WHERE ip = ?").run(ip);
}
