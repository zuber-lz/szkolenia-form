import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { prisma } from "@/lib/prisma";

const styles = StyleSheet.create({
  page: { padding: 24, fontSize: 10 },
  h1: { fontSize: 14, marginBottom: 8 },
  sectionTitle: { fontSize: 11, marginTop: 12, marginBottom: 6 },
  box: { border: "1px solid #ddd", padding: 8, marginTop: 6 },
  row: { flexDirection: "row", gap: 8 },
  col: { flex: 1 },
  small: { fontSize: 9, color: "#444", marginTop: 10 },
});

export async function buildPdfDocument(submissionId: string) {
  const s = await prisma.submission.findUnique({
    where: { id: submissionId },
    include: { participants: true },
  });
  if (!s) throw new Error("NotFound");

  const Pdf = (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.h1}>FORMULARZ ZGŁOSZENIOWY</Text>

        <Text style={styles.sectionTitle}>TERMIN SZKOLENIA</Text>
        <View style={styles.box}>
          <Text>{s.term}</Text>
        </View>

        <Text style={styles.sectionTitle}>UCZESTNICY</Text>
        {s.participants.map((p, idx) => (
          <View key={p.id} style={styles.box}>
            <Text>Uczestnik {idx + 1}: {p.fullName}</Text>
            <View style={styles.row}>
              <Text style={styles.col}>PESEL: {p.pesel || "-"}</Text>
              <Text style={styles.col}>Dokument: {p.documentId || "-"}</Text>
            </View>
            <Text>Zakres szkolenia: {p.trainingScope || "-"}</Text>
            <View style={styles.row}>
              <Text style={styles.col}>G: {p.group || "-"}</Text>
              <Text style={styles.col}>E/D: {p.mode || "-"}</Text>
              <Text style={styles.col}>Punkty: {p.points || "-"}</Text>
            </View>
          </View>
        ))}

        <Text style={styles.sectionTitle}>DANE DO FAKTURY / WYSYŁKI</Text>
        <View style={styles.box}>
          <Text>Nazwa: {s.invoiceName || "-"}</Text>
          <Text>Adres: {s.streetAndNumber || "-"}, {s.zipCity || "-"}</Text>
          <Text>NIP: {s.nip || "-"}</Text>
          <Text>Telefon: {s.phone || "-"}</Text>
          <Text>Email faktury: {s.invoiceEmail || "-"}</Text>
          <Text>Inny adres: {s.otherAddress || "-"}</Text>
          <Text>Zgoda e-faktura: {s.eInvoiceConsent}</Text>
        </View>

        <Text style={styles.sectionTitle}>SKĄD WIEDZIAŁ(A) SIĘ O FIRMIE</Text>
        <View style={styles.box}>
          <Text>{s.heardFrom || "-"}</Text>
        </View>

        <Text style={styles.sectionTitle}>ZGODY</Text>
        <View style={styles.box}>
          <Text>RODO: {s.rodoConsent ? "TAK" : "NIE"}</Text>
          <Text>Obowiązek informacyjny: {s.infoObligation ? "TAK" : "NIE"}</Text>
        </View>

        <Text style={styles.small}>
          (To jest prosty szablon. Jak chcesz 1:1 jak w Wordzie z tabelkami, też zrobimy.)
        </Text>
      </Page>
    </Document>
  );

  return Pdf;
}