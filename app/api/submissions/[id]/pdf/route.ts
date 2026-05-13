import { NextResponse, NextRequest } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { buildPdfDocument } from "@/lib/pdf";

export const runtime = "nodejs";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const doc = await buildPdfDocument(id);
    const buffer = await renderToBuffer(doc);

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="zgloszenie-${id}.pdf"`,
      },
    });
  } catch {
    return NextResponse.json({ error: "NotFound" }, { status: 404 });
  }
}