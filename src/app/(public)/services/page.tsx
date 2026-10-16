import { IMG } from "@/lib/stockImages";
import type { Metadata } from "next";
import { PageHero, Pill, PreviewBanner } from "@/components/Bits";
import Image from "next/image";
import { Reveal } from "@/components/Motion";
import { serviceImage } from "@/lib/stockImages";
import { getServices } from "@/lib/data";

export const metadata: Metadata = {
  title: "Services",
  description: "Breakfast and brunch dining, reservation requests, catering, custom orders and group or event inquiries in Calgary.",
};
export const revalidate = 60;

const CTA: Record<string, { href: string; kind: string }> = {
  menu: { href: "/menu", kind: "Dining" },
  booking: { href: "/book", kind: "Table booking request" },
  catering: { href: "mailto:rnsbreakfast@gmail.com?subject=Catering%20inquiry", kind: "Inquiry" },
  custom: { href: "mailto:rnsbreakfast@gmail.com?subject=Custom%20order%20inquiry", kind: "Inquiry" },
  event: { href: "mailto:rnsbreakfast@gmail.com?subject=Group%20or%20event%20inquiry", kind: "Inquiry" },
};

export default async function Services() {
  const { data: services, source } = await getServices();
  return (
    <>
      {source === "preview" && <PreviewBanner />}
      <PageHero image={{ src: IMG.catering, alt: "Illustrative image of a catering breakfast spread" }} eyebrow="Services" title={<>However you <span className="text-gold">gather.</span></>}>
        <p>Dine in, bring the family, or let us cook for your event. A table booking and a catering inquiry are different things, so each has its own form.</p>
      </PageHero>
      <section className="mx-auto max-w-7xl px-4 py-12 sm:py-16 lg:py-20 sm:px-6">
        {services.length === 0 ? (
          <p className="rounded-2xl bg-white p-8 text-lg font-bold">Our services list is being updated. Please call (403) 707-6529 to ask how we can help.</p>
        ) : (
          <ol className="divide-y-4 divide-char border-y-4 border-char">
            {services.map((s, i) => {
              const c = CTA[s.cta] ?? CTA.catering;
              return (
                <Reveal as="li" key={s.id} delay={0.03}>
                  <div className="grid items-center gap-4 py-8 md:grid-cols-[5rem_1.3fr_12rem_auto]">
                    <span className="display-xl text-6xl text-sun" aria-hidden>{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-char/80">{c.kind}</p>
                      <h2 className="display-lg mt-1 text-4xl">{s.title}</h2>
                      <p className="mt-2 max-w-xl text-lg">{s.summary}</p>
                    </div>
                    <div className="relative hidden aspect-[4/3] overflow-hidden rounded-2xl border-4 border-char md:block"><Image src={serviceImage(s.slug)} alt="" fill sizes="192px" className="object-cover transition-transform duration-500 hover:scale-110" /></div>
                    <div className="md:justify-self-end"><Pill href={c.href} variant={s.cta === "booking" ? "orange" : "dark"}>{s.ctaLabel}</Pill></div>
                  </div>
                </Reveal>
              );
            })}
          </ol>
        )}
      </section>
    </>
  );
}
