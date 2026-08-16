"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Monitor, Link2, Cloud, HardDrive } from "lucide-react";

interface Props {
  onDevice: () => void;
  onUrl: () => void;
}

const CLOUD = [
  { label: "From Google Drive", icon: HardDrive },
  { label: "From Dropbox", icon: Cloud },
  { label: "From OneDrive", icon: Cloud },
];

/**
 * CloudConvert-style split "Select File" button with a source dropdown.
 * Device + URL uploads are wired; cloud providers are shown but disabled
 * (they'd each need OAuth) so the menu matches CloudConvert without faking it.
 */
export function SelectFileButton({ onDevice, onUrl }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div ref={ref} className="relative inline-flex" onClick={(e) => e.stopPropagation()}>
      {/* main action */}
      <button
        onClick={onDevice}
        className="rounded-l-[5px] bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
      >
        Select File
      </button>
      {/* dropdown toggle */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Upload options"
        className="rounded-r-[5px] border-l border-white/20 bg-primary px-2 py-2.5 text-white transition-colors hover:bg-primary-hover"
      >
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.14 }}
            className="absolute left-1/2 top-full z-50 mt-2 w-60 -translate-x-1/2 overflow-hidden rounded-[8px] border border-line bg-surface py-1.5 text-left shadow-2xl"
          >
            <MenuItem icon={Monitor} label="From my device" onClick={() => { setOpen(false); onDevice(); }} />
            <MenuItem icon={Link2} label="By URL" onClick={() => { setOpen(false); onUrl(); }} />
            <div className="my-1.5 border-t border-line/70" />
            {CLOUD.map((c) => (
              <MenuItem key={c.label} icon={c.icon} label={c.label} soon />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MenuItem({
  icon: Icon,
  label,
  onClick,
  soon,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick?: () => void;
  soon?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={soon}
      className={`flex w-full items-center gap-3 px-4 py-2 text-sm transition-colors ${
        soon
          ? "cursor-not-allowed text-zinc-500"
          : "text-zinc-200 hover:bg-white/5 hover:text-white"
      }`}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className="flex-1 text-left">{label}</span>
      {soon && <span className="text-[10px] uppercase tracking-wide text-zinc-600">soon</span>}
    </button>
  );
}
