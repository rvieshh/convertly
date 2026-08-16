"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, RefreshCw } from "lucide-react";

// Format pairs that cycle in the hero animation, mimicking a live conversion.
const PAIRS: [string, string][] = [
  ["PDF", "DOCX"],
  ["PNG", "WEBP"],
  ["MP4", "MP3"],
  ["JPG", "AVIF"],
  ["WEBM", "GIF"],
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
    <div className="relative flex h-[340px] w-full items-center justify-center">
      {/* Background orbit rings + radial glow */}
      <div className="pointer-events-none absolute inset-0 grid place-items-center">
        {[220, 340, 460].map((s, idx) => (
          <motion.div
            key={s}
            className="absolute rounded-full border border-teal/10"
            style={{ width: s, height: s }}
            animate={{ rotate: 360 }}
            transition={{ duration: 40 + idx * 15, repeat: Infinity, ease: "linear" }}
          />
        ))}
        <div className="absolute h-64 w-64 rounded-full bg-teal/20 blur-3xl" />
      </div>

      {/* Convert cluster: source → badge → target */}
      <div className="relative flex items-center gap-5">
        {/* Source card */}
        <FileCard label={from} accent={false} />

        {/* Connector + convert badge */}
        <div className="relative flex flex-col items-center">
          <TransferLine />
          <motion.div
            key={`badge-${i}`}
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="z-10 grid h-11 w-11 place-items-center rounded-full border border-teal/40 bg-zinc-900 text-teal shadow-lg"
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
        accent ? "border-teal/50" : "border-zinc-700"
      }`}
    >
      {accent && (
        <div className="absolute -bottom-2 -right-2 h-16 w-16 rounded-full bg-teal/30 blur-2xl" />
      )}
      <FileText className={`h-9 w-9 ${accent ? "text-teal" : "text-zinc-400"}`} />
      <div className="mt-2 h-5 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.span
            key={label}
            initial={{ y: 14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -14, opacity: 0 }}
            transition={{ duration: 0.35 }}
            className={`block text-sm font-bold uppercase tracking-wide ${
              accent ? "text-teal" : "text-zinc-300"
            }`}
          >
            {label}
          </motion.span>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// Animated dashed line with a light pulse travelling along it (the "transfer").
function TransferLine() {
  return (
    <div className="absolute left-1/2 top-1/2 -z-0 h-px w-40 -translate-x-1/2 -translate-y-1/2 overflow-hidden">
      <div className="h-full w-full bg-gradient-to-r from-transparent via-zinc-600 to-transparent" />
      <motion.div
        className="absolute top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-teal shadow-[0_0_8px_2px_rgba(57,173,181,0.7)]"
        animate={{ left: ["0%", "100%"] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
