import type { Metadata } from "next";
import { getStats, getRecentActivity } from "@/lib/stats";
import { getEngineStatuses, getSystemInfo } from "@/lib/system";
import { getSettings } from "@/lib/settings";
import { DashboardClient } from "@/components/admin/DashboardClient";

export const metadata: Metadata = {
  title: "Dashboard — Convertly Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [stats, engines, system, activity, settings] = await Promise.all([
    Promise.resolve(getStats()),
    getEngineStatuses(),
    getSystemInfo(),
    Promise.resolve(getRecentActivity(15)),
    Promise.resolve(getSettings()),
  ]);

  return (
    <DashboardClient
      stats={stats}
      engines={engines}
      system={system}
      activity={activity}
      settings={settings}
    />
  );
}
