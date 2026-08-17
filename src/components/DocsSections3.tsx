"use client";

import { CodeBlock } from "@/components/CodeBlock";

function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return <h2 id={id} className="scroll-mt-20 text-2xl font-bold text-white">{children}</h2>;
}

const ERRORS = [
  { code: "200", meaning: "Success — the response body is the converted/optimized file." },
  { code: "400", meaning: "Bad request — missing file or missing target/op field." },
  { code: "422", meaning: "Unsupported conversion — that source→target pair isn't available." },
  { code: "500", meaning: "Conversion failed — the engine errored on this file." },
];

const ERR_SHAPE = `{ "error": "Cannot convert docx to mp3" }`;

const DEPS = `# Debian / Ubuntu
sudo apt install ffmpeg libreoffice imagemagick pandoc \\
  calibre fontforge inkscape p7zip-full unrar libraw-bin \\
  ghostscript pngquant jpegoptim ocrmypdf tesseract-ocr

# then
git clone https://github.com/rvieshh/convertly
cd convertly && npm install && npm run build && npm start`;

export function DocsErrors() {
  return (
    <section id="errors" className="scroll-mt-20 space-y-4">
      <H2 id="errors-h">Errors</H2>
      <p className="text-[15px] leading-relaxed text-muted">
        Non-2xx responses return a JSON object with an <code className="text-white">error</code> message.
      </p>
      <CodeBlock title="Error response" lang="json" code={ERR_SHAPE} />
      <div className="overflow-hidden rounded-[10px] border border-line">
        <table className="w-full text-sm">
          <thead className="bg-surface text-left text-muted">
            <tr>
              <th className="px-4 py-2 font-semibold">Status</th>
              <th className="px-4 py-2 font-semibold">Meaning</th>
            </tr>
          </thead>
          <tbody>
            {ERRORS.map((e) => (
              <tr key={e.code} className="border-t border-line/50">
                <td className="px-4 py-2 font-mono text-white">{e.code}</td>
                <td className="px-4 py-2 text-muted">{e.meaning}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function DocsSelfHost() {
  return (
    <section id="selfhost" className="scroll-mt-20 space-y-4">
      <H2 id="selfhost-h">Self-hosting</H2>
      <p className="text-[15px] leading-relaxed text-muted">
        Convertly is open source (MIT). It runs entirely on your own server — uploaded files are
        processed in a temp dir and deleted right after. Conversions shell out to native engines, so
        install these system dependencies, then build and run:
      </p>
      <CodeBlock title="Install & run" code={DEPS} />
      <p className="text-[15px] leading-relaxed text-muted">
        Point the API base URL at your deployment. No API keys or rate limits are built in — add your
        own reverse-proxy auth/limits if you expose it publicly.
      </p>
      <a
        href="https://github.com/rvieshh/convertly"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block text-sm font-medium text-primary hover:underline"
      >
        View the source on GitHub →
      </a>
    </section>
  );
}
