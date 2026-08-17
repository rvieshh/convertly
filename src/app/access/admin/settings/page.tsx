import type { Metadata } from "next";
import { getSettings } from "@/lib/settings";
import { AdminShell } from "@/components/admin/AdminShell";
import { SettingsForm } from "@/components/admin/SettingsForm";

export const metadata: Metadata = {
  title: "Settings — Convertly Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function AdminSettingsPage() {
  const settings = getSettings();
  return (
    <AdminShell title="Settings">
      <SettingsForm initial={settings} />
    </AdminShell>
  );
}
