"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { submissionSchema, SubmissionInput } from "@/lib/validation";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  // dropdown terminu
  const [trainings, setTrainings] = useState<any[]>([]);
  const [loadingTrainings, setLoadingTrainings] = useState(true);

  useEffect(() => {
    fetch("/api/trainings")
      .then((res) => res.json())
      .then((data) => {
        setTrainings(data);
        setLoadingTrainings(false);
      });
  }, []);

  const form = useForm<SubmissionInput>({
    resolver: zodResolver(submissionSchema),
    defaultValues: {
      term: "",

      participants: [
        {
          fullName: "",
          pesel: "",
          documentId: "",
          scopes: [{ group: "G1", trainingScope: "", pointsE: [], pointsD: [] }],
        },
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
      {
        fullName: "",
        pesel: "",
        documentId: "",
        scopes: [{ group: "G1", trainingScope: "", pointsE: [], pointsD: [] }],
      },
    ]);
  };

  const removeParticipant = (idx: number) => {
    form.setValue(
      "participants",
      participants.filter((_, i) => i !== idx)
    );
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
            <p className="hint">
              Podaj odpowiadający termin (np. data/godzina lub nazwa terminu).
            </p>
          </div>
          <span className="badge">Wymagane</span>
        </div>

        <div className="fieldGrid">
          <div>
            <label className="label">Termin</label>
            <select className="select" {...form.register("term")} required>
              <option value="">
                {loadingTrainings ? "Ładowanie..." : "Wybierz termin"}
              </option>
              {trainings.map((t) => (
                <option key={t.id} value={`${t.date} – ${t.location}`}>
                  {t.date} – {t.location}
                </option>
              ))}
            </select>

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
                    <div className="error">
                      {String(form.formState.errors.participants?.[idx]?.fullName?.message)}
                    </div>
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

                {/* ✅ ZAKRESY + CHECKBOXY (G1/G2/G3) */}
                <ParticipantScopes idx={idx} form={form} />
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

      {/* ... reszta sekcji bez zmian ... */}

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

function ParticipantScopes({ idx, form }: { idx: number; form: any }) {
  const allGroups = ["G1", "G2", "G3"] as const;

  const POINTS_COUNT: Record<"G1" | "G2" | "G3", number> = {
    G1: 13,
    G2: 21,
    G3: 14,
  };

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: `participants.${idx}.scopes`,
  });

  const scopes = form.watch(`participants.${idx}.scopes`) || [];
  const usedGroups = scopes.map((s: any) => s.group);

  const addScope = () => {
    const available = allGroups.filter((g) => !usedGroups.includes(g));
    if (available.length === 0) return;

    append({ group: available[0], trainingScope: "", pointsE: [], pointsD: [] });
  };

  return (
    <div className="fieldGrid" style={{ marginTop: 10 }}>
      <div className="cardHeader" style={{ marginBottom: 6 }}>
        <div>
          <h3 className="h2" style={{ fontSize: 16 }}>Zakres szkolenia</h3>
          <p className="hint">Dodaj G1/G2/G3 jako osobne pozycje. Dla każdego G wybierz min. 1 punkt w E lub D. G1 – uprawnienia elektryczne, G2 – uprawnienia energetyczne (cieplne), G3 – uprawnienia gazowe</p>
        </div>

        <button type="button" className="btn" onClick={addScope} disabled={usedGroups.length >= 3}>
          + Dodaj zakres (G2/G3)
        </button>
      </div>

      {fields.map((f, sIdx) => {
        const currentGroup = (scopes?.[sIdx]?.group ?? f.group) as "G1" | "G2" | "G3";
        const count = POINTS_COUNT[currentGroup];
        const options = Array.from({ length: count }, (_, i) => String(i + 1));

        const selectedE: string[] = form.watch(`participants.${idx}.scopes.${sIdx}.pointsE`) ?? [];
        const selectedD: string[] = form.watch(`participants.${idx}.scopes.${sIdx}.pointsD`) ?? [];

        const toggle = (field: "pointsE" | "pointsD", val: string) => {
          const selected = field === "pointsE" ? selectedE : selectedD;
          const next = selected.includes(val) ? selected.filter((x) => x !== val) : [...selected, val];

          form.setValue(`participants.${idx}.scopes.${sIdx}.${field}`, next, {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true,
          });
        };

        const renderPointsGrid = (
          title: string,
          selectedArr: string[],
          toggleField: "pointsE" | "pointsD",
          keyPrefix: "E" | "D"
        ) => (
          <div style={{ marginTop: 10 }}>
            <label className="label">{title}</label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(0, 1fr))", gap: 8 }}>
              {options.map((val) => (
                <label
                  key={`${keyPrefix}-${idx}-${sIdx}-${val}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "6px 8px",
                    border: "1px solid #e5e7eb",
                    borderRadius: 8,
                    background: selectedArr.includes(val) ? "#f3f4f6" : "white",
                    cursor: "pointer",
                    userSelect: "none",
                    justifyContent: "center",
                    fontSize: 13,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedArr.includes(val)}
                    onChange={() => toggle(toggleField, val)}
                  />
                  {val}
                </label>
              ))}
            </div>
          </div>
        );

        return (
          <div key={f.id} className="cardSub">
            <div className="cardHeader" style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span className="badge">{currentGroup}</span>
                <span className="hint">Pozycja zakresu</span>
              </div>

              {fields.length > 1 && (
                <button type="button" className="btn btnDanger" onClick={() => remove(sIdx)}>
                  Usuń zakres
                </button>
              )}
            </div>

            <div className="row2">
              <div>
                <label className="label">Zakres (G)</label>
                <select className="select" {...form.register(`participants.${idx}.scopes.${sIdx}.group`)}>
                  {allGroups.map((g) => (
                    <option key={g} value={g} disabled={usedGroups.includes(g) && g !== currentGroup}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>

             
            </div>

            {renderPointsGrid("Eksploatacja (E) — zakres punktowy", selectedE, "pointsE", "E")}
            {renderPointsGrid("Dozór (D) — zakres punktowy", selectedD, "pointsD", "D")}

            {/* błąd walidacji: min 1 checkbox w E lub D dla danego G */}
            {form.formState.errors.participants?.[idx]?.scopes?.[sIdx]?.pointsE?.message && (
              <div className="error" style={{ marginTop: 10 }}>
                {String(form.formState.errors.participants?.[idx]?.scopes?.[sIdx]?.pointsE?.message)}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}