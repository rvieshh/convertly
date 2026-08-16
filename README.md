# Convertly

A free, fast, open-source file converter. Drop a file, pick a target format, and
download the result — no sign-up, no watermarks. Runs entirely on your own
infrastructure.

Currently supports **image conversion** (PNG, JPG, WebP, AVIF, TIFF) with audio &
video (via FFmpeg) and documents on the roadmap.

## Features

- 🖼️ **Image conversion** — PNG ↔ JPG ↔ WebP ↔ AVIF ↔ TIFF, powered by [sharp](https://sharp.pixelplumbing.com/)
- ⚡ **Fast** — conversions run server-side, streamed straight back to the browser
- 🎨 **Modern UI** — drag-and-drop, smooth animations, dark theme
- 🔓 **No account needed** — just convert and download
- 🧩 **Extensible engine registry** — add a new format/engine in one place

## Tech Stack

- [Next.js 16](https://nextjs.org/) (App Router, Route Handlers)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [sharp](https://sharp.pixelplumbing.com/) for image processing

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Roadmap

- [x] Image conversion (sharp)
- [ ] Audio & video conversion (FFmpeg)
- [ ] Document conversion (LibreOffice)
- [ ] Markup conversion (Pandoc)
- [ ] Batch conversion
- [ ] Conversion options (quality, resize)

## License

MIT

---

Backed by [Ravisen](https://ravisen.com).
