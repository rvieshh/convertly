import { NextRequest, NextResponse } from "next/server";
import { resolveEngine, MIME_BY_EXT } from "@/lib/formats";
import { convertImage } from "@/lib/engines/image";

// Convert runs on the Node runtime (sharp needs native bindings).
export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_BYTES = 100 * 1024 * 1024; // 100 MB per file

export async function POST(req: NextRequest) {
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = form.get("file");
  const target = String(form.get("target") ?? "").toLowerCase().replace(/^\./, "");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  if (!target) {
    return NextResponse.json({ error: "No target format" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File too large (max 100 MB)" }, { status: 413 });
  }

  const sourceExt = (file.name.split(".").pop() ?? "").toLowerCase();
  const engine = resolveEngine(sourceExt, target);
  if (!engine) {
    return NextResponse.json(
      { error: `Cannot convert ${sourceExt || "?"} to ${target}` },
      { status: 422 },
    );
  }

  const input = Buffer.from(await file.arrayBuffer());

  try {
    let output: Buffer;
    switch (engine) {
      case "image":
        output = await convertImage(input, target);
        break;
      default:
        return NextResponse.json(
          { error: `Engine "${engine}" not available yet` },
          { status: 501 },
        );
    }

    const baseName = file.name.replace(/\.[^.]+$/, "") || "converted";
    const outName = `${baseName}.${target}`;
    const outArray = new Uint8Array(output);

    return new NextResponse(outArray, {
      status: 200,
      headers: {
        "Content-Type": MIME_BY_EXT[target] ?? "application/octet-stream",
        "Content-Disposition": `attachment; filename="${outName}"`,
        "Content-Length": String(output.length),
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Conversion failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
