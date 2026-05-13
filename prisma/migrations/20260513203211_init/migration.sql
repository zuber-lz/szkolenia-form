-- CreateEnum
CREATE TYPE "TrainingGroup" AS ENUM ('G1', 'G2', 'G3');

-- CreateEnum
CREATE TYPE "TrainingMode" AS ENUM ('E', 'D');

-- CreateEnum
CREATE TYPE "EInvoiceConsent" AS ENUM ('TAK', 'NIE', 'NIE_POTRZEBUJE');

-- CreateTable
CREATE TABLE "Submission" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "term" TEXT NOT NULL,
    "invoiceName" TEXT,
    "streetAndNumber" TEXT,
    "zipCity" TEXT,
    "nip" TEXT,
    "phone" TEXT,
    "invoiceEmail" TEXT,
    "otherAddress" TEXT,
    "eInvoiceConsent" "EInvoiceConsent" NOT NULL DEFAULT 'NIE',
    "heardFrom" TEXT NOT NULL,
    "rodoConsent" BOOLEAN NOT NULL,
    "infoObligation" BOOLEAN NOT NULL,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Participant" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "pesel" TEXT,
    "documentId" TEXT,
    "trainingScope" TEXT,
    "group" "TrainingGroup",
    "mode" "TrainingMode",
    "points" TEXT,

    CONSTRAINT "Participant_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "Submission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
