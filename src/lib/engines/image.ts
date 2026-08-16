import sharp from "sharp";

export interface ConvertOptions {
  /** JPEG/WebP/AVIF quality 1-100. */
  quality?: number;
  /** Optional max width/height for resize (keeps aspect ratio). */
  width?: number;
  height?: number;
}

/**
 * Convert an image buffer from its source format to `target` using sharp.
 * Returns the converted buffer. Throws on unsupported target.
 */
export async function convertImage(
  input: Buffer,
  target: string,
  opts: ConvertOptions = {},
): Promise<Buffer> {
  const quality = opts.quality ?? 82;
  let pipeline = sharp(input, { animated: target === "webp" });

  if (opts.width || opts.height) {
    pipeline = pipeline.resize({
      width: opts.width,
      height: opts.height,
      fit: "inside",
      withoutEnlargement: true,
    });
  }

  switch (target) {
    case "png":
      return pipeline.png({ compressionLevel: 9 }).toBuffer();
    case "jpg":
    case "jpeg":
      return pipeline.jpeg({ quality, mozjpeg: true }).toBuffer();
    case "webp":
      return pipeline.webp({ quality }).toBuffer();
    case "avif":
      return pipeline.avif({ quality }).toBuffer();
    case "tiff":
      return pipeline.tiff({ quality }).toBuffer();
    default:
      throw new Error(`Unsupported image target: ${target}`);
  }
}
