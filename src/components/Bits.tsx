import Link from "next/link";
import type { ReactNode } from "react";
import { Reveal } from "./Motion";
import { SunArcs } from "./Art";
import { RevealImg } from "./Media";

export function PageHero({ eyebrow, title, children, tone = "orange", image }: { eyebrow: string; title: ReactNode; children?: ReactNode; tone?: "orange" | "dark" | "gold"; image?: { src: string; alt: string; illustrative?: boolean } }) {
  const cls = tone === "orange" ? "bg-sun text-cream on-orange" : tone === "dark" ? "bg-char text-cream on-dark" : "bg-gold text-char";
  return (
    <section className={`${cls} grain relative isolate overflow-hidden`}>
      <SunArcs className="pointer-events-none absolute -bottom-2 right-[-20%] -z-10 w-[120%] opacity-50 sm:right-[-5%] sm:w-[60%]" />
      <div className={`mx-auto grid max-w-7xl items-center gap-10 px-4 pb-14 pt-10 sm:px-6 sm:pb-24 sm:pt-16 ${image ? "lg:grid-cols-[1.25fr_1fr]" : ""}`}>
        <div>
          <Reveal><p className="mb-4 inline-block rounded-full bg-char px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.18em] text-gold">{eyebrow}</p></Reveal>
          <Reveal delay={0.08}><h1 className="display-xl max-w-4xl text-[clamp(3.4rem,10vw,8rem)]">{title}</h1></Reveal>
          {children && <Reveal delay={0.16}><div className="mt-6 max-w-2xl font-serif2 text-xl sm:text-2xl">{children}</div></Reveal>}
        </div>
        {image && (
          <div className="relative mx-auto hidden w-full max-w-sm lg:block">
            <RevealImg src={image.src} alt={image.alt} sizes="(min-width:1024px) 30vw, 0px" shape="arch" className="aspect-[4/5] w-full" speed={30} illustrative={image.illustrative ?? true} />
            <div className="bob absolute -left-6 bottom-10 grid h-24 w-24 place-items-center rounded-full bg-gold p-2 text-center text-[0.68rem] font-black uppercase leading-tight text-char shadow-lg [--r:-8deg]">Fresh<br />every<br />morning</div>
          </div>
        )}
      </div>
      <div className={`scallop ${tone === "dark" ? "text-char" : tone === "gold" ? "text-gold" : "text-sun"}`} style={{ bottom: -13 }} />
    </section>
  );
}

export function Pill({ href, children, variant = "orange", external = false }: { href: string; children: ReactNode; variant?: "orange" | "dark" | "cream" | "outline"; external?: boolean }) {
  const v = {
    orange: "bg-sun text-white shadow-[0_4px_0_#C93A00]",
    dark: "bg-char text-cream shadow-[0_4px_0_#000]",
    cream: "bg-cream text-char shadow-[0_4px_0_#C93A00]",
    outline: "border-2 border-current",
  }[variant];
  const cls = `btn-press inline-flex min-h-[52px] items-center rounded-full px-7 text-lg font-extrabold transition-transform hover:-translate-y-0.5 ${v}`;
  if (href.startsWith("mailto:") || href.startsWith("tel:")) return <a href={href} className={cls}>{children}</a>;
  return external
    ? <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>{children}<span className="sr-only"> (opens in a new tab)</span></a>
    : <Link href={href} className={cls}>{children}</Link>;
}

export function PreviewBanner() {
  return (
    <p className="bg-char px-4 py-2 text-center text-sm font-bold text-gold" role="note">
      Preview: live content and online forms are not switched on yet. Please call Forest Lawn (403) 271-5170 or The District (825) 205-6390.
    </p>
  );
}

export function JsonLd({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
