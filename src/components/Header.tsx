import { Repeat } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-[100] border-b border-white/5 bg-[#18181b]/95 backdrop-blur">
      <div className="mx-auto flex h-12 max-w-[1200px] items-center justify-between px-8">
        <a href="/" className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-[6px] bg-primary text-white">
            <Repeat className="h-4 w-4" />
          </span>
          <span className="text-[15px] font-bold tracking-tight text-white">
            Convert<span className="text-primary">ly</span>
          </span>
        </a>

        <nav className="hidden items-center sm:flex">
          {[
            { label: "Convert", href: "#converter" },
            { label: "Formats", href: "#formats" },
            { label: "GitHub", href: "https://github.com/rvieshh/convertly" },
          ].map((l) => (
            <a
              key={l.label}
              href={l.href}
              target={l.href.startsWith("http") ? "_blank" : undefined}
              rel={l.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="px-4 py-3 text-[14px] font-medium leading-5 text-white transition-colors hover:bg-white/10"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <a
          href="https://github.com/rvieshh/convertly"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-[8px] bg-primary px-4 py-1.5 text-[14px] font-medium leading-5 text-white shadow-[rgba(0,0,0,0.35)_0px_8px_24px_0px] transition-colors hover:bg-primary-hover"
        >
          Star on GitHub
        </a>
      </div>
    </header>
  );
}
