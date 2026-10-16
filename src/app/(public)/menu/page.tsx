import { IMG } from "@/lib/stockImages";
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
  const missing = menu.items.filter((i) => i.priceCents == null).length;
  return (
    <>
      {source === "preview" && <PreviewBanner />}
      <PageHero image={{ src: IMG.ube, alt: "Illustrative image of ube French toast with berries and cream" }} eyebrow="The menu" title={<>Sweet, savoury, <span className="text-gold">sunny.</span></>}>
        <p>From garlic rice and tapa to eggs benedict on a homemade waffle. Search or browse by category.</p>
      </PageHero>
      <div className="mx-auto max-w-7xl px-4 pb-8 pt-6 sm:px-6">
        {missing > 0 && missing === menu.items.length && (
          <p className="mb-2 rounded-xl border-2 border-char/20 bg-white p-4 text-base">Prices are being finalized online. Ask our team for current prices at either location, or call <a className="font-extrabold underline" href="tel:+14037076529">(403) 707-6529</a>.</p>
        )}
        <MenuExplorer categories={menu.categories} items={menu.items} locations={locations.map((l) => ({ slug: l.slug, name: l.name }))} pdfUrl={settings.menuPdfUrl || undefined} />
      </div>
    </>
  );
}
