"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Boxes, ShieldCheck, Trash2, UserCheck, ArrowRight, Image, Film, Music, FileText, Sheet, Presentation, BookOpen, Type, PenTool, Archive, Box, Camera } from "lucide-react";
import { CATEGORIES, TOTAL_FORMATS } from "@/lib/formats";

// Icon per catalog category (matches the category id in formats.ts).
const CAT_ICON: Record<string, React.ComponentType<{ className?: string }>> = {
  image: Image,
  video: Film,
  audio: Music,
  document: FileText,
  spreadsheet: Sheet,
  slides: Presentation,
  ebook: BookOpen,
  font: Type,
  vector: PenTool,
  archive: Archive,
  raw: Camera,
  cad: Box,
};

const SECURITY = [
  {
    icon: Trash2,
    lead: "Automatic deletion",
    body: "files are removed from the server right after the conversion job finishes.",
  },
  {
    icon: UserCheck,
    lead: "No accounts, no mining",
    body: "no sign-up is required and your files are never sold or used to train anything.",
  },
  {
    icon: ShieldCheck,
    lead: "Open source",
    body: "the full pipeline is public on GitHub — audit exactly how files are handled or self-host it.",
  },
];

const COMMON = [
  { from: "PNG", to: "WEBP", note: "smaller, modern image" },
  { from: "MP4", to: "MP3", note: "extract the audio track" },
  { from: "MOV", to: "MP4", note: "widely-compatible video" },
];

export function CatalogSecurity() {
  const [active, setActive] = useState(0);
  const cat = CATEGORIES[active];

  return (
    <section id="formats" className="border-t border-line/60">
      <div className="mx-auto max-w-[1600px] px-6 py-16 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-[1.9fr_1fr]">
          {/* Format Catalog */}
          <div>
            <div className="flex items-center gap-2.5">
              <span className="grid h-8 w-8 place-items-center rounded-[6px] bg-primary/15 text-primary">
                <Boxes className="h-4.5 w-4.5" />
              </span>
              <h2 className="text-xl font-bold text-white">Format Catalog</h2>
            </div>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted">
              Convertly handles {TOTAL_FORMATS} formats across {CATEGORIES.length} categories —
              images, video, audio, documents, ebooks, fonts, vectors and archives.
            </p>

            {/* Category row */}
            <div className="mt-5 flex flex-wrap gap-2">
              {CATEGORIES.map((c, i) => {
                const Icon = CAT_ICON[c.id] ?? Boxes;
                return (
                  <button
                    key={c.id}
                    onClick={() => setActive(i)}
                    className={`inline-flex items-center gap-1.5 rounded-[6px] border px-2.5 py-1.5 text-sm font-medium transition-colors ${
                      i === active
                        ? "border-primary/50 bg-primary/15 text-primary"
                        : "border-line/70 bg-surface text-zinc-300 hover:border-primary/40 hover:text-white"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {c.label}
                    <span className={`text-xs ${i === active ? "text-primary/70" : "text-muted"}`}>
                      {c.formats.length}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="my-6 border-t border-line/70" />

            {/* Inner two columns */}
            <div id="security" className="grid gap-8 sm:grid-cols-[1.4fr_1fr]">
              {/* Format grid */}
              <div>
                <div className="flex items-baseline justify-between">
                  <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
                    {cat.label} formats
                  </p>
                  <span className="text-xs text-muted">{cat.formats.length} listed</span>
                </div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={cat.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18 }}
                    className="mt-3 flex flex-wrap gap-1.5"
                  >
                    {cat.formats.map((f) => (
                      <span
                        key={f}
                        className="rounded-[5px] border border-line/70 bg-surface px-2.5 py-1.5 font-mono text-xs text-zinc-300"
                      >
                        {f}
                      </span>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Common conversions */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
                  Common conversions
                </p>
                <ul className="mt-3 space-y-3">
                  {COMMON.map((c) => (
                    <li key={`${c.from}-${c.to}`}>
                      <a
                        href="#converter"
                        className="group inline-flex items-center gap-2 text-sm font-semibold"
                      >
                        <span className="text-zinc-300">{c.from}</span>
                        <ArrowRight className="h-3.5 w-3.5 text-primary transition-transform group-hover:translate-x-0.5" />
                        <span className="text-primary">{c.to}</span>
                      </a>
                      <p className="text-xs text-muted">{c.note}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Data Security */}
          <div>
            <div className="flex items-center gap-2.5">
              <span className="grid h-8 w-8 place-items-center rounded-[6px] bg-primary/15 text-primary">
                <ShieldCheck className="h-4.5 w-4.5" />
              </span>
              <h2 className="text-xl font-bold text-white">Data Security</h2>
            </div>
            <p className="mt-3 text-[15px] leading-relaxed text-muted">
              Files are processed only for the conversion you request, then removed. The whole
              pipeline is open source, so nothing is hidden.
            </p>

            <ul className="mt-5 space-y-4">
              {SECURITY.map((s) => (
                <li key={s.lead} className="flex gap-3">
                  <span className="mt-0.5 text-primary">
                    <s.icon className="h-4.5 w-4.5" />
                  </span>
                  <p className="text-sm leading-relaxed text-muted">
                    <span className="font-semibold text-white">{s.lead}:</span> {s.body}
                  </p>
                </li>
              ))}
            </ul>

            <a
              href="https://github.com/rvieshh/convertly"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary-hover"
            >
              Read the source on GitHub <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
