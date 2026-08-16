"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Repeat, ChevronDown } from "lucide-react";
import { TOOL_GROUPS } from "@/lib/tools";

export function Header() {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openMenu = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  };

  useEffect(() => () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  return (
    <header className="sticky top-0 z-[100] border-b border-white/5 bg-[#18181b]/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-[1600px] items-center justify-between px-6 lg:px-12">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-[6px] bg-primary text-white">
            <Repeat className="h-4 w-4" />
          </span>
          <span className="text-[15px] font-bold tracking-tight text-white">
            Convert<span className="text-primary">ly</span>
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
                  className="absolute left-0 top-full mt-1 w-[440px] rounded-[12px] border border-line bg-surface p-5 shadow-2xl"
                >
                  <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                    {TOOL_GROUPS.map((g) => (
                      <div key={g.title}>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted">
                          {g.title}
                        </p>
                        <ul className="space-y-0.5">
                          {g.links.map((l) => (
                            <li key={l.label}>
                              <a
                                href={l.href}
                                className="block rounded-[6px] px-2 py-1.5 text-sm text-zinc-300 transition-colors hover:bg-white/5 hover:text-white"
                              >
                                {l.label}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <a
            href="#formats"
            className="rounded-[6px] px-3 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-white/5 hover:text-white"
          >
            Formats
          </a>
        </nav>

        {/* Right CTA */}
        <a
          href="https://github.com/rvieshh/convertly"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-[5px] bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
        >
          Star on GitHub
        </a>
      </div>
    </header>
  );
}
