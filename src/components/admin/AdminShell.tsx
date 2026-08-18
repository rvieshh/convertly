"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Repeat, LayoutDashboard, Settings, LogOut, Menu, X } from "lucide-react";

const NAV = [
  { label: "Dashboard", href: "/access/admin/dashboard", icon: LayoutDashboard },
  { label: "Settings", href: "/access/admin/settings", icon: Settings },
];

export function AdminShell({ children, title }: { children: React.ReactNode; title: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const [drawer, setDrawer] = useState(false);

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/access/admin/login");
    router.refresh();
  };

  const NavLinks = ({ onNavigate }: { onNavigate?: () => void }) => (
    <>
      <nav className="flex-1 space-y-1 p-3">
        {NAV.map((n) => {
          const active = pathname === n.href;
          const Icon = n.icon;
          return (
            <a
              key={n.href}
              href={n.href}
              onClick={onNavigate}
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
    </>
  );

  const Brand = () => (
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
  );

  return (
    <div className="flex min-h-screen bg-bg">
      {/* Desktop sidebar */}
      <aside className="hidden w-56 shrink-0 flex-col border-r border-line bg-surface md:flex">
        <Brand />
        <NavLinks />
      </aside>

      {/* Mobile drawer */}
      {drawer && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setDrawer(false)} />
          <aside className="absolute left-0 top-0 flex h-full w-[85%] max-w-xs flex-col border-r border-line bg-surface">
            <div className="flex items-center justify-between border-b border-line">
              <div className="flex h-14 items-center gap-2 px-5">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-[6px] bg-primary text-white">
                  <Repeat className="h-4 w-4" />
                </span>
                <span className="whitespace-nowrap text-sm font-bold text-white">
                  Convert<span className="text-primary">ly</span>
                </span>
                <span className="shrink-0 rounded bg-primary/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-primary">
                  Admin
                </span>
              </div>
              <button onClick={() => setDrawer(false)} className="mr-2 grid h-8 w-8 shrink-0 place-items-center text-muted hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <NavLinks onNavigate={() => setDrawer(false)} />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-line bg-bg px-4 md:px-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDrawer(true)}
              className="grid h-9 w-9 place-items-center rounded-[8px] text-zinc-300 hover:bg-white/5 md:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-base font-bold text-white">{title}</h1>
          </div>
        </header>
        <div className="p-4 md:p-6">{children}</div>
      </div>
    </div>
  );
}
