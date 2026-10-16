import { IMG } from "@/lib/stockImages";
import type { Metadata } from "next";
import { PageHero, PreviewBanner } from "@/components/Bits";
import { BookingForm } from "@/components/Forms";
import { Pill } from "@/components/Bits";
import { LocationCards } from "@/components/LocationCards";
import { Reveal } from "@/components/Motion";
import { getLocations, getSettings } from "@/lib/data";
import { BUSINESS } from "@/lib/content";
import { env } from "@/lib/env";

export const metadata: Metadata = {
  title: "Contact & Visit",
  description: "Find Rise N’ Shine in Calgary: Forest Lawn and The District. Hours, directions, phone, email, contact form and booking requests.",
};
export const dynamic = "force-dynamic";

export default async function Contact() {
  const [{ data: locations, source }, { data: settings }] = await Promise.all([getLocations(), getSettings()]);
  const formLocations = locations.map((l) => ({ slug: l.slug, name: l.name, weekly: l.weekly, overrides: l.overrides, rules: l.rules, acceptsBookings: l.acceptsBookings }));
  const dbOk = env.dbConfigured;
  return (
    <>
      {source === "preview" && <PreviewBanner />}
      <PageHero image={{ src: IMG.family, alt: "Illustrative image of a family sharing breakfast" }} eyebrow="Contact & visit" title={<>Come <span className="text-gold">hungry.</span></>}>
        <p>Two Calgary locations, one friendly team. Call, email, send a message or request a table.</p>
      </PageHero>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:py-16 sm:px-6">
        <ul className="grid gap-4 md:grid-cols-3 [&>li]:min-w-0">
          <li><a href="tel:+14037076529" className="btn-press block rounded-2xl border-4 border-char bg-white p-5 hover:bg-gold/30"><span className="block text-sm font-extrabold uppercase tracking-wider text-sun">Call</span><span className="display-lg block text-3xl [overflow-wrap:anywhere]">{BUSINESS.phoneDisplay}</span></a></li>
          <li><a href={`mailto:${BUSINESS.email}`} className="btn-press block rounded-2xl border-4 border-char bg-white p-5 hover:bg-gold/30"><span className="block text-sm font-extrabold uppercase tracking-wider text-sun">Email</span><span className="display-lg block text-2xl [overflow-wrap:anywhere]">{BUSINESS.email}</span></a></li>
          <li><a href={BUSINESS.social.instagram} target="_blank" rel="noopener noreferrer" className="btn-press block rounded-2xl border-4 border-char bg-white p-5 hover:bg-gold/30"><span className="block text-sm font-extrabold uppercase tracking-wider text-sun">Instagram<span className="sr-only"> (opens in a new tab)</span></span><span className="display-lg block text-2xl [overflow-wrap:anywhere] sm:text-3xl">{BUSINESS.handle}</span></a></li>
        </ul>
        <ul className="mt-4 flex flex-wrap gap-3 text-base font-bold">
          <li><a className="underline underline-offset-4" href={BUSINESS.social.facebook} target="_blank" rel="noopener noreferrer">Facebook<span className="sr-only"> (opens in a new tab)</span></a></li>
          <li><a className="underline underline-offset-4" href={BUSINESS.social.tiktok} target="_blank" rel="noopener noreferrer">TikTok<span className="sr-only"> (opens in a new tab)</span></a></li>
        </ul>
      </section>

      <section id="locations" className="mx-auto max-w-7xl scroll-mt-24 px-4 pb-20 sm:px-6" aria-labelledby="locs">
        <h2 id="locs" className="display-xl mb-8 text-[clamp(2.4rem,6vw,4.6rem)]">Our locations</h2>
        <LocationCards locations={locations} hoursNote={settings.hoursNote} withMap />
      </section>

      <section className="on-dark grain relative bg-char py-12 sm:py-16 lg:py-20 text-cream">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2">
          <Reveal>
            <h2 className="display-xl text-[clamp(2.2rem,5vw,4rem)] text-gold">Questions, catering or events?</h2>
            <p className="mt-3 font-serif2 text-xl">Call or email the team. A catering or event inquiry is not a table booking, so use the booking form for dining.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Pill href="tel:+14037076529" variant="orange">Call {BUSINESS.phoneDisplay}</Pill>
              <Pill href={"mailto:rnsbreakfast@gmail.com?subject=" + encodeURIComponent("Catering inquiry")} variant="cream">Email us</Pill>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div id="booking" className="scroll-mt-28" />
            <h2 className="display-xl text-[clamp(2.2rem,5vw,4rem)] text-gold">Request a table</h2>
            <p className="mt-3 text-lg">For dining at one of our locations.</p>
            <div className="mt-6 rounded-[1.6rem] bg-cream p-6 text-char"><BookingForm idp="bk-" locations={formLocations} enabled={dbOk && settings.bookingsEnabled} /></div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
