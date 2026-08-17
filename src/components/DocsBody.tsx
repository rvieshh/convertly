"use client";

import { CodeBlock } from "@/components/CodeBlock";
import { DocsConvert, DocsOptimize } from "@/components/DocsSections";
import { DocsExamples, DocsFormats } from "@/components/DocsSections2";
import { DocsErrors, DocsSelfHost } from "@/components/DocsSections3";

const BASE = "https://convertly.app"; // change to your deployment origin

const NAV = [
  { id: "intro", label: "Introduction" },
  { id: "quickstart", label: "Quickstart" },
  { id: "convert", label: "POST /api/convert" },
  { id: "optimize", label: "POST /api/optimize" },
  { id: "examples", label: "Examples" },
  { id: "formats", label: "Supported formats" },
  { id: "errors", label: "Errors" },
  { id: "selfhost", label: "Self-hosting" },
];

export function DocsBody() {
  return (
    <div className="mx-auto max-w-[1600px] px-6 py-10 lg:px-12">
      <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
        {/* Sidebar */}
        <aside className="hidden lg:block">
          <nav className="sticky top-20 space-y-1">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted">
              API Reference
            </p>
            {NAV.map((n) => (
              <a
                key={n.id}
                href={`#${n.id}`}
                className="block rounded-[6px] px-3 py-1.5 text-sm text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
              >
                {n.label}
              </a>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <article className="max-w-3xl space-y-14">
          <DocsIntro />
          <DocsQuickstart />
          <DocsConvert />
          <DocsOptimize />
          <DocsExamples />
          <DocsFormats />
          <DocsErrors />
          <DocsSelfHost />
        </article>
      </div>
    </div>
  );
}

function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="scroll-mt-20 text-2xl font-bold text-white">
      {children}
    </h2>
  );
}

function DocsIntro() {
  return (
    <section id="intro" className="scroll-mt-20 space-y-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-primary">
        Convertly API
      </p>
      <h1 className="text-4xl font-bold tracking-tight">File conversion API</h1>
      <p className="text-[15px] leading-relaxed text-muted">
        The Convertly API lets you convert and optimize files programmatically — the same engines
        that power the website, exposed as two simple HTTP endpoints. Send a file, get a file back.
        No SDK, no account, no API key. Perfect for backends, scripts, CI pipelines, and bots that
        need to turn one file format into another automatically.
      </p>
      <div className="rounded-[10px] border border-line bg-surface p-4 text-sm text-muted">
        <span className="font-semibold text-white">Base URL</span>
        <div className="mt-1 font-mono text-primary">{BASE}</div>
        <p className="mt-2">
          Self-hosting? Replace the base URL with your own deployment origin. Everything runs on
          your infrastructure — files never leave your server.
        </p>
      </div>
    </section>
  );
}

function DocsQuickstart() {
  return (
    <section id="quickstart" className="scroll-mt-20 space-y-4">
      <H2 id="quickstart-h">Quickstart</H2>
      <p className="text-[15px] leading-relaxed text-muted">
        Convert a PNG to WebP in one request. The response body is the converted file.
      </p>
      <CodeBlock
        title="curl"
        code={`curl -X POST ${BASE}/api/convert \\
  -F "file=@photo.png" \\
  -F "target=webp" \\
  -o photo.webp`}
      />
      <p className="text-[15px] leading-relaxed text-muted">
        That&apos;s the whole flow: a multipart POST with your <code className="text-white">file</code>{" "}
        and a <code className="text-white">target</code> format. No authentication required.
      </p>
    </section>
  );
}
