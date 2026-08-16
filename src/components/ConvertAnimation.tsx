"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, RefreshCw } from "lucide-react";

// Format pairs that cycle in the hero animation — only conversions Convertly
// actually supports (images, audio, video), so the demo never oversells.
const PAIRS: [string, string][] = [
  ["PNG", "WEBP"],
  ["JPG", "PNG"],
  ["MP4", "MP3"],
  ["WEBP", "AVIF"],
  ["MOV", "MP4"],
  ["WAV", "MP3"],
];

export function ConvertAnimation() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % PAIRS.length), 2600);
    return () => clearInterval(t);
  }, []);

  const [from, to] = PAIRS[i];

  return (
    <div className="relative flex h-[400px] w-full items-center justify-center">
      {/* Background orbit rings + radial glow */}
      <div className="pointer-events-none absolute inset-0 grid place-items-center">
        {[240, 380, 520].map((s, idx) => (
          <motion.div
            key={s}
            className="absolute rounded-full border border-primary/15"
            style={{ width: s, height: s }}
            animate={{ rotate: 360 }}
            transition={{ duration: 40 + idx * 15, repeat: Infinity, ease: "linear" }}
          />
        ))}
        <div className="absolute h-72 w-72 rounded-full bg-primary/40 blur-[90px]" />
        <div className="absolute h-40 w-40 rounded-full bg-secondary/30 blur-[70px]" />
      </div>

      {/* Convert cluster: source → badge → target */}
      <div className="relative flex items-center gap-5">
        {/* Source card */}
        <FileCard label={from} accent={false} />

        {/* Connector + convert badge */}
        <div className="relative flex flex-col items-center px-2">
          <motion.div
            key={`badge-${i}`}
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="z-10 grid h-11 w-11 place-items-center rounded-full border border-primary/40 bg-zinc-900 text-primary shadow-lg"
          >
            <RefreshCw className="h-5 w-5" />
          </motion.div>
          <span className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
            to
          </span>
        </div>

        {/* Target card (glowing = result) */}
        <FileCard label={to} accent />
      </div>
    </div>
  );
}

function FileCard({ label, accent }: { label: string; accent: boolean }) {
  return (
    <motion.div
      initial={{ y: 8, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 18 }}
      className={`relative grid h-32 w-28 place-items-center rounded-2xl border bg-zinc-900/80 backdrop-blur ${
        accent ? "border-primary/50" : "border-zinc-700"
      }`}
    >
      {accent && (
        <div className="absolute -bottom-2 -right-2 h-16 w-16 rounded-full bg-primary/30 blur-2xl" />
      )}
      <FileText className={`h-9 w-9 ${accent ? "text-primary" : "text-zinc-400"}`} />
      <div className="mt-2 h-5 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.span
            key={label}
            initial={{ y: 14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -14, opacity: 0 }}
            transition={{ duration: 0.35 }}
            className={`block text-sm font-bold uppercase tracking-wide ${
              accent ? "text-primary" : "text-zinc-300"
            }`}
          >
            {label}
          </motion.span>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

