"use client";

import { useCallback, useRef, useState } from "react";
import { UploadCloud, Loader2, Download, CheckCircle2 } from "lucide-react";

interface Props {
  op: "compress-pdf" | "compress-png" | "compress-jpg" | "pdf-ocr";
  accept: string;   // e.g. ".pdf" or ".png"
  verb: string;     // e.g. "Compress" / "OCR"
}

type Stage = "idle" | "working" | "done" | "error";

function human(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

/**
 * Single-file optimize widget: upload a file, POST to /api/optimize, then show
 * the before/after size and a download link. Used by the /compress-* and
 * /pdf-ocr pages.
 */
export function OptimizeTool({ op, accept, verb }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [stage, setStage] = useState<Stage>("idle");
  const [dragging, setDragging] = useState(false);
  const [name, setName] = useState("");
  const [before, setBefore] = useState(0);
  const [after, setAfter] = useState(0);
  const [url, setUrl] = useState("");
  const [outName, setOutName] = useState("");
  const [error, setError] = useState("");

  const run = useCallback(
    async (file: File) => {
      setStage("working");
      setName(file.name);
      setBefore(file.size);
      setError("");
      try {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("op", op);
        const res = await fetch("/api/optimize", { method: "POST", body: fd });
        if (!res.ok) {
          const j = await res.json().catch(() => ({}));
          throw new Error(j.error || `HTTP ${res.status}`);
        }
        const blob = await res.blob();
        const cd = res.headers.get("Content-Disposition") || "";
        const fn = /filename="([^"]+)"/.exec(cd)?.[1] || "output";
        setAfter(Number(res.headers.get("X-Optimized-Size")) || blob.size);
        setUrl(URL.createObjectURL(blob));
        setOutName(fn);
        setStage("done");
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed");
        setStage("error");
      }
    },
    [op],
  );

  const pct = before > 0 && after > 0 ? Math.max(0, Math.round((1 - after / before) * 100)) : 0;

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          if (e.dataTransfer.files?.[0]) run(e.dataTransfer.files[0]);
        }}
        className={`flex min-h-[320px] flex-col items-center justify-center gap-4 rounded-[12px] bg-surface px-8 py-16 text-center elev-raised transition-colors ${
          dragging ? "ring-2 ring-primary" : ""
        }`}
        style={{ border: "2px dashed rgba(63,55,201,0.45)" }}
      >
        {stage === "idle" && (
          <>
            <div className="grid h-16 w-16 place-items-center rounded-full bg-primary/15 text-primary">
              <UploadCloud className="h-8 w-8" />
            </div>
            <div>
              <p className="text-lg font-semibold text-white">Select your file</p>
              <p className="mt-1 text-sm text-muted">or drop your file here</p>
            </div>
            <button
              onClick={() => inputRef.current?.click()}
              className="cursor-pointer rounded-[5px] bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
            >
              Select File
            </button>
          </>
        )}

        {stage === "working" && (
          <>
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-sm text-muted">
              {verb}ing <span className="text-white">{name}</span>…
            </p>
          </>
        )}

        {stage === "done" && (
          <>
            <CheckCircle2 className="h-12 w-12 text-success" />
            <div>
              <p className="text-lg font-semibold text-white">{name}</p>
              <p className="mt-1 text-sm text-muted">
                {human(before)} → <span className="text-white">{human(after)}</span>
                {pct > 0 && <span className="ml-2 text-success">−{pct}%</span>}
              </p>
            </div>
            <div className="flex gap-3">
              <a
                href={url}
                download={outName}
                className="inline-flex items-center gap-1.5 rounded-[5px] bg-success px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
              >
                <Download className="h-4 w-4" /> Download
              </a>
              <button
                onClick={() => {
                  setStage("idle");
                  setUrl("");
                }}
                className="cursor-pointer rounded-[5px] border border-line px-4 py-2 text-sm text-zinc-300 transition-colors hover:text-white"
              >
                Another file
              </button>
            </div>
          </>
        )}

        {stage === "error" && (
          <>
            <p className="text-sm text-danger">{error}</p>
            <button
              onClick={() => setStage("idle")}
              className="cursor-pointer rounded-[5px] border border-line px-4 py-2 text-sm text-zinc-300 hover:text-white"
            >
              Try again
            </button>
          </>
        )}

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => e.target.files?.[0] && run(e.target.files[0])}
        />
      </div>
    </div>
  );
}
