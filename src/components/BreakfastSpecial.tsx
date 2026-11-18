import Image from "next/image";
import { Reveal } from "./Motion";

/** Weekday breakfast special. Details come from the restaurant's own in-store sign. */
export function BreakfastSpecial() {
  return (
    <section className="grain relative isolate overflow-hidden bg-black text-cream" aria-labelledby="special-title">
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-12 sm:px-6 md:grid-cols-[1.1fr_1fr] md:py-16 lg:py-20">
        <Reveal>
          <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-gold">Weekday deal</p>
          <h2 id="special-title" className="display-xl mt-2 text-[clamp(3rem,8vw,6.5rem)] text-gold">Breakfast special</h2>
          <p className="mt-5 font-nav text-xl font-bold sm:text-2xl">Monday to Friday, 7am to 9am</p>
          <p className="mt-1 font-serif2 text-lg text-cream/90">Dine in only.</p>
          <p className="display-xl mt-5 text-[clamp(3.6rem,9vw,6rem)] text-gold" aria-label="7 dollars and 99 cents">$7.99</p>
          <p className="mt-3 max-w-md font-serif2 text-lg text-cream/90">Choice of maple pork sausage, bacon or ham, two eggs the way you like them, crispy potatoes, fresh tomatoes and toast.</p>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[1.6rem] border-4 border-gold">
            <Image src="/images/dishes/breakfast-special.jpg" alt="Breakfast special: sausages, two sunny-side-up eggs, crispy potatoes, tomato slices and toast on a wooden table" fill sizes="(min-width:768px) 45vw, 100vw" className="object-cover" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
