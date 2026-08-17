"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { targetsFor, sourcesFor, FORMAT_LABELS } from "@/lib/formats";
import { formatInfo } from "@/lib/formatInfo";

function label(ext: string) {
  return FORMAT_LABELS[ext] ?? ext.toUpperCase();
}

function fullName(ext: string): string {
  const names: Record<string, string> = {
    png: "Portable Network Graphic",
    jpg: "Joint Photographic Experts Group",
    jpeg: "Joint Photographic Experts Group",
    webp: "Web Picture Format",
    gif: "Graphics Interchange Format",
    svg: "Scalable Vector Graphics",
    pdf: "Portable Document Format",
    mp4: "MPEG-4 Video",
    mp3: "MPEG Audio Layer III",
    docx: "Microsoft Word Document",
    epub: "Electronic Publication",
  };
  return names[ext] ?? `${label(ext)} File`;
}

/**
 * Converter-page section 2.
 *  - Single format (/png-converter): "Convert from PNG" + "Convert to PNG"
 *    lists linking to the pair routes.
 *  - Pair (/png-to-jpg): two explanation cards for the two chosen formats,
 *    each with a link to its own converter page.
 */
export function ConversionTypes({ format, target }: { format: string; target?: string }) {
  const fmt = format.toLowerCase();

  // ----- Pair variant: two description cards -----
  if (target) {
    const to = target.toLowerCase();
    return (
      <section className="border-t border-line/60 bg-bg">
        <div className="mx-auto grid max-w-[1600px] gap-6 px-6 py-14 lg:grid-cols-2 lg:px-12">
          {[fmt, to].map((f) => (
            <div key={f} className="rounded-[12px] border border-line bg-surface p-6 elev-raised">
              <h2 className="text-xl font-bold text-white">
                {label(f)} <span className="text-muted">— {fullName(f)}</span>
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-muted">{formatInfo(f)}</p>
              <Link
                href={`/${f}-converter`}
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
              >
                {label(f)} Converter <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // ----- Single variant: conversion lists -----
  const lbl = label(fmt);
  const targets = targetsFor(fmt);
  const sources = sourcesFor(fmt);

  return (
    <section className="border-t border-line/60 bg-bg">
      <div className="mx-auto max-w-[1600px] px-6 py-14 lg:px-12">
        <h2 className="text-2xl font-bold text-white">
          {lbl} <span className="text-muted">— {fullName(fmt)}</span>
        </h2>
        <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-muted">{formatInfo(fmt)}</p>

        <div className="mt-10 grid gap-10 lg:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-zinc-400">
              Convert from {lbl}
            </h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {targets.map((t) => (
                <Link
                  key={t}
                  href={`/${fmt}-to-${t}`}
                  className="inline-flex items-center gap-1 rounded-[6px] border border-line/70 bg-surface px-2.5 py-1.5 text-xs font-semibold text-zinc-300 transition-colors hover:border-primary/50 hover:text-white"
                >
                  {lbl} <ArrowRight className="h-3 w-3 text-muted" /> {label(t)}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-zinc-400">
              Convert to {lbl}
            </h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {sources.map((s) => (
                <Link
                  key={s}
                  href={`/${s}-to-${fmt}`}
                  className="inline-flex items-center gap-1 rounded-[6px] border border-line/70 bg-surface px-2.5 py-1.5 text-xs font-semibold text-zinc-300 transition-colors hover:border-primary/50 hover:text-white"
                >
                  {label(s)} <ArrowRight className="h-3 w-3 text-muted" /> {lbl}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
