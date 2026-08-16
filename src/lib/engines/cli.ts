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
