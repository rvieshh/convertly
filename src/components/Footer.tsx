"use client";

import { Repeat } from "lucide-react";
import { useSettings } from "@/components/SettingsProvider";

export function Footer() {
  const s = useSettings();
  const isExt = (h: string) => h.startsWith("http");

  return (
    <footer className="border-t border-line/60 bg-surface">
      <div className="mx-auto max-w-[1600px] px-6 lg:px-12 py-14">
        <div className="grid gap-10 sm:grid-cols-[1.5fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center overflow-hidden rounded-[6px] bg-primary text-white">
                {s.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={s.logoUrl} alt={s.siteName} className="h-full w-full object-cover" />
                ) : (
                  <Repeat className="h-4 w-4" />
                )}
              </span>
              <span className="text-[15px] font-bold text-white">{s.logoText || s.siteName}</span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-muted">{s.footerDescription}</p>
          </div>

          {s.footerColumns.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
                {col.title}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      target={isExt(l.href) ? "_blank" : undefined}
                      rel={isExt(l.href) ? "noopener noreferrer" : undefined}
                      className="text-sm text-muted transition-colors hover:text-white"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-line/60 pt-6 text-sm text-muted sm:flex-row">
          <p>
            © {new Date().getFullYear()} {s.copyrightName || s.siteName}
          </p>
          {s.footerBackedByName && (
            <p>
              {s.footerBackedByLabel}{" "}
              <a
                href={s.footerBackedByUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-zinc-300 transition-colors hover:text-primary"
              >
                {s.footerBackedByName}
              </a>
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}
