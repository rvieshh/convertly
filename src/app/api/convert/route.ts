import { NextRequest, NextResponse } from "next/server";
import { resolveEngine, MIME_BY_EXT } from "@/lib/formats";
import { convertImage } from "@/lib/engines/image";
import {
  convertMedia,
  convertDocument,
  convertMagick,
  convertMarkup,
  convertEbook,
  convertFont,
  convertVector,
  convertArchive,
} from "@/lib/engines/cli";

// Conversions run on the Node runtime (native binaries + child processes).
export const runtime = "nodejs";
export const maxDuration = 300;

function extOf(name: string) {
  return (name.split(".").pop() ?? "").toLowerCase();
}

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("file");
    const target = String(form.get("target") ?? "").toLowerCase();

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }
    if (!target) {
      return NextResponse.json({ error: "No target format specified" }, { status: 400 });
    }

    const sourceExt = extOf(file.name);
    const engine = resolveEngine(sourceExt, target);
    if (!engine) {
      return NextResponse.json(
        { error: `Cannot convert ${sourceExt || "file"} to ${target}` },
        { status: 422 },
      );
    }

    const input = Buffer.from(await file.arrayBuffer());

    let output: Buffer;
    switch (engine) {
      case "image":
        output = await convertImage(input, target);
        break;
      case "magick":
        output = await convertMagick(input, sourceExt, target);
        break;
      case "media":
        output = await convertMedia(input, sourceExt, target);
        break;
      case "doc":
        output = await convertDocument(input, sourceExt, target);
        break;
      case "markup":
        output = await convertMarkup(input, sourceExt, target);
        break;
      case "ebook":
        output = await convertEbook(input, sourceExt, target);
        break;
      case "font":
        output = await convertFont(input, sourceExt, target);
        break;
      case "vector":
        output = await convertVector(input, sourceExt, target);
        break;
      case "archive":
        output = await convertArchive(input, sourceExt, target);
        break;
      default:
        return NextResponse.json({ error: "Unsupported conversion" }, { status: 422 });
    }

    const base = file.name.replace(/\.[^.]+$/, "");
    const mime = MIME_BY_EXT[target] ?? "application/octet-stream";
    return new NextResponse(new Uint8Array(output), {
      status: 200,
      headers: {
        "Content-Type": mime,
        "Content-Disposition": `attachment; filename="${base}.${target}"`,
        "Content-Length": String(output.length),
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Conversion failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
