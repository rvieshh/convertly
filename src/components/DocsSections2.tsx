"use client";

import { CodeBlock } from "@/components/CodeBlock";
import { TOTAL_FORMATS, CATEGORIES } from "@/lib/formats";

const BASE = "https://convertly.app";

function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return <h2 id={id} className="scroll-mt-20 text-2xl font-bold text-white">{children}</h2>;
}

const JS_EXAMPLE = `// Node 18+ / browsers (native fetch + FormData)
const fd = new FormData();
fd.append("file", fileBlob, "photo.png"); // Blob/File
fd.append("target", "webp");

const res = await fetch("${BASE}/api/convert", {
  method: "POST",
  body: fd,
});
if (!res.ok) throw new Error((await res.json()).error);

const converted = await res.blob(); // the .webp file
`;

const PY_EXAMPLE = `import requests

with open("photo.png", "rb") as f:
    res = requests.post(
        "${BASE}/api/convert",
        files={"file": f},
        data={"target": "webp"},
    )
res.raise_for_status()
with open("photo.webp", "wb") as out:
    out.write(res.content)
`;

export function DocsExamples() {
  return (
    <section id="examples" className="scroll-mt-20 space-y-4">
      <H2 id="examples-h">Examples</H2>
      <p className="text-[15px] leading-relaxed text-muted">The same convert request in three languages.</p>
      <CodeBlock title="JavaScript (fetch)" lang="js" code={JS_EXAMPLE} />
      <CodeBlock title="Python (requests)" lang="python" code={PY_EXAMPLE} />
    </section>
  );
}

export function DocsFormats() {
  return (
    <section id="formats" className="scroll-mt-20 space-y-4">
      <H2 id="formats-h">Supported formats</H2>
      <p className="text-[15px] leading-relaxed text-muted">
        Convertly supports {TOTAL_FORMATS} formats across {CATEGORIES.length} categories. Any input in a
        category can convert to compatible targets in that family. Pass a lowercase extension as{" "}
        <code className="text-white">target</code>.
      </p>
      <div className="space-y-3">
        {CATEGORIES.map((c) => (
          <div key={c.id} className="rounded-[10px] border border-line bg-surface p-4">
            <p className="text-sm font-semibold text-white">{c.label}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted">{c.formats.join(", ")}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
