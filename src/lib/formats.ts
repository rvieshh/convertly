// Central format + engine registry. Each engine declares the formats it can
// read (from) and write (to). The converter API resolves the right engine for
// a requested conversion. Adding a new engine here automatically expands the
// supported conversion matrix surfaced in the UI.

export type EngineId = "image" | "media" | "document" | "markup";

export interface FormatDef {
  ext: string; // canonical extension, lowercase, no dot
  label: string; // human label shown in the UI
  mime: string;
}

export interface Engine {
  id: EngineId;
  label: string;
  /** Formats this engine can convert FROM. */
  inputs: string[];
  /** Formats this engine can convert TO. */
  outputs: string[];
}

// ---- Image (sharp) ----
const IMAGE_FORMATS: FormatDef[] = [
  { ext: "png", label: "PNG", mime: "image/png" },
  { ext: "jpg", label: "JPG", mime: "image/jpeg" },
  { ext: "jpeg", label: "JPEG", mime: "image/jpeg" },
  { ext: "webp", label: "WebP", mime: "image/webp" },
  { ext: "avif", label: "AVIF", mime: "image/avif" },
  { ext: "gif", label: "GIF", mime: "image/gif" },
  { ext: "tiff", label: "TIFF", mime: "image/tiff" },
];

// ---- Media (ffmpeg) — added in a later phase ----
const AUDIO_FORMATS: FormatDef[] = [
  { ext: "mp3", label: "MP3", mime: "audio/mpeg" },
  { ext: "wav", label: "WAV", mime: "audio/wav" },
  { ext: "ogg", label: "OGG", mime: "audio/ogg" },
  { ext: "m4a", label: "M4A", mime: "audio/mp4" },
  { ext: "flac", label: "FLAC", mime: "audio/flac" },
];

const VIDEO_FORMATS: FormatDef[] = [
  { ext: "mp4", label: "MP4", mime: "video/mp4" },
  { ext: "webm", label: "WebM", mime: "video/webm" },
  { ext: "mkv", label: "MKV", mime: "video/x-matroska" },
  { ext: "mov", label: "MOV", mime: "video/quicktime" },
  { ext: "gif", label: "GIF", mime: "image/gif" },
];

export const FORMAT_LABELS: Record<string, string> = Object.fromEntries(
  [...IMAGE_FORMATS, ...AUDIO_FORMATS, ...VIDEO_FORMATS].map((f) => [f.ext, f.label]),
);

export const MIME_BY_EXT: Record<string, string> = Object.fromEntries(
  [...IMAGE_FORMATS, ...AUDIO_FORMATS, ...VIDEO_FORMATS].map((f) => [f.ext, f.mime]),
);

const imageExts = IMAGE_FORMATS.map((f) => f.ext);
const audioExts = AUDIO_FORMATS.map((f) => f.ext);
const videoExts = VIDEO_FORMATS.map((f) => f.ext);

export const ENGINES: Engine[] = [
  {
    id: "image",
    label: "Image",
    inputs: imageExts,
    // sharp cannot write gif frames reliably as animation; keep static outputs
    outputs: ["png", "jpg", "webp", "avif", "tiff"],
  },
  {
    id: "media",
    label: "Audio & Video",
    inputs: [...videoExts, ...audioExts],
    outputs: [...audioExts, "mp4", "webm", "gif"],
  },
];

/** All extensions we accept as an upload. */
export function allInputExts(): string[] {
  return Array.from(new Set(ENGINES.flatMap((e) => e.inputs))).sort();
}

/** Given a source extension, list every target extension we can produce. */
export function targetsFor(sourceExt: string): string[] {
  const ext = sourceExt.toLowerCase().replace(/^\./, "");
  const targets = new Set<string>();
  for (const engine of ENGINES) {
    if (engine.inputs.includes(ext)) {
      for (const out of engine.outputs) {
        if (out !== ext) targets.add(out);
      }
    }
  }
  return Array.from(targets).sort();
}

/** Resolve which engine handles a source→target conversion. */
export function resolveEngine(sourceExt: string, targetExt: string): EngineId | null {
  const from = sourceExt.toLowerCase().replace(/^\./, "");
  const to = targetExt.toLowerCase().replace(/^\./, "");
  for (const engine of ENGINES) {
    if (engine.inputs.includes(from) && engine.outputs.includes(to)) {
      return engine.id;
    }
  }
  return null;
}

/** Catalog categories surfaced in the Format Catalog section. Only lists
 *  formats an engine can actually read, so the count never overstates. */
export interface Category {
  id: string;
  label: string;
  formats: string[];
  common: [string, string][];
}

export const CATEGORIES: Category[] = [
  {
    id: "image",
    label: "Images",
    formats: imageExts.map((e) => e.toUpperCase()),
    common: [
      ["PNG", "WEBP"],
      ["JPG", "PNG"],
      ["WEBP", "JPG"],
      ["PNG", "AVIF"],
    ],
  },
  {
    id: "video",
    label: "Video",
    formats: videoExts.map((e) => e.toUpperCase()),
    common: [
      ["MP4", "GIF"],
      ["MOV", "MP4"],
      ["WEBM", "MP4"],
    ],
  },
  {
    id: "audio",
    label: "Audio",
    formats: audioExts.map((e) => e.toUpperCase()),
    common: [
      ["WAV", "MP3"],
      ["M4A", "MP3"],
      ["FLAC", "MP3"],
    ],
  },
];

export const TOTAL_FORMATS = Array.from(
  new Set(CATEGORIES.flatMap((c) => c.formats)),
).length;
