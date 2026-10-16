"use client";

import Image from "next/image";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";
import { useParallaxEnabled } from "./Motion";

const ease = [0.2, 0.7, 0.2, 1] as const;

/** Image that is revealed with a clip-path wipe when it enters view and drifts slightly with scroll (capable devices only). */
export function RevealImg({
  src, alt, sizes, className = "", rounded = "rounded-[2rem]", shape, speed = 40, priority = false, illustrative = true, tilt = 0, position = "center",
}: {
  src: string; alt: string; sizes: string; className?: string; rounded?: string; shape?: "arch"; speed?: number; priority?: boolean; illustrative?: boolean; tilt?: number; position?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const parallax = useParallaxEnabled();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [parallax ? speed : 0, parallax ? -speed : 0]);
  return (
    <motion.div ref={ref} data-reveal className={`relative ${className}`} style={{ rotate: tilt }}
      initial={{ clipPath: "inset(12% 12% 12% 12% round 2rem)", opacity: 0 }} whileInView={{ clipPath: "inset(0% 0% 0% 0% round 0rem)", opacity: 1 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }} transition={{ duration: 1.1, ease }}>
      <div className={`group relative h-full w-full overflow-hidden border-4 border-char bg-cream-dark ${shape === "arch" ? "rounded-t-[999px] rounded-b-[2rem]" : rounded}`}>
        <motion.div style={{ y, scale: 1.12 }} className="absolute inset-0">
          <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="zoom-img object-cover" style={{ objectPosition: position }} />
        </motion.div>
        {illustrative && <span className="absolute bottom-3 left-3 rounded-full bg-char/75 px-3 py-1 text-[0.7rem] font-bold uppercase tracking-wider text-cream">Illustrative image</span>}
      </div>
    </motion.div>
  );
}

/** Headline that reveals word by word (each word slides up from a mask). */
export function SplitHeading({ text, className = "", as: Tag = "h2", highlight = [] }: { text: string; className?: string; as?: "h1" | "h2" | "h3"; highlight?: string[] }) {
  const words = text.split(" ");
  const M = motion[Tag];
  return (
    <M className={className} initial="hidden" whileInView="show" viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} aria-hidden className="mr-[0.22em] inline-block overflow-hidden pb-[0.06em] pr-[0.05em] -mr-[0.05em] align-bottom">
          <motion.span className={`inline-block ${highlight.includes(w.replace(/[.,!?]/g, "")) ? "text-sun" : ""}`}
            variants={{ hidden: { y: "110%", rotate: 3 }, show: { y: 0, rotate: 0, transition: { duration: 0.8, ease } } }}>{w}</motion.span>
        </span>
      ))}
    </M>
  );
}

/** Button wrapper that is gently pulled toward the pointer (fine-pointer desktops only). */
export function Magnetic({ children, strength = 0.25 }: { children: ReactNode; strength?: number }) {
  const enabled = useParallaxEnabled();
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 });
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 });
  const ref = useRef<HTMLDivElement>(null);
  return (
    <motion.div ref={ref} style={{ x, y, display: "inline-block" }}
      onMouseMove={(e) => {
        if (!enabled || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}>
      {children}
    </motion.div>
  );
}

/** Card that tilts toward the pointer in 3D (fine-pointer desktops only). */
export function Tilt({ children, className = "" }: { children: ReactNode; className?: string }) {
  const enabled = useParallaxEnabled();
  const rx = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 });
  const ry = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 });
  return (
    <motion.div className={className} style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      onMouseMove={(e) => {
        if (!enabled) return;
        const r = e.currentTarget.getBoundingClientRect();
        ry.set(((e.clientX - r.left) / r.width - 0.5) * 8);
        rx.set(-((e.clientY - r.top) / r.height - 0.5) * 8);
      }}
      onMouseLeave={() => { rx.set(0); ry.set(0); }}>
      {children}
    </motion.div>
  );
}

/** Horizontal filmstrip of images that slides with page scroll (no autoplay). */
export function ImageStrip({ items }: { items: { src: string; alt: string; label: string }[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], ["6%", "-24%"]);
  return (
    <div ref={ref} className="overflow-hidden py-4">
      <motion.ul style={{ x }} className="flex w-max gap-5 pl-4 sm:gap-8">
        {items.map((it, i) => (
          <li key={it.src} className={`group relative h-[260px] w-[220px] shrink-0 overflow-hidden rounded-[1.6rem] border-4 border-char sm:h-[380px] sm:w-[310px] ${i % 2 ? "mt-10" : ""}`}>
            <Image src={it.src} alt={it.alt} fill sizes="310px" className="zoom-img object-cover" />
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-char/90 to-transparent p-4 pt-12 font-cond text-2xl font-extrabold uppercase text-cream">{it.label}</span>
          </li>
        ))}
      </motion.ul>
    </div>
  );
}
