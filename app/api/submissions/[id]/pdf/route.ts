import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { buildPdfDocument } from "@/lib/pdf";

export const runtime = "nodejs";

export async function GET(
  _: Request,
  { params }: { params: { id: string } }
) {
  try {
    const doc = await buildPdfDocument(params.id);
    const buffer = await renderToBuffer(doc);

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="zgloszenie-${params.id}.pdf"`,
      },
    });
  } catch {
    return NextResponse.json({ error: "NotFound" }, { status: 404 });
  }
}