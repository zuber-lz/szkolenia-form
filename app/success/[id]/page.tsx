export default function SuccessPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const pdfHref = `/api/submissions/${id}/pdf`;
  const xlsxHref = `/api/submissions/export`;

  return (
    <main className="grid">
      <section className="card">
        <div className="cardHeader">
          <div>
            <h2 className="h2">Zapisane ✅</h2>
            <p className="hint">
              ID zgłoszenia: <b>{id}</b>
            </p>
          </div>
          <span className="badge">Gotowe</span>
        </div>

        <div className="actions">
          <a className="btnLink" href={pdfHref}>📄 Pobierz PDF</a>
          <a className="btnLink" href={xlsxHref}>📊 Pobierz Excel (wszystkie)</a>
        </div>
      </section>
    </main>
  );
}