/* Idempotent seed of VERIFIED public content. Safe to run repeatedly: existing records (and admin edits) are never overwritten.
 * Seeds: locations, menu categories + items (no prices), services, site settings.
 * Does NOT seed: reviews, team members, prices, photos. */
import { config } from "dotenv";
import mongoose from "mongoose";
config({ path: ".env.local" });
config();
import { connectDB } from "../src/lib/db";
import { Location, MenuCategory, MenuItem, Service, SiteSettings } from "../src/lib/models";
import { CATEGORIES, HOURS_NOTE, ITEMS, LOCATIONS, SERVICES } from "../src/lib/content";

async function main() {
  if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI is not set. Copy .env.example to .env.local and fill it in first.");
    process.exit(1);
  }
  await connectDB();
  let created = 0;
  const upsert = async (model: typeof Location, filter: object, doc: object) => {
    const r = await model.updateOne(filter, { $setOnInsert: doc }, { upsert: true });
    if (r.upsertedCount) created++;
  };

  for (const l of LOCATIONS) await upsert(Location, { slug: l.slug }, { ...l, published: true, acceptsBookings: true });

  const catIds: Record<string, unknown> = {};
  for (const c of CATEGORIES) {
    await upsert(MenuCategory, { slug: c.slug }, { ...c, published: true });
    catIds[c.slug] = (await MenuCategory.findOne({ slug: c.slug }).select("_id").lean<{ _id: unknown }>())!._id;
  }
  let order = 0;
  for (const i of ITEMS) {
    order++;
    await upsert(MenuItem, { category: catIds[i.category], name: i.name }, {
      category: catIds[i.category], name: i.name, description: i.description, priceCents: null,
      signature: !!i.signature, featured: false, available: true, published: true, dietary: [], order,
    });
  }
  for (const s of SERVICES) await upsert(Service, { slug: s.slug }, { ...s, published: true });
  await upsert(SiteSettings, { key: "main" }, { key: "main", menuPdfUrl: "", hoursNote: HOURS_NOTE, bookingsEnabled: true });

  const noPrice = await MenuItem.countDocuments({ priceCents: null });
  console.log(`Seed complete. ${created} new record(s) created (existing records untouched).`);
  console.log(`${noPrice} menu items have no verified price yet: add them in Admin > Menu.`);
  console.log("Locations use the site-wide hours from the current website and are flagged 'hours not confirmed'.");
  await mongoose.disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
