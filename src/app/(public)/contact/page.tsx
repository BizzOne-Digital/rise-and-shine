import type { Metadata } from "next";
import { PageHero, PreviewBanner } from "@/components/Bits";
import { ContactForm, WorkWithUsForm } from "@/components/Forms";
import { IconFacebook, IconInstagram, IconMail } from "@/components/Icons";
import { Pill } from "@/components/Bits";
import { LocationCards } from "@/components/LocationCards";
import { Reveal } from "@/components/Motion";
import { getLocations, getSettings } from "@/lib/data";
import { BUSINESS } from "@/lib/content";
import { EmailLink } from "@/components/EmailLink";
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
      <PageHero image={{ src: "/images/restaurant/sign-wall-closeup.jpg", alt: "The Rise N’ Shine Breakfast Place sign above the yellow booths", illustrative: false, landscape: true }} eyebrow="Contact us" title={<>Come <span className="text-gold">hungry.</span></>}>
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
                <IconMail size={30} className="mt-1 shrink-0 text-gold" />
                <div>
                  <p className="text-sm font-extrabold uppercase tracking-wider text-gold">General inquiries</p>
                  <EmailLink className="text-xl font-bold lowercase underline decoration-gold/40 underline-offset-4 [overflow-wrap:anywhere] hover:text-gold hover:decoration-gold"><span>{BUSINESS.email}</span><span className="sr-only"> (opens your email)</span></EmailLink>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <IconFacebook size={30} className="mt-1 shrink-0 text-gold" />
                <div>
                  <p className="text-sm font-extrabold uppercase tracking-wider text-gold">Facebook</p>
                  <a href={BUSINESS.social.facebook} target="_blank" rel="noopener noreferrer" className="text-xl font-bold lowercase underline decoration-gold/40 underline-offset-4 [overflow-wrap:anywhere] hover:text-gold hover:decoration-gold">{BUSINESS.handle}<span className="sr-only"> (opens in a new tab)</span></a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <IconInstagram size={30} className="mt-1 shrink-0 text-gold" />
                <div>
                  <p className="text-sm font-extrabold uppercase tracking-wider text-gold">Instagram</p>
                  <a href={BUSINESS.social.instagram} target="_blank" rel="noopener noreferrer" className="text-xl font-bold lowercase underline decoration-gold/40 underline-offset-4 [overflow-wrap:anywhere] hover:text-gold hover:decoration-gold">{BUSINESS.handle}<span className="sr-only"> (opens in a new tab)</span></a>
                </div>
              </li>
            </ul>

            <h3 id="work-with-us" className="mt-12 scroll-mt-24 text-sm font-extrabold uppercase tracking-[0.18em] text-gold">Work with us</h3>
            <p className="mt-3 font-serif2 text-xl">Want to join the Rise N’ Shine team? Send us your details and your resume.</p>
            <div className="mt-5 rounded-[1.6rem] bg-cream p-6 text-char"><WorkWithUsForm enabled={dbOk} /></div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
