import Link from "next/link";
import { BUSINESS, formatPhone, mapsDirectionsUrl, telHref } from "@/lib/content";
import type { PubLocation } from "@/lib/data";
import { Logo } from "./Logo";

export function Footer({ locations }: { locations: PubLocation[] }) {
  return (
    <footer className="on-dark grain relative mt-14 sm:mt-24 bg-black text-cream">
      <div className="scallop text-black" style={{ top: -13, bottom: "auto", transform: "scaleY(-1)" }} />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 pb-10 pt-16 sm:px-6 md:grid-cols-12">
        <div className="md:col-span-5">
          <Logo size="lg" className="!rounded-none" />
          <p className="display-lg mt-6 text-4xl text-gold sm:text-5xl">A little sunshine.<br />A lot of breakfast.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/menu" className="btn-press inline-flex min-h-[48px] items-center rounded-full bg-sun px-6 font-extrabold text-white">View the menu</Link>
            <Link href="/book" className="btn-press inline-flex min-h-[48px] items-center rounded-full border-2 border-cream px-6 font-extrabold">Request a table</Link>
          </div>
        </div>
        <nav aria-label="Footer" className="md:col-span-2">
          <h2 className="mb-3 text-sm font-extrabold uppercase tracking-[0.16em] text-gold">Explore</h2>
          <ul className="space-y-1 text-lg">
            {[["/menu", "Menu"], ["/about-us", "About us"], ["/services", "Services"], ["/testimonials", "Testimonials"], ["/our-team", "Our team"], ["/contact#contact-us", "Contact us"]].map(([h, l]) => (
              <li key={h}><Link href={h} className="inline-flex min-h-[40px] items-center hover:text-gold">{l}</Link></li>
            ))}
          </ul>
        </nav>
        <div className="md:col-span-5">
          <h2 className="mb-3 text-sm font-extrabold uppercase tracking-[0.16em] text-gold">Visit & contact</h2>
          <ul className="space-y-4">
            {locations.map((l) => (
              <li key={l.slug}>
                <p className="font-extrabold">{l.name}</p>
                <address className="not-italic text-cream/90">{l.street}, {l.city}, {l.region} {l.postalCode}</address>
                <a href={telHref(l.phone)} className="block min-h-[36px] text-lg font-bold hover:text-gold">{formatPhone(l.phone)}</a>
                <a href={mapsDirectionsUrl(l)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[40px] items-center font-bold text-gold underline underline-offset-4">Get directions<span className="sr-only"> to {l.name} (opens in a new tab)</span></a>
              </li>
            ))}
          </ul>
          <p className="mt-4 space-y-1">
            <a href={`mailto:${BUSINESS.email}`} className="block min-h-[36px] hover:text-gold">{BUSINESS.email}</a>
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {[["Instagram", BUSINESS.social.instagram], ["Facebook", BUSINESS.social.facebook], ["TikTok", BUSINESS.social.tiktok]].map(([n, u]) => (
              <li key={n}><a href={u} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[44px] items-center rounded-full border border-cream/40 px-4 text-sm font-bold hover:border-gold hover:text-gold">{n}<span className="sr-only"> (opens in a new tab)</span></a></li>
            ))}
          </ul>
          <p className="mt-2 text-sm text-cream/80">{BUSINESS.handle}</p>
        </div>
      </div>
      <div className="border-t border-cream/15 px-4 py-5 text-center text-sm text-cream/80">
        © {new Date().getFullYear()} {BUSINESS.name}. Calgary, Alberta.<br />Images marked “Illustrative” are AI-created concept imagery, not photos of our actual dishes, rooms or people.
      </div>
    </footer>
  );
}
