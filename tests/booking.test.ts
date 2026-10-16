import { describe, expect, it } from "vitest";
import { DEFAULT_RULES, edmontonToUtc, hoursFor, slotsFor, validateBookingWindow, type HoursConfig } from "@/lib/hours";
import { LOCATIONS } from "@/lib/content";

const cfg: HoursConfig = { weekly: LOCATIONS[0].weekly, overrides: [{ date: "2026-12-25", closed: true }, { date: "2026-12-26", closed: false, open: "09:00", close: "15:00" }] };
const now = new Date("2026-10-01T15:00:00Z"); // Thu 9:00 Calgary

describe("booking window validation (America/Edmonton)", () => {
  it("accepts a valid request", () => {
    expect(validateBookingWindow({ date: "2026-10-10", time: "09:00", partySize: 4 }, cfg, DEFAULT_RULES, now)).toBeNull();
  });
  it("rejects outside operating hours and too-late seatings", () => {
    expect(validateBookingWindow({ date: "2026-10-10", time: "06:00", partySize: 4 }, cfg, DEFAULT_RULES, now)).toMatch(/between/);
    expect(validateBookingWindow({ date: "2026-10-10", time: "14:45", partySize: 4 }, cfg, DEFAULT_RULES, now)).toMatch(/between/);
  });
  it("rejects party size outside limits", () => {
    expect(validateBookingWindow({ date: "2026-10-10", time: "09:00", partySize: 0 }, cfg, DEFAULT_RULES, now)).toMatch(/Party size/);
    expect(validateBookingWindow({ date: "2026-10-10", time: "09:00", partySize: 99 }, cfg, DEFAULT_RULES, now)).toMatch(/Party size/);
  });
  it("rejects past dates, short notice and dates too far ahead", () => {
    expect(validateBookingWindow({ date: "2026-09-30", time: "09:00", partySize: 2 }, cfg, DEFAULT_RULES, now)).toMatch(/notice/);
    expect(validateBookingWindow({ date: "2026-10-01", time: "10:00", partySize: 2 }, cfg, DEFAULT_RULES, now)).toMatch(/notice/);
    expect(validateBookingWindow({ date: "2027-03-01", time: "09:00", partySize: 2 }, cfg, DEFAULT_RULES, now)).toMatch(/ahead/);
  });
  it("honours holiday overrides", () => {
    expect(validateBookingWindow({ date: "2026-12-25", time: "09:00", partySize: 2 }, cfg, DEFAULT_RULES, new Date("2026-12-01T15:00:00Z"))).toMatch(/closed/);
    expect(hoursFor(cfg, "2026-12-26").open).toBe("09:00");
    expect(slotsFor(cfg, "2026-12-26")[0]).toBe("09:00");
  });
  it("rejects malformed input", () => {
    expect(validateBookingWindow({ date: "2026-02-31", time: "09:00", partySize: 2 }, cfg, DEFAULT_RULES, now)).toMatch(/valid/);
  });
  it("converts Edmonton wall time to UTC across DST", () => {
    expect(edmontonToUtc("2026-07-01", "09:00").toISOString()).toBe("2026-07-01T15:00:00.000Z"); // MDT -6
    expect(edmontonToUtc("2026-01-15", "09:00").toISOString()).toBe("2026-01-15T16:00:00.000Z"); // MST -7
  });
});

