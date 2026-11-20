import type { Metadata } from "next";
import { PageHero, Pill, PreviewBanner, Stars } from "@/components/Bits";
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
      <PageHero image={{ src: "/images/restaurant/latte-orange-juice.jpg", alt: "A Rise N’ Shine latte mug and a glass of orange juice on a sunlit wooden table", illustrative: false }} eyebrow="Testimonials" title={<>Your words, <span className="text-gold">our fuel.</span></>}>
        <p>Feedback shared with us directly, shown only after our team has reviewed it.</p>
      </PageHero>
      <section className="mx-auto max-w-7xl px-4 py-12 sm:py-16 lg:py-20 sm:px-6">
        {items.length === 0 ? (
          <div className="rounded-[2rem] border-4 border-dashed border-char/40 bg-white p-10 text-center">
            <h2 className="display-lg text-4xl">No feedback published yet.</h2>
            <p className="mx-auto mt-3 max-w-xl text-lg">Had breakfast with us? We would love to hear about it on Google.</p>
          </div>
        ) : (
          <Stagger className="columns-1 gap-6 md:columns-2 lg:columns-3 [&>*]:mb-6">
            {items.map((t) => (
              <StaggerItem key={t.id}>
                <figure className="break-inside-avoid rounded-[1.6rem] border-4 border-char bg-white p-6">
                  <Stars rating={t.rating} />
                  <blockquote className="text-lg leading-relaxed">“{t.body}”</blockquote>
                  <figcaption className="mt-4 font-extrabold">{t.authorName}{t.visitedLocation ? `, ${t.visitedLocation}` : ""}</figcaption>
                </figure>
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </section>
      <section className="mx-auto max-w-3xl px-4 pb-14 text-center sm:px-6 sm:pb-20" aria-labelledby="leave-review">
        <Reveal>
          <h2 id="leave-review" className="display-lg text-4xl">Leave a Google review</h2>
          <p className="mx-auto mt-2 max-w-xl text-lg">Choose the location you visited.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {BUSINESS.reviewLinks.map((r) => <Pill key={r.name} href={r.url} external variant="orange">Review {r.name}</Pill>)}
          </div>
        </Reveal>
      </section>
    </>
  );
}
