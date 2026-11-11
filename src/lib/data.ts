import "server-only";
import { connectDB } from "./db";
import { env } from "./env";
import * as M from "./models";
import { BUSINESS, CATEGORIES, HOURS_NOTE, ITEMS, LOCATIONS, SERVICES } from "./content";
import { conceptFor, realPhotoFor, resolveImage } from "./stockImages";
import { DEFAULT_RULES, type BookingRules, type DayHours, type HolidayOverride } from "./hours";

// ---- Public view types (plain, serialisable) ----
export type PubLocation = {
  slug: string; name: string; street: string; city: string; region: string; postalCode: string;
  phone: string; email: string; weekly: DayHours[]; overrides: HolidayOverride[];
  hoursConfirmed: boolean; acceptsBookings: boolean; rules: BookingRules;
};
export type PubCategory = { id: string; slug: string; name: string; blurb: string };
export type PubItem = {
  id: string; categoryId: string; name: string; description: string; priceCents: number | null;
  imageUrl: string | null; illustrative: boolean; imageAlt: string; dietary: string[]; signature: boolean; featured: boolean; available: boolean;
  overrides: { locationSlug: string; priceCents: number | null; available: boolean }[];
};
export type PubService = { id: string; slug: string; title: string; summary: string; cta: string; ctaLabel: string };
export type PubTestimonial = { id: string; authorName: string; body: string; visitedLocation: string; featured: boolean };
export type PubMember = { id: string; name: string; role: string; bio: string; imageUrl: string | null; imageAlt: string };
export type PubSettings = { menuPdfUrl: string; hoursNote: string; bookingsEnabled: boolean };

export type Source = "database" | "preview";

/** Run a DB read; on missing config or failure, fall back (public preview). */
async function withDb<T>(read: () => Promise<T>, fallback: () => T): Promise<{ data: T; source: Source }> {
  if (!env.dbConfigured) return { data: fallback(), source: "preview" };
  try {
    await connectDB();
    return { data: await read(), source: "database" };
  } catch (e) {
    console.error("[data] database read failed, using preview content:", (e as Error).message);
    return { data: fallback(), source: "preview" };
  }
}

const str = (v: unknown) => (v == null ? "" : String(v));
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Lean = any;

const mapLocation = (l: Lean): PubLocation => ({
  slug: l.slug, name: l.name, street: str(l.street), city: str(l.city), region: str(l.region), postalCode: str(l.postalCode),
  phone: str(l.phone), email: str(l.email),
  weekly: (l.weekly ?? []).map((d: Lean) => ({ closed: !!d.closed, open: str(d.open), close: str(d.close) })),
  overrides: (l.overrides ?? []).map((o: Lean) => ({ date: o.date, closed: !!o.closed, open: o.open, close: o.close, note: o.note })),
  hoursConfirmed: !!l.hoursConfirmed,
  acceptsBookings: l.acceptsBookings !== false,
  rules: { ...DEFAULT_RULES, ...(l.rules ? JSON.parse(JSON.stringify(l.rules)) : {}) },
});

export async function getSettings() {
  return withDb<PubSettings>(
    async () => {
      const s = await M.SiteSettings.findOne({ key: "main" }).lean<Lean>();
      return { menuPdfUrl: str(s?.menuPdfUrl), hoursNote: str(s?.hoursNote) || HOURS_NOTE, bookingsEnabled: s?.bookingsEnabled !== false };
    },
    () => ({ menuPdfUrl: "", hoursNote: HOURS_NOTE, bookingsEnabled: true }),
  );
}

export async function getLocations() {
  const r = await withDb<PubLocation[]>(
    async () => {
      const rows = await M.Location.find({ published: true }).sort({ order: 1 }).lean<Lean[]>();
      return rows.map(mapLocation);
    },
    () => LOCATIONS.map((l) => mapLocation({ ...l, acceptsBookings: true })),
  );
  return r;
}

export async function getMenu() {
  return withDb<{ categories: PubCategory[]; items: PubItem[] }>(
    async () => {
      const cats = await M.MenuCategory.find({ published: true }).sort({ order: 1 }).lean<Lean[]>();
      const items = await M.MenuItem.find({ published: true }).sort({ order: 1, name: 1 }).lean<Lean[]>();
      return {
        categories: cats.map((c) => ({ id: String(c._id), slug: c.slug, name: c.name, blurb: str(c.blurb) })),
        items: items.map((i) => ({
          id: String(i._id), categoryId: String(i.category), name: i.name, description: str(i.description),
          priceCents: typeof i.priceCents === "number" && i.priceCents > 0 ? i.priceCents : null,
          imageUrl: resolveImage(i.image) ?? realPhotoFor(i.name) ?? conceptFor(i.name), illustrative: !resolveImage(i.image) && !realPhotoFor(i.name), imageAlt: resolveImage(i.image) || realPhotoFor(i.name) ? i.name : `Illustrative image: ${i.name}`,
          dietary: i.dietary ?? [], signature: !!i.signature, featured: !!i.featured, available: i.available !== false,
          overrides: (i.locationOverrides ?? []).map((o: Lean) => ({ locationSlug: o.locationSlug, priceCents: o.priceCents ?? null, available: o.available !== false })),
        })),
      };
    },
    () => ({
      categories: CATEGORIES.map((c) => ({ id: c.slug, slug: c.slug, name: c.name, blurb: c.blurb })),
      items: ITEMS.map((i) => ({
        id: i.name, categoryId: i.category, name: i.name, description: i.description, priceCents: null, imageUrl: realPhotoFor(i.name) ?? conceptFor(i.name), illustrative: !realPhotoFor(i.name),
        imageAlt: realPhotoFor(i.name) ? i.name : `Illustrative image: ${i.name}`, dietary: [], signature: !!i.signature, featured: false, available: true, overrides: [],
      })),
    }),
  );
}

export async function getServices() {
  return withDb<PubService[]>(
    async () => {
      const rows = await M.Service.find({ published: true }).sort({ order: 1 }).lean<Lean[]>();
      return rows.map((s) => ({ id: String(s._id), slug: s.slug, title: s.title, summary: str(s.summary), cta: s.cta, ctaLabel: str(s.ctaLabel) }));
    },
    () => SERVICES.map((s) => ({ id: s.slug, slug: s.slug, title: s.title, summary: s.summary, cta: s.cta, ctaLabel: s.ctaLabel })),
  );
}

export async function getTestimonials(limit = 60) {
  return withDb<PubTestimonial[]>(
    async () => {
      const rows = await M.Testimonial.find({ status: "approved" })
        .select("authorName body visitedLocation featured").sort({ featured: -1, createdAt: -1 }).limit(limit).lean<Lean[]>();
      return rows.map((t) => ({ id: String(t._id), authorName: t.authorName, body: t.body, visitedLocation: str(t.visitedLocation), featured: !!t.featured }));
    },
    () => [],
  );
}

export async function getTeam() {
  return withDb<PubMember[]>(
    async () => {
      const rows = await M.TeamMember.find({ published: true }).sort({ order: 1 }).lean<Lean[]>();
      return rows.map((m) => ({ id: String(m._id), name: m.name, role: str(m.role), bio: str(m.bio), imageUrl: resolveImage(m.image), imageAlt: m.name }));
    },
    () => [],
  );
}

export const siteFacts = BUSINESS;
