import type { Metadata } from "next";
import { PageHero, PreviewBanner } from "@/components/Bits";
import { EmailLink } from "@/components/EmailLink";
import { BookingForm } from "@/components/Forms";
import { Reveal } from "@/components/Motion";
import { getLocations, getSettings } from "@/lib/data";
import { env } from "@/lib/env";

export const metadata: Metadata = { title: "Request a Table", description: "Send a booking request to Rise N’ Shine. Your reservation is confirmed only after the restaurant approves it." };
export const dynamic = "force-dynamic";

export default async function Book({ searchParams }: { searchParams: Promise<{ location?: string }> }) {
  const [{ data: locations, source }, { data: settings }, sp] = await Promise.all([getLocations(), getSettings(), searchParams]);
  const formLocations = locations.map((l) => ({ slug: l.slug, name: l.name, weekly: l.weekly, overrides: l.overrides, rules: l.rules, acceptsBookings: l.acceptsBookings }));
  return (
    <>
      {source === "preview" && <PreviewBanner />}
      <PageHero image={{ src: "/images/restaurant/dining-room-chalkboard.jpg", alt: "The Rise N’ Shine dining room with the chalkboard wall and coffee bar", illustrative: false, landscape: true }} eyebrow="Booking request" title={<>Save us a <span className="text-gold">spot?</span></>}>
        <p>Families and groups are welcome. We take reservations on weekdays only (Monday to Friday), not on weekends. Tell us when you would like to come and we will confirm.</p>
      </PageHero>
      <section className="mx-auto max-w-3xl px-4 py-10 sm:py-16 sm:px-6">
        <Reveal><div className="rounded-[2rem] border-4 border-char bg-white p-6 shadow-[8px_8px_0_#211A16] sm:p-10">
          <BookingForm locations={formLocations} enabled={env.dbConfigured && settings.bookingsEnabled} defaultLocation={sp.location} />
        </div></Reveal>
        <p className="mt-6 text-center text-base">Planning catering or a large event? <EmailLink className="font-extrabold underline" subject="Catering inquiry">Email us instead.</EmailLink></p>
      </section>
    </>
  );
}
