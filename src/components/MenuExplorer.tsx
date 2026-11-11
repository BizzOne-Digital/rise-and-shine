"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { BUSINESS } from "@/lib/content";
import type { PubCategory, PubItem } from "@/lib/data";
import { DishArt } from "./Art";
import { inputCls } from "./FormKit";

type Loc = { slug: string; name: string };

export function MenuExplorer({ categories, items, locations, pdfUrl }: { categories: PubCategory[]; items: PubItem[]; locations: Loc[]; pdfUrl?: string }) {
  const [cat, setCat] = useState("all");
  const [q, setQ] = useState("");
  const [loc, setLoc] = useState("");
  const showLoc = items.some((i) => i.overrides.length > 0);

  const view = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return items
      .filter((i) => (cat === "all" || i.categoryId === cat))
      .filter((i) => !needle || i.name.toLowerCase().includes(needle) || i.description.toLowerCase().includes(needle))
      .map((i) => {
        const o = loc ? i.overrides.find((x) => x.locationSlug === loc) : undefined;
        return { ...i, priceCents: o?.priceCents ?? i.priceCents, available: i.available && (o ? o.available : true) };
      });
  }, [items, cat, q, loc]);

  const grouped = categories.map((c) => ({ c, rows: view.filter((i) => i.categoryId === c.id) })).filter((g) => g.rows.length);

  return (
    <div>
      <div className="sticky top-[72px] z-30 -mx-4 border-b border-char/10 bg-cream/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 md:flex-row md:items-center">
          <div className="flex min-w-0 items-center gap-2">
          <div role="tablist" aria-label="Menu categories" className="hide-scrollbar -mx-1 flex min-w-0 gap-2 overflow-x-auto px-1 py-1">
            {[{ id: "all", name: "All dishes" }, ...categories].map((c) => (
              <button key={c.id} role="tab" aria-selected={cat === c.id} onClick={() => setCat(c.id)}
                className={`btn-press min-touch relative shrink-0 rounded-full border-2 border-char px-5 font-extrabold ${cat === c.id ? "text-cream" : "bg-white hover:bg-gold/30"}`}>
                {cat === c.id && <motion.span layoutId="cat-pill" className="absolute inset-0 -z-0 rounded-full bg-char" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
                <span className="relative z-10">{c.name}</span>
              </button>
            ))}
          </div>
          <a href={pdfUrl || BUSINESS.menuPdf} target="_blank" rel="noopener noreferrer" className="btn-press min-touch inline-flex shrink-0 items-center rounded-full bg-sun px-5 text-sm font-extrabold uppercase tracking-wide text-white">Download full menu<span className="sr-only"> (opens in a new tab)</span></a>
          </div>
          <div className="flex flex-1 gap-2 md:justify-end">
            <label className="sr-only" htmlFor="menu-search">Search the menu</label>
            <input id="menu-search" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search dishes, e.g. tapa, ube, waffle" className={`${inputCls} md:max-w-xs`} />
            {showLoc && (
              <>
                <label className="sr-only" htmlFor="menu-loc">Show prices for location</label>
                <select id="menu-loc" value={loc} onChange={(e) => setLoc(e.target.value)} className={`${inputCls} max-w-[11rem]`}>
                  <option value="">All locations</option>
                  {locations.map((l) => <option key={l.slug} value={l.slug}>{l.name}</option>)}
                </select>
              </>
            )}
          </div>
        </div>
      </div>

      <p className="sr-only" role="status" aria-live="polite">{view.length} dishes shown</p>

      {items.length === 0 ? (
        <p className="mt-12 rounded-2xl bg-white p-8 text-lg font-bold">The menu is being updated. Please check back soon, or call us at (403) 271-5170 (Forest Lawn) or (825) 205-6390 (The District).</p>
      ) : view.length === 0 ? (
        <div className="mt-12 rounded-2xl border-4 border-dashed border-char/30 bg-white p-8 text-center">
          <p className="display-lg text-3xl">Nothing matches “{q}”.</p>
          <p className="mt-2">Try a shorter word, or browse everything.</p>
          <button onClick={() => { setQ(""); setCat("all"); }} className="btn-press mt-5 min-h-[48px] rounded-full bg-sun px-6 font-extrabold text-white">Clear filters</button>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div key={cat + (q ? "q" : "")} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
            {grouped.map(({ c, rows }) => (
              <section key={c.id} aria-labelledby={`cat-${c.slug}`} className="mt-14">
                <h2 id={`cat-${c.slug}`} className="display-xl text-5xl text-sun sm:text-7xl">{c.name}</h2>
                {c.blurb && <p className="mt-2 max-w-2xl text-lg">{c.blurb}</p>}
                <ul className="mt-8 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                  {rows.map((i, idx) => <Dish key={i.id} item={i} offset={idx % 3 === 1} />)}
                </ul>
              </section>
            ))}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}

function Dish({ item, offset }: { item: PubItem; offset: boolean }) {
  return (
    <motion.li layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`group ${offset ? "lg:mt-10" : ""} ${item.available ? "" : "opacity-70"}`}>
      <div className="relative aspect-[4/3] overflow-hidden rounded-[1.6rem] border-4 border-char bg-cream-dark">
        <div className="zoom-img h-full w-full">
          {item.imageUrl ? <Image src={item.imageUrl} alt={item.imageAlt} fill sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" className="object-cover" /> : <DishArt name={item.name} className="h-full w-full" />}
        </div>
        {item.imageUrl && item.illustrative && <span className="absolute bottom-3 left-3 rounded-full bg-char/75 px-3 py-1 text-[0.68rem] font-bold uppercase tracking-wider text-cream">Illustrative image</span>}
        {item.signature && <span className="absolute left-3 top-3 rounded-full bg-gold px-3 py-1 text-xs font-black uppercase tracking-wide text-char">Signature</span>}
        {!item.available && <span className="absolute inset-0 grid place-items-center bg-char/60 text-lg font-black uppercase tracking-wide text-cream">Currently unavailable</span>}
      </div>
      <div className="mt-3 flex flex-wrap items-start justify-between gap-x-3 gap-y-2">
        <h3 className="display-lg min-w-0 break-words text-2xl">{item.name}</h3>
      </div>
      {item.description && <p className="mt-1.5 text-base leading-relaxed text-char/90">{item.description}</p>}
      {item.dietary.length > 0 && <p className="mt-2 text-sm font-bold">{item.dietary.join(" · ")}</p>}
    </motion.li>
  );
}
