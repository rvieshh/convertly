import { db, now } from "./db";
import { getSettings } from "./settings";
import crypto from "crypto";

// Rolling-window upload limiting for guests. Counts are keyed by a hashed IP so
// raw IPs are never stored. Users (once auth lands) get the higher user limit.
const WINDOW_MS = 24 * 60 * 60 * 1000; // 24h rolling window

db().exec(`
  CREATE TABLE IF NOT EXISTS usage (
    ip_hash TEXT NOT NULL,
    ts INTEGER NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_usage_ts ON usage(ts);
`);

export function hashIp(ip: string): string {
  const salt = process.env.AUTH_JWT_SECRET || "salt";
  return crypto.createHash("sha256").update(ip + salt).digest("hex").slice(0, 32);
}

export interface LimitResult {
  allowed: boolean;
  reason?: string;
  remaining?: number;
}

// Check whether this IP may upload another file, and whether the file size is
// within the configured cap. Does not record — call recordUpload() on success.
export function checkUploadAllowed(ip: string, fileBytes: number, isUser = false): LimitResult {
  const s = getSettings();
  const maxBytes = s.maxFileSizeMb * 1024 * 1024;
  if (s.maxFileSizeMb > 0 && fileBytes > maxBytes) {
    return { allowed: false, reason: `File exceeds the ${s.maxFileSizeMb} MB limit` };
  }

  const cap = isUser ? s.userMaxUploads : s.guestMaxUploads;
  if (!cap || cap <= 0) return { allowed: true }; // 0 = unlimited

  const iph = hashIp(ip);
  const since = now() - WINDOW_MS;
  const used = (db().prepare("SELECT COUNT(*) c FROM usage WHERE ip_hash = ? AND ts > ?").get(iph, since) as { c: number }).c;
  if (used >= cap) {
    return { allowed: false, reason: `Upload limit reached (${cap} per day). Try again later.`, remaining: 0 };
  }
  return { allowed: true, remaining: cap - used };
}

export function recordUpload(ip: string) {
  try {
    db().prepare("INSERT INTO usage(ip_hash, ts) VALUES(?, ?)").run(hashIp(ip), now());
    // Opportunistic cleanup of old rows.
    if (Math.random() < 0.02) {
      db().prepare("DELETE FROM usage WHERE ts < ?").run(now() - WINDOW_MS);
    }
  } catch {
    /* ignore */
  }
}
