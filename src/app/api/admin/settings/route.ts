import { NextRequest, NextResponse } from "next/server";
import { verifySession, AUTH_COOKIE } from "@/lib/auth";
import { getSettings, setSettings, DEFAULT_SETTINGS, type SiteSettings } from "@/lib/settings";
import { logActivity } from "@/lib/stats";

export const runtime = "nodejs";

async function guard(req: NextRequest): Promise<boolean> {
  return verifySession(req.cookies.get(AUTH_COOKIE)?.value);
}

export async function GET(req: NextRequest) {
  if (!(await guard(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ settings: getSettings(), defaults: DEFAULT_SETTINGS });
}

// Whitelist of writable keys — never trust arbitrary keys from the client.
const KEYS: (keyof SiteSettings)[] = [
  "siteName", "logoText", "logoUrl", "theme", "accent", "accentHover", "font",
  "footerDescription", "footerBackedByLabel", "footerBackedByName", "footerBackedByUrl",
  "footerColumns", "copyrightName", "authEnabled",
  "guestMaxUploads", "userMaxUploads", "maxFileSizeMb",
];

function isHex(s: unknown): s is string {
  return typeof s === "string" && /^#[0-9a-fA-F]{6}$/.test(s);
}

export async function POST(req: NextRequest) {
  if (!(await guard(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: Partial<SiteSettings>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const patch: Partial<SiteSettings> = {};
  for (const k of KEYS) {
    if (!(k in body)) continue;
    const v = body[k];
    // Light validation per field.
    if ((k === "accent" || k === "accentHover") && !isHex(v)) {
      return NextResponse.json({ error: `${k} must be a #RRGGBB hex color` }, { status: 400 });
    }
    if (k === "theme" && v !== "dark" && v !== "light") {
      return NextResponse.json({ error: "theme must be dark or light" }, { status: 400 });
    }
    if ((k === "guestMaxUploads" || k === "userMaxUploads" || k === "maxFileSizeMb") && typeof v !== "number") {
      return NextResponse.json({ error: `${k} must be a number` }, { status: 400 });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (patch as any)[k] = v;
  }

  setSettings(patch);
  logActivity("settings", "Site settings updated");
  return NextResponse.json({ ok: true, settings: getSettings() });
}
