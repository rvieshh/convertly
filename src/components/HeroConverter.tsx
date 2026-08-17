"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  RefreshCw,
  FileImage,
  FileAudio,
  FileVideo,
  FileText,
  FileSpreadsheet,
  Presentation,
  BookOpen,
  Type,
  PenTool,
  FileArchive,
  Camera,
  File as FileIcon,
} from "lucide-react";
import { targetsFor, allInputExts, categoryOf } from "@/lib/formats";
import { FormatPicker } from "@/components/FormatPicker";
import { useUploadHandoff } from "@/components/UploadContext";

// Auto-cycle these source formats until the user interacts.
const DEMO = ["png", "mp4", "docx", "webp", "mov", "epub"];

// Icon per format, derived from its catalog category.
const ICON_BY_CAT: Record<string, React.ComponentType<{ className?: string }>> = {
  image: FileImage,
  audio: FileAudio,
  video: FileVideo,
  document: FileText,
  spreadsheet: FileSpreadsheet,
  slides: Presentation,
  ebook: BookOpen,
  font: Type,
  vector: PenTool,
  archive: FileArchive,
  raw: Camera,
};

function iconFor(ext: string) {
  return ICON_BY_CAT[categoryOf(ext)] ?? FileIcon;
}

export function HeroConverter({
  initialSource,
  initialTarget,
}: {
  initialSource?: string;
  initialTarget?: string;
} = {}) {
  const handoff = useUploadHandoff();
  const [source, setSource] = useState(initialSource || "png");
  const [target, setTarget] = useState(initialTarget || "");
  const [touched, setTouched] = useState(Boolean(initialSource));
  const sources = allInputExts();
  const targets = targetsFor(source);

  // Reflect the current selection in the URL (no navigation, just history):
  //   source only  -> /png-converter
  //   + target     -> /png-to-jpg
  function reflectUrl(s: string, t: string) {
    if (typeof window === "undefined") return;
    const path = t ? `/${s}-to-${t}` : s ? `/${s}-converter` : "/";
    window.history.replaceState(null, "", path);
  }

  // Share selection with the homepage upload box (for the accept filter).
  useEffect(() => {
    handoff?.setHeroSource(touched ? source : "");
    handoff?.setHeroTarget(touched ? target : "");
  }, [source, target, touched, handoff]);

  // Demo cycle until first interaction — rotates the source only, leaving the
  // target on "ANY" (matches CloudConvert: you pick the target yourself).
  useEffect(() => {
    if (touched) return;
    let i = 0;
    const iv = setInterval(() => {
      i = (i + 1) % DEMO.length;
      setSource(DEMO[i]);
    }, 2600);
    return () => clearInterval(iv);
  }, [touched]);

  useEffect(() => {
    if (target && !targets.includes(target)) setTarget("");
  }, [source, target, targets]);

  function pickSource(fmt: string) {
    setTouched(true);
    setSource(fmt);
    setTarget("");
    reflectUrl(fmt, "");
  }
  function pickTarget(fmt: string) {
    setTouched(true);
    setTarget(fmt);
    reflectUrl(source, fmt);
  }

  return (
    <div className="relative flex h-[320px] w-full items-center justify-center">
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
        <FormatPicker targets={sources} value={source} placeholder="Any file" onChange={pickSource}>
          <Card>
            {(() => { const I = iconFor(source); return <I className="h-8 w-8 text-zinc-400" />; })()}
            <span className="mt-2 text-lg font-bold text-white">{source.toUpperCase()}</span>
          </Card>
        </FormatPicker>

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
          <span className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-zinc-500">to</span>
        </div>

        <FormatPicker targets={targets} value={target} placeholder="Any" onChange={pickTarget}>
          <Card accent>
            {(() => { const I = target ? iconFor(target) : FileIcon; return <I className="h-8 w-8 text-primary" />; })()}
            <span className={`mt-2 text-lg font-bold ${target ? "text-white" : "text-primary"}`}>
              {target ? target.toUpperCase() : "ANY"}
            </span>
          </Card>
        </FormatPicker>
      </div>
    </div>
  );
}

function Card({ children, accent }: { children: React.ReactNode; accent?: boolean }) {
  return (
    <div
      className={`flex h-36 w-36 cursor-pointer flex-col items-center justify-center rounded-[12px] border bg-surface elev-raised transition-colors hover:border-primary ${
        accent ? "border-primary/40" : "border-line"
      }`}
    >
      {children}
    </div>
  );
}
