import { Terminal, Cpu, Sliders, Palette } from "lucide-react";

const HIGHLIGHTS = [
  {
    icon: Cpu,
    title: "Proven engines",
    body: "Conversions run on battle-tested open-source engines — sharp for images, FFmpeg for audio and video — not fragile in-house code.",
  },
  {
    icon: Sliders,
    title: "Per-conversion control",
    body: "Tune quality, resolution and codec per job. Sensible defaults out of the box, full control when you need it.",
  },
  {
    icon: Palette,
    title: "Faithful output",
    body: "Color-accurate images and clean audio/video — the output stays true to the source, every time.",
  },
];

export function ApiSection() {
  return (
    <section id="api" className="border-t border-line/60">
      <div className="mx-auto max-w-[1600px] px-6 py-16 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* API & Integrations */}
          <div>
            <div className="flex items-center gap-2.5">
              <span className="grid h-8 w-8 place-items-center rounded-[6px] bg-primary/15 text-primary">
                <Terminal className="h-4 w-4" />
              </span>
              <h2 className="text-xl font-bold text-white">API &amp; Integrations</h2>
            </div>
            <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted">
              Convertly ships a simple HTTP endpoint: send a file and a target format, get the
              converted file back. Wire it into scripts, apps or CI — no SDK required.
            </p>

            {/* Code block */}
            <div className="mt-5 overflow-hidden rounded-[10px] border border-line bg-[#141417]">
              <div className="flex items-center gap-1.5 border-b border-line/70 px-4 py-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                <span className="ml-2 text-xs text-muted">convert.sh</span>
              </div>
              <pre className="overflow-x-auto p-4 text-[13px] leading-relaxed">
                <code className="font-mono">
                  <span className="text-zinc-500"># Convert a PNG to WebP</span>
                  {"\n"}
                  <span className="text-primary">curl</span>
                  <span className="text-zinc-300"> -X POST https://convertly.app/api/convert \</span>
                  {"\n"}
                  <span className="text-zinc-300">  -F </span>
                  <span className="text-emerald-400">&quot;file=@photo.png&quot;</span>
                  <span className="text-zinc-300"> \</span>
                  {"\n"}
                  <span className="text-zinc-300">  -F </span>
                  <span className="text-emerald-400">&quot;target=webp&quot;</span>
                  <span className="text-zinc-300"> \</span>
                  {"\n"}
                  <span className="text-zinc-300">  -o photo.webp</span>
                </code>
              </pre>
            </div>
            <a
              href="/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block text-sm font-medium text-primary transition-colors hover:text-primary-hover"
            >
              Explore the API →
            </a>
          </div>

          {/* High-Quality Conversions */}
          <div>
            <div className="flex items-center gap-2.5">
              <span className="grid h-8 w-8 place-items-center rounded-[6px] bg-primary/15 text-primary">
                <Cpu className="h-4 w-4" />
              </span>
              <h2 className="text-xl font-bold text-white">High-Quality Conversions</h2>
            </div>
            <ul className="mt-5 space-y-5">
              {HIGHLIGHTS.map((h) => (
                <li key={h.title} className="flex gap-3.5">
                  <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-[8px] bg-primary/15 text-primary">
                    <h.icon className="h-4.5 w-4.5" />
                  </span>
                  <div>
                    <h3 className="text-[15px] font-semibold text-white">{h.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted">{h.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Stats / trust bar */}
        <div className="mt-14 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 border-t border-line/60 pt-8 text-center text-sm text-muted">
          <span className="font-semibold uppercase tracking-widest text-zinc-400">
            Free &amp; open source
          </span>
          <span className="text-zinc-700">—</span>
          <span>MIT licensed</span>
          <span className="text-zinc-700">—</span>
          <span>runs entirely on your own infrastructure</span>
          <span className="text-zinc-700">—</span>
          <span>backed by Ravisen</span>
        </div>
      </div>
    </section>
  );
}
