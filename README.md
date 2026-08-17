# Convertly

A free, fast, open-source file converter. Drop a file, pick a target format, and
download the result — no sign-up, no watermarks. Runs entirely on your own
infrastructure.

Live demo: self-host it (see below). Backed by [Ravisen](https://ravisen.com).

## Features

- **Images** — PNG, JPG, WebP, AVIF, GIF, TIFF, BMP, ICO, HEIC, PSD, TGA, EPS, SVG and 40+ more
  (via [sharp](https://sharp.pixelplumbing.com/) + [ImageMagick](https://imagemagick.org/))
- **Audio & Video** — MP4, MKV, MOV, WebM, AVI, MP3, WAV, FLAC, AAC, OGG, AC3 and more,
  including audio extraction (via [FFmpeg](https://ffmpeg.org/))
- **Documents** — PDF, DOCX, ODT, RTF, TXT, HTML, XLSX, PPTX and more
  (via [LibreOffice](https://www.libreoffice.org/) headless)
- **Markup** — Markdown, HTML, reStructuredText, EPUB, LaTeX (via [Pandoc](https://pandoc.org/))
- **Ebooks** — EPUB, MOBI, AZW3, FB2, LIT, PDB, CBZ (via [Calibre](https://calibre-ebook.com/))
- **Fonts** — TTF, OTF, WOFF, WOFF2, SVG (via [FontForge](https://fontforge.org/))
- **Vectors** — SVG, PDF, EPS, EMF, WMF (via [Inkscape](https://inkscape.org/))
- **Archives** — ZIP, 7Z, TAR, GZ, BZ2, XZ, RAR (via [7-Zip](https://www.7-zip.org/))

170+ formats across 10 categories. CloudConvert-style UI: drag-and-drop, per-format
converter pages, a searchable format picker grouped by category, and a clean dark theme.

## API

Convert a file over HTTP — no SDK required:

```bash
curl -X POST https://your-host/api/convert \
  -F "file=@photo.png" \
  -F "target=webp" \
  -o photo.webp
```

The endpoint auto-detects the source format and routes to the right engine.

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
```

### System dependencies

The CLI-based engines need these on the host (`apt install` on Debian/Ubuntu):

- `ffmpeg` — audio/video
- `libreoffice` — documents/spreadsheets/slides
- `imagemagick` — extended image formats
- `pandoc` — markup
- `calibre` — ebooks (provides `ebook-convert`)
- `fontforge` — fonts
- `inkscape` — vector graphics
- `p7zip-full` / `unrar` — archives

`sharp` installs automatically via npm.

## Tech stack

Next.js (App Router) · TypeScript · Tailwind CSS · Framer Motion.

## License

MIT — free for personal and commercial use.
