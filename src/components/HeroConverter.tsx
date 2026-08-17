"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, RefreshCw, ChevronDown } from "lucide-react";
import { targetsFor, FORMAT_LABELS, allInputExts } from "@/lib/formats";
import { FormatPicker } from "@/components/FormatPicker";

// A few source formats to auto-cycle through until the user interacts.
const DEMO_SOURCES = ["png", "mp4", "docx", "webp", "mov", "epub"];

function label(ext: string) {
  return FORMAT_LABELS[ext] ?? ext.toUpperCase();
}

export function HeroConverter() {
  const [source, setSource] = useState("png");
  const [target, setTarget] = useState("");
  const [touched, setTouched] = useState(false);
  const [i, setI] = useState(0);

  const sources = allInputExts();
  const targets = targetsFor(source);

  // Auto-cycle the demo until the user picks something.
  useEffect(() => {
    if (touched) return;
    const t = setInterval(() => {
      setI((v) => {
        const next = (v + 1) % DEMO_SOURCES.length;
        const s = DEMO_SOURCES[next];
        setSource(s);
        setTarget(targetsFor(s)[0] ?? "");
        return next;
      });
    }, 2600);
    return () => clearInterval(t);
  }, [touched]);

  // keep target valid when source changes
  useEffect(() => {
    if (target && !targets.includes(target)) setTarget("");
  }, [source, target, targets]);

  return (
    <div className="relative flex h-[320px] w-full items-center justify-center">
      {/* glow + rings */}
      <div className="pointer-events-none absolute inset-0 grid place-items-center">
        {[240, 380, 520].map((s, idx) => (
          <motion.div
            key={s}
            className="absolute rounded-full border border-primary/12"
            style={{ width: s, height: s }}
            animate={{ rotate: 360 }}
            transition={{ duration: 40 + idx * 15, repeat: Infinity, ease: "linear" }}
          />
        ))}
        <div className="absolute h-64 w-64 rounded-full bg-primary/25 blur-[90px]" />
      </div>

      <div className="relative flex items-center gap-4">
        {/* Source card */}
        <Card>
          <FileText className="h-7 w-7 text-zinc-400" />
          <div className="relative mt-2">
            <select
              value={source}
              onChange={(e) => {
                setTouched(true);
                setSource(e.target.value);
                setTarget("");
              }}
              className="w-24 cursor-pointer appearance-none rounded-[5px] border border-line bg-transparent px-2 py-1 pr-6 text-center text-sm font-semibold text-white outline-none focus:border-primary"
            >
              {sources.map((s) => (
                <option key={s} value={s} className="bg-surface">
                  {label(s)}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
          </div>
        </Card>

        {/* TO badge */}
        <div className="flex flex-col items-center px-1">
          <motion.div
            key={`${source}-${target}`}
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
            className="z-10 grid h-11 w-11 place-items-center rounded-full border border-primary/40 bg-zinc-900 text-primary shadow-lg"
          >
            <RefreshCw className="h-5 w-5" />
          </motion.div>
          <span className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
            to
          </span>
        </div>

        {/* Target card — opens the real format picker */}
        <Card accent>
          <FileText className="h-7 w-7 text-primary" />
          <div className="mt-2" onClick={() => setTouched(true)}>
            <FormatPicker
              targets={targets}
              value={target}
              onChange={(fmt) => {
                setTouched(true);
                setTarget(fmt);
              }}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}

function Card({ children, accent }: { children: React.ReactNode; accent?: boolean }) {
  return (
    <div
      className={`flex h-36 w-36 flex-col items-center justify-center rounded-[12px] border bg-surface elev-raised ${
        accent ? "border-primary/40" : "border-line"
      }`}
    >
      {children}
    </div>
  );
}
