// ---------------------------------------------------------------------------
// Convertly format registry
// ---------------------------------------------------------------------------
// Every conversion is resolved here: given a source extension and a target
// extension, which engine handles it. Engines are ordered by preference; the
// first one that can read the source AND write the target wins.
//
// Engines:
//   image   -> sharp        (fast, common web images)
//   magick  -> ImageMagick  (wide image format coverage, raw, icons, etc.)
//   media   -> FFmpeg       (audio + video)
//   doc     -> LibreOffice  (office documents, spreadsheets, slides)
//   markup  -> Pandoc       (markdown / html / rst / epub / plain text)
// ---------------------------------------------------------------------------

export type EngineId = "image" | "magick" | "media" | "doc" | "markup" | "ebook" | "font" | "vector" | "archive";

export interface Engine {
  id: EngineId;
  inputs: string[];
  outputs: string[];
}

// ---- format sets --------------------------------------------------------

// sharp: reliable, fast web image I/O
const sharpIn = ["png", "jpg", "jpeg", "webp", "avif", "tiff", "gif", "svg"];
const sharpOut = ["png", "jpg", "jpeg", "webp", "avif", "tiff"];

// ImageMagick: broad raster + vector coverage (read + write), verified via
// `convert -list format`. Kept to the formats users actually reach for.
const magickImg = [
  "png", "jpg", "jpeg", "webp", "avif", "gif", "tiff", "bmp", "ico", "cur",
  "heic", "heif", "tga", "psd", "psb", "ppm", "pgm", "pbm", "pnm", "xcf",
  "dds", "dib", "jp2", "j2k", "jpc", "pcx", "wbmp", "eps", "ai", "svg", "svgz",
  "pdf", "hdr", "exr", "pfm", "pict", "pct", "sgi", "sun", "ras", "xbm", "xpm",
  "xwd", "fits", "fax", "miff", "mng", "apng", "dpx", "otb", "palm", "pcd",
  "picon", "viff", "vips", "wpg", "cin", "jng",
];

// FFmpeg audio + video (verified muxers).
const audioExts = [
  "mp3", "wav", "flac", "aac", "ogg", "opus", "m4a", "wma", "aiff", "amr",
  "ac3", "wv", "caf", "au",
];
const videoExts = [
  "mp4", "mkv", "avi", "mov", "webm", "flv", "wmv", "mpeg", "mpg", "3gp",
  "m4v", "ts", "ogv", "asf", "dv", "f4v", "m2ts", "mts", "vob", "swf", "mxf",
];
const mediaIn = [...videoExts, ...audioExts];
const mediaOut = [...audioExts, ...videoExts, "gif"];

// LibreOffice office documents (headless --convert-to filters).
const docText = [
  "doc", "docx", "odt", "rtf", "txt", "html", "fodt", "dot", "dotx", "wps",
  "abw", "lwp", "sdw", "hwp", "pages",
];
const docSheet = ["xls", "xlsx", "ods", "csv", "fods", "xlsm", "dif", "slk", "dbf"];
const docSlide = ["ppt", "pptx", "odp", "fodp", "pps", "ppsx"];
const docIn = [...docText, ...docSheet, ...docSlide, "pdf"];
const docOut = [
  "pdf", "docx", "doc", "odt", "rtf", "txt", "html", "epub",
  "xlsx", "xls", "ods", "csv", "pptx", "ppt", "odp",
];

// Pandoc markup / lightweight documents.
const markupIn = [
  "md", "markdown", "html", "htm", "rst", "tex", "latex", "docx", "epub",
  "txt", "org", "rtf", "odt", "textile", "opml",
];
const markupOut = ["html", "md", "pdf", "docx", "epub", "txt", "rst", "latex", "odt", "rtf"];

// Calibre ebooks.
const ebookExts = ["epub", "mobi", "azw3", "azw", "fb2", "lit", "pdb", "lrf", "rtf", "cbz", "cbr", "txt", "html", "pdf", "docx"];
const ebookIn = ["epub", "mobi", "azw3", "azw", "fb2", "lit", "pdb", "lrf", "cbz", "cbr", "txt", "html", "pdf", "docx", "rtf", "odt"];
const ebookOut = ["epub", "mobi", "azw3", "fb2", "lit", "pdb", "lrf", "txt", "pdf", "docx", "rtf"];

// FontForge fonts.
const fontExts = ["ttf", "otf", "woff", "woff2", "eot", "svg", "ps", "pfb", "bdf"];
const fontIn = ["ttf", "otf", "woff", "woff2", "pfb", "bdf", "ps"];
const fontOut = ["ttf", "otf", "woff", "woff2", "svg", "pfb"];

// Inkscape vector graphics.
const vectorIn = ["svg", "svgz", "pdf", "eps", "ai", "emf", "wmf", "cdr"];
const vectorOut = ["svg", "pdf", "eps", "png", "emf", "wmf", "ps"];

// 7-Zip / archive formats (recompress).
const archiveExts = ["zip", "7z", "tar", "gz", "tgz", "bz2", "tbz2", "xz", "rar", "cbz"];
const archiveIn = ["zip", "7z", "tar", "gz", "tgz", "bz2", "tbz2", "xz", "rar"];
const archiveOut = ["zip", "7z", "tar", "gz", "tgz", "bz2", "xz"];

export const ENGINES: Engine[] = [
  { id: "image", inputs: sharpIn, outputs: sharpOut },
  { id: "magick", inputs: magickImg, outputs: magickImg },
  { id: "media", inputs: mediaIn, outputs: mediaOut },
  { id: "doc", inputs: docIn, outputs: docOut },
  { id: "markup", inputs: markupIn, outputs: markupOut },
  { id: "ebook", inputs: ebookIn, outputs: ebookOut },
  { id: "font", inputs: fontIn, outputs: fontOut },
  { id: "vector", inputs: vectorIn, outputs: vectorOut },
  { id: "archive", inputs: archiveIn, outputs: archiveOut },
];

// ---- MIME map (for download responses) ----------------------------------

export const MIME_BY_EXT: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  avif: "image/avif",
  tiff: "image/tiff",
  gif: "image/gif",
  bmp: "image/bmp",
  ico: "image/x-icon",
  heic: "image/heic",
  svg: "image/svg+xml",
  psd: "image/vnd.adobe.photoshop",
  eps: "application/postscript",
  mp3: "audio/mpeg",
  wav: "audio/wav",
  flac: "audio/flac",
  aac: "audio/aac",
  ogg: "audio/ogg",
  opus: "audio/opus",
  m4a: "audio/mp4",
  mp4: "video/mp4",
  mkv: "video/x-matroska",
  avi: "video/x-msvideo",
  mov: "video/quicktime",
  webm: "video/webm",
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  odt: "application/vnd.oasis.opendocument.text",
  rtf: "application/rtf",
  txt: "text/plain",
  html: "text/html",
  md: "text/markdown",
  epub: "application/epub+zip",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ods: "application/vnd.oasis.opendocument.spreadsheet",
  csv: "text/csv",
  ppt: "application/vnd.ms-powerpoint",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  odp: "application/vnd.oasis.opendocument.presentation",
};

export const FORMAT_LABELS: Record<string, string> = {
  jpg: "JPG",
  jpeg: "JPEG",
  png: "PNG",
  webp: "WebP",
  avif: "AVIF",
  tiff: "TIFF",
  gif: "GIF",
  bmp: "BMP",
  ico: "ICO",
  heic: "HEIC",
  svg: "SVG",
  mp3: "MP3",
  mp4: "MP4",
  wav: "WAV",
  flac: "FLAC",
  docx: "DOCX",
  pdf: "PDF",
  md: "Markdown",
};

// ---- resolution helpers -------------------------------------------------

export function allInputExts(): string[] {
  return Array.from(new Set(ENGINES.flatMap((e) => e.inputs))).sort();
}

/** Given a source extension, every target extension we can produce. */
export function targetsFor(sourceExt: string): string[] {
  const ext = sourceExt.toLowerCase().replace(/^\./, "");
  const targets = new Set<string>();
  for (const engine of ENGINES) {
    if (engine.inputs.includes(ext)) {
      for (const out of engine.outputs) if (out !== ext) targets.add(out);
    }
  }
  return Array.from(targets).sort();
}

/** Resolve which engine handles source -> target (first match wins). */
export function resolveEngine(sourceExt: string, targetExt: string): EngineId | null {
  const from = sourceExt.toLowerCase().replace(/^\./, "");
  const to = targetExt.toLowerCase().replace(/^\./, "");
  for (const engine of ENGINES) {
    if (engine.inputs.includes(from) && engine.outputs.includes(to)) return engine.id;
  }
  return null;
}

// ---- catalog (UI) -------------------------------------------------------

export interface Category {
  id: string;
  label: string;
  formats: string[];
}

export const CATEGORIES: Category[] = [
  {
    id: "image",
    label: "Image",
    formats: Array.from(new Set([...sharpIn, ...magickImg]))
      .map((e) => e.toUpperCase())
      .sort(),
  },
  { id: "video", label: "Video", formats: videoExts.map((e) => e.toUpperCase()).sort() },
  { id: "audio", label: "Audio", formats: audioExts.map((e) => e.toUpperCase()).sort() },
  {
    id: "document",
    label: "Document",
    formats: Array.from(new Set([...docText, "pdf", ...markupIn]))
      .map((e) => e.toUpperCase())
      .sort(),
  },
  { id: "spreadsheet", label: "Spreadsheet", formats: docSheet.map((e) => e.toUpperCase()).sort() },
  { id: "slides", label: "Slides", formats: docSlide.map((e) => e.toUpperCase()).sort() },
  { id: "ebook", label: "Ebook", formats: Array.from(new Set(ebookExts)).map((e) => e.toUpperCase()).sort() },
  { id: "font", label: "Font", formats: Array.from(new Set(fontExts)).map((e) => e.toUpperCase()).sort() },
  { id: "vector", label: "Vector", formats: Array.from(new Set([...vectorIn, ...vectorOut])).map((e) => e.toUpperCase()).sort() },
  { id: "archive", label: "Archive", formats: Array.from(new Set(archiveExts)).map((e) => e.toUpperCase()).sort() },
];

/** Which catalog category an extension belongs to (for the format picker). */
export function categoryOf(ext: string): string {
  const e = ext.toLowerCase().replace(/^\./, "");
  if (audioExts.includes(e)) return "audio";
  if (videoExts.includes(e)) return "video";
  if (archiveExts.includes(e)) return "archive";
  if (fontExts.includes(e)) return "font";
  if (ebookExts.includes(e) && !["pdf", "txt", "html", "docx", "rtf"].includes(e)) return "ebook";
  if (docSheet.includes(e)) return "spreadsheet";
  if (docSlide.includes(e)) return "slides";
  if (vectorIn.includes(e) && !magickImg.includes(e)) return "vector";
  if ([...docText, "pdf", ...markupIn].includes(e)) return "document";
  return "image";
}

export const TOTAL_FORMATS = CATEGORIES.reduce((n, c) => n + c.formats.length, 0);
