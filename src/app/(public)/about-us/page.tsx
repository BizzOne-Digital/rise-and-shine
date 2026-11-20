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
      <PageHero image={{ src: "/images/restaurant/chalkboard-wall.jpg", alt: "The chalkboard wall inside Rise N’ Shine: Good morning starts with coffee, all day breakfast, welcome home", illustrative: false }} eyebrow="About us" title={<>Breakfast with a <span className="text-gold">Filipino</span> heart.</>}>
        <p>A Calgary breakfast place where garlic rice shares the table with hashbrowns, and everybody is welcome.</p>
      </PageHero>

      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:py-20 lg:py-24 sm:px-6 lg:grid-cols-12">
        <Reveal className="lg:col-span-7">
          <h2 className="display-xl text-[clamp(2.4rem,6vw,4.6rem)]">Good food. Great mornings. A little taste of home.</h2>
          <div className="mt-8 space-y-5 text-xl leading-relaxed">
            <p>At Rise N’ Shine Breakfast Place, we believe breakfast is more than just the first meal of the day. It’s a chance to slow down, enjoy good food, and make great memories with the people who matter.</p>
            <p>Proudly serving Calgary since 2020, we bring together the breakfast classics you know and love with the bold, comforting flavours of Filipino-inspired cuisine.</p>
            <p>From fluffy pancakes, waffles, omelettes, and eggs Benedict to Filipino favourites like beef tapa, pork tocino, longanisa, crispy sisig, and our signature ube French toast, there’s something for everyone at our table.</p>
            <p>We believe great food doesn’t have to come at a high price. That’s why we focus on quality ingredients, generous portions, reasonable prices, and genuine hospitality.</p>
            <p>Whether you’re joining us for a quick morning bite, a relaxed family breakfast, or a weekend brunch with friends, we’re here to make your visit worth waking up for.</p>
            <p className="font-extrabold">Rise N’ Shine. Good mornings start here.</p>
          </div>
        </Reveal>
        <div className="relative lg:col-span-5">
          <div className="grid grid-cols-2 gap-4">
            <RevealImg src="/images/restaurant/chef-philly-benedict.jpg" alt="A cook finishing a Philly steak benedict with fresh parsley" illustrative={false} sizes="(min-width:1024px) 20vw, 45vw" className="aspect-[3/4]" speed={25} />
            <RevealImg src="/images/restaurant/latte-orange-juice.jpg" alt="A Rise N’ Shine latte mug and a glass of orange juice on a sunlit wooden table" illustrative={false} sizes="(min-width:1024px) 20vw, 45vw" className="mt-10 aspect-[3/4]" speed={-25} />
            <RevealImg src="/images/restaurant/dining-room-overhead.jpg" alt="Overhead view of the Rise N’ Shine dining room and chalkboard wall" illustrative={false} sizes="(min-width:1024px) 40vw, 90vw" className="col-span-2 aspect-[16/9]" speed={20} />
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
