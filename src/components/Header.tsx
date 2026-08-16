import { Repeat } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800/60 bg-zinc-950/70 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <a href="/" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-500 text-white">
            <Repeat className="h-4 w-4" />
          </span>
          <span className="text-lg font-extrabold tracking-tight">
            Convert<span className="text-indigo-400">ly</span>
          </span>
        </a>

        <nav className="hidden items-center gap-7 text-sm text-zinc-400 sm:flex">
          <a href="#converter" className="transition-colors hover:text-white">
            Convert
          </a>
          <a href="#formats" className="transition-colors hover:text-white">
            Formats
          </a>
          <a
            href="https://github.com/rvieshh/convertly"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-white"
          >
            GitHub
          </a>
        </nav>

        <a
          href="https://github.com/rvieshh/convertly"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/20"
        >
          Star on GitHub
        </a>
      </div>
    </header>
  );
}
