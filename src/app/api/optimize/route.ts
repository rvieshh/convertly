import { NextRequest, NextResponse } from "next/server";
import { compressPdf, compressPng, compressJpg, ocrPdf } from "@/lib/engines/cli";
import { logConversion } from "@/lib/stats";

export const runtime = "nodejs";
export const maxDuration = 300;

function extOf(name: string): string {
  const m = name.toLowerCase().match(/\.([a-z0-9]+)$/);
  return m ? m[1] : "";
}

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("file");
    const op = String(form.get("op") || "");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    const input = Buffer.from(await file.arrayBuffer());
    const ext = extOf(file.name);

    let output: Buffer;
    let outName = file.name;
    let mime = "application/octet-stream";

    switch (op) {
      case "compress-pdf":
        output = await compressPdf(input);
        mime = "application/pdf";
        outName = file.name.replace(/\.pdf$/i, "") + "-compressed.pdf";
        break;
      case "compress-png":
        output = await compressPng(input);
        mime = "image/png";
        outName = file.name.replace(/\.png$/i, "") + "-compressed.png";
        break;
      case "compress-jpg":
        output = await compressJpg(input);
        mime = "image/jpeg";
        outName = file.name.replace(/\.(jpe?g)$/i, "") + "-compressed.jpg";
        break;
      case "pdf-ocr":
        output = await ocrPdf(input, ext || "pdf");
        mime = "application/pdf";
        outName = file.name.replace(/\.[a-z0-9]+$/i, "") + "-ocr.pdf";
        break;
      default:
        return NextResponse.json({ error: "Unknown operation" }, { status: 422 });
    }

    logConversion({
      sourceExt: ext || op,
      targetExt: op.startsWith("compress") ? ext || op : "pdf",
      kind: "optimize",
      op,
      ok: true,
      bytesIn: input.length,
      bytesOut: output.length,
      ms: 0,
    });
    return new NextResponse(new Uint8Array(output), {
      status: 200,
      headers: {
        "Content-Type": mime,
        "Content-Disposition": `attachment; filename="${outName}"`,
        "X-Original-Size": String(input.length),
        "X-Optimized-Size": String(output.length),
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Optimization failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
