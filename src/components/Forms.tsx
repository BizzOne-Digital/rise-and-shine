"use client";

import { useMemo, useState } from "react";
import { submitBooking, submitContact } from "@/app/actions";
import { ActionForm, Field, describedBy, inputCls } from "./FormKit";
import { formatTime12, hoursFor, slotsFor, todayEdmonton, type DayHours, type HolidayOverride, type BookingRules } from "@/lib/hours";

export type FormLocation = { slug: string; name: string; weekly: DayHours[]; overrides: HolidayOverride[]; rules: BookingRules; acceptsBookings: boolean };

export const BOOKING_NOTICE = "This is a booking request. Your reservation is confirmed only after the restaurant approves it.";
const DB_MSG = "Online submissions are not available right now. Please call Forest Lawn (403) 271-5170 or The District (825) 205-6390, or email rnsbreakfast@gmail.com.";

export function BookingForm({ locations, enabled, defaultLocation, idp = "" }: { locations: FormLocation[]; enabled: boolean; defaultLocation?: string; idp?: string }) {
  const bookable = locations.filter((l) => l.acceptsBookings);
  const [loc, setLoc] = useState(defaultLocation && bookable.some((l) => l.slug === defaultLocation) ? defaultLocation : "");
  const [date, setDate] = useState("");
  const [party, setParty] = useState(2);
  const current = bookable.find((l) => l.slug === loc);
  const slots = useMemo(() => (current && date ? slotsFor({ weekly: current.weekly, overrides: current.overrides }, date, current.rules) : []), [current, date]);
  const closed = current && date && hoursFor({ weekly: current.weekly, overrides: current.overrides }, date).closed;
  const min = todayEdmonton();
  const rules = current?.rules;

  return (
    <ActionForm action={submitBooking} submitLabel="Send booking request" disabledReason={enabled ? undefined : DB_MSG}>
      {(s) => {
        const e = s.fieldErrors ?? {};
        return (
          <>
            <p className="rounded-xl bg-char px-4 py-3 text-base font-bold text-cream">{BOOKING_NOTICE}</p>
            <Field idp={idp} label="Location" name="location" error={e.location}>
              <select id={idp + "location"} name="location" required value={loc} onChange={(ev) => setLoc(ev.target.value)} className={inputCls} {...describedBy(idp + "location", e.location)}>
                <option value="">Choose a location</option>
                {bookable.map((l) => <option key={l.slug} value={l.slug}>{l.name}</option>)}
              </select>
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field idp={idp} label="Your name" name="name" error={e.name}><input id={idp + "name"} name="name" autoComplete="name" required className={inputCls} {...describedBy(idp + "name", e.name)} /></Field>
              <Field idp={idp} label="Party size" name="partySize" error={e.partySize} hint={rules ? `${rules.minPartySize} to ${rules.maxPartySize} guests. Larger groups: send a catering or event inquiry.` : undefined}>
                <input id={idp + "partySize"} name="partySize" type="number" inputMode="numeric" min={rules?.minPartySize ?? 1} max={rules?.maxPartySize ?? 20} value={party} onChange={(ev) => setParty(Number(ev.target.value))} required className={inputCls} {...describedBy(idp + "partySize", e.partySize, rules ? "x" : undefined)} />
              </Field>
              <Field idp={idp} label="Email" name="email" error={e.email}><input id={idp + "email"} name="email" type="email" autoComplete="email" required className={inputCls} {...describedBy(idp + "email", e.email)} /></Field>
              <Field idp={idp} label="Phone" name="phone" error={e.phone}><input id={idp + "phone"} name="phone" type="tel" autoComplete="tel" required className={inputCls} {...describedBy(idp + "phone", e.phone)} /></Field>
              <Field idp={idp} label="Requested date" name="date" error={e.date} hint="Restaurant times are Calgary time (America/Edmonton).">
                <input id={idp + "date"} name="date" type="date" min={min} required value={date} onChange={(ev) => setDate(ev.target.value)} className={inputCls} {...describedBy(idp + "date", e.date, "x")} />
              </Field>
              <Field idp={idp} label="Requested time" name="time" error={e.time} hint={closed ? "Closed on this date. Please pick another day." : !loc || !date ? "Choose a location and date to see available request times." : undefined}>
                <select id={idp + "time"} name="time" required className={inputCls} disabled={slots.length === 0} {...describedBy(idp + "time", e.time, "x")}>
                  <option value="">{slots.length ? "Choose a time" : "No times available"}</option>
                  {slots.map((t) => <option key={t} value={t}>{formatTime12(t)}</option>)}
                </select>
              </Field>
            </div>
            <Field idp={idp} label="Notes (optional)" name="notes" error={e.notes} hint="Celebrations, high chairs, accessibility needs.">
              <textarea id={idp + "notes"} name="notes" rows={3} maxLength={500} className={inputCls} {...describedBy(idp + "notes", e.notes, "x")} />
            </Field>
            <p className="text-sm text-char/80">Requested times are not a live table check. The team will review your request and reply.</p>
          </>
        );
      }}
    </ActionForm>
  );
}

export function ContactForm({ enabled, idp = "ct-" }: { enabled: boolean; idp?: string }) {
  const [len, setLen] = useState(0);
  const req = <span className="ml-1 text-sm font-semibold text-sun-red">(Required)</span>;
  return (
    <ActionForm action={submitContact} submitLabel="Send message" disabledReason={enabled ? undefined : DB_MSG} resetOnSuccess>
      {(s) => {
        const e = s.fieldErrors ?? {};
        return (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field idp={idp} label={<>First name{req}</>} name="firstName" error={e.firstName}><input id={idp + "firstName"} name="firstName" autoComplete="given-name" required className={inputCls} {...describedBy(idp + "firstName", e.firstName)} /></Field>
              <Field idp={idp} label={<>Last name{req}</>} name="lastName" error={e.lastName}><input id={idp + "lastName"} name="lastName" autoComplete="family-name" required className={inputCls} {...describedBy(idp + "lastName", e.lastName)} /></Field>
            </div>
            <Field idp={idp} label={<>Email address{req}</>} name="email" error={e.email}><input id={idp + "email"} name="email" type="email" autoComplete="email" required className={inputCls} {...describedBy(idp + "email", e.email)} /></Field>
            <Field idp={idp} label="Phone number" name="phone" error={e.phone}><input id={idp + "phone"} name="phone" type="tel" autoComplete="tel" className={inputCls} {...describedBy(idp + "phone", e.phone)} /></Field>
            <Field idp={idp} label={<>Your message{req}</>} name="message" error={e.message} hint="Please let us know what's on your mind. Have a question for us? Ask away.">
              <textarea id={idp + "message"} name="message" rows={6} maxLength={300} required placeholder="Type here" onChange={(ev) => setLen(ev.target.value.length)} className={inputCls} {...describedBy(idp + "message", e.message, "x")} />
            </Field>
            <p className="-mt-2 text-sm text-char/75">{len} of 300 max characters</p>
          </>
        );
      }}
    </ActionForm>
  );
}
