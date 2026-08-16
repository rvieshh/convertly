import { Repeat } from "lucide-react";

const COLUMNS = [
  {
    title: "Project",
    links: [
      { label: "GitHub", href: "https://github.com/rvieshh/convertly" },
      { label: "Convert", href: "#converter" },
      { label: "Formats", href: "#formats" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Ravisen", href: "https://ravisen.com" },
      { label: "Report an issue", href: "https://github.com/rvieshh/convertly/issues" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "MIT License", href: "https://github.com/rvieshh/convertly/blob/main/README.md" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-line/60 bg-[#151517]">
      <div className="mx-auto max-w-[1200px] px-8 py-14">
        <div className="grid gap-10 sm:grid-cols-[1.5fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-[6px] bg-primary text-white">
                <Repeat className="h-4 w-4" />
              </span>
              <span className="text-[15px] font-bold text-white">
                Convert<span className="text-primary">ly</span>
              </span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-muted">
              Free, open-source file converter for images, audio, and video. Convert in your
              browser, no sign-up.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
                {col.title}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      target={l.href.startsWith("http") ? "_blank" : undefined}
                      rel={l.href.startsWith("http") ? "noopener noreferrer" : undefined}
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
          <p>© {new Date().getFullYear()} Convertly · MIT Licensed</p>
          <p>
            Backed by{" "}
            <a
              href="https://ravisen.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-zinc-300 transition-colors hover:text-primary"
            >
              Ravisen
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
