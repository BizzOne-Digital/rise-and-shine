"use server";

import { createHash } from "crypto";
import { connectDB } from "@/lib/db";
import { env } from "@/lib/env";
import { BookingRequest, ContactMessage, JobApplication, Location, SiteSettings } from "@/lib/models";
import { applicationSchema, bookingSchema, checkResume, contactSchema, looksLikeSpam } from "@/lib/validation";
import { DEFAULT_RULES, edmontonToUtc, validateBookingWindow, weekdayOf, type HoursConfig } from "@/lib/hours";
import { clientKey, rateLimit } from "@/lib/ratelimit";
import { notifyStaff } from "@/lib/notify";
import { BUSINESS } from "@/lib/content";

export type FormState = { ok?: boolean; message?: string; error?: string; fieldErrors?: Record<string, string> };

const UNAVAILABLE = `Online submissions are not available right now. Please call ${BUSINESS.phoneDisplay} or email ${BUSINESS.email}.`;
/** Shown when a submission was saved but the email to the team did not go out (e.g. email is not set up yet). */
const NOT_EMAILED = `We saved your submission, but we could not email it to the team just right now. Please email ${BUSINESS.email} or call ${BUSINESS.phoneDisplay} so we do not miss you.`;
const hash = (...p: (string | number)[]) => createHash("sha256").update(p.join("|").toLowerCase()).digest("hex");

function fieldErrors(issues: { path: PropertyKey[]; message: string }[]) {
  const out: Record<string, string> = {};
  for (const i of issues) out[String(i.path[0] ?? "form")] ??= i.message;
  return out;
}

async function guard(scope: string, limit: number, windowSec: number): Promise<string | null> {
  if (!env.dbConfigured) return UNAVAILABLE;
  try {
    const { ok } = await rateLimit(scope, await clientKey(), limit, windowSec);
    return ok ? null : "Too many submissions. Please wait a few minutes and try again.";
  } catch {
    return "We could not save your submission right now. Please try again shortly, or call us.";
  }
}

export async function submitBooking(_prev: FormState, fd: FormData): Promise<FormState> {
  const parsed = bookingSchema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) return { error: "Please fix the highlighted fields.", fieldErrors: fieldErrors(parsed.error.issues) };
  const d = parsed.data;
  if (looksLikeSpam(d)) return { error: "We could not submit that form. Please reload the page and try again." };
  const blocked = await guard("booking", 5, 600);
  if (blocked) return { error: blocked };

  try {
    await connectDB();
    const [loc, settings] = await Promise.all([
      Location.findOne({ slug: d.location, published: true }).lean<any>(), // eslint-disable-line @typescript-eslint/no-explicit-any
      SiteSettings.findOne({ key: "main" }).lean<any>(), // eslint-disable-line @typescript-eslint/no-explicit-any
    ]);
    if (!loc) return { error: "Please choose a valid location.", fieldErrors: { location: "Choose a location" } };
    if (settings?.bookingsEnabled === false || loc.acceptsBookings === false)
      return { error: `Booking requests are paused for this location. Please call ${BUSINESS.phoneDisplay}.` };

    if ([0, 6].includes(weekdayOf(d.date))) {
      const m = "We only take reservations on weekdays (Monday to Friday), not on weekends. Please choose a weekday.";
      return { error: m, fieldErrors: { date: m } };
    }
    const cfg: HoursConfig = { weekly: JSON.parse(JSON.stringify(loc.weekly)), overrides: JSON.parse(JSON.stringify(loc.overrides ?? [])) };
    const rules = { ...DEFAULT_RULES, ...JSON.parse(JSON.stringify(loc.rules ?? {})) };
    const problem = validateBookingWindow({ date: d.date, time: d.time, partySize: d.partySize }, cfg, rules);
    if (problem) return { error: problem, fieldErrors: { date: problem } };

    const dedupeKey = hash(d.email, d.location, d.date, d.time, d.partySize);
    const existing = await BookingRequest.findOne({ dedupeKey, status: { $in: ["pending", "approved"] } }).select("_id").lean();
    if (!existing) {
      const created = await BookingRequest.create({
        location: d.location, name: d.name, email: d.email, phone: d.phone, partySize: d.partySize,
        date: d.date, time: d.time, startsAt: edmontonToUtc(d.date, d.time), notes: d.notes, status: "pending",
        history: [{ status: "pending", at: new Date(), by: "customer", note: "Request submitted" }], dedupeKey,
      });
      const delivered = await notifyStaff(`New booking request: ${loc.name}, ${d.date} ${d.time}`, [
        `Location: ${loc.name}`, `Name: ${d.name}`, `Email: ${d.email}`, `Phone: ${d.phone}`, `Party of ${d.partySize}`, `When: ${d.date} ${d.time}`,
        d.notes ? `Notes: ${d.notes}` : "Notes: none", `Booking id: ${created._id}`,
      ], { replyTo: d.email });
      if (!delivered) return { error: NOT_EMAILED };
    }
    return {
      ok: true,
      message: `Request received. This is a booking request. Your reservation is confirmed only after the restaurant approves it. We will contact you at ${d.email} or ${d.phone}.`,
    };
  } catch (e) {
    console.error("[submitBooking]", (e as Error).message);
    return { error: `We could not save your request. Please try again, or call ${BUSINESS.phoneDisplay}.` };
  }
}

export async function submitContact(_prev: FormState, fd: FormData): Promise<FormState> {
  const parsed = contactSchema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) return { error: "Please fix the highlighted fields.", fieldErrors: fieldErrors(parsed.error.issues) };
  const d = parsed.data;
  if (looksLikeSpam(d)) return { error: "We could not send that message. Please reload the page and try again." };
  const blocked = await guard("contact", 5, 600);
  if (blocked) return { error: blocked };
  try {
    await connectDB();
    const saved = await ContactMessage.create({ firstName: d.firstName, lastName: d.lastName, email: d.email, phone: d.phone, message: d.message });
    const delivered = await notifyStaff(`New website message from ${d.firstName} ${d.lastName}`, [
      `Name: ${d.firstName} ${d.lastName}`, `Email: ${d.email}`, d.phone ? `Phone: ${d.phone}` : "Phone: not provided", "", d.message, "", `Message id: ${saved._id}`,
    ], { replyTo: d.email });
    if (!delivered) return { error: NOT_EMAILED };
    return { ok: true, message: "Salamat! Your message has been sent. The team will get back to you soon." };
  } catch (e) {
    console.error("[submitContact]", (e as Error).message);
    return { error: `We could not send your message. Please try again, or call ${BUSINESS.phoneDisplay}.` };
  }
}

export async function submitApplication(_prev: FormState, fd: FormData): Promise<FormState> {
  const parsed = applicationSchema.safeParse({ fullName: fd.get("fullName"), email: fd.get("email"), message: fd.get("message") ?? "", website: fd.get("website") ?? "", ts: fd.get("ts") ?? 0 });
  const errs = parsed.success ? {} : fieldErrors(parsed.error.issues);
  const file = fd.get("resume");
  let bytes = new Uint8Array(0);
  let fileName = "";
  if (file && typeof file === "object" && "arrayBuffer" in file) {
    fileName = String((file as File).name || "resume").replace(/[^\w.\- ]+/g, "_").slice(0, 120);
    bytes = new Uint8Array(await (file as File).arrayBuffer());
  }
  const resumeProblem = checkResume(fileName, bytes);
  if (resumeProblem) errs.resume = resumeProblem;
  if (!parsed.success || resumeProblem) return { error: "Please fix the highlighted fields.", fieldErrors: errs };
  const d = parsed.data;
  if (looksLikeSpam(d)) return { error: "We could not send that form. Please reload the page and try again." };
  const blocked = await guard("application", 3, 3600);
  if (blocked) return { error: blocked };
  try {
    await connectDB();
    const saved = await JobApplication.create({
      fullName: d.fullName, email: d.email, message: d.message, resumeName: fileName,
      resumeType: fileName.toLowerCase().endsWith(".pdf") ? "application/pdf" : "application/msword", resume: Buffer.from(bytes),
    });
    const delivered = await notifyStaff(`Work with us: application from ${d.fullName}`, [
      `Name: ${d.fullName}`, `Email: ${d.email}`, "", d.message || "(no message)", "", `Resume attached: ${fileName}`, `Application id: ${saved._id}`,
    ], { replyTo: d.email, attachments: [{ filename: fileName, content: Buffer.from(bytes) }] });
    if (!delivered) return { error: NOT_EMAILED };
    return { ok: true, message: "Thank you! Your application and resume have been sent to the team. We will be in touch if there is a fit." };
  } catch (e) {
    console.error("[submitApplication]", (e as Error).message);
    return { error: `We could not send your application. Please try again, or email ${BUSINESS.email}.` };
  }
}
