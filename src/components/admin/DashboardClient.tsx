"use client";

import { AdminShell } from "@/components/admin/AdminShell";
import { StatsSection } from "@/components/admin/DashStats";
import { EngineSection, SystemSection, ActivitySection } from "@/components/admin/DashPanels";
import type { DashboardStats } from "@/lib/stats";
import type { EngineStatus, SystemInfo } from "@/lib/system";
import type { SiteSettings } from "@/lib/settings";

export function DashboardClient({
  stats,
  engines,
  system,
  activity,
  settings,
}: {
  stats: DashboardStats;
  engines: EngineStatus[];
  system: SystemInfo;
  activity: { type: string; message: string; created_at: number }[];
  settings: SiteSettings;
}) {
  return (
    <AdminShell title="Dashboard">
      <div className="space-y-6">
        <StatsSection stats={stats} />
        <div className="grid gap-6 lg:grid-cols-2">
          <EngineSection engines={engines} />
          <div className="space-y-6">
            <SystemSection system={system} />
            <ActivitySection activity={activity} />
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
