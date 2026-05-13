
import { z } from "zod";

export const participantSchema = z.object({
  fullName: z.string().min(1, "Imię i nazwisko jest wymagane"),
  pesel: z.string().optional(),
  documentId: z.string().optional(),
  trainingScope: z.string().optional(),
  group: z.enum(["G1", "G2", "G3"]).optional(),
  mode: z.enum(["E", "D"]).optional(),
  points: z.string().optional(),
});

export const submissionSchema = z.object({
  term: z.string().min(1, "Termin szkolenia jest wymagany"),
  participants: z.array(participantSchema).min(1, "Dodaj min. 1 uczestnika"),

  invoiceName: z.string().optional(),
  streetAndNumber: z.string().optional(),
  zipCity: z.string().optional(),
  nip: z.string().optional(),
  phone: z.string().optional(),
  invoiceEmail: z.union([z.string().email(), z.literal(""), z.undefined()]),
  otherAddress: z.string().optional(),
  eInvoiceConsent: z.enum(["TAK", "NIE", "NIE_POTRZEBUJE"]).default("NIE"),

  heardFrom: z.string().default(""),

  rodoConsent: z.boolean().refine((v) => v === true, "Wymagana zgoda RODO"),
  infoObligation: z.boolean().refine((v) => v === true, "Wymagane potwierdzenie obowiązku informacyjnego"),
});

export type SubmissionInput = z.infer<typeof submissionSchema>;
