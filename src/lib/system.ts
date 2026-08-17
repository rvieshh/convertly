import { execFile } from "child_process";
import { promisify } from "util";
import os from "os";
import fs from "fs";

const execFileP = promisify(execFile);

export interface EngineStatus {
  name: string;
  binary: string;
  installed: boolean;
  version: string;
  purpose: string;
}

const ENGINES: { name: string; binary: string; args: string[]; purpose: string }[] = [
  { name: "FFmpeg", binary: "ffmpeg", args: ["-version"], purpose: "Audio & video" },
  { name: "ImageMagick", binary: "convert", args: ["-version"], purpose: "Extended images" },
  { name: "LibreOffice", binary: "soffice", args: ["--version"], purpose: "Documents" },
  { name: "Pandoc", binary: "pandoc", args: ["--version"], purpose: "Markup" },
  { name: "Calibre", binary: "ebook-convert", args: ["--version"], purpose: "Ebooks" },
  { name: "FontForge", binary: "fontforge", args: ["--version"], purpose: "Fonts" },
  { name: "Inkscape", binary: "inkscape", args: ["--version"], purpose: "Vectors" },
  { name: "7-Zip", binary: "7z", args: [], purpose: "Archives" },
  { name: "LibRaw", binary: "raw-identify", args: [], purpose: "Camera RAW" },
  { name: "Ghostscript", binary: "gs", args: ["--version"], purpose: "Compress PDF" },
  { name: "pngquant", binary: "pngquant", args: ["--version"], purpose: "Compress PNG" },
  { name: "jpegoptim", binary: "jpegoptim", args: ["--version"], purpose: "Compress JPG" },
  { name: "OCRmyPDF", binary: "ocrmypdf", args: ["--version"], purpose: "PDF OCR" },
  { name: "Tesseract", binary: "tesseract", args: ["--version"], purpose: "OCR engine" },
  { name: "potrace", binary: "potrace", args: ["--version"], purpose: "Raster → SVG" },
];

function firstVersion(text: string): string {
  const m = text.match(/\d+\.\d+(\.\d+)?/);
  return m ? m[0] : "installed";
}

export async function getEngineStatuses(): Promise<EngineStatus[]> {
  return Promise.all(
    ENGINES.map(async (e) => {
      try {
        const { stdout, stderr } = await execFileP(e.binary, e.args, { timeout: 5000 });
        const out = (stdout || stderr || "").toString();
        return {
          name: e.name,
          binary: e.binary,
          installed: true,
          version: firstVersion(out),
          purpose: e.purpose,
        };
      } catch (err: unknown) {
        // ENOENT means the binary isn't installed. A non-zero exit (usage text,
        // etc.) still means it exists — treat that as installed.
        const code = (err as { code?: string | number }).code;
        const missing = code === "ENOENT";
        const out = ((err as { stdout?: string; stderr?: string }).stdout ||
          (err as { stderr?: string }).stderr ||
          "").toString();
        return {
          name: e.name,
          binary: e.binary,
          installed: !missing,
          version: missing ? "—" : firstVersion(out),
          purpose: e.purpose,
        };
      }
    }),
  );
}

export interface SystemInfo {
  platform: string;
  arch: string;
  nodeVersion: string;
  cpuCount: number;
  loadAvg: number[];
  totalMem: number;
  freeMem: number;
  uptimeSec: number;
  disk?: { total: number; free: number; usedPct: number };
}

export async function getSystemInfo(): Promise<SystemInfo> {
  const info: SystemInfo = {
    platform: os.platform(),
    arch: os.arch(),
    nodeVersion: process.version,
    cpuCount: os.cpus().length,
    loadAvg: os.loadavg().map((n) => Math.round(n * 100) / 100),
    totalMem: os.totalmem(),
    freeMem: os.freemem(),
    uptimeSec: Math.round(os.uptime()),
  };
  try {
    const st = fs.statfsSync(process.cwd());
    const total = st.blocks * st.bsize;
    const free = st.bfree * st.bsize;
    info.disk = { total, free, usedPct: Math.round(((total - free) / total) * 100) };
  } catch {
    /* statfs may be unavailable */
  }
  return info;
}
