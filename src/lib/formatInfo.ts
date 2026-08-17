// Short human descriptions for common formats, shown on converter pages.
// Falls back to a generic line for anything not listed.
import { FORMAT_LABELS, categoryOf } from "@/lib/formats";

const INFO: Record<string, string> = {
  png: "PNG (Portable Network Graphics) is a lossless raster image format with transparency support, ideal for web graphics, logos, and screenshots.",
  jpg: "JPG (JPEG) is a lossy raster image format that compresses photos to small file sizes, the most common format for digital photography and the web.",
  jpeg: "JPEG is a lossy raster image format that compresses photos to small file sizes, the most common format for digital photography and the web.",
  webp: "WebP is a modern image format by Google offering superior lossy and lossless compression for the web, smaller than JPG and PNG.",
  avif: "AVIF is a next-generation image format based on the AV1 codec, delivering excellent compression and quality for the web.",
  gif: "GIF is a raster image format supporting simple animation and a 256-colour palette, widely used for short looping clips.",
  tiff: "TIFF is a high-quality, lossless raster format used in publishing, photography, and scanning where detail matters.",
  bmp: "BMP is an uncompressed raster image format from Windows, storing pixel data with no quality loss but large file sizes.",
  ico: "ICO is the Windows icon format, storing small images at multiple sizes for app and favicon use.",
  svg: "SVG is a vector image format defined in XML, scaling to any size without quality loss — ideal for logos and icons.",
  heic: "HEIC is Apple's high-efficiency image format, storing photos at high quality with small file sizes on iPhone and iPad.",
  psd: "PSD is Adobe Photoshop's layered image format, preserving layers, masks, and editing data.",
  eps: "EPS is a vector format based on PostScript, used in professional printing and graphic design.",
  pdf: "PDF (Portable Document Format) preserves layout, fonts, and graphics across devices — the standard for documents and print.",
  docx: "DOCX is the modern Microsoft Word document format, storing formatted text, images, and styles.",
  doc: "DOC is the classic Microsoft Word document format used by older versions of Word.",
  odt: "ODT is the OpenDocument text format used by LibreOffice and OpenOffice.",
  xlsx: "XLSX is the modern Microsoft Excel spreadsheet format storing cells, formulas, and charts.",
  pptx: "PPTX is the modern Microsoft PowerPoint presentation format.",
  txt: "TXT is plain text with no formatting, readable everywhere.",
  html: "HTML is the markup language of the web, structuring text, links, and media.",
  md: "Markdown is a lightweight markup language for formatting plain text, popular for docs and READMEs.",
  epub: "EPUB is the open ebook standard, reflowing text to fit any screen — supported by most e-readers.",
  mobi: "MOBI is an ebook format originally used by Amazon Kindle devices.",
  azw3: "AZW3 (KF8) is Amazon's Kindle ebook format with richer formatting than MOBI.",
  mp4: "MP4 is the most widely supported video container, balancing quality and file size for streaming and playback.",
  mkv: "MKV (Matroska) is a flexible video container that can hold many audio, video, and subtitle tracks.",
  mov: "MOV is Apple's QuickTime video container, common on macOS and iOS.",
  webm: "WebM is an open, royalty-free video format designed for the web.",
  avi: "AVI is a classic Windows video container with broad compatibility.",
  mp3: "MP3 is the most common lossy audio format, compressing music to small files with good quality.",
  wav: "WAV is an uncompressed, lossless audio format used in production and archiving.",
  flac: "FLAC is a lossless audio format that compresses without any quality loss, favoured by audiophiles.",
  aac: "AAC is a lossy audio format offering better quality than MP3 at similar bitrates, used by Apple and streaming.",
  ogg: "OGG is an open, royalty-free audio container commonly paired with the Vorbis codec.",
  ttf: "TTF (TrueType Font) is a widely supported outline font format for screen and print.",
  otf: "OTF (OpenType Font) is a modern font format with advanced typographic features.",
  woff2: "WOFF2 is the compressed web font format delivering fast-loading fonts to browsers.",
  zip: "ZIP is the most common archive format, bundling and compressing multiple files.",
  "7z": "7Z is a high-ratio archive format from 7-Zip, compressing tighter than ZIP.",
};

export function formatInfo(ext: string): string {
  const e = ext.toLowerCase();
  if (INFO[e]) return INFO[e];
  const label = FORMAT_LABELS[e] ?? e.toUpperCase();
  const cat = categoryOf(e);
  const kind: Record<string, string> = {
    image: "an image format",
    audio: "an audio format",
    video: "a video format",
    document: "a document format",
    spreadsheet: "a spreadsheet format",
    slides: "a presentation format",
    ebook: "an ebook format",
    font: "a font format",
    vector: "a vector graphics format",
    archive: "an archive format",
    raw: "a camera RAW image format",
  };
  return `${label} is ${kind[cat] ?? "a file format"} supported by Convertly for fast, free online conversion.`;
}
