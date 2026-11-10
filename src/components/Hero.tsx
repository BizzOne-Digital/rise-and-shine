"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { useParallaxEnabled } from "./Motion";

const ease = [0.2, 0.7, 0.2, 1] as const;

const Arrow = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);

function Sun({ size = 40, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true" className={className}>
      <path d="M8 27a12 12 0 0 1 24 0" />
      {[...Array(9)].map((_, i) => <path key={i} d="M20 6v5" transform={`rotate(${-80 + i * 20} 20 27)`} />)}
      <path d="M4 31h32" />
    </svg>
  );
}

function Stamp() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.4, rotate: -40 }} animate={{ opacity: 1, scale: 1, rotate: 12 }} transition={{ delay: 1.1, type: "spring", stiffness: 160, damping: 14 }}
      className="absolute right-[4%] top-8 z-10 hidden sm:block lg:top-[6%]"
    >
      <div className="relative h-[120px] w-[120px] rounded-full bg-gold text-char shadow-lg md:h-[164px] md:w-[164px]">
        <svg viewBox="0 0 164 164" className="absolute inset-0" aria-hidden="true">
          <defs>
            <path id="arc-top" d="M 24 82 A 58 58 0 0 1 140 82" />
            <path id="arc-bot" d="M 22 86 A 60 60 0 0 0 142 86" />
          </defs>
          <circle cx="82" cy="82" r="74" fill="none" stroke="#211A16" strokeWidth="1" strokeDasharray="2 3" opacity=".7" />
          <text fontSize="15" fontWeight="800" letterSpacing="3.2" fill="#211A16" fontFamily="var(--font-body)"><textPath href="#arc-top" startOffset="50%" textAnchor="middle">GOOD FOOD</textPath></text>
          <text fontSize="15" fontWeight="800" letterSpacing="3.2" fill="#211A16" fontFamily="var(--font-body)" dy="12"><textPath href="#arc-bot" startOffset="50%" textAnchor="middle">BRIGHT MOODS</textPath></text>
        </svg>
        <span className="absolute inset-0 grid place-items-center text-sun"><Sun size={52} /></span>
      </div>
    </motion.div>
  );
}

const TICKER = ["Breakfast, but brighter", "Filipino soul", "Breakfast, but brighter", "Filipino soul", "Breakfast, but brighter", "Filipino soul"];

function Ticker() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const x = useTransform(scrollY, [0, 1500], ["0%", "-22%"]);
  return (
    <div ref={ref} className="overflow-hidden whitespace-nowrap border-t border-char bg-gold" role="presentation">
      <motion.div style={{ x }} className="inline-flex items-center gap-10 py-[18px] pl-6 font-cond text-[1.55rem] font-bold uppercase tracking-[0.12em] text-char md:text-[1.7rem]" aria-hidden="true">
        {TICKER.concat(TICKER).map((t, i) => (
          <span key={i} className="inline-flex items-center gap-10">{t}<Sun size={36} className="text-sun" /></span>
        ))}
      </motion.div>
    </div>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const parallax = useParallaxEnabled();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", parallax ? "3%" : "0%"]);

  return (
    <>
      <section ref={ref} aria-labelledby="hero-title" className="on-dark relative isolate overflow-hidden bg-[#2a1a10] text-cream">
        <motion.div style={{ y: bgY }} className="absolute inset-0 -z-20">
          <motion.div className="absolute inset-0" initial={{ scale: 1.1, opacity: 0.4 }} animate={{ scale: 1.04, opacity: 1 }} transition={{ duration: 1.8, ease }}>
            <Image src="/images/hero-bg.png" alt="Beef tapa with garlic rice and egg, ube French toast, a latte and orange juice on a sunlit wooden table" fill priority quality={80} sizes="100vw" className="object-cover object-[50%_38%]" />
          </motion.div>
        </motion.div>
        <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(25,18,12,.86)_0%,rgba(25,18,12,.62)_34%,rgba(25,18,12,.12)_64%,rgba(25,18,12,0)_100%),linear-gradient(0deg,rgba(24,17,10,.55),transparent_24%)] max-md:bg-[linear-gradient(90deg,rgba(25,18,12,.85),rgba(25,18,12,.5)_85%),linear-gradient(0deg,rgba(24,17,10,.6),transparent_40%)]" />

        <div className="mx-auto flex min-h-[560px] max-w-[1800px] flex-col justify-center px-[5%] py-14 sm:min-h-[640px] sm:py-20 md:min-h-[calc(100svh-84px-68px)] md:px-[4.5%]">
          <Stamp />
          <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}
            className="text-[0.72rem] font-semibold uppercase tracking-[0.3em] md:text-[0.8rem]">
            Good mornings start here
          </motion.p>

          <h1 id="hero-title" className="mt-6 font-cond font-black uppercase leading-[0.86] tracking-tight text-cream [font-size:clamp(3.2rem,19vw,9.5rem)] md:[font-size:clamp(5.4rem,9.4vw,10.6rem)]">
            {["Wake up.", "Dig in.", "Shine on."].map((line, i) => (
              <span key={line} className="block overflow-hidden pb-[0.04em]">
                <motion.span className={`relative inline-block ${i === 2 ? "pb-4 text-gold" : ""}`}
                  initial={{ y: "105%" }} animate={{ y: 0 }} transition={{ delay: 0.3 + i * 0.12, duration: 0.85, ease }}>
                  {line}
                  {i === 2 && (
                    <motion.svg viewBox="0 0 420 22" fill="none" aria-hidden="true" className="absolute -bottom-0 left-0 h-[0.12em] min-h-3 w-full"
                      initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ delay: 1.0, duration: 0.9, ease }}>
                      <motion.path d="M5 13C99 1 251 0 414 12" stroke="currentColor" strokeWidth="5" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1.0, duration: 0.9, ease }} />
                    </motion.svg>
                  )}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85, duration: 0.7 }}
            className="mt-8 max-w-2xl font-cond text-[1.6rem] font-bold uppercase tracking-[0.12em] text-cream md:text-[1.7rem] md:leading-snug">
            Breakfast favourites. A little Filipino soul.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0, duration: 0.7 }} className="mt-9 flex flex-wrap items-center gap-x-10 gap-y-5">
            <Link href="/menu" className="btn-press group inline-flex items-center gap-10 rounded-md bg-sun px-7 py-5 font-serif2 text-lg font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-sun-red">
              Explore the menu <span className="transition-transform group-hover:translate-x-1"><Arrow /></span>
            </Link>
            <Link href="/contact#locations" className="group inline-flex items-center gap-3 border-b border-cream py-1 font-serif2 text-lg font-medium text-cream">
              Plan your visit <span className="transition-transform group-hover:translate-x-1"><Arrow /></span>
            </Link>
          </motion.div>
        </div>
      </section>
      <Ticker />
    </>
  );
}
