import { db } from "./db";

// All customizable site settings live here with sane defaults. The admin
// dashboard writes overrides into the settings table; getSettings() merges
// defaults + overrides so the site always has a complete config.
export interface SiteSettings {
  // Branding
  siteName: string;
  logoText: string;         // shown next to logo mark; falls back to siteName
  logoUrl: string;          // optional image URL for the logo mark
  // Theme
  theme: "dark" | "light";
  accent: string;           // hex, e.g. #3f37c9
  accentHover: string;
  font: string;             // CSS font-family stack name
  // Footer
  footerDescription: string;
  footerBackedByLabel: string;   // e.g. "Backed by"
  footerBackedByName: string;    // e.g. "Ravisen"
  footerBackedByUrl: string;
  footerColumns: FooterColumn[];
  copyrightName: string;    // defaults to siteName
  // Features
  authEnabled: boolean;     // show Login/Register instead of Star on GitHub
  // Limits
  guestMaxUploads: number;  // per rolling window; 0 = unlimited
  userMaxUploads: number;
  maxFileSizeMb: number;
}

export interface FooterColumn {
  title: string;
  links: { label: string; href: string }[];
}

export const DEFAULT_SETTINGS: SiteSettings = {
  siteName: "Convertly",
  logoText: "Convertly",
  logoUrl: "",
  theme: "dark",
  accent: "#3f37c9",
  accentHover: "#332db0",
  font: "Inter",
  footerDescription:
    "Free, open-source file converter for images, video, audio, documents, ebooks, fonts and more. Convert in your browser, no sign-up.",
  footerBackedByLabel: "Backed by",
  footerBackedByName: "Ravisen",
  footerBackedByUrl: "https://ravisen.com",
  footerColumns: [
    {
      title: "Project",
      links: [
        { label: "GitHub", href: "https://github.com/rvieshh/convertly" },
        { label: "Convert", href: "/#converter" },
        { label: "Formats", href: "/#formats" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Docs", href: "/docs" },
        { label: "Report an issue", href: "https://github.com/rvieshh/convertly/issues" },
      ],
    },
    {
      title: "Legal",
      links: [{ label: "MIT License", href: "https://github.com/rvieshh/convertly/blob/main/README.md" }],
    },
  ],
  copyrightName: "Convertly",
  authEnabled: false,
  guestMaxUploads: 0,
  userMaxUploads: 0,
  maxFileSizeMb: 100,
};

export function getSettings(): SiteSettings {
  const rows = db().prepare("SELECT key, value FROM settings").all() as { key: string; value: string }[];
  const overrides: Record<string, unknown> = {};
  for (const r of rows) {
    try {
      overrides[r.key] = JSON.parse(r.value);
    } catch {
      overrides[r.key] = r.value;
    }
  }
  return { ...DEFAULT_SETTINGS, ...(overrides as Partial<SiteSettings>) };
}

export function setSettings(patch: Partial<SiteSettings>) {
  const stmt = db().prepare(
    "INSERT INTO settings(key, value) VALUES(?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value",
  );
  const tx = db().transaction((entries: [string, unknown][]) => {
    for (const [k, v] of entries) stmt.run(k, JSON.stringify(v));
  });
  tx(Object.entries(patch));
}
