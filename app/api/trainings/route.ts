
import { NextResponse } from "next/server";

export async function GET() {
  const SHEET_ID = "1klWytCk3xl5pg9UWxhXDdIL6junQEhxdpPBKKKgxKpU";
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv`;

  const res = await fetch(url);
  const text = await res.text();

  // parsowanie CSV
  const rows = text.split("\n").slice(1); // skip header

  const trainings = rows
    .map((row) => {
      const [date, location] = row.split(",");

      if (!date || !location) return null;

      return {
        id: `${date}-${location}`,
        date: date.trim(),
        location: location.trim(),
      };
    })
    .filter(Boolean);

  return NextResponse.json(trainings);
}
