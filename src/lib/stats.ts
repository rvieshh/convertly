import { db, now } from "./db";

export interface ConversionLog {
  sourceExt: string;
  targetExt: string;
  kind: "convert" | "optimize";
  op?: string;
  ok: boolean;
  bytesIn?: number;
  bytesOut?: number;
  ms?: number;
  ipHash?: string;
}

export function logConversion(c: ConversionLog) {
  try {
    db()
      .prepare(
        `INSERT INTO conversions(source_ext, target_ext, kind, op, ok, bytes_in, bytes_out, ms, ip_hash, created_at)
         VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .run(
        c.sourceExt,
        c.targetExt,
        c.kind,
        c.op ?? null,
        c.ok ? 1 : 0,
        c.bytesIn ?? 0,
        c.bytesOut ?? 0,
        c.ms ?? 0,
        c.ipHash ?? null,
        now(),
      );
  } catch {
    /* never let logging break a conversion */
  }
}

export function logActivity(type: string, message: string) {
  try {
    db().prepare("INSERT INTO activity(type, message, created_at) VALUES(?, ?, ?)").run(type, message, now());
  } catch {
    /* ignore */
  }
}

export interface DashboardStats {
  totalConversions: number;
  successRate: number;
  last24h: number;
  last7d: number;
  bytesProcessed: number;
  topConversions: { pair: string; count: number }[];
  daily: { day: string; count: number }[];
}

export function getStats(): DashboardStats {
  const d = db();
  const total = (d.prepare("SELECT COUNT(*) c FROM conversions").get() as { c: number }).c;
  const ok = (d.prepare("SELECT COUNT(*) c FROM conversions WHERE ok = 1").get() as { c: number }).c;
  const t = now();
  const day = 24 * 60 * 60 * 1000;
  const last24h = (d.prepare("SELECT COUNT(*) c FROM conversions WHERE created_at > ?").get(t - day) as { c: number }).c;
  const last7d = (d.prepare("SELECT COUNT(*) c FROM conversions WHERE created_at > ?").get(t - 7 * day) as { c: number }).c;
  const bytes = (d.prepare("SELECT COALESCE(SUM(bytes_in),0) s FROM conversions").get() as { s: number }).s;

  const top = d
    .prepare(
      `SELECT source_ext || ' -> ' || target_ext AS pair, COUNT(*) AS count
       FROM conversions GROUP BY pair ORDER BY count DESC LIMIT 8`,
    )
    .all() as { pair: string; count: number }[];

  // Daily counts for the last 7 days.
  const daily: { day: string; count: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - i);
    const s = start.getTime();
    const e = s + day;
    const c = (d.prepare("SELECT COUNT(*) c FROM conversions WHERE created_at >= ? AND created_at < ?").get(s, e) as { c: number }).c;
    daily.push({ day: start.toLocaleDateString("en-US", { weekday: "short" }), count: c });
  }

  return {
    totalConversions: total,
    successRate: total ? Math.round((ok / total) * 100) : 100,
    last24h,
    last7d,
    bytesProcessed: bytes,
    topConversions: top,
    daily,
  };
}

export function getRecentActivity(limit = 20): { type: string; message: string; created_at: number }[] {
  return db()
    .prepare("SELECT type, message, created_at FROM activity ORDER BY created_at DESC LIMIT ?")
    .all(limit) as { type: string; message: string; created_at: number }[];
}

export function getRecentConversions(limit = 20) {
  return db()
    .prepare(
      "SELECT source_ext, target_ext, kind, ok, bytes_in, bytes_out, ms, created_at FROM conversions ORDER BY created_at DESC LIMIT ?",
    )
    .all(limit);
}
