import { IMG, realPhotoFor } from "@/lib/stockImages";
import type { Metadata } from "next";
import { MenuExplorer } from "@/components/MenuExplorer";
import { PageHero, PreviewBanner } from "@/components/Bits";
import { getLocations, getMenu, getSettings } from "@/lib/data";

export const metadata: Metadata = {
  title: "Menu",
  description: "Filipino-inspired dishes and breakfast classics: tapa, tocino, longanisa, sisig, ube French toast, benedicts, omelettes, waffles and pancakes.",
};
export const revalidate = 60;

export default async function MenuPage() {
  const [{ data: menu, source }, { data: locations }, { data: settings }] = await Promise.all([getMenu(), getLocations(), getSettings()]);
  return (
    <>
      {source === "preview" && <PreviewBanner />}
      <PageHero image={{ src: realPhotoFor("ube french toast") ?? IMG.ube, alt: "Ube French toast with strawberries, whipped cream and doughnut balls", illustrative: false }} eyebrow="The menu" title={<>Sweet, savoury, <span className="text-gold">sunny.</span></>}>
        <p>Whether you’re in the mood for garlic rice and beef tapa or a fresh plate of eggs benedict, we’ve got you covered. Search or browse our menu by category.</p>
      </PageHero>
      <div className="mx-auto max-w-7xl px-4 pb-8 pt-6 sm:px-6">
        <MenuExplorer categories={menu.categories} items={menu.items} locations={locations.map((l) => ({ slug: l.slug, name: l.name }))} pdfUrl={settings.menuPdfUrl || undefined} />
      </div>
    </>
  );
}
