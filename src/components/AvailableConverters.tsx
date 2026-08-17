"use client";

import Link from "next/link";
import { FORMAT_LABELS } from "@/lib/formats";

function label(ext: string) {
  return FORMAT_LABELS[ext] ?? ext.toUpperCase();
}

/**
 * "AVAILABLE CONVERTERS" section for a category page — every format in the
 * category as a tag linking to its own /{fmt}-converter page. Mirrors
 * CloudConvert's category-page format browser.
 */
export function AvailableConverters({
  categoryLabel,
  formats,
}: {
  categoryLabel: string;
  formats: string[];
}) {
  return (
    <section className="border-t border-line/60 bg-bg">
      <div className="mx-auto max-w-[1600px] px-6 py-14 lg:px-12">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">
          Available Converters
        </p>
        <h2 className="mt-2 text-2xl font-bold text-white">{categoryLabel} converters</h2>
        <p className="mt-2 max-w-2xl text-[15px] text-muted">
          Browse every {categoryLabel.toLowerCase()} format we support — each opens a dedicated
          converter.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {formats.map((f) => (
            <Link
              key={f}
              href={`/${f}-converter`}
              className="rounded-[6px] border border-line/70 bg-surface px-3 py-2 text-sm font-semibold text-zinc-300 transition-colors hover:border-primary/50 hover:text-white"
            >
              {label(f)}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
