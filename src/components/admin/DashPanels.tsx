"use client";

import type { EngineStatus, SystemInfo } from "@/lib/system";
import { Cpu, CheckCircle2, XCircle } from "lucide-react";

function human(bytes: number): string {
  if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(0)} MB`;
  return `${(bytes / 1024 ** 3).toFixed(1)} GB`;
}

function uptime(sec: number): string {
  const d = Math.floor(sec / 86400);
  const h = Math.floor((sec % 86400) / 3600);
  const m = Math.floor((sec % 3600) / 60);
  return d > 0 ? `${d}d ${h}h` : h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export function EngineSection({ engines }: { engines: EngineStatus[] }) {
  const up = engines.filter((e) => e.installed).length;
  return (
    <div className="rounded-[12px] border border-line bg-surface p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">Conversion engines</h3>
        <span className="text-xs text-muted">
          {up}/{engines.length} available
        </span>
      </div>
      <ul className="mt-4 divide-y divide-line/60">
        {engines.map((e) => (
          <li key={e.binary} className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2.5">
              {e.installed ? (
                <CheckCircle2 className="h-4 w-4 text-success" />
              ) : (
                <XCircle className="h-4 w-4 text-danger" />
              )}
              <div>
                <p className="text-sm font-medium text-white">{e.name}</p>
                <p className="text-[11px] text-muted">{e.purpose}</p>
              </div>
            </div>
            <span className="font-mono text-xs text-muted">{e.installed ? e.version : "missing"}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SystemSection({ system }: { system: SystemInfo }) {
  const memUsedPct = Math.round(((system.totalMem - system.freeMem) / system.totalMem) * 100);
  const rows: [string, string][] = [
    ["Platform", `${system.platform} · ${system.arch}`],
    ["Node", system.nodeVersion],
    ["CPU cores", String(system.cpuCount)],
    ["Load avg", system.loadAvg.join(" / ")],
    ["Memory", `${human(system.totalMem - system.freeMem)} / ${human(system.totalMem)} (${memUsedPct}%)`],
    ["Uptime", uptime(system.uptimeSec)],
  ];
  if (system.disk) rows.push(["Disk", `${human(system.disk.free)} free (${system.disk.usedPct}% used)`]);

  return (
    <div className="rounded-[12px] border border-line bg-surface p-5">
      <div className="mb-3 flex items-center gap-2">
        <Cpu className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold text-white">System</h3>
      </div>
      <dl className="space-y-2 text-sm">
        {rows.map(([k, v]) => (
          <div key={k} className="flex items-center justify-between">
            <dt className="text-muted">{k}</dt>
            <dd className="font-mono text-xs text-zinc-300">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function ActivitySection({
  activity,
}: {
  activity: { type: string; message: string; created_at: number }[];
}) {
  return (
    <div className="rounded-[12px] border border-line bg-surface p-5">
      <h3 className="text-sm font-semibold text-white">Recent activity</h3>
      {activity.length === 0 ? (
        <p className="mt-4 text-sm text-muted">Nothing yet.</p>
      ) : (
        <ul className="mt-4 space-y-2.5">
          {activity.map((a, i) => (
            <li key={i} className="flex items-start justify-between gap-3 text-sm">
              <span className="text-zinc-300">{a.message}</span>
              <span className="shrink-0 text-[11px] text-muted">
                {new Date(a.created_at).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
