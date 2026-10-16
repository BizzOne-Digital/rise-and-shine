"use client";

import { MotionConfig, motion, useReducedMotion } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";

export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

const ease = [0.2, 0.7, 0.2, 1] as const;

/** Fades/slides content in once when it enters the viewport. Content is visible without JS (see layout noscript). */
export function Reveal({
  children, delay = 0, y = 28, className, as = "div",
}: { children: ReactNode; delay?: number; y?: number; className?: string; as?: "div" | "li" | "section" | "article" }) {
  const Comp = motion[as];
  return (
    <Comp
      data-reveal
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.7, delay, ease }}
      className={className}
    >
      {children}
    </Comp>
  );
}

export function Stagger({ children, className, gap = 0.08 }: { children: ReactNode; className?: string; gap?: number }) {
  return (
    <motion.div
      data-reveal
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: gap } } }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.65, ease } } }}
    >
      {children}
    </motion.div>
  );
}

/** True only on devices that can afford parallax: fine pointer, no reduced-motion preference. */
export function useParallaxEnabled() {
  const reduce = useReducedMotion();
  const [capable, setCapable] = useState(false);
  useEffect(() => {
    setCapable(window.matchMedia("(pointer: fine) and (min-width: 1024px)").matches);
  }, []);
  return capable && !reduce;
}
