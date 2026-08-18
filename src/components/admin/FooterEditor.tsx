"use client";

import { Plus, Trash2 } from "lucide-react";
import type { FooterColumn } from "@/lib/settings";

export function FooterEditor({
  columns,
  onChange,
}: {
  columns: FooterColumn[];
  onChange: (cols: FooterColumn[]) => void;
}) {
  const update = (fn: (cols: FooterColumn[]) => void) => {
    const next = structuredClone(columns);
    fn(next);
    onChange(next);
  };

  return (
    <div>
      <label className="mb-2 block text-xs font-medium text-muted">Footer columns</label>
      <div className="space-y-4">
        {columns.map((col, ci) => (
          <div key={ci} className="rounded-[10px] border border-line bg-bg p-4">
            <div className="mb-3 flex items-center gap-2">
              <input
                value={col.title}
                onChange={(e) => update((c) => (c[ci].title = e.target.value))}
                placeholder="Column title"
                className="flex-1 rounded-[6px] border border-line bg-surface px-3 py-1.5 text-sm font-semibold text-white outline-none focus:border-primary"
              />
              <button
                onClick={() => update((c) => c.splice(ci, 1))}
                className="grid h-8 w-8 place-items-center rounded-[6px] text-muted hover:text-danger"
                title="Remove column"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-2">
              {col.links.map((l, li) => (
                <div key={li} className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <input
                    value={l.label}
                    onChange={(e) => update((c) => (c[ci].links[li].label = e.target.value))}
                    placeholder="Label"
                    className="w-full rounded-[6px] border border-line bg-surface px-2.5 py-1.5 text-sm text-white outline-none focus:border-primary sm:w-1/3"
                  />
                  <div className="flex items-center gap-2">
                    <input
                      value={l.href}
                      onChange={(e) => update((c) => (c[ci].links[li].href = e.target.value))}
                      placeholder="https://… or /path"
                      className="min-w-0 flex-1 rounded-[6px] border border-line bg-surface px-2.5 py-1.5 text-sm text-white outline-none focus:border-primary"
                    />
                    <button
                      onClick={() => update((c) => c[ci].links[li] && c[ci].links.splice(li, 1))}
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-[6px] text-muted hover:text-danger"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
              <button
                onClick={() => update((c) => c[ci].links.push({ label: "New link", href: "/" }))}
                className="flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
              >
                <Plus className="h-3.5 w-3.5" /> Add link
              </button>
            </div>
          </div>
        ))}
        <button
          onClick={() => update((c) => c.push({ title: "New column", links: [] }))}
          className="flex items-center gap-1.5 rounded-[8px] border border-dashed border-line px-3 py-2 text-sm text-muted hover:border-primary hover:text-white"
        >
          <Plus className="h-4 w-4" /> Add column
        </button>
      </div>
    </div>
  );
}
