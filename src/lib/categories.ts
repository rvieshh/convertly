// Category converter pages (e.g. /document-converter, /image-converter).
// Each groups every format in that category; the page presets the hero to the
// category and lists all its formats as dedicated converter links.
import { CATEGORIES, ENGINES, type EngineId } from "@/lib/formats";

export interface CategoryPage {
  slug: string;      // "document-converter"
  id: string;        // "document"
  label: string;     // "Document"
  title: string;
  description: string;
  formats: string[]; // lowercase input exts in this category
}

// Which engines feed each catalog category (for collecting input formats).
const CAT_ENGINES: Record<string, EngineId[]> = {
  image: ["image", "magick"],
  video: ["media"],
  audio: ["media"],
  document: ["doc", "markup"],
  spreadsheet: ["doc"],
  slides: ["doc"],
  ebook: ["ebook"],
  font: ["font"],
  vector: ["vector"],
  archive: ["archive"],
  raw: ["magick"],
};

const DESCRIPTIONS: Record<string, string> = {
  image: "Convert image files online — PNG, JPG, WebP, AVIF, GIF, TIFF, SVG and dozens more. Free, fast, and secure, right in your browser.",
  video: "Convert video files online between MP4, MKV, MOV, WebM, AVI and more. Change format or extract audio — free and fast, no sign-up.",
  audio: "Convert audio files online — MP3, WAV, FLAC, AAC, OGG, M4A and more. High-quality conversion in your browser, no sign-up.",
  document: "Convert document files online — PDF, DOCX, ODT, RTF, TXT, HTML and more. Clean, accurate output, free and fast, no sign-up.",
  spreadsheet: "Convert spreadsheet files online — XLSX, XLS, ODS, CSV and more. Preserve your data across formats, free and fast.",
  slides: "Convert presentation files online — PPTX, PPT, ODP and more. Free, fast, and secure, right in your browser.",
  ebook: "Convert ebook files online — EPUB, MOBI, AZW3, FB2, PDF and more. Ready for any e-reader, free and fast.",
  font: "Convert font files online — TTF, OTF, WOFF, WOFF2 and more. Web-ready fonts in seconds, free and fast.",
  vector: "Convert vector graphics online — SVG, PDF, EPS, EMF and more. Scale without quality loss, free and fast.",
  archive: "Convert and recompress archives online — ZIP, 7Z, TAR, GZ and more. Free, fast, and secure, right in your browser.",
  raw: "Convert camera RAW photos online — CR2, NEF, ARW, DNG and more — into standard images like JPG, PNG or TIFF.",
};

function inputsForCategory(id: string): string[] {
  const engineIds = CAT_ENGINES[id] ?? [];
  const cat = CATEGORIES.find((c) => c.id === id);
  const catFormats = new Set((cat?.formats ?? []).map((f) => f.toLowerCase()));
  const inputs = new Set<string>();
  for (const e of ENGINES) {
    if (!engineIds.includes(e.id)) continue;
    for (const inp of e.inputs) if (catFormats.has(inp)) inputs.add(inp);
  }
  // Fall back to the catalog list if engine intersection is empty.
  if (inputs.size === 0) catFormats.forEach((f) => inputs.add(f));
  // Drop alias duplicates that render the same label (e.g. md/markdown,
  // jpg/jpeg, htm/html, tex/latex) — keep the first, canonical one.
  const ALIASES: Record<string, string> = {
    markdown: "md",
    jpeg: "jpg",
    htm: "html",
    latex: "tex",
    tiff: "tiff",
    svgz: "svg",
  };
  const seen = new Set<string>();
  const out: string[] = [];
  for (const f of Array.from(inputs).sort()) {
    const canonical = ALIASES[f] ?? f;
    if (seen.has(canonical)) continue;
    seen.add(canonical);
    out.push(canonical === f ? f : canonical);
  }
  return Array.from(new Set(out)).sort();
}

export function allCategoryIds(): string[] {
  return CATEGORIES.map((c) => c.id);
}

export function allCategorySlugs(): string[] {
  return CATEGORIES.map((c) => `${c.id}-converter`);
}

export function isCategoryId(id: string): boolean {
  return CATEGORIES.some((c) => c.id === id.toLowerCase());
}

export function getCategoryPage(slug: string): CategoryPage | null {
  const m = slug.toLowerCase().match(/^([a-z]+)-converter$/);
  if (!m) return null;
  const id = m[1];
  const cat = CATEGORIES.find((c) => c.id === id);
  if (!cat) return null;
  return {
    slug: `${id}-converter`,
    id,
    label: cat.label,
    title: `${cat.label} Converter — Convert ${cat.label} Files Online Free`,
    description: DESCRIPTIONS[id] ?? `Convert ${cat.label} files online — free, fast, no sign-up.`,
    formats: inputsForCategory(id),
  };
}
