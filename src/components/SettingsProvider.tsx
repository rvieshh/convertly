"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { SiteSettings } from "@/lib/settings";

const SettingsCtx = createContext<SiteSettings | null>(null);

export function SettingsProvider({
  settings,
  children,
}: {
  settings: SiteSettings;
  children: ReactNode;
}) {
  return <SettingsCtx.Provider value={settings}>{children}</SettingsCtx.Provider>;
}

export function useSettings(): SiteSettings {
  const s = useContext(SettingsCtx);
  if (!s) throw new Error("useSettings must be used within SettingsProvider");
  return s;
}
