"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { CATEGORIES, TOTAL_FORMATS } from "@/lib/formats";

export function FormatCatalog() {
  const [active, setActive] = useState(0);
  const cat = CATEGORIES[active];

  return (
    <section id="formats" className="border-t border-line/60">
      <div className="mx-auto max-w-[1600px] px-6 lg:px-12 py-20">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-bold text-white">Format Catalog</h2>
          <p className="mt-2 text-[15px] text-muted">
            Convertly handles {TOTAL_FORMATS} formats across {CATEGORIES.length} categories — and
            growing. More engines (documents, archives) are on the roadmap.
          </p>
        </div>

        {/* Category tabs */}
        <div className="mt-8 flex flex-wrap gap-2">
          {CATEGORIES.map((c, i) => (
            <button
              key={c.id}
              onClick={() => setActive(i)}
              className={`rounded-[5px] px-4 py-2 text-sm font-medium transition-colors ${
                i === active
                  ? "bg-primary text-white"
                  : "bg-surface text-zinc-300 hover:bg-surface-2"
              }`}
            >
              {c.label}{" "}
              <span className={i === active ? "text-white/70" : "text-muted"}>
                {c.formats.length}
              </span>
            </button>
          ))}
        </div>

        {/* Format grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="mt-6 grid grid-cols-3 gap-2 sm:grid-cols-6 md:grid-cols-8"
          >
            {cat.formats.map((f) => (
              <div
                key={f}
                className="rounded-[5px] border border-line/70 bg-surface px-3 py-3 text-center text-xs font-semibold tracking-wide text-zinc-300"
              >
                {f}
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Common conversions */}
        <div className="mt-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted">
            Common conversions
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {cat.common.map(([from, to]) => (
              <a
                key={`${from}-${to}`}
                href="#converter"
                className="group inline-flex items-center gap-2 rounded-[5px] border border-line/70 bg-surface px-3 py-2 text-sm font-semibold transition-colors hover:border-primary/50"
              >
                <span className="text-zinc-300">{from}</span>
                <ArrowRight className="h-3.5 w-3.5 text-primary transition-transform group-hover:translate-x-0.5" />
                <span className="text-primary">{to}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
