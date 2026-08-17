import { promises as fs } from "fs";
import path from "path";
import { run, makeWorkDir, cleanup } from "./exec";

/** FFmpeg: audio + video conversion. */
export async function convertMedia(
  input: Buffer,
  sourceExt: string,
  targetExt: string,
): Promise<Buffer> {
  const dir = await makeWorkDir();
  try {
    const inPath = path.join(dir, `in.${sourceExt}`);
    const outPath = path.join(dir, `out.${targetExt}`);
    await fs.writeFile(inPath, input);
    // -y overwrite, let ffmpeg pick sane codecs from the container extension.
    const args = ["-y", "-i", inPath];
    // extracting audio from video: drop the video stream
    const audio = ["mp3", "wav", "flac", "aac", "ogg", "opus", "m4a", "wma", "aiff", "amr"];
    if (audio.includes(targetExt)) args.push("-vn");
    args.push(outPath);
    try {
      await run("ffmpeg", args, 240_000);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (audio.includes(targetExt) && /does not contain any stream|Output file .* does not|no streams/i.test(msg)) {
        throw new Error("This file has no audio track to extract.");
      }
      throw err;
    }
    return await fs.readFile(outPath);
  } finally {
    await cleanup(dir);
  }
}

/** LibreOffice headless: office documents. */
export async function convertDocument(
  input: Buffer,
  sourceExt: string,
  targetExt: string,
): Promise<Buffer> {
  const dir = await makeWorkDir();
  try {
    const inPath = path.join(dir, `in.${sourceExt}`);
    await fs.writeFile(inPath, input);
    // soffice writes <basename>.<target> into the outdir.
    await run(
      "soffice",
      [
        "--headless",
        "--norestore",
        "--convert-to",
        targetExt,
        "--outdir",
        dir,
        inPath,
      ],
      240_000,
    );
    const outPath = path.join(dir, `in.${targetExt}`);
    return await fs.readFile(outPath);
  } finally {
    await cleanup(dir);
  }
}

/** ImageMagick: wide image format coverage. */
export async function convertMagick(
  input: Buffer,
  sourceExt: string,
  targetExt: string,
): Promise<Buffer> {
  const dir = await makeWorkDir();
  try {
    const inPath = path.join(dir, `in.${sourceExt}`);
    const outPath = path.join(dir, `out.${targetExt}`);
    await fs.writeFile(inPath, input);
    await run("convert", [inPath, outPath], 120_000);
    return await fs.readFile(outPath);
  } finally {
    await cleanup(dir);
  }
}

/** Pandoc: markup / document text conversion. */
export async function convertMarkup(
  input: Buffer,
  sourceExt: string,
  targetExt: string,
): Promise<Buffer> {
  const dir = await makeWorkDir();
  try {
    const inPath = path.join(dir, `in.${sourceExt}`);
    const outPath = path.join(dir, `out.${targetExt}`);
    await fs.writeFile(inPath, input);
    const args = [inPath, "-o", outPath];
    // pandoc needs a PDF engine; use LibreOffice-independent wkhtml fallback? Keep default.
    await run("pandoc", args, 120_000);
    return await fs.readFile(outPath);
  } finally {
    await cleanup(dir);
  }
}

/** Calibre: ebook conversion (epub, mobi, azw3, fb2, cbz, etc.). */
export async function convertEbook(
  input: Buffer,
  sourceExt: string,
  targetExt: string,
): Promise<Buffer> {
  const dir = await makeWorkDir();
  try {
    const inPath = path.join(dir, `in.${sourceExt}`);
    const outPath = path.join(dir, `out.${targetExt}`);
    await fs.writeFile(inPath, input);
    // ebook-convert infers formats from the file extensions.
    await run("ebook-convert", [inPath, outPath], 240_000);
    return await fs.readFile(outPath);
  } finally {
    await cleanup(dir);
  }
}

/** FontForge: font conversion (ttf, otf, woff, woff2, etc.). */
export async function convertFont(
  input: Buffer,
  sourceExt: string,
  targetExt: string,
): Promise<Buffer> {
  const dir = await makeWorkDir();
  try {
    const inPath = path.join(dir, `in.${sourceExt}`);
    const outPath = path.join(dir, `out.${targetExt}`);
    await fs.writeFile(inPath, input);
    // Run a tiny FontForge script: open the input, generate the target.
    const script = `Open("${inPath}"); Generate("${outPath}");`;
    await run("fontforge", ["-lang=ff", "-c", script], 120_000);
    return await fs.readFile(outPath);
  } finally {
    await cleanup(dir);
  }
}

/** Inkscape: vector conversion (svg, pdf, eps, png, emf, wmf). */
export async function convertVector(
  input: Buffer,
  sourceExt: string,
  targetExt: string,
): Promise<Buffer> {
  const dir = await makeWorkDir();
  try {
    const inPath = path.join(dir, `in.${sourceExt}`);
    const outPath = path.join(dir, `out.${targetExt}`);
    await fs.writeFile(inPath, input);
    await run("inkscape", [inPath, "--export-type=" + targetExt, "--export-filename=" + outPath], 120_000);
    return await fs.readFile(outPath);
  } finally {
    await cleanup(dir);
  }
}

/** 7-Zip / tar: archive create + extract-to-single conversions. */
export async function convertArchive(
  input: Buffer,
  sourceExt: string,
  targetExt: string,
): Promise<Buffer> {
  const dir = await makeWorkDir();
  try {
    const inPath = path.join(dir, `in.${sourceExt}`);
    const outPath = path.join(dir, `out.${targetExt}`);
    await fs.writeFile(inPath, input);
    // Recompress: extract the input into a folder, then repack as the target.
    const extractDir = path.join(dir, "x");
    await fs.mkdir(extractDir, { recursive: true });
    await run("7z", ["x", inPath, `-o${extractDir}`, "-y"], 180_000);
    await run("7z", ["a", outPath, path.join(extractDir, "*")], 180_000);
    return await fs.readFile(outPath);
  } finally {
    await cleanup(dir);
  }
}

/** Ghostscript: compress a PDF (downsampling + recompression). */
export async function compressPdf(input: Buffer): Promise<Buffer> {
  const dir = await makeWorkDir();
  try {
    const inPath = path.join(dir, "in.pdf");
    const outPath = path.join(dir, "out.pdf");
    await fs.writeFile(inPath, input);
    await run(
      "gs",
      [
        "-sDEVICE=pdfwrite",
        "-dCompatibilityLevel=1.4",
        "-dPDFSETTINGS=/ebook",
        "-dNOPAUSE",
        "-dQUIET",
        "-dBATCH",
        `-sOutputFile=${outPath}`,
        inPath,
      ],
      180_000,
    );
    const out = await fs.readFile(outPath);
    // If Ghostscript somehow produced a larger file, keep the original.
    return out.length > 0 && out.length < input.length ? out : input;
  } finally {
    await cleanup(dir);
  }
}

/** pngquant: lossy PNG compression with alpha preserved. */
export async function compressPng(input: Buffer): Promise<Buffer> {
  const dir = await makeWorkDir();
  try {
    const inPath = path.join(dir, "in.png");
    const outPath = path.join(dir, "out.png");
    await fs.writeFile(inPath, input);
    // --force overwrite, quality floor/ceiling, keep going on marginal images.
    await run(
      "pngquant",
      ["--force", "--quality=45-85", "--strip", "--output", outPath, inPath],
      120_000,
    ).catch(() => {});
    try {
      const out = await fs.readFile(outPath);
      return out.length > 0 && out.length < input.length ? out : input;
    } catch {
      return input;
    }
  } finally {
    await cleanup(dir);
  }
}

/** jpegoptim: JPEG compression (in place, max quality 80). */
export async function compressJpg(input: Buffer): Promise<Buffer> {
  const dir = await makeWorkDir();
  try {
    const inPath = path.join(dir, "in.jpg");
    await fs.writeFile(inPath, input);
    await run("jpegoptim", ["--strip-all", "--max=80", inPath], 120_000).catch(() => {});
    const out = await fs.readFile(inPath);
    return out.length > 0 && out.length <= input.length ? out : input;
  } finally {
    await cleanup(dir);
  }
}

/** ocrmypdf: add a searchable text layer to a PDF (or image -> PDF). */
export async function ocrPdf(input: Buffer, sourceExt: string): Promise<Buffer> {
  const dir = await makeWorkDir();
  try {
    const inPath = path.join(dir, `in.${sourceExt}`);
    const outPath = path.join(dir, "out.pdf");
    await fs.writeFile(inPath, input);
    // --force-ocr redoes OCR even if some text exists; -l eng+ind for EN+ID.
    await run(
      "ocrmypdf",
      ["--force-ocr", "-l", "eng+ind", inPath, outPath],
      240_000,
    );
    return await fs.readFile(outPath);
  } finally {
    await cleanup(dir);
  }
}
