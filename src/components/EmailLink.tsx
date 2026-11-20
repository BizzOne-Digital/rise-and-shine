"use client";

import type { ReactNode } from "react";
import { BUSINESS, gmailComposeUrl } from "@/lib/content";

/** Opens an email to the restaurant. On phones and tablets it uses mailto: so the Gmail / Mail app opens its compose screen.
 *  On a desktop browser it opens Gmail's compose window in a new tab (a plain mailto: often opens nothing useful there). */
export function EmailLink({ email = BUSINESS.email, subject = "", className = "", children }: { email?: string; subject?: string; className?: string; children?: ReactNode }) {
  const mailto = `mailto:${email}${subject ? `?subject=${encodeURIComponent(subject)}` : ""}`;
  return (
    <a href={mailto} className={className}
      onClick={(e) => {
        const touch = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || (navigator.maxTouchPoints > 1 && /Mac/.test(navigator.platform));
        if (touch) return; // let the phone open its mail app
        e.preventDefault();
        window.open(gmailComposeUrl(email, subject), "_blank", "noopener,noreferrer");
      }}>
      {children ?? email}
    </a>
  );
}
