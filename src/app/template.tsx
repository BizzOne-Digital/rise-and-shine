"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

/** Soft page transition: opacity + small rise. Short, so navigation always feels immediate. */
export default function Template({ children }: { children: ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}>
      {children}
    </motion.div>
  );
}
