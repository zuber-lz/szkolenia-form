"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { submissionSchema, SubmissionInput } from "@/lib/validation";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<SubmissionInput>({
    resolver: zodResolver(submissionSchema),
    defaultValues: {
      term: "",
      participants: [
        { fullName: "", pesel: "", documentId: "", trainingScope: "", group: "G1", mode: "E", points: "" },
      ],
      invoiceName: "",
      streetAndNumber: "",
      zipCity: "",
      nip: "",
      phone: "",
      invoiceEmail: "",
      otherAddress: "",
      eInvoiceConsent: "NIE",
      heardFrom: "",
      rodoConsent: false,
      infoObligation: false,
    },
  });

  const participants = form.watch("participants");

  const addParticipant = () => {
    form.setValue("participants", [
      ...participants,
      { fullName: "", pesel: "", documentId: "", trainingScope: "", group: "G1", mode: "E", points: "" },
    ]);
  };

  const removeParticipant = (idx: number) => {
    form.setValue("participants", participants.filter((_, i) => i !== idx));
  };

  const onSubmit = async (data: SubmissionInput) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        console.error("Submit error:", res.status, body);
        alert("Błąd zapisu. Sprawdź pola i zgody.");
        return;
      }

      const { id } = await res.json();
      router.push(`/success/${id}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="grid">
      {/* TERMIN */}
      <section className="card">
        <div className="cardHeader">
          <div>
            <h2 className="h2">Termin szkolenia</h2>
            <p className="hint">Podaj odpowiadający termin (np. data/godzina lub nazwa terminu).</p>
          </div>
          <span className="badge">Wymagane</span>
        </div>

        <div className="fieldGrid">
          <div>
            <label className="label">Termin</label>
            <input
              className="input"
              placeholder="np. 2026-06-01 09:00"
              {...form.register("term")}
            />
            {form.formState.errors.term?.message && (
              <div className="error">{form.formState.errors.term?.message}</div>
            )}
          </div>
        </div>
      </section>

      {/* UCZESTNICY */}
      <section className="card">
        <div className="cardHeader">
          <div>
            <h2 className="h2">Dane uczestników</h2>
            <p className="hint">
              Jeśli posiadasz PESEL — wpisz wyłącznie PESEL. Jeśli brak PESEL — wpisz dane dokumentu.
            </p>
          </div>
          <span className="badge">{participants.length} os.</span>
        </div>

        <div className="fieldGrid">
          {participants.map((_, idx) => (
            <div key={idx} className="cardSub">
              <div className="cardHeader" style={{ marginBottom: 10 }}>
                <div>
                  <h2 className="h2">Uczestnik {idx + 1}</h2>
                  <p className="hint">Wypełnij dane i zakres szkolenia.</p>
                </div>

                {participants.length > 1 && (
                  <button type="button" className="btn btnDanger" onClick={() => removeParticipant(idx)}>
                    Usuń
                  </button>
                )}
              </div>

              <div className="fieldGrid">
                <div>
                  <label className="label">Imię i nazwisko</label>
                  <input
                    className="input"
                    placeholder="np. Jan Kowalski"
                    {...form.register(`participants.${idx}.fullName`)}
                  />
                  {form.formState.errors.participants?.[idx]?.fullName?.message && (
                    <div className="error">{form.formState.errors.participants?.[idx]?.fullName?.message}</div>
                  )}
                </div>

                <div className="row2">
                  <div>
                    <label className="label">PESEL (jeśli jest)</label>
                    <input
                      className="input"
                      placeholder="np. 90010112345"
                      {...form.register(`participants.${idx}.pesel`)}
                    />
                  </div>

                  <div>
                    <label className="label">Dokument tożsamości (gdy brak PESEL)</label>
                    <input
                      className="input"
                      placeholder="np. Dowód: ABC123456"
                      {...form.register(`participants.${idx}.documentId`)}
                    />
                  </div>
                </div>

                <div>
                  <label className="label">Zakres szkolenia</label>
                  <input
                    className="input"
                    placeholder="np. Uprawnienia SEP"
                    {...form.register(`participants.${idx}.trainingScope`)}
                  />
                </div>

                <div className="row3">
                  <div>
                    <label className="label">G (G1/G2/G3)</label>
                    <select className="select" {...form.register(`participants.${idx}.group`)}>
                      <option value="G1">G1</option>
                      <option value="G2">G2</option>
                      <option value="G3">G3</option>
                    </select>
                  </div>

                  <div>
                    <label className="label">E / D</label>
                    <select className="select" {...form.register(`participants.${idx}.mode`)}>
                      <option value="E">E (Eksploatacja)</option>
                      <option value="D">D (Dozór)</option>
                    </select>
                  </div>

                  <div>
                    <label className="label">Zakres punktowy (po przecinku)</label>
                    <input
                      className="input"
                      placeholder="np. 1,2,5"
                      {...form.register(`participants.${idx}.points`)}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="actions">
            <button type="button" className="btn" onClick={addParticipant}>
              + Dodaj uczestnika
            </button>
            <span className="badge">Dodawaj/usuń dynamicznie</span>
          </div>
        </div>
      </section>

      {/* DANE DO FAKTURY / WYSYŁKI */}
      <section className="card">
        <div className="cardHeader">
          <div>
            <h2 className="h2">Dane do wysyłki uprawnień / dane do faktury</h2>
            <p className="hint">Uzupełnij dane firmy/osoby oraz adresowe.</p>
          </div>
          <span className="badge">Opcjonalne (poza wyborem zgody)</span>
        </div>

        <div className="fieldGrid">
          <div>
            <label className="label">Nazwa firmy / Imię i nazwisko</label>
            <input className="input" {...form.register("invoiceName")} placeholder="np. Firma Sp. z o.o." />
          </div>

          <div>
            <label className="label">Ulica i numer</label>
            <input className="input" {...form.register("streetAndNumber")} placeholder="np. Marszałkowska 10" />
          </div>

          <div className="row2">
            <div>
              <label className="label">Kod pocztowy, miejscowość</label>
              <input className="input" {...form.register("zipCity")} placeholder="np. 00-001 Warszawa" />
            </div>
            <div>
              <label className="label">NIP</label>
              <input className="input" {...form.register("nip")} placeholder="np. 5250000000" />
            </div>
          </div>

          <div className="row2">
            <div>
              <label className="label">Telefon</label>
              <input className="input" {...form.register("phone")} placeholder="np. +48 600 000 000" />
            </div>
            <div>
              <label className="label">Email do przesłania faktury</label>
              <input className="input" {...form.register("invoiceEmail")} placeholder="np. faktury@firma.pl" />
              {form.formState.errors.invoiceEmail?.message && (
                <div className="error">{String(form.formState.errors.invoiceEmail?.message)}</div>
              )}
            </div>
          </div>

          <div>
            <label className="label">Inny adres korespondencyjny</label>
            <input className="input" {...form.register("otherAddress")} placeholder="jeśli inny niż powyżej" />
          </div>

          <div>
            <label className="label">Zgoda na otrzymywanie faktur drogą elektroniczną</label>
            <select className="select" {...form.register("eInvoiceConsent")}>
              <option value="TAK">TAK</option>
              <option value="NIE">NIE</option>
              <option value="NIE_POTRZEBUJE">NIE POTRZEBUJĘ FAKTURY</option>
            </select>
          </div>
        </div>
      </section>

      {/* ŹRÓDŁO */}
      <section className="card">
        <div className="cardHeader">
          <div>
            <h2 className="h2">Skąd dowiedział(a) się Pan/Pani o naszej firmie?</h2>
            <p className="hint">Wpisz np.: GOOGLE, OLX, z polecenia, ulotka, billboardy…</p>
          </div>
          <span className="badge">Opcjonalne</span>
        </div>

        <div className="fieldGrid">
          <div>
            <label className="label">Źródło</label>
            <input className="input" {...form.register("heardFrom")} placeholder="np. GOOGLE; OLX; z polecenia" />
          </div>
        </div>
      </section>

      {/* ZGODY */}
      <section className="card">
        <div className="cardHeader">
          <div>
            <h2 className="h2">Zgody</h2>
            <p className="hint">Wymagane do wysłania formularza.</p>
          </div>
          <span className="badge">Wymagane</span>
        </div>

        <div className="fieldGrid">
          <label className="checkboxRow">
            <input type="checkbox" {...form.register("rodoConsent")} />
            <div>
              <div style={{ fontWeight: 700 }}>Zgoda RODO</div>
              <div className="hint">Wyrażam zgodę na przetwarzanie danych osobowych na potrzeby szkolenia.</div>
            </div>
          </label>

          <label className="checkboxRow">
            <input type="checkbox" {...form.register("infoObligation")} />
            <div>
              <div style={{ fontWeight: 700 }}>Obowiązek informacyjny</div>
              <div className="hint">Potwierdzam otrzymanie dokumentu „Obowiązek informacyjny administratora danych”.</div>
            </div>
          </label>

          {(form.formState.errors.rodoConsent?.message || form.formState.errors.infoObligation?.message) && (
            <div className="error">
              {String(form.formState.errors.rodoConsent?.message || form.formState.errors.infoObligation?.message)}
            </div>
          )}

          <div className="actions">
            <button className="btn btnPrimary" disabled={submitting} type="submit" onClick={form.handleSubmit(onSubmit)}>
              {submitting ? "Wysyłam..." : "Wyślij"}
            </button>
            <span className="badge">Po wysyłce: PDF + Excel</span>
          </div>
        </div>
      </section>
    </main>
  );
}