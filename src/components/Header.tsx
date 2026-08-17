"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Repeat,
  ChevronDown,
  Image,
  Film,
  Music,
  FileText,
  FileSpreadsheet,
  Presentation,
  BookOpen,
  Type,
  PenTool,
  Archive,
  Camera,
  FileType,
  ScanText,
  Minimize2,
} from "lucide-react";
import { CONVERT_GROUP, OPTIMIZE_GROUP } from "@/lib/tools";
import { useSettings } from "@/components/SettingsProvider";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  image: Image,
  video: Film,
  audio: Music,
  document: FileText,
  spreadsheet: FileSpreadsheet,
  slides: Presentation,
  ebook: BookOpen,
  font: Type,
  vector: PenTool,
  archive: Archive,
  raw: Camera,
  pdf: FileType,
  ocr: ScanText,
  compress: Minimize2,
};

export function Header() {
  const settings = useSettings();
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openMenu = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  };

  useEffect(
    () => () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    },
    [],
  );

  return (
    <header className="sticky top-0 z-[100] border-b border-line/60 bg-surface/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-[1600px] items-center justify-between px-6 lg:px-12">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center overflow-hidden rounded-[6px] bg-primary text-white">
            {settings.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={settings.logoUrl} alt={settings.siteName} className="h-full w-full object-cover" />
            ) : (
              <Repeat className="h-4 w-4" />
            )}
          </span>
          <span className="text-[15px] font-bold tracking-tight text-white">
            {settings.logoText || settings.siteName}
          </span>
        </a>

        {/* Center nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {/* Tools dropdown */}
          <div className="relative" onMouseEnter={openMenu} onMouseLeave={scheduleClose}>
            <button className="flex items-center gap-1 rounded-[6px] px-3 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-white/5 hover:text-white">
              Tools
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}
              />
            </button>

            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 top-full mt-1 w-[560px] rounded-[12px] border border-line bg-surface p-5 shadow-2xl"
                >
                  <div className="grid grid-cols-[1.7fr_1fr] gap-x-6">
                    {/* Convert Files — icon grid, two sub-columns */}
                    <div>
                      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted">
                        {CONVERT_GROUP.title}
                      </p>
                      <ul className="grid grid-cols-2 gap-x-3 gap-y-0.5">
                        {CONVERT_GROUP.links.map((l) => {
                          const Icon = ICONS[l.icon] ?? FileText;
                          return (
                            <li key={l.label}>
                              <a
                                href={l.href}
                                className="flex items-center gap-2.5 rounded-[6px] px-2 py-1.5 text-sm text-zinc-300 transition-colors hover:bg-white/5 hover:text-white"
                              >
                                <Icon className="h-4 w-4 shrink-0 text-primary/80" />
                                {l.label.replace(" Converter", "")}
                              </a>
                            </li>
                          );
                        })}
                      </ul>
                    </div>

                    {/* Optimize Files — icon list */}
                    <div className="border-l border-line/60 pl-5">
                      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted">
                        {OPTIMIZE_GROUP.title}
                      </p>
                      <ul className="space-y-0.5">
                        {OPTIMIZE_GROUP.links.map((l) => {
                          const Icon = ICONS[l.icon] ?? Minimize2;
                          return (
                            <li key={l.label}>
                              <a
                                href={l.href}
                                className="flex items-center gap-2.5 rounded-[6px] px-2 py-1.5 text-sm text-zinc-300 transition-colors hover:bg-white/5 hover:text-white"
                              >
                                <Icon className="h-4 w-4 shrink-0 text-primary/80" />
                                {l.label}
                              </a>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <a
            href="/#formats"
            className="rounded-[5px] px-3 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-white/5 hover:text-white"
          >
            Formats
          </a>
          <a
            href="/docs"
            className="rounded-[5px] px-3 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-white/5 hover:text-white"
          >
            Docs
          </a>
        </nav>

        {/* Right CTA */}
        {settings.authEnabled ? (
          <div className="flex items-center gap-3">
            <a
              href="/login"
              className="rounded-[5px] px-3 py-2 text-sm font-medium text-zinc-300 transition-colors hover:text-white"
            >
              Login
            </a>
            <a
              href="/register"
              className="rounded-[5px] bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
            >
              Register
            </a>
          </div>
        ) : (
          <a
            href="https://github.com/rvieshh/convertly"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-[5px] bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
          >
            Star on GitHub
          </a>
        )}
      </div>
    </header>
  );
}
