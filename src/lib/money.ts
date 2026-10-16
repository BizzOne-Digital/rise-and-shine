const cad = new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" });

/** Formats integer cents as CAD. Returns null when there is no verified positive price. */
export function formatCAD(cents: number | null | undefined): string | null {
  if (typeof cents !== "number" || !Number.isInteger(cents) || cents <= 0) return null;
  return cad.format(cents / 100);
}

/** Parses "12.50" / "$12.5" into integer cents. Returns null for empty/invalid/zero input. */
export function parsePriceToCents(input: string | null | undefined): number | null {
  if (!input) return null;
  const cleaned = input.replace(/[$,\s]/g, "");
  if (!/^\d+(\.\d{1,2})?$/.test(cleaned)) return null;
  const cents = Math.round(parseFloat(cleaned) * 100);
  return cents > 0 ? cents : null;
}
