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

/** Every input format gets a converter page. */
export function allConverterSlugs(): string[] {
  return allInputExts().map((ext) => `${ext}-converter`);
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
