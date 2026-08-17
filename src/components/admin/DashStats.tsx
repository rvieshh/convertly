"use client";

import type { DashboardStats } from "@/lib/stats";
import { Activity, CheckCircle2, Clock, HardDrive } from "lucide-react";

function human(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
  return `${(bytes / 1024 ** 3).toFixed(2)} GB`;
}

function Card({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="rounded-[12px] border border-line bg-surface p-5">
      <div className="flex items-center gap-2 text-muted">
        <Icon className="h-4 w-4 text-primary" />
        <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
      </div>
      <p className="mt-2 text-2xl font-bold text-white">{value}</p>
    </div>
  );
}

export function StatsSection({ stats }: { stats: DashboardStats }) {
  const maxDaily = Math.max(1, ...stats.daily.map((d) => d.count));
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card icon={Activity} label="Total conversions" value={stats.totalConversions.toLocaleString()} />
        <Card icon={CheckCircle2} label="Success rate" value={`${stats.successRate}%`} />
        <Card icon={Clock} label="Last 24h" value={stats.last24h.toLocaleString()} />
        <Card icon={HardDrive} label="Data processed" value={human(stats.bytesProcessed)} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Daily chart */}
        <div className="rounded-[12px] border border-line bg-surface p-5">
          <h3 className="text-sm font-semibold text-white">Conversions — last 7 days</h3>
          <div className="mt-5 flex h-40 items-end gap-3">
            {stats.daily.map((d, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex w-full flex-1 items-end">
                  <div
                    className="w-full rounded-t-[4px] bg-primary/70 transition-all"
                    style={{ height: `${(d.count / maxDaily) * 100}%`, minHeight: d.count > 0 ? 8 : 2 }}
                    title={`${d.count} conversions`}
                  />
                </div>
                <span className="text-[11px] text-muted">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top conversions */}
        <div className="rounded-[12px] border border-line bg-surface p-5">
          <h3 className="text-sm font-semibold text-white">Top conversions</h3>
          {stats.topConversions.length === 0 ? (
            <p className="mt-4 text-sm text-muted">No conversions yet.</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {stats.topConversions.map((t) => (
                <li key={t.pair} className="flex items-center justify-between text-sm">
                  <span className="font-mono text-zinc-300">{t.pair.toUpperCase()}</span>
                  <span className="text-muted">{t.count}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
