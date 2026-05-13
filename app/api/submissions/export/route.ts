import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  const subs = await prisma.submission.findMany({
    include: { participants: true },
    orderBy: { createdAt: "desc" },
  });

  const rows: any[] = [];
  for (const s of subs) {
    for (const p of s.participants) {
      rows.push({
        submissionId: s.id,
        createdAt: s.createdAt.toISOString(),
        term: s.term,

        fullName: p.fullName,
        pesel: p.pesel || "",
        documentId: p.documentId || "",
        trainingScope: p.trainingScope || "",
        group: p.group || "",
        mode: p.mode || "",
        points: p.points || "",

        invoiceName: s.invoiceName || "",
        streetAndNumber: s.streetAndNumber || "",
        zipCity: s.zipCity || "",
        nip: s.nip || "",
        phone: s.phone || "",
        invoiceEmail: s.invoiceEmail || "",
        otherAddress: s.otherAddress || "",
        eInvoiceConsent: s.eInvoiceConsent,

        heardFrom: s.heardFrom || "",
        rodoConsent: s.rodoConsent ? "TAK" : "NIE",
        infoObligation: s.infoObligation ? "TAK" : "NIE",
      });
    }
  }

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Zgloszenia");
  const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

  return new NextResponse(buf, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="zgloszenia.xlsx"`,
    },
  });
}