"use client";

import { useState, useRef, useEffect, useMemo, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Search } from "lucide-react";
import { categoryOf, FORMAT_LABELS, CATEGORIES } from "@/lib/formats";

interface Props {
  targets: string[];
  value: string; // "" = unset
  onChange: (fmt: string) => void;
  placeholder?: string;
  children?: ReactNode; // custom trigger; falls back to the default button
  defaultCategory?: string; // which sidebar category to open on first render
}

const CAT_ORDER = CATEGORIES.map((c) => c.id);
const CAT_LABEL: Record<string, string> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c.label]),
);

/**
 * CloudConvert-style format picker: a compact trigger that opens a popover
 * with a search field, a category sidebar, and a grid of output formats.
 * Replaces the plain <select>.
 */
export function FormatPicker({ targets, value, onChange, placeholder, children, defaultCategory }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<string>(defaultCategory ?? "all");
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const popRef = useRef<HTMLDivElement>(null);

  // Group available targets by category.
  const grouped = useMemo(() => {
    const g: Record<string, string[]> = {};
    for (const t of targets) {
      const c = categoryOf(t);
      (g[c] ??= []).push(t);
    }
    return g;
  }, [targets]);

  // When the picker opens, snap to the default category (and clear search) so a
  // category page always opens in its own category, not wherever it was left.
  useEffect(() => {
    if (open) {
      setCat(defaultCategory ?? "all");
      setQuery("");
    }
  }, [open, defaultCategory]);

  const cats = useMemo(
    () => CAT_ORDER.filter((c) => grouped[c]?.length),
    [grouped],
  );

  const visible = useMemo(() => {
    let list = cat === "all" ? targets : (grouped[cat] ?? []);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((t) => t.toLowerCase().includes(q));
    }
    return list;
  }, [cat, grouped, targets, query]);

  // Position the popover under the trigger (portal to escape overflow clipping).
  // Recompute on open AND on scroll/resize so it tracks the trigger instead of
  // sticking in place when the page scrolls.
  useEffect(() => {
    if (!open) return;

    const reposition = () => {
      if (!btnRef.current) return;
      const r = btnRef.current.getBoundingClientRect();
      const width = 380;
      let left = r.left - 40;
      if (left + width > window.innerWidth - 12) left = window.innerWidth - width - 12;
      if (left < 12) left = 12;
      setCoords({ top: r.bottom + 8, left });
    };

    reposition();
    // Capture-phase so we catch scrolls on any ancestor scroll container too.
    window.addEventListener("scroll", reposition, true);
    window.addEventListener("resize", reposition);
    return () => {
      window.removeEventListener("scroll", reposition, true);
      window.removeEventListener("resize", reposition);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (
        popRef.current &&
        !popRef.current.contains(e.target as Node) &&
        btnRef.current &&
        !btnRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const label = value ? FORMAT_LABELS[value] ?? value.toUpperCase() : (placeholder ?? "Select Format");

  return (
    <>
      {children ? (
        <button ref={btnRef} onClick={() => setOpen((v) => !v)} className="cursor-pointer">
          {children}
        </button>
      ) : (
        <button
          ref={btnRef}
          onClick={() => setOpen((v) => !v)}
          className={`inline-flex items-center gap-1.5 rounded-[6px] border px-3 py-1.5 text-sm font-semibold transition-colors ${
            value
              ? "border-line text-white hover:border-primary/50"
              : "border-primary/60 text-primary hover:bg-primary/10"
          }`}
        >
          {label}
          <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
      )}

      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {open && coords && (
              <motion.div
                ref={popRef}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.14 }}
                style={{ position: "fixed", top: coords.top, left: coords.left, zIndex: 200 }}
                className="w-[380px] overflow-hidden rounded-[10px] border border-line bg-surface shadow-2xl"
              >
                {/* search */}
                <div className="flex items-center gap-2 border-b border-line/70 px-3 py-2.5">
                  <Search className="h-4 w-4 text-muted" />
                  <input
                    autoFocus
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search format"
                    className="w-full bg-transparent text-sm text-white placeholder:text-muted focus:outline-none"
                  />
                </div>

                <div className="flex max-h-[320px]">
                  {/* category sidebar */}
                  <div className="w-28 shrink-0 border-r border-line/70 py-1.5">
                    <SideItem label="All" active={cat === "all"} onClick={() => setCat("all")} />
                    {cats.map((c) => (
                      <SideItem
                        key={c}
                        label={CAT_LABEL[c] ?? c}
                        active={cat === c}
                        onClick={() => setCat(c)}
                      />
                    ))}
                  </div>

                  {/* format grid */}
                  <div className="flex-1 overflow-y-auto p-2.5">
                    {visible.length === 0 ? (
                      <p className="px-2 py-6 text-center text-sm text-muted">No formats</p>
                    ) : (
                      <div className="grid grid-cols-3 gap-1.5">
                        {visible.map((t) => (
                          <button
                            key={t}
                            onClick={() => {
                              onChange(t);
                              setOpen(false);
                              setQuery("");
                            }}
                            className={`rounded-[6px] border px-2 py-2 text-xs font-semibold transition-colors ${
                              value === t
                                ? "border-primary bg-primary/15 text-primary"
                                : "border-line/70 bg-[#1f1f22] text-zinc-300 hover:border-primary/50 hover:text-white"
                            }`}
                          >
                            {FORMAT_LABELS[t] ?? t.toUpperCase()}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}

function SideItem({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`block w-full px-3 py-1.5 text-left text-sm transition-colors ${
        active ? "bg-primary/15 font-medium text-primary" : "text-zinc-400 hover:text-white"
      }`}
    >
      {label}
    </button>
  );
}
