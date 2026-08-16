// Per-format converter page definitions. A slug like "jpg-converter" resolves
// to { from: "jpg" }. Used by the dynamic route to render an SEO page whose
// workspace defaults to converting FROM that format.
import { allInputExts, targetsFor, FORMAT_LABELS } from "@/lib/formats";

export interface ConverterPage {
  slug: string; // e.g. "jpg-converter"
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
  const m = slug.match(/^([a-z0-9]+)-converter$/i);
  if (!m) return null;
  const from = m[1].toLowerCase();
  const targets = targetsFor(from);
  if (targets.length === 0) return null;
  const fromLabel = FORMAT_LABELS[from] ?? from.toUpperCase();
  const suggestedTarget = targets[0];
  const targetLabel = FORMAT_LABELS[suggestedTarget] ?? suggestedTarget.toUpperCase();
  return {
    slug,
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
