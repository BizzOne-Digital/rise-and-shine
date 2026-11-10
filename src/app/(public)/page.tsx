import Image from "next/image";
import Link from "next/link";
import { Hero } from "@/components/Hero";
import { Reveal, Stagger, StaggerItem } from "@/components/Motion";
import { DishArt } from "@/components/Art";
import { ImageStrip, Magnetic, RevealImg, SplitHeading, Tilt } from "@/components/Media";
import { LocationCards } from "@/components/LocationCards";
import { JsonLd, Pill, PreviewBanner } from "@/components/Bits";
import { getLocations, getMenu, getServices, getSettings, getTestimonials, type PubItem } from "@/lib/data";
import { formatCAD } from "@/lib/money";
import { restaurantJsonLd } from "@/lib/jsonld";
import { BUSINESS } from "@/lib/content";
import { IMG, serviceImage } from "@/lib/stockImages";

const FILIPINO_STORY: [string, string][] = [
  ["Beef Tapa", "House marinated beef strips with garlic rice, fried egg and mango salsa."],
  ["Pork Tocino", "Pan fried sugar-cured pork on the same sunny plate."],
  ["Crispy Sisig", "Spicy crispy pork belly, tossed with mayo, with garlic rice and a fried egg."],
  ["Ube French Toast", "Ube cream cheese, condensed milk and a little cinnamon."],
  ["Ensaymada Waffle", "Filipino inspired pastry topped with sweet cream cheese and grated cheese."],
];

const STRIP = [
  { src: IMG.tapa, alt: "Illustrative image of beef tapa with garlic rice and egg", label: "Beef Tapa" },
  { src: IMG.pandan, alt: "Illustrative image of ricotta pancakes", label: "Ricotta pancake" },
  { src: IMG.tocino, alt: "Illustrative image of pork tocino", label: "Pork Tocino" },
  { src: IMG.ensaymada, alt: "Illustrative image of an ensaymada waffle", label: "Ensaymada waffle" },
  { src: IMG.longanisa, alt: "Illustrative image of longanisa", label: "Longanisa" },
  { src: IMG.poutine, alt: "Illustrative image of breakfast poutine", label: "Breakfast poutine" },
  { src: IMG.avocado, alt: "Illustrative image of avocado toast", label: "Avocado toast" },
];

function Price({ cents }: { cents: number | null }) {
  const p = formatCAD(cents);
  if (!p) return null; // no "Price on request" label
  return <span className="shrink-0 rounded-full bg-sun px-3 py-1 text-base font-black text-white">{p}</span>;
}

function SignatureTile({ item, big }: { item: PubItem; big?: boolean }) {
  return (
    <Tilt className="h-full">
      <article className="group h-full">
        <div className={`relative overflow-hidden rounded-[2rem] border-4 border-char ${big ? "aspect-[4/3] lg:aspect-auto lg:h-[36rem]" : "aspect-[4/3]"}`}>
          <div className="zoom-img h-full w-full">
            {item.imageUrl ? <Image src={item.imageUrl} alt={item.imageAlt} fill sizes={big ? "(min-width:1024px) 45vw, 100vw" : "(min-width:1024px) 22vw, 100vw"} priority={big} className="object-cover" /> : <DishArt name={item.name} className="h-full w-full" />}
          </div>
          {item.imageUrl && item.illustrative && <span className="absolute bottom-3 left-3 rounded-full bg-char/75 px-3 py-1 text-[0.68rem] font-bold uppercase tracking-wider text-cream">Illustrative image</span>}
          <span className="absolute right-3 top-3 rounded-full bg-gold px-3 py-1 text-xs font-black uppercase text-char">Signature</span>
        </div>
        <div className="mt-3 flex flex-wrap items-start justify-between gap-x-3 gap-y-2">
          <h3 className={`display-lg min-w-0 break-words ${big ? "text-4xl sm:text-5xl" : "text-3xl"}`}>{item.name}</h3>
          <Price cents={item.priceCents} />
        </div>
        <p className="mt-1 line-clamp-2 text-base">{item.description}</p>
      </article>
    </Tilt>
  );
}

export default async function Home() {
  const [{ data: menu, source }, { data: locations }, { data: services }, { data: testimonials }, { data: settings }] = await Promise.all([
    getMenu(), getLocations(), getServices(), getTestimonials(3), getSettings(),
  ]);
  const signature = menu.items.filter((i) => i.signature && i.available).slice(0, 5);

  return (
    <>
      {source === "preview" && <PreviewBanner />}
      <JsonLd data={restaurantJsonLd(locations)} />
      <Hero />

      {/* Quick access */}
      <section className="mx-auto max-w-7xl px-4 pt-14 sm:px-6" aria-label="Quick links">
        <Stagger className="grid gap-4 md:grid-cols-3">
          {[
            ["/menu", "See the menu", "Every dish, with prices as they are confirmed.", "01"],
            ["/contact#locations", "Find a location", "Forest Lawn and The District, with hours and directions.", "02"],
            ["/book", "Request a table", "Families and groups welcome. The team confirms every request.", "03"],
          ].map(([h, t, d, n]) => (
            <StaggerItem key={h}>
              <Link href={h} className="group relative block overflow-hidden rounded-[1.6rem] border-4 border-char bg-white p-6 transition-all duration-300 hover:-translate-y-1.5 hover:bg-gold hover:shadow-[8px_8px_0_#211A16]">
                <span className="display-xl absolute -right-1 -top-3 text-7xl text-char/10 transition-colors group-hover:text-char/20">{n}</span>
                <span className="display-lg relative text-4xl">{t}<span aria-hidden className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-2">→</span></span>
                <span className="relative mt-2 block text-base">{d}</span>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* Signature dishes */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:py-20 lg:py-24 sm:px-6" aria-labelledby="sig">
        <Reveal><p className="text-sm font-extrabold uppercase tracking-[0.18em] text-sun">House favourites</p></Reveal>
        <SplitHeading text="Plates people come back for." className="display-xl mt-2 max-w-3xl text-[clamp(3rem,8vw,6.5rem)]" highlight={["back"]} />
        <span id="sig" className="sr-only">Signature dishes</span>
        {signature.length > 0 && (
          <div className="mt-14 grid gap-8 lg:grid-cols-12">
            <Reveal className="lg:col-span-6 lg:row-span-2"><SignatureTile item={signature[0]} big /></Reveal>
            {signature.slice(1).map((s, i) => (
              <Reveal key={s.id} delay={i * 0.08} className={`lg:col-span-3 ${i % 2 ? "lg:mt-10" : ""}`}><SignatureTile item={s} /></Reveal>
            ))}
          </div>
        )}
        <Reveal className="mt-12"><Magnetic><Pill href="/menu" variant="dark">Explore the full menu</Pill></Magnetic></Reveal>
      </section>

      {/* Filipino feature */}
      <section className="on-dark grain relative isolate bg-char text-cream" aria-labelledby="fil">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 py-10 sm:py-16 sm:py-24 lg:py-28 sm:px-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <RevealImg src={IMG.ube} alt="Illustrative image of ube French toast with berries and cream" sizes="(min-width:1024px) 40vw, 90vw" shape="arch" className="aspect-[4/5] w-full" speed={50} />
            <div className="absolute -right-3 bottom-16 hidden w-44 rotate-3 sm:block lg:-right-10">
              <RevealImg src={IMG.tapa} alt="Illustrative image of beef tapa" sizes="180px" className="aspect-square" rounded="rounded-[1.4rem]" speed={20} illustrative={false} />
            </div>
            <div className="bob absolute -left-2 top-6 grid h-28 w-28 place-items-center rounded-full bg-sun p-3 text-center text-[0.72rem] font-black uppercase leading-tight text-white shadow-xl [--r:-8deg]">Sweet<br />& savoury<br />Filipino</div>
          </div>
          <div>
            <Reveal><p className="text-sm font-extrabold uppercase tracking-[0.18em] text-gold">What sets us apart</p></Reveal>
            <SplitHeading text="Filipino-inspired mornings." className="display-xl mt-2 text-[clamp(3.2rem,8vw,7rem)]" highlight={["Filipino-inspired"]} />
            <span id="fil" className="sr-only">Filipino-inspired breakfast</span>
            <Reveal delay={0.1}><p className="mt-6 max-w-lg font-serif2 text-xl">Garlic rice, mango salsa and a fried egg on the plate. Sweet, savoury and made to share. If it is your first time, start here.</p></Reveal>
            <Stagger className="mt-8 divide-y divide-cream/20">
              {FILIPINO_STORY.map(([n, d], i) => (
                <StaggerItem key={n}>
                  <div className="group flex gap-5 py-4 transition-transform duration-300 hover:translate-x-2">
                    <span className="display-lg text-4xl text-gold" aria-hidden>{String(i + 1).padStart(2, "0")}</span>
                    <div><h3 className="display-lg text-3xl transition-colors group-hover:text-gold">{n}</h3><p className="mt-1 text-lg text-cream/90">{d}</p></div>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
            <Reveal delay={0.1} className="mt-8"><Magnetic><Pill href="/menu" variant="orange">See Filipino-inspired dishes</Pill></Magnetic></Reveal>
          </div>
        </div>
        <div className="scallop text-char" />
      </section>

      {/* Filmstrip */}
      <section className="overflow-hidden pb-6 pt-16 sm:pt-24 lg:pt-28" aria-label="A taste of the morning">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal><p className="text-sm font-extrabold uppercase tracking-[0.18em] text-sun">A taste of the morning</p></Reveal>
          <SplitHeading text="Scroll the table." className="display-xl mt-2 text-[clamp(3rem,8vw,6.5rem)]" />
        </div>
        <div className="mt-10"><ImageStrip items={STRIP} /></div>
        <p className="mx-auto mt-4 max-w-7xl px-4 text-sm text-char/80 sm:px-6">Illustrative images. Photos of our own plates are coming.</p>
      </section>

      {/* Story */}
      <section className="mx-auto grid max-w-7xl items-center gap-14 px-4 py-10 sm:py-16 sm:py-24 lg:py-28 sm:px-6 lg:grid-cols-[1.05fr_1fr]" aria-labelledby="story">
        <div className="relative mx-auto grid w-full max-w-xl grid-cols-5 grid-rows-6 gap-4">
          <RevealImg src={IMG.interior} alt="Illustrative image of a warm, sunlit cafe interior" sizes="(min-width:1024px) 30vw, 70vw" className="col-span-3 row-span-5 aspect-[3/4]" speed={30} />
          <RevealImg src={IMG.coffee} alt="Illustrative image of coffee and orange juice" sizes="(min-width:1024px) 20vw, 40vw" className="col-span-2 col-start-4 row-span-3 row-start-2 aspect-square" speed={-20} />
          <div className="bob col-span-2 col-start-4 row-start-5 grid place-items-center self-center rounded-[1.4rem] bg-sun p-4 text-center font-cond text-2xl font-extrabold uppercase leading-none text-white [--r:3deg]">Serving<br />Calgary<br />since 2020</div>
        </div>
        <div>
          <SplitHeading text="Home-style food, a friendly table." className="display-xl text-[clamp(3rem,7vw,5.6rem)]" highlight={["friendly"]} />
          <span id="story" className="sr-only">Our story</span>
          <Reveal delay={0.1}><p className="mt-6 max-w-xl font-serif2 text-xl leading-relaxed">Rise N’ Shine is a Calgary breakfast spot built on quality ingredients, reasonable prices and a warm welcome. Our menu pairs breakfast classics with Filipino dishes that you will not find at every brunch place.</p></Reveal>
          <Reveal delay={0.18} className="mt-8"><Magnetic><Pill href="/about-us" variant="outline">Read our story</Pill></Magnetic></Reveal>
        </div>
      </section>

      {/* Services */}
      <section className="on-orange grain relative isolate bg-sun text-white" aria-labelledby="svc">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:py-16 sm:py-24 lg:py-28 sm:px-6">
          <SplitHeading text="More than breakfast." className="display-xl text-[clamp(3rem,8vw,6.5rem)] text-cream" />
          <span id="svc" className="sr-only">Services</span>
          <Stagger className="mt-12 divide-y-2 divide-white/30 border-y-2 border-white/30">
            {services.slice(0, 5).map((s, i) => (
              <StaggerItem key={s.id}>
                <Link href="/services" className="group grid items-center gap-4 py-6 sm:grid-cols-[4rem_1fr_9rem_auto]">
                  <span className="display-lg text-4xl text-gold" aria-hidden>{String(i + 1).padStart(2, "0")}</span>
                  <span><span className="display-lg block text-4xl transition-transform duration-300 group-hover:translate-x-2 sm:text-5xl">{s.title}</span><span className="mt-1 block max-w-2xl text-lg">{s.summary}</span></span>
                  <span className="relative hidden h-24 w-36 overflow-hidden rounded-2xl border-2 border-cream/80 sm:block">
                    <Image src={serviceImage(s.slug)} alt="" fill sizes="144px" className="zoom-img object-cover transition-transform duration-500 group-hover:scale-110" />
                  </span>
                  <span aria-hidden className="hidden text-5xl transition-transform duration-300 group-hover:translate-x-2 sm:block">→</span>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
        <div className="scallop text-sun" />
      </section>

      {/* Testimonials (approved only) */}
      {testimonials.length > 0 ? (
        <section className="mx-auto max-w-7xl px-4 py-10 sm:py-16 sm:py-24 lg:py-28 sm:px-6" aria-labelledby="tst">
          <SplitHeading text="Kind words from guests." className="display-xl text-[clamp(3rem,7vw,5.6rem)]" />
          <span id="tst" className="sr-only">Testimonials</span>
          <Stagger className="mt-10 grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <StaggerItem key={t.id}>
                <figure className="h-full rounded-[1.6rem] border-4 border-char bg-white p-6">
                  <blockquote className="font-serif2 text-lg leading-relaxed">“{t.body}”</blockquote>
                  <figcaption className="mt-4 font-extrabold">{t.authorName}{t.visitedLocation ? `, ${t.visitedLocation}` : ""}</figcaption>
                </figure>
              </StaggerItem>
            ))}
          </Stagger>
          <div className="mt-8"><Pill href="/testimonials" variant="outline">More feedback</Pill></div>
        </section>
      ) : (
        <section className="mx-auto max-w-4xl px-4 py-14 sm:py-20 lg:py-24 text-center sm:px-6">
          <Reveal><h2 className="display-xl text-5xl">Been in lately?</h2><p className="mt-3 font-serif2 text-xl">We would love to hear how your breakfast went. Review the location you visited.</p><div className="mt-6 flex flex-wrap justify-center gap-3">{BUSINESS.reviewLinks.map((r) => <Pill key={r.name} href={r.url} external variant="dark">Review us: {r.name}</Pill>)}</div></Reveal>
        </section>
      )}

      {/* Locations */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:pb-24 lg:pb-28 sm:px-6" aria-labelledby="loc">
        <SplitHeading text="Two Calgary tables." className="display-xl text-[clamp(3rem,8vw,6.5rem)]" />
        <span id="loc" className="sr-only">Locations</span>
        <div className="mt-10"><LocationCards locations={locations} hoursNote={settings.hoursNote} /></div>
      </section>

      {/* Group CTA */}
      <section className="grain relative isolate overflow-hidden bg-gold text-char">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:py-20 lg:py-24 sm:px-6 md:grid-cols-[1.3fr_1fr]">
          <div>
            <SplitHeading text="Bringing the whole crew?" className="display-xl text-[clamp(3rem,8vw,6.5rem)]" />
            <Reveal delay={0.1}><p className="mt-4 max-w-xl font-serif2 text-xl">We take table reservations on weekdays only (Monday to Friday), not on weekends. Weekend visits are first come, first served. Send a booking request for your family or group. Your reservation is confirmed only after the restaurant approves it. Planning catering? Send an inquiry instead.</p></Reveal>
            <Reveal delay={0.16} className="mt-8 flex flex-wrap gap-3">
              <Magnetic><Pill href="/book" variant="dark">Request a table</Pill></Magnetic>
              <Pill href="mailto:rnsbreakfast@gmail.com?subject=Catering%20inquiry" variant="outline">Catering inquiry</Pill>
            </Reveal>
          </div>
          <RevealImg src={IMG.family} alt="Illustrative image of a family sharing breakfast" sizes="(min-width:768px) 35vw, 90vw" shape="arch" className="mx-auto aspect-[4/5] w-full max-w-sm" speed={30} />
        </div>
      </section>
    </>
  );
}
