import { z } from "zod";

const clean = (s: string) => s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim();
const text = (min: number, max: number, label: string) =>
  z.string({ error: `${label} is required` }).transform(clean)
    .pipe(z.string().min(min, `${label} is required`).max(max, `${label} is too long`));
const optionalText = (max: number) =>
  z.string().optional().default("").transform(clean).pipe(z.string().max(max, "That field is too long"));

export const phoneSchema = z.string().transform(clean)
  .pipe(z.string().regex(/^[0-9+()\-.\s]{7,20}$/, "Enter a valid phone number"));
export const emailSchema = z.string().transform((s) => clean(s).toLowerCase())
  .pipe(z.string().email("Enter a valid email address").max(120));

/** Hidden anti-spam fields: honeypot must be empty and the form must have been open at least 3 seconds. */
const spamFields = { website: z.string().optional().default(""), ts: z.coerce.number().optional().default(0) };

export function looksLikeSpam(d: { website?: string; ts?: number }, now = Date.now()) {
  if (d.website) return true;
  if (!d.ts || now - d.ts < 3000 || now - d.ts > 1000 * 60 * 60 * 6) return true;
  return false;
}

export const bookingSchema = z.object({
  location: text(1, 60, "Location"),
  name: text(2, 80, "Name"),
  email: emailSchema,
  phone: phoneSchema,
  partySize: z.coerce.number({ error: "Party size is required" }).int("Party size must be a whole number"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a date"),
  time: z.string().regex(/^\d{2}:\d{2}$/, "Choose a time"),
  notes: optionalText(500),
  ...spamFields,
});

export const loginSchema = z.object({ email: emailSchema, password: z.string().min(1).max(200) });

export const passwordPolicy = z.string().min(12, "Use at least 12 characters").max(200);
