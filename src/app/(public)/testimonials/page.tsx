import { IMG } from "@/lib/stockImages";
import type { Metadata } from "next";
import { PageHero, Pill, PreviewBanner } from "@/components/Bits";
import { Reveal, Stagger, StaggerItem } from "@/components/Motion";
import { getTestimonials } from "@/lib/data";
import { BUSINESS } from "@/lib/content";

export const metadata: Metadata = { title: "Testimonials", description: "Feedback from Rise N’ Shine guests, reviewed by our team before it is shown." };
export const revalidate = 60;

export default async function Testimonials() {
  const { data: items, source } = await getTestimonials();
  return (
    <>
      {source === "preview" && <PreviewBanner />}
      <PageHero image={{ src: IMG.coffee, alt: "Illustrative image of coffee and orange juice in morning light" }} eyebrow="Testimonials" title={<>Your words, <span className="text-gold">our fuel.</span></>}>
        <p>Feedback shared with us directly, shown only after our team has reviewed it.</p>
      </PageHero>
      <section className="mx-auto max-w-7xl px-4 py-12 sm:py-16 lg:py-20 sm:px-6">
        {items.length === 0 ? (
          <div className="rounded-[2rem] border-4 border-dashed border-char/40 bg-white p-10 text-center">
            <h2 className="display-lg text-4xl">No feedback published yet.</h2>
            <p className="mx-auto mt-3 max-w-xl text-lg">Had breakfast with us? We would love to hear about it on Google.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3"><Pill href={BUSINESS.googleReviewUrl} external>Review us on Google</Pill></div>
          </div>
        ) : (
          <Stagger className="columns-1 gap-6 md:columns-2 lg:columns-3 [&>*]:mb-6">
            {items.map((t) => (
              <StaggerItem key={t.id}>
                <figure className="break-inside-avoid rounded-[1.6rem] border-4 border-char bg-white p-6">
                  {t.featured && <p className="mb-3 inline-block rounded-full bg-gold px-3 py-1 text-xs font-black uppercase">Featured</p>}
                  <blockquote className="text-lg leading-relaxed">“{t.body}”</blockquote>
                  <figcaption className="mt-4 font-extrabold">{t.authorName}{t.visitedLocation ? `, ${t.visitedLocation}` : ""}</figcaption>
                </figure>
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </section>
      <section className="mx-auto max-w-3xl px-4 pb-14 text-center sm:px-6 sm:pb-20">
        <Reveal><Pill href={BUSINESS.googleReviewUrl} external variant="dark">Leave a Google review</Pill></Reveal>
      </section>
    </>
  );
}
