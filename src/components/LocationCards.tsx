import Link from "next/link";
import { formatPhone, mapsDirectionsUrl, mapsEmbedUrl } from "@/lib/content";
import type { PubLocation } from "@/lib/data";
import { Reveal } from "./Motion";
import { TodayHours, WeeklyHours } from "./Locations";

export function LocationCards({ locations, hoursNote, withMap = false }: { locations: PubLocation[]; hoursNote?: string; withMap?: boolean }) {
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {locations.map((l, i) => (
        <Reveal key={l.slug} delay={i * 0.1} className={i % 2 ? "lg:mt-12" : ""}>
          <article className="rounded-[2rem] border-4 border-char bg-white p-6 shadow-[8px_8px_0_#211A16] sm:p-8" aria-labelledby={`loc-${l.slug}`}>
            <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-sun">Location {i + 1}</p>
            <h3 id={`loc-${l.slug}`} className="display-lg mt-1 text-4xl">{l.name}</h3>
            <address className="mt-3 text-lg not-italic">{l.street}<br />{l.city}, {l.region} {l.postalCode}</address>
            <p className="mt-1 text-lg font-bold">{formatPhone(l.phone)}</p>
            <p className="mt-3 rounded-full bg-gold/30 px-4 py-2 text-char"><TodayHours weekly={l.weekly} overrides={l.overrides} /></p>
            <details className="mt-4 rounded-xl border-2 border-char/15 p-3">
              <summary className="min-touch cursor-pointer font-extrabold">Opening hours</summary>
              <div className="mt-3"><WeeklyHours weekly={l.weekly} /></div>
              {hoursNote && <p className="mt-3 text-sm text-char/80">{hoursNote}</p>}
              {!l.hoursConfirmed && <p className="mt-2 text-sm font-bold text-char/80">Please call to confirm hours before you travel.</p>}
            </details>
            <div className="mt-5 flex flex-wrap gap-3">
              <a href={mapsDirectionsUrl(l)} target="_blank" rel="noopener noreferrer" className="btn-press inline-flex min-h-[48px] items-center rounded-full bg-sun px-6 font-extrabold text-white shadow-[0_4px_0_#C93A00]">Get directions<span className="sr-only"> to {l.name} (opens in a new tab)</span></a>
              <a href={`tel:+1${l.phone.replace(/\D/g, "")}`} className="btn-press inline-flex min-h-[48px] items-center rounded-full border-2 border-char px-6 font-extrabold">Call</a>
              {l.acceptsBookings && <Link href={`/book?location=${l.slug}`} className="btn-press inline-flex min-h-[48px] items-center rounded-full bg-char px-6 font-extrabold text-cream">Request a table</Link>}
            </div>
            {withMap && (
              <div className="mt-6 overflow-hidden rounded-2xl border-2 border-char/20">
                <iframe title={`Map showing ${l.name} at ${l.street}, ${l.city}`} src={mapsEmbedUrl(l)} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="h-64 w-full" />
                <p className="bg-cream-dark px-3 py-2 text-sm">Map not loading? Use the directions button above.</p>
              </div>
            )}
          </article>
        </Reveal>
      ))}
    </div>
  );
}
