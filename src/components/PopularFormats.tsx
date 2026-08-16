"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const POPULAR: { from: string; to: string }[] = [
  { from: "PNG", to: "WEBP" },
  { from: "JPG", to: "PNG" },
  { from: "WEBP", to: "JPG" },
  { from: "PNG", to: "AVIF" },
  { from: "MP4", to: "MP3" },
  { from: "MOV", to: "MP4" },
  { from: "WAV", to: "MP3" },
  { from: "WEBM", to: "GIF" },
];

export function PopularFormats() {
  return (
    <section id="formats" className="mx-auto w-full max-w-[1200px] px-8 py-20">
      <h2 className="text-center text-2xl font-bold">Popular conversions</h2>
      <p className="mt-2 text-center text-sm text-zinc-500">
        One-click shortcuts for the formats people convert most.
      </p>

      <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {POPULAR.map((p, idx) => (
          <motion.a
            key={`${p.from}-${p.to}`}
            href="#converter"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.04 }}
            whileHover={{ y: -3 }}
            className="group flex items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-4 text-sm font-semibold transition-colors hover:border-teal/50 hover:bg-zinc-900"
          >
            <span className="text-zinc-300">{p.from}</span>
            <ArrowRight className="h-3.5 w-3.5 text-teal transition-transform group-hover:translate-x-0.5" />
            <span className="text-teal">{p.to}</span>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
