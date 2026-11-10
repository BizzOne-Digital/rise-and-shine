"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";

const Arrow = ({ className = "" }: { className?: string }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" className={className}><path d="M6 18 18 6M6 6h12v12" /></svg>
);

// Desktop shows the three primary links from the design; the full list lives in the mobile menu and footer.
const DESKTOP = [
  { href: "/menu", label: "Menu" },
  { href: "/about-us", label: "Our Story" },
  { href: "/contact#locations", label: "Visit Us" },
  { href: "/contact", label: "Contact Us" },
];
const ALL = [
  { href: "/menu", label: "Menu" },
  { href: "/about-us", label: "Our Story" },
  { href: "/services", label: "Services" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/our-team", label: "Our Team" },
  { href: "/contact#locations", label: "Visit Us" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 bg-black text-white">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:rounded-md focus:bg-char focus:px-4 focus:py-2 focus:text-cream">
        Skip to content
      </a>
      <div className="mx-auto flex h-[72px] max-w-[1800px] items-center justify-between gap-6 pr-[4.5%] pl-[2%] lg:h-[84px]">
        <Link href="/" aria-label="Rise N’ Shine Breakfast Place, home" className="shrink-0"><Logo plain /></Link>

        <nav aria-label="Main" className="hidden items-center gap-8 font-nav text-[0.95rem] font-bold uppercase tracking-wide lg:flex xl:gap-12">
          {DESKTOP.map((n) => (
            <Link key={n.href} href={n.href} aria-current={pathname === n.href ? "page" : undefined}
              className="group relative py-3 font-bold text-white">
              {n.label}
              <span className="absolute bottom-1 left-0 h-0.5 w-0 bg-sun transition-[width] duration-300 group-hover:w-full group-aria-[current=page]:w-full" />
            </Link>
          ))}
        </nav>

        <Link href="/book" className="btn-press group hidden items-center gap-4 rounded-md bg-sun px-6 py-3 font-nav text-[0.95rem] font-semibold text-white transition-colors hover:bg-sun-red lg:inline-flex">
          Let’s do breakfast <Arrow className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>

        <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-controls="mobile-nav"
          className="min-touch inline-flex items-center gap-2 rounded-md border border-white px-4 font-serif2 text-sm font-semibold text-white lg:hidden">
          <span>{open ? "Close" : "Menu"}</span>
          <span aria-hidden className="relative block h-3 w-5">
            <motion.span className="absolute left-0 top-0 block h-0.5 w-5 bg-white" animate={open ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }} />
            <motion.span className="absolute left-0 top-[10px] block h-0.5 w-5 bg-white" animate={open ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }} />
          </span>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div id="mobile-nav" className="on-orange fixed inset-x-0 bottom-0 top-[72px] z-40 overflow-y-auto bg-sun lg:hidden"
            initial={{ clipPath: "circle(0% at 90% 0%)" }} animate={{ clipPath: "circle(150% at 90% 0%)" }} exit={{ clipPath: "circle(0% at 90% 0%)" }}
            transition={{ duration: 0.55, ease: [0.2, 0.7, 0.2, 1] }}>
            <nav aria-label="Mobile" className="flex min-h-full flex-col justify-between px-6 pb-10 pt-8 text-white">
              <ul>
                {[{ href: "/", label: "Home" }, ...ALL].map((n, i) => (
                  <motion.li key={n.href} initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.12 + i * 0.05 }}>
                    <Link href={n.href} className="display-lg block border-b border-white/25 py-3 text-[2.6rem]">{n.label}</Link>
                  </motion.li>
                ))}
              </ul>
              <div className="mt-8 flex flex-col gap-3">
                <Link href="/book" className="btn-press rounded-md bg-char py-4 text-center font-serif2 text-lg font-semibold text-cream">Let’s do breakfast</Link>
                <a href="tel:+14037076529" className="btn-press rounded-md border-2 border-white py-4 text-center font-serif2 text-lg font-semibold">Call (403) 707-6529</a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
