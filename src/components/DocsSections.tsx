"use client";

import { CodeBlock } from "@/components/CodeBlock";

const BASE = "https://convertly.app";

function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return <h2 id={id} className="scroll-mt-20 text-2xl font-bold text-white">{children}</h2>;
}

function Param({ name, type, req, children }: { name: string; type: string; req?: boolean; children: React.ReactNode }) {
  return (
    <div className="border-b border-line/50 py-3">
      <div className="flex items-center gap-2">
        <code className="text-sm font-semibold text-white">{name}</code>
        <span className="text-xs text-muted">{type}</span>
        {req && <span className="rounded bg-primary/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-primary">required</span>}
      </div>
      <p className="mt-1 text-sm text-muted">{children}</p>
    </div>
  );
}

export function DocsConvert() {
  return (
    <section id="convert" className="scroll-mt-20 space-y-4">
      <H2 id="convert-h">POST /api/convert</H2>
      <p className="text-[15px] leading-relaxed text-muted">
        Converts a single file to another format. Send a <code className="text-white">multipart/form-data</code>{" "}
        request; the response body <em>is</em> the converted file (with a{" "}
        <code className="text-white">Content-Disposition</code> filename). The source format is
        detected from the uploaded file&apos;s extension.
      </p>
      <div className="rounded-[10px] border border-line bg-surface px-4">
        <Param name="file" type="File" req>
          The file to convert (multipart form field).
        </Param>
        <Param name="target" type="string" req>
          The target format extension, e.g. <code className="text-white">webp</code>,{" "}
          <code className="text-white">pdf</code>, <code className="text-white">mp3</code>. Case-insensitive.
        </Param>
      </div>
      <p className="text-[15px] leading-relaxed text-muted">Response: the binary file on success (HTTP 200), or a JSON error object.</p>
      <CodeBlock
        title="Request"
        code={`curl -X POST ${BASE}/api/convert \\
  -F "file=@report.docx" \\
  -F "target=pdf" \\
  -o report.pdf`}
      />
    </section>
  );
}

export function DocsOptimize() {
  return (
    <section id="optimize" className="scroll-mt-20 space-y-4">
      <H2 id="optimize-h">POST /api/optimize</H2>
      <p className="text-[15px] leading-relaxed text-muted">
        Compresses a file or adds an OCR text layer. Same multipart shape as{" "}
        <code className="text-white">/api/convert</code>, but you pass an{" "}
        <code className="text-white">op</code> instead of a target. The response body is the
        optimized file, plus two headers reporting the size change.
      </p>
      <div className="rounded-[10px] border border-line bg-surface px-4">
        <Param name="file" type="File" req>The file to optimize.</Param>
        <Param name="op" type="string" req>
          One of: <code className="text-white">compress-pdf</code>,{" "}
          <code className="text-white">compress-png</code>, <code className="text-white">compress-jpg</code>,{" "}
          <code className="text-white">pdf-ocr</code>.
        </Param>
      </div>
      <p className="text-[15px] leading-relaxed text-muted">
        Response headers <code className="text-white">X-Original-Size</code> and{" "}
        <code className="text-white">X-Optimized-Size</code> give the before/after byte counts.
      </p>
      <CodeBlock
        title="Request"
        code={`curl -X POST ${BASE}/api/optimize \\
  -F "file=@scan.pdf" \\
  -F "op=pdf-ocr" \\
  -o scan-searchable.pdf`}
      />
    </section>
  );
}
