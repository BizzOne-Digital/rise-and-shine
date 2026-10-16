export const TZ = "America/Edmonton";
export const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;

export type DayHours = { closed: boolean; open: string; close: string }; // "HH:MM" 24h
export type HolidayOverride = { date: string; closed: boolean; open?: string; close?: string; note?: string };
export type HoursConfig = { weekly: DayHours[]; overrides: HolidayOverride[] }; // weekly[0] = Sunday

export type BookingRules = {
  minPartySize: number;
  maxPartySize: number;
  minLeadMinutes: number;
  maxAdvanceDays: number;
  slotMinutes: number;
  lastSeatingBeforeCloseMinutes: number;
};

export const DEFAULT_RULES: BookingRules = {
  minPartySize: 1,
  maxPartySize: 20,
  minLeadMinutes: 120,
  maxAdvanceDays: 60,
  slotMinutes: 30,
  lastSeatingBeforeCloseMinutes: 30,
};

const pad = (n: number) => String(n).padStart(2, "0");
export const toMinutes = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};
export const fromMinutes = (m: number) => `${pad(Math.floor(m / 60))}:${pad(m % 60)}`;

/** Calendar-date parts of an instant as seen in Edmonton. */
export function edmontonParts(d: Date) {
  const f = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  });
  const p = Object.fromEntries(f.formatToParts(d).map((x) => [x.type, x.value]));
  return { date: `${p.year}-${p.month}-${p.day}`, time: `${p.hour}:${p.minute}` };
}

export function todayEdmonton(now = new Date()) {
  return edmontonParts(now).date;
}

/** Weekday (0=Sun) of a YYYY-MM-DD calendar date (timezone independent). */
export function weekdayOf(date: string) {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

export function isValidDate(date: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const [y, m, d] = date.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d;
}

/** Converts an Edmonton wall-clock date+time to a UTC Date (DST safe). */
export function edmontonToUtc(date: string, time: string): Date {
  const [y, mo, d] = date.split("-").map(Number);
  const [h, mi] = time.split(":").map(Number);
  const wall = Date.UTC(y, mo - 1, d, h, mi);
  let guess = wall;
  for (let i = 0; i < 2; i++) {
    const p = edmontonParts(new Date(guess));
    const [py, pmo, pd] = p.date.split("-").map(Number);
    const [ph, pmi] = p.time.split(":").map(Number);
    const shown = Date.UTC(py, pmo - 1, pd, ph, pmi);
    guess += wall - shown;
  }
  return new Date(guess);
}

/** Effective hours for a calendar date, considering holiday overrides. */
export function hoursFor(cfg: HoursConfig, date: string): DayHours {
  const o = cfg.overrides.find((x) => x.date === date);
  if (o) return o.closed ? { closed: true, open: "00:00", close: "00:00" } : { closed: false, open: o.open ?? "09:00", close: o.close ?? "15:00" };
  return cfg.weekly[weekdayOf(date)] ?? { closed: true, open: "00:00", close: "00:00" };
}

/** Bookable time slots (HH:MM) for a date. */
export function slotsFor(cfg: HoursConfig, date: string, rules: BookingRules = DEFAULT_RULES): string[] {
  if (!isValidDate(date)) return [];
  const h = hoursFor(cfg, date);
  if (h.closed) return [];
  const out: string[] = [];
  const last = toMinutes(h.close) - rules.lastSeatingBeforeCloseMinutes;
  for (let m = toMinutes(h.open); m <= last; m += rules.slotMinutes) out.push(fromMinutes(m));
  return out;
}

export type BookingInput = { date: string; time: string; partySize: number };

/** Returns a human-readable error, or null when the request is acceptable. */
export function validateBookingWindow(
  input: BookingInput, cfg: HoursConfig, rules: BookingRules = DEFAULT_RULES, now = new Date(),
): string | null {
  if (!Number.isInteger(input.partySize) || input.partySize < rules.minPartySize || input.partySize > rules.maxPartySize)
    return `Party size must be between ${rules.minPartySize} and ${rules.maxPartySize}. For larger groups, please send a catering or event inquiry.`;
  if (!isValidDate(input.date) || !/^\d{2}:\d{2}$/.test(input.time)) return "Please choose a valid date and time.";
  const at = edmontonToUtc(input.date, input.time);
  if (at.getTime() < now.getTime() + rules.minLeadMinutes * 60_000)
    return `Booking requests need at least ${Math.round(rules.minLeadMinutes / 60)} hour(s) notice.`;
  const maxDate = new Date(now.getTime() + rules.maxAdvanceDays * 86_400_000);
  if (at.getTime() > maxDate.getTime()) return `Requests can be made up to ${rules.maxAdvanceDays} days ahead.`;
  const h = hoursFor(cfg, input.date);
  if (h.closed) return "The restaurant is closed on that date. Please choose another day.";
  if (!slotsFor(cfg, input.date, rules).includes(input.time))
    return `Please choose a time between ${h.open} and ${fromMinutes(toMinutes(h.close) - rules.lastSeatingBeforeCloseMinutes)}.`;
  return null;
}

export function formatTime12(t: string) {
  const [h, m] = t.split(":").map(Number);
  const suffix = h >= 12 ? "pm" : "am";
  return `${((h + 11) % 12) + 1}${m ? ":" + pad(m) : ""}${suffix}`;
}
