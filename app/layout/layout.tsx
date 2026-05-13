import "./globals.css";

export const metadata = {
  title: "Zgłoszenia na szkolenie",
  description: "Formularz + PDF + Excel",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl">
      <body>
        <div className="container">
          <header className="topbar">
            <div className="brand">
              <span
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 10,
                  background: "linear-gradient(135deg, #2563eb, #7c3aed)",
                  display: "inline-block",
                }}
              />
              <span>Zgłoszenie na szkolenie</span>
            </div>
            <span className="badge">Next.js • PDF • Excel</span>
          </header>

          <div className="hero">
            <h1 className="h1">Formularz zgłoszeniowy</h1>
            <p className="sub">
              Wypełnij dane i dodaj uczestników. Po wysyłce pobierzesz PDF oraz eksport XLSX.
            </p>
          </div>

          {children}

          <p className="footerNote">
            Uwaga: jeśli endpointy PDF/XLSX mają być prywatne, dodamy prosty token lub logowanie.
          </p>
        </div>
      </body>
    </html>
  );
}