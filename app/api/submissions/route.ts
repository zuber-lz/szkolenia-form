import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { submissionSchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const json = await req.json();
  const parsed = submissionSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "ValidationError", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;

  const created = await prisma.submission.create({
    data: {
      term: data.term,
      invoiceName: data.invoiceName || null,
      streetAndNumber: data.streetAndNumber || null,
      zipCity: data.zipCity || null,
      nip: data.nip || null,
      phone: data.phone || null,
      invoiceEmail: data.invoiceEmail || null,
      otherAddress: data.otherAddress || null,
      eInvoiceConsent: data.eInvoiceConsent,
      heardFrom: data.heardFrom || "",
      rodoConsent: data.rodoConsent,
      infoObligation: data.infoObligation,

      participants: {
        create: data.participants.flatMap((p) =>
          p.scopes.map((s) => ({
            fullName: p.fullName,
            pesel: p.pesel || null,
            documentId: p.documentId || null,

            trainingScope: s.trainingScope || null,
            group: s.group || null,
            mode: null,

            points:
              [...(s.pointsE || []), ...(s.pointsD || [])].join(", ") || null,
          }))
        ),
      },
    },

    select: { id: true },
  });
  ``
  return NextResponse.json({ id: created.id }, { status: 201 });
}