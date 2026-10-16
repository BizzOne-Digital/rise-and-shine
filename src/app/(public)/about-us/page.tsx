import { IMG } from "@/lib/stockImages";
import type { Metadata } from "next";
import { PageHero, Pill } from "@/components/Bits";
import { Reveal, Stagger, StaggerItem } from "@/components/Motion";
import { RevealImg } from "@/components/Media";

export const metadata: Metadata = {
  title: "About Us",
  description: "Rise N’ Shine is a Calgary breakfast restaurant serving home-style meals, Filipino-inspired dishes and breakfast classics.",
};

export default function About() {
  return (
    <>
      <PageHero image={{ src: IMG.interior, alt: "Illustrative image of a warm, sunlit cafe interior" }} eyebrow="About us" title={<>Breakfast with a <span className="text-gold">Filipino</span> heart.</>}>
        <p>A Calgary breakfast place where garlic rice shares the table with hashbrowns, and everybody is welcome.</p>
      </PageHero>

      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:py-20 lg:py-24 sm:px-6 lg:grid-cols-12">
        <Reveal className="lg:col-span-7">
          <h2 className="display-xl text-[clamp(2.4rem,6vw,4.6rem)]">Quality ingredients. Reasonable prices. Real hospitality.</h2>
          <div className="mt-8 space-y-5 text-xl leading-relaxed">
            <p>Rise N’ Shine Breakfast Place serves quality home-style meals prepared with quality ingredients at reasonable prices. We have been proudly serving the Calgary area and beyond since 2020.</p>
            <p>Our menu mixes the breakfast you know (eggs, benedicts, omelettes, waffles and pancakes) with Filipino-inspired dishes like beef tapa, pork tocino, longanisa, crispy sisig and ube French toast.</p>
            <p>Whether you are stopping in for a quick bite or settling in for a long, easy meal, our friendly team wants you to leave happy. We also offer catering and custom orders for the days that call for more.</p>
          </div>
        </Reveal>
        <div className="relative lg:col-span-5">
          <div className="grid grid-cols-2 gap-4">
            <RevealImg src={IMG.chef} alt="Illustrative image of a cook finishing a breakfast plate" sizes="(min-width:1024px) 20vw, 45vw" className="aspect-[3/4]" speed={25} />
            <RevealImg src={IMG.coffee} alt="Illustrative image of coffee and orange juice" sizes="(min-width:1024px) 20vw, 45vw" className="mt-10 aspect-[3/4]" speed={-25} />
            <RevealImg src={IMG.family} alt="Illustrative image of a family sharing breakfast" sizes="(min-width:1024px) 40vw, 90vw" className="col-span-2 aspect-[16/9]" speed={20} />
          </div>
          <p className="mt-3 text-sm">Illustrative images. Photos of our own plates and rooms are coming.</p>
        </div>
      </section>

      <section className="on-dark grain relative bg-char text-cream">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:py-20 lg:py-24 sm:px-6">
          <Reveal><h2 className="display-xl text-[clamp(2.4rem,6vw,4.6rem)] text-gold">What you can expect</h2></Reveal>
          <Stagger className="mt-10 grid gap-8 md:grid-cols-3">
            {[
              ["A menu with two accents", "Filipino-inspired plates beside breakfast classics, so a table of mixed tastes is easy to please."],
              ["Fresh, home-style cooking", "Meals made with quality ingredients, the way you would want them served at home."],
              ["A warm welcome", "A friendly team and a relaxed room for families, friends and groups."],
            ].map(([t, d]) => (
              <StaggerItem key={t}><div className="h-full border-t-4 border-sun pt-5"><h3 className="display-lg text-3xl">{t}</h3><p className="mt-3 text-lg text-cream/90">{d}</p></div></StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-14 sm:py-20 lg:py-24 text-center sm:px-6">
        <Reveal>
          <h2 className="display-xl text-[clamp(2.4rem,6vw,4.6rem)]">Come say good morning.</h2>
          <div className="mt-8 flex flex-wrap justify-center gap-3"><Pill href="/menu">See the menu</Pill><Pill href="/contact#locations" variant="outline">Find a location</Pill></div>
        </Reveal>
      </section>
    </>
  );
}
