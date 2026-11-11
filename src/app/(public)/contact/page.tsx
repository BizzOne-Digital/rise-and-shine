import { IMG } from "@/lib/stockImages";
import type { Metadata } from "next";
import { PageHero, PreviewBanner } from "@/components/Bits";
import { ContactForm } from "@/components/Forms";
import { Pill } from "@/components/Bits";
import { LocationCards } from "@/components/LocationCards";
import { Reveal } from "@/components/Motion";
import { getLocations, getSettings } from "@/lib/data";
import { BUSINESS } from "@/lib/content";
import { env } from "@/lib/env";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Find Rise N’ Shine in Calgary: Forest Lawn and The District. Hours, directions, phone, email, contact form and booking requests.",
};
export const dynamic = "force-dynamic";

export default async function Contact() {
  const [{ data: locations, source }, { data: settings }] = await Promise.all([getLocations(), getSettings()]);
  const dbOk = env.dbConfigured;
  return (
    <>
      {source === "preview" && <PreviewBanner />}
      <PageHero image={{ src: IMG.family, alt: "Illustrative image of a family sharing breakfast" }} eyebrow="Contact us" title={<>Come <span className="text-gold">hungry.</span></>}>
        <p>Serving up your favorite morning comforts across two Calgary locations. Reach out today to say hello or book a table.</p>
      </PageHero>

      <section id="locations" className="mx-auto max-w-7xl scroll-mt-24 px-4 pb-20 sm:px-6" aria-labelledby="locs">
        <h2 id="locs" className="display-xl mb-8 text-[clamp(2.4rem,6vw,4.6rem)]">Our locations</h2>
        <LocationCards locations={locations} hoursNote={settings.hoursNote} withMap />
      </section>

      <section id="contact-us" className="on-dark grain relative scroll-mt-20 bg-char py-12 sm:py-16 lg:py-20 text-cream">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2">
          <Reveal>
            <h2 className="display-xl text-[clamp(2.2rem,5vw,4rem)] text-gold">Mabuhay! Let’s chat over breakfast.</h2>
            <p className="mt-3 font-serif2 text-xl">Whether you have a question about our menu, want to plan a big family breakfast, or just want to send some love to the team. Drop us a line below! <em>Salamat!</em></p>
            <div className="mt-6 rounded-[1.6rem] bg-cream p-6 text-char"><ContactForm enabled={dbOk} /></div>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="display-xl text-[clamp(2.2rem,5vw,4rem)] text-gold">Looking for a specific spot?</h2>
            <p className="mt-3 text-xl font-extrabold">Find your nearest Rise N’ Shine</p>
            <p className="mt-2 font-serif2 text-xl">Want to check our hours, ask about a location or secure a table? Connect directly with the team at your neighborhood spot.</p>
            <div className="mt-6"><Pill href="/contact" variant="orange">Find a location</Pill></div>

            <h3 className="mt-12 text-sm font-extrabold uppercase tracking-[0.18em] text-gold">Ways to reach us</h3>
            <ul className="mt-5 space-y-6">
              <li className="flex items-start gap-4">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="mt-1 shrink-0 text-gold"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>
                <div>
                  <p className="text-sm font-extrabold uppercase tracking-wider text-gold">General inquiries</p>
                  <a href={`mailto:${BUSINESS.email}`} className="text-xl font-bold [overflow-wrap:anywhere] hover:text-gold">Rnsbreakfast@gmail.com</a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="mt-1 shrink-0 text-gold"><path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9v2.3H7.9v3h2.6V21h3z" /></svg>
                <div>
                  <p className="text-sm font-extrabold uppercase tracking-wider text-gold">Facebook</p>
                  <a href={BUSINESS.social.facebook} target="_blank" rel="noopener noreferrer" className="text-xl font-bold hover:text-gold">@Rnsbreakfastplace<span className="sr-only"> (opens in a new tab)</span></a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="mt-1 shrink-0 text-gold"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.3" cy="6.7" r="0.6" fill="currentColor" /></svg>
                <div>
                  <p className="text-sm font-extrabold uppercase tracking-wider text-gold">Instagram</p>
                  <a href={BUSINESS.social.instagram} target="_blank" rel="noopener noreferrer" className="text-xl font-bold hover:text-gold">@RNSBREAKFASTPLACE<span className="sr-only"> (opens in a new tab)</span></a>
                </div>
              </li>
            </ul>
          </Reveal>
        </div>
      </section>
    </>
  );
}
