import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { db, now } from "./db";
import { logActivity } from "./stats";

const SECRET = new TextEncoder().encode(
  process.env.AUTH_JWT_SECRET || "dev-insecure-secret-change-me",
);
export const USER_COOKIE = "convertly_user";
const SESSION_DAYS = 30;

export interface UserRow {
  id: number;
  email: string;
  username: string;
  password_hash: string;
  created_at: number;
}

export function findUserByEmail(email: string): UserRow | undefined {
  return db().prepare("SELECT * FROM users WHERE email = ?").get(email.toLowerCase()) as UserRow | undefined;
}

export function createUser(email: string, username: string, password: string): UserRow {
  const hash = bcrypt.hashSync(password, 12);
  const info = db()
    .prepare("INSERT INTO users(email, username, password_hash, created_at) VALUES(?, ?, ?, ?)")
    .run(email.toLowerCase(), username, hash, now());
  logActivity("user", `New user registered: ${username}`);
  return db().prepare("SELECT * FROM users WHERE id = ?").get(info.lastInsertRowid) as UserRow;
}

export function verifyUser(email: string, password: string): UserRow | null {
  const u = findUserByEmail(email);
  if (!u) return null;
  if (!bcrypt.compareSync(password, u.password_hash)) return null;
  return u;
}

export async function createUserSession(user: UserRow): Promise<string> {
  return await new SignJWT({ uid: user.id, username: user.username, role: "user" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DAYS}d`)
    .sign(SECRET);
}

export interface UserSession {
  uid: number;
  username: string;
}

export async function verifyUserSession(token: string | undefined): Promise<UserSession | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, SECRET);
    if (payload.role !== "user") return null;
    return { uid: payload.uid as number, username: payload.username as string };
  } catch {
    return null;
  }
}
