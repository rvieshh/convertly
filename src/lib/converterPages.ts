// Per-format converter page definitions. A slug like "jpg-converter" resolves
// to { from: "jpg" }. Used by the dynamic route to render an SEO page whose
// workspace defaults to converting FROM that format.
import { allInputExts, targetsFor, FORMAT_LABELS } from "@/lib/formats";

export interface ConverterPage {
  slug: string; // e.g. "jpg-converter" or "png-to-jpg"
  from: string; // source ext, e.g. "jpg"
  fromLabel: string;
  suggestedTarget: string; // default target format
  title: string;
  description: string;
}

/** Every input format gets a converter page, plus popular conversion pairs. */
export function allConverterSlugs(): string[] {
  const single = allInputExts().map((ext) => `${ext}-converter`);
  // Pre-render common conversion pairs so they're crawlable and fast.
  const pairs = [
    "png-to-jpg", "jpg-to-png", "png-to-webp", "webp-to-png", "jpg-to-webp",
    "heic-to-jpg", "png-to-pdf", "jpg-to-pdf", "png-to-ico", "svg-to-png",
    "mp4-to-mp3", "mp4-to-gif", "mov-to-mp4", "webm-to-mp4", "avi-to-mp4",
    "wav-to-mp3", "flac-to-mp3", "m4a-to-mp3", "mkv-to-mp4",
    "docx-to-pdf", "pdf-to-docx", "doc-to-pdf", "xlsx-to-pdf", "pptx-to-pdf",
    "epub-to-mobi", "epub-to-pdf", "mobi-to-epub", "pdf-to-epub",
    "ttf-to-woff2", "otf-to-ttf", "svg-to-pdf", "eps-to-svg",
    "zip-to-7z", "rar-to-zip", "7z-to-zip",
  ];
  return [...single, ...pairs];
}

export function getConverterPage(slug: string): ConverterPage | null {
  const s = slug.toLowerCase();

  // Pair route: "png-to-jpg" -> from png, target jpg.
  const pair = s.match(/^([a-z0-9]+)-to-([a-z0-9]+)$/i);
  if (pair) {
    const from = pair[1];
    const to = pair[2];
    const targets = targetsFor(from);
    if (!targets.includes(to)) return null;
    const fromLabel = FORMAT_LABELS[from] ?? from.toUpperCase();
    const toLabel = FORMAT_LABELS[to] ?? to.toUpperCase();
    return {
      slug: s,
      from,
      fromLabel,
      suggestedTarget: to,
      title: `${fromLabel} to ${toLabel} — Convert ${fromLabel} to ${toLabel} Online Free`,
      description: `Convert ${fromLabel} to ${toLabel} online, free and fast. No sign-up, no watermark — right in your browser.`,
    };
  }

  // Single route: "jpg-converter".
  const m = s.match(/^([a-z0-9]+)-converter$/i);
  if (!m) return null;
  const from = m[1];
  const targets = targetsFor(from);
  if (targets.length === 0) return null;
  const fromLabel = FORMAT_LABELS[from] ?? from.toUpperCase();
  const suggestedTarget = targets[0];
  const targetLabel = FORMAT_LABELS[suggestedTarget] ?? suggestedTarget.toUpperCase();
  return {
    slug: s,
    from,
    fromLabel,
    suggestedTarget,
    title: `${fromLabel} Converter — Convert ${fromLabel} Online Free`,
    description: `Convert ${fromLabel} files to ${targets
      .slice(0, 4)
      .map((t) => FORMAT_LABELS[t] ?? t.toUpperCase())
      .join(", ")} and more. Free, fast, no sign-up. ${fromLabel} to ${targetLabel} in your browser.`,
  };
}
