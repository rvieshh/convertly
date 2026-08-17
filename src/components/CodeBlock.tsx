"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

/**
 * A titled code block with a copy button — used across the docs page.
 */
export function CodeBlock({
  title,
  code,
  lang = "bash",
}: {
  title?: string;
  code: string;
  lang?: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="overflow-hidden rounded-[10px] border border-line bg-[#141417]">
      <div className="flex items-center justify-between border-b border-line/70 px-4 py-2">
        <span className="text-xs text-muted">{title ?? lang}</span>
        <button
          onClick={copy}
          className="flex items-center gap-1.5 rounded-[5px] px-2 py-1 text-xs text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-[13px] leading-relaxed">
        <code className="font-mono text-zinc-200 whitespace-pre">{code}</code>
      </pre>
    </div>
  );
}
