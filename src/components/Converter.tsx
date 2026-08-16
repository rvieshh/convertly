"use client";

import { useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, FileIcon, ArrowRight, Download, Loader2, X, Check } from "lucide-react";
import { targetsFor, FORMAT_LABELS } from "@/lib/formats";

type Stage = "idle" | "ready" | "converting" | "done" | "error";

interface Job {
  file: File;
  sourceExt: string;
  targets: string[];
  target: string;
  stage: Stage;
  resultUrl?: string;
  resultName?: string;
  error?: string;
}

function extOf(name: string) {
  return (name.split(".").pop() ?? "").toLowerCase();
}

export function Converter() {
  const [job, setJob] = useState<Job | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const acceptFile = useCallback((file: File) => {
    const sourceExt = extOf(file.name);
    const targets = targetsFor(sourceExt);
    setJob({
      file,
      sourceExt,
      targets,
      target: targets[0] ?? "",
      stage: targets.length ? "ready" : "error",
      error: targets.length ? undefined : `Format .${sourceExt} belum didukung`,
    });
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) acceptFile(file);
    },
    [acceptFile],
  );

  const convert = useCallback(async () => {
    if (!job || !job.target) return;
    setJob((j) => (j ? { ...j, stage: "converting", error: undefined } : j));
    try {
      const fd = new FormData();
      fd.append("file", job.file);
      fd.append("target", job.target);
      const res = await fetch("/api/convert", { method: "POST", body: fd });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? `Gagal (${res.status})`);
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const base = job.file.name.replace(/\.[^.]+$/, "");
      setJob((j) =>
        j ? { ...j, stage: "done", resultUrl: url, resultName: `${base}.${job.target}` } : j,
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Konversi gagal";
      setJob((j) => (j ? { ...j, stage: "error", error: msg } : j));
    }
  }, [job]);

  const reset = () => setJob(null);

  return (
    <div id="converter" className="w-full">
      <AnimatePresence mode="wait">
        {!job && (
          <motion.div
            key="drop"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            onClick={() => inputRef.current?.click()}
            className={`group relative flex cursor-pointer flex-col items-center justify-center gap-4 rounded-[13.6px] bg-white px-8 py-14 text-center shadow-[rgba(0,0,0,0.05)_0px_2px_8px_0px] transition-colors ${
              dragging ? "bg-[#39adb50d]" : "hover:bg-[#39adb508]"
            }`}
            style={{
              border: `2px dashed ${dragging ? "#39ADB5" : "rgba(57,173,181,0.3)"}`,
            }}
          >
            <motion.div
              animate={{ y: dragging ? -6 : 0 }}
              className="grid h-16 w-16 place-items-center rounded-full bg-teal/10 text-teal"
            >
              <UploadCloud className="h-8 w-8" />
            </motion.div>
            <div>
              <p className="text-lg font-semibold text-[#5a5f66]">Select your file to convert</p>
              <p className="mt-1 text-sm text-[#90a4ae]">or drop your file here</p>
            </div>
            <span className="mt-1 rounded-[13.6px] bg-teal px-5 py-2.5 text-sm font-medium text-white shadow-[rgba(0,0,0,0.35)_0px_8px_24px_0px] transition-colors group-hover:bg-teal-hover">
              Select File
            </span>
            <input
              ref={inputRef}
              type="file"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && acceptFile(e.target.files[0])}
            />
          </motion.div>
        )}

        {job && (
          <motion.div
            key="job"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="elev-raised rounded-[13.6px] border border-white/[0.06] bg-surface/80 p-6"
          >
            <div className="flex items-center gap-4">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-[6px] bg-white/5 text-zinc-300">
                <FileIcon className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-white">{job.file.name}</p>
                <p className="text-xs text-muted">
                  {(job.file.size / 1024 / 1024).toFixed(2)} MB · .{job.sourceExt}
                </p>
              </div>
              <button
                onClick={reset}
                className="grid h-8 w-8 place-items-center rounded-[2.4px] text-muted hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {job.targets.length > 0 && (
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <span className="rounded-[2.4px] bg-white/5 px-3 py-2 text-sm font-semibold uppercase text-zinc-300">
                  {job.sourceExt}
                </span>
                <ArrowRight className="h-4 w-4 text-zinc-600" />
                <select
                  value={job.target}
                  onChange={(e) => setJob((j) => (j ? { ...j, target: e.target.value } : j))}
                  disabled={job.stage === "converting"}
                  className="rounded-[6px] border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-white outline-none focus:border-teal"
                >
                  {job.targets.map((t) => (
                    <option key={t} value={t} className="bg-surface">
                      {FORMAT_LABELS[t] ?? t.toUpperCase()}
                    </option>
                  ))}
                </select>

                <div className="ml-auto">
                  {job.stage !== "done" && (
                    <button
                      onClick={convert}
                      disabled={job.stage === "converting"}
                      className="inline-flex items-center gap-2 rounded-[13.6px] bg-teal px-5 py-2.5 text-sm font-medium text-white shadow-[rgba(0,0,0,0.35)_0px_8px_24px_0px] transition-colors hover:bg-teal-hover disabled:opacity-60"
                    >
                      {job.stage === "converting" ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" /> Converting…
                        </>
                      ) : (
                        "Convert"
                      )}
                    </button>
                  )}
                  {job.stage === "done" && job.resultUrl && (
                    <a
                      href={job.resultUrl}
                      download={job.resultName}
                      className="inline-flex items-center gap-2 rounded-[13.6px] bg-success px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
                    >
                      <Download className="h-4 w-4" /> Download
                    </a>
                  )}
                </div>
              </div>
            )}

            <AnimatePresence>
              {job.stage === "converting" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mt-5 h-1 overflow-hidden rounded-full bg-white/10"
                >
                  <motion.div
                    className="h-full w-1/3 rounded-full bg-teal"
                    animate={{ x: ["-100%", "300%"] }}
                    transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {job.stage === "done" && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 inline-flex items-center gap-1.5 text-sm text-success"
              >
                <Check className="h-4 w-4" /> Selesai — file siap diunduh.
              </motion.p>
            )}
            {job.error && <p className="mt-4 text-sm text-coral">{job.error}</p>}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
