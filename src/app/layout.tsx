import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, Outfit, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import { MotionProvider } from "@/components/Motion";
import { env } from "@/lib/env";

const display = Barlow_Condensed({ subsets: ["latin"], weight: ["600", "700", "800", "900"], variable: "--font-display", display: "swap" });
const serif = Source_Serif_4({ subsets: ["latin"], variable: "--font-serif", display: "swap" });
const body = Outfit({ subsets: ["latin"], variable: "--font-body", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(env.siteUrl),
  title: { default: "Rise N’ Shine Breakfast Place | Filipino-inspired breakfast in Calgary", template: "%s | Rise N’ Shine Breakfast Place" },
  description: "A little sunshine. A lot of breakfast. Filipino-inspired dishes and breakfast classics at two Calgary locations: Forest Lawn and The District.",
  openGraph: { type: "website", siteName: "Rise N’ Shine Breakfast Place", locale: "en_CA" },
};

export const viewport: Viewport = { themeColor: "#FF4D00", width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-CA" className={`${display.variable} ${body.variable} ${serif.variable}`}>
      <body>
        {/* If scripts fail to run, reveal-on-scroll content must still be visible */}
        <noscript><style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style></noscript>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
