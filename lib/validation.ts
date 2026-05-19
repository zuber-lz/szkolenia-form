import { z } from "zod";

const scopeSchema = z.object({
  group: z.enum(["G1", "G2", "G3"]),
  trainingScope: z.string().min(1, "Podaj zakres szkolenia"),
  pointsE: z.array(z.string()).default([]), // ✅ checkboxy dla Eksploatacji
  pointsD: z.array(z.string()).default([]), // ✅ checkboxy dla Dozoru
}).superRefine((val, ctx) => {
  // ✅ min. 1 checkbox dla tego G (E lub D)
  if ((val.pointsE?.length ?? 0) + (val.pointsD?.length ?? 0) < 1) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Zaznacz min. 1 punkt (E lub D) dla wybranego zakresu G",
      path: ["pointsE"], // możesz też dać ["pointsD"] albo ["group"]
    });
  }
});

export const participantSchema = z.object({
  fullName: z.string().min(1, "Imię i nazwisko jest wymagane"),
  pesel: z.string().optional(),
  documentId: z.string().optional(),
  scopes: z.array(scopeSchema).min(1, "Dodaj przynajmniej jeden zakres (G1)").max(3),
}).superRefine((val, ctx) => {
  // unikalność G
  const groups = val.scopes.map(s => s.group);
  const set = new Set(groups);
  if (set.size !== groups.length) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Nie możesz wybrać tego samego zakresu G więcej niż raz",
      path: ["scopes"],
    });
  }

  // PESEL lub dokument
  if (!val.pesel?.trim() && !val.documentId?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Podaj PESEL lub dokument tożsamości",
      path: ["documentId"],
    });
  }
});

export const submissionSchema = z.object({
  term: z.string().min(1, "Termin szkolenia jest wymagany"),
  participants: z.array(participantSchema).min(1, "Dodaj min. 1 uczestnika"),

  invoiceName: z.string().optional(),
  streetAndNumber: z.string().optional(),
  zipCity: z.string().optional(),
  nip: z.string().optional(),
  phone: z.string().optional(),
  invoiceEmail: z.union([z.string().email("Niepoprawny email"), z.literal(""), z.undefined()]),
  otherAddress: z.string().optional(),
  eInvoiceConsent: z.enum(["TAK", "NIE", "NIE_POTRZEBUJE"]).default("NIE"),

  heardFrom: z.string().default(""),

  rodoConsent: z.boolean().refine(v => v === true, "Wymagana zgoda RODO"),
  infoObligation: z.boolean().refine(v => v === true, "Wymagane potwierdzenie obowiązku informacyjnego"),
});

export type SubmissionInput = z.input<typeof submissionSchema>;
export type SubmissionParsed = z.infer<typeof submissionSchema>;
