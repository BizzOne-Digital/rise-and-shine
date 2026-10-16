import type { MetadataRoute } from "next";
import { env } from "@/lib/env";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", "/menu", "/about-us", "/services", "/testimonials", "/our-team", "/contact", "/book"];
  return paths.map((p) => ({ url: `${env.siteUrl}${p}`, changeFrequency: p === "/menu" ? "weekly" : "monthly", priority: p === "" ? 1 : 0.7 }));
}
