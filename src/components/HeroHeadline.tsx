"use client";

import { useEffect } from "react";
import { useUploadHandoff } from "@/components/UploadContext";
import { FORMAT_LABELS } from "@/lib/formats";

function label(ext: string) {
  return FORMAT_LABELS[ext] ?? ext.toUpperCase();
}

/**
 * Homepage hero title + subtitle that react to the hero converter selection:
 *   nothing chosen -> "Convert Any File"
 *   source only     -> "PNG Converter"
 *   source + target -> "PNG to JPG Converter"
 * The dedicated /{src}-converter and /{src}-to-{tgt} routes carry the real
 * server-rendered <title>/meta for SEO; this is the on-page UX mirror.
 */
export function HeroHeadline() {
  const h = useUploadHandoff();
  const src = h?.heroSource ?? "";
  const tgt = h?.heroTarget ?? "";

  let title = "Convert Any File";
  let subtitle =
    "Drop a file and pick what to turn it into. Convertly handles images, video, audio, documents, ebooks, fonts and more — right in your browser, no sign-up.";

  if (src && tgt) {
    title = `${label(src)} to ${label(tgt)} Converter`;
    subtitle = `Convert ${label(src)} to ${label(tgt)} online — free, fast, and secure. No sign-up, no watermark, right in your browser.`;
  } else if (src) {
    title = `${label(src)} Converter`;
    subtitle = `Convert ${label(src)} files to any format online — free and fast. Drop your ${label(src)} file and pick a target format. No sign-up required.`;
  }

  // Mirror the on-page title into the browser tab as the selection changes.
  useEffect(() => {
    document.title = `${title} — Convertly`;
  }, [title]);

  return (
    <>
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{title}</h1>
      <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted">{subtitle}</p>
    </>
  );
}
