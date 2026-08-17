"use client";

import { useRouter, usePathname } from "next/navigation";
import { Repeat, LayoutDashboard, Settings, LogOut } from "lucide-react";

const NAV = [
  { label: "Dashboard", href: "/access/admin/dashboard", icon: LayoutDashboard },
  { label: "Settings", href: "/access/admin/settings", icon: Settings },
];

export function AdminShell({ children, title }: { children: React.ReactNode; title: string }) {
  const router = useRouter();
  const pathname = usePathname();

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/access/admin/login");
    router.refresh();
  };

  return (
    <div className="flex min-h-screen bg-bg">
      {/* Sidebar */}
      <aside className="hidden w-56 shrink-0 flex-col border-r border-line bg-surface md:flex">
        <div className="flex h-14 items-center gap-2 border-b border-line px-5">
          <span className="grid h-7 w-7 place-items-center rounded-[6px] bg-primary text-white">
            <Repeat className="h-4 w-4" />
          </span>
          <span className="text-sm font-bold text-white">
            Convert<span className="text-primary">ly</span>
          </span>
          <span className="ml-1 rounded bg-primary/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-primary">
            Admin
          </span>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {NAV.map((n) => {
            const active = pathname === n.href;
            const Icon = n.icon;
            return (
              <a
                key={n.href}
                href={n.href}
                className={`flex items-center gap-2.5 rounded-[8px] px-3 py-2 text-sm transition-colors ${
                  active ? "bg-primary/15 text-white" : "text-zinc-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
                {n.label}
              </a>
            );
          })}
        </nav>
        <div className="border-t border-line p-3">
          <button
            onClick={logout}
            className="flex w-full items-center gap-2.5 rounded-[8px] px-3 py-2 text-sm text-zinc-400 transition-colors hover:bg-white/5 hover:text-danger"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1">
        <header className="flex h-14 items-center justify-between border-b border-line px-6">
          <h1 className="text-base font-bold text-white">{title}</h1>
          <button
            onClick={logout}
            className="rounded-[6px] px-3 py-1.5 text-sm text-zinc-400 transition-colors hover:text-danger md:hidden"
          >
            Sign out
          </button>
        </header>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
