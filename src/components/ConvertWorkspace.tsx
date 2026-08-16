"use client";

import { useCallback, useId, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UploadCloud,
  FileImage,
  FileVideo,
  FileAudio,
  FileIcon,
  RefreshCw,
  ChevronDown,
  Download,
  Loader2,
  X,
  Check,
  Info,
  Plus,
} from "lucide-react";
import { targetsFor, FORMAT_LABELS } from "@/lib/formats";

type Stage = "ready" | "converting" | "done" | "error";

interface Item {
  id: string;
  file: File;
  sourceExt: string;
  targets: string[];
  target: string; // "" = unset
  stage: Stage;
  resultUrl?: string;
  resultName?: string;
  error?: string;
}

function extOf(name: string) {
  return (name.split(".").pop() ?? "").toLowerCase();
}

const IMG = ["png", "jpg", "jpeg", "webp", "avif", "gif", "tiff"];
const VID = ["mp4", "webm", "mkv", "mov"];
const AUD = ["mp3", "wav", "ogg", "m4a", "flac"];

function FileGlyph({ ext, className }: { ext: string; className?: string }) {
  if (IMG.includes(ext)) return <FileImage className={className} />;
  if (VID.includes(ext)) return <FileVideo className={className} />;
  if (AUD.includes(ext)) return <FileAudio className={className} />;
  return <FileIcon className={className} />;
}

function humanSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function kindLabel(ext: string) {
  if (IMG.includes(ext)) return "Image";
  if (VID.includes(ext)) return "Video";
  if (AUD.includes(ext)) return "Audio";
  return "File";
}

export function ConvertWorkspace({
  defaultTarget,
  reflectUrl = false,
}: {
  defaultTarget?: string;
  reflectUrl?: boolean;
}) {
  const [items, setItems] = useState<Item[]>([]);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const uid = useId();

  const addFiles = useCallback(
    (files: FileList | File[]) => {
      const next: Item[] = [];
      Array.from(files).forEach((file, idx) => {
        const sourceExt = extOf(file.name);
        const targets = targetsFor(sourceExt);
        const preset =
          defaultTarget && targets.includes(defaultTarget) ? defaultTarget : "";
        next.push({
          id: `${uid}-${Date.now()}-${idx}`,
          file,
          sourceExt,
          targets,
          target: preset,
          stage: targets.length ? "ready" : "error",
          error: targets.length ? undefined : `.${sourceExt} not supported yet`,
        });
      });
      setItems((prev) => {
        // On the homepage, reflect the first uploaded format in the URL
        // (e.g. /jpg-converter) without a full navigation, so the file stays
        // loaded but the page reads as a format-specific converter.
        if (reflectUrl && prev.length === 0 && next.length > 0) {
          const ext = next[0].sourceExt;
          if (ext && targetsFor(ext).length > 0 && typeof window !== "undefined") {
            window.history.replaceState(null, "", `/${ext}-converter`);
          }
        }
        return [...prev, ...next];
      });
    },
    [defaultTarget, reflectUrl, uid],
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
    },
    [addFiles],
  );

  const setTarget = (id: string, target: string) =>
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, target } : it)));
  const removeItem = (id: string) =>
    setItems((prev) => prev.filter((it) => it.id !== id));

  const convertOne = async (it: Item) => {
    if (!it.target) return;
    setItems((prev) =>
      prev.map((x) => (x.id === it.id ? { ...x, stage: "converting", error: undefined } : x)),
    );
    try {
      const fd = new FormData();
      fd.append("file", it.file);
      fd.append("target", it.target);
      const res = await fetch("/api/convert", { method: "POST", body: fd });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? `Failed (${res.status})`);
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const base = it.file.name.replace(/\.[^.]+$/, "");
      setItems((prev) =>
        prev.map((x) =>
          x.id === it.id
            ? { ...x, stage: "done", resultUrl: url, resultName: `${base}.${it.target}` }
            : x,
        ),
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Conversion failed";
      setItems((prev) =>
        prev.map((x) => (x.id === it.id ? { ...x, stage: "error", error: msg } : x)),
      );
    }
  };

  const convertAll = () => {
    items.filter((it) => it.target && it.stage === "ready").forEach(convertOne);
  };

  const pending = items.filter((it) => it.stage === "ready");
  const allReady = pending.length > 0 && pending.every((it) => it.target);
  const anyConverting = items.some((it) => it.stage === "converting");
  const needFormat = pending.some((it) => !it.target);

  // Empty state — drop zone
  if (items.length === 0) {
    return (
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`group relative flex min-h-[320px] cursor-pointer flex-col items-center justify-center gap-4 rounded-[12px] bg-surface px-8 py-16 text-center elev-raised transition-colors ${
          dragging ? "bg-surface-2" : "hover:bg-surface-2"
        }`}
        style={{ border: `2px dashed ${dragging ? "#3f37c9" : "rgba(63,55,201,0.45)"}` }}
      >
        <motion.div
          animate={{ y: dragging ? -6 : 0 }}
          className="grid h-16 w-16 place-items-center rounded-full bg-primary/15 text-primary"
        >
          <UploadCloud className="h-8 w-8" />
        </motion.div>
        <div>
          <p className="text-lg font-semibold text-white">Select your file to convert</p>
          <p className="mt-1 text-sm text-muted">or drop your file here</p>
        </div>
        <span className="mt-1 rounded-[8px] bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors group-hover:bg-primary-hover">
          Select File
        </span>
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && addFiles(e.target.files)}
        />
      </div>
    );
  }

  // Loaded state — file rows + action bar
  return (
    <div className="overflow-hidden rounded-[12px] border border-line bg-surface elev-raised">
      <ul className="divide-y divide-line/70">
        <AnimatePresence initial={false}>
          {items.map((it) => (
            <motion.li
              key={it.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-wrap items-center gap-3 px-5 py-4 sm:flex-nowrap"
            >
              {/* file glyph */}
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-[8px] bg-surface-2 text-zinc-400">
                <FileGlyph ext={it.sourceExt} className="h-5 w-5" />
              </div>

              {/* name + meta */}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white">{it.file.name}</p>
                <p className="text-xs text-muted">
                  {humanSize(it.file.size)} · {it.sourceExt.toUpperCase()} {kindLabel(it.sourceExt)}
                </p>
              </div>

              {/* controls */}
              <div className="flex items-center gap-2">
                {it.stage === "done" && it.resultUrl ? (
                  <a
                    href={it.resultUrl}
                    download={it.resultName}
                    className="inline-flex items-center gap-1.5 rounded-[8px] bg-success px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
                  >
                    <Download className="h-4 w-4" /> Download
                  </a>
                ) : it.stage === "converting" ? (
                  <span className="inline-flex items-center gap-1.5 px-2 text-sm text-muted">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" /> Converting…
                  </span>
                ) : it.targets.length > 0 ? (
                  <>
                    <span className="hidden items-center gap-1.5 rounded-[6px] bg-surface-2 px-2.5 py-1.5 text-xs font-semibold uppercase text-zinc-300 sm:inline-flex">
                      {it.sourceExt}
                    </span>
                    <RefreshCw className="hidden h-3.5 w-3.5 text-muted sm:block" />
                    <div className="relative">
                      <select
                        value={it.target}
                        onChange={(e) => setTarget(it.id, e.target.value)}
                        className={`cursor-pointer appearance-none rounded-[6px] border bg-transparent py-1.5 pl-3 pr-8 text-sm font-semibold outline-none transition-colors ${
                          it.target
                            ? "border-line text-white"
                            : "border-primary/60 text-primary"
                        }`}
                      >
                        <option value="" disabled className="bg-surface text-muted">
                          Select Format
                        </option>
                        {it.targets.map((t) => (
                          <option key={t} value={t} className="bg-surface text-white">
                            {FORMAT_LABELS[t] ?? t.toUpperCase()}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        className={`pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 ${
                          it.target ? "text-muted" : "text-primary"
                        }`}
                      />
                    </div>
                  </>
                ) : (
                  <span className="text-xs text-danger">{it.error}</span>
                )}

                <button
                  onClick={() => removeItem(it.id)}
                  className="grid h-8 w-8 place-items-center rounded-[6px] text-muted transition-colors hover:bg-white/5 hover:text-white"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      {/* Bottom action bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line bg-[#1f1f22] px-5 py-3.5">
        <div className="flex items-center gap-1.5 text-[13px] text-muted">
          <Info className="h-4 w-4" />
          {needFormat
            ? "Please select output format"
            : items.every((it) => it.stage === "done")
              ? "All files converted"
              : "Ready to convert"}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center gap-1.5 rounded-[8px] bg-surface-2 px-3.5 py-2 text-sm font-medium text-zinc-200 transition-colors hover:bg-white/10"
          >
            <Plus className="h-4 w-4" /> Add more files
          </button>
          <input
            ref={inputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && addFiles(e.target.files)}
          />
          <button
            onClick={convertAll}
            disabled={!allReady || anyConverting}
            className="inline-flex items-center gap-1.5 rounded-[8px] bg-primary px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-40"
          >
            {anyConverting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Convert
          </button>
        </div>
      </div>
    </div>
  );
}
