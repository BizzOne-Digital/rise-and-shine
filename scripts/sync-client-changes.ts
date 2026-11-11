/* One-off, idempotent sync of the client's confirmed revisions into an EXISTING database.
 * (seed.ts never overwrites existing records, so already-seeded data must be updated here.)
 * Run once against the target database:  npm run sync-client-changes
 * Changes: location phone numbers, removes Buko Pandan Pancake, adds Lemon Ricotta Pancake,
 *          sets the five "House favourites" (signature) dishes, and clears the old personal number. */
import { config } from "dotenv";
import mongoose from "mongoose";
config({ path: ".env.local" });
config();
import { connectDB } from "../src/lib/db";
import { Location, MenuCategory, MenuItem } from "../src/lib/models";

const PHONES: Record<string, string> = { "forest-lawn": "4032715170", "the-district": "8252056390" };
const HOUSE_FAVOURITES = ["Beef Tapa", "Pork Tocino", "Crispy Sisig", "Ube French Toast", "Loco Moco"];

async function main() {
  if (!process.env.MONGODB_URI) { console.error("MONGODB_URI is not set."); process.exit(1); }
  await connectDB();

  for (const [slug, phone] of Object.entries(PHONES)) {
    const r = await Location.updateOne({ slug }, { $set: { phone } });
    console.log(`Location ${slug}: phone ${r.matchedCount ? "updated" : "NOT FOUND"}`);
  }

  const del = await MenuItem.deleteMany({ name: /^buko pandan pancake$/i });
  console.log(`Buko Pandan Pancake removed: ${del.deletedCount}`);

  const classics = await MenuCategory.findOne({ slug: "the-classics" }).select("_id").lean<{ _id: unknown }>();
  if (classics) {
    const last = await MenuItem.findOne({ category: classics._id }).sort({ order: -1 }).select("order").lean<{ order: number }>();
    const r = await MenuItem.updateOne(
      { category: classics._id, name: "Lemon Ricotta Pancake" },
      { $setOnInsert: { category: classics._id, name: "Lemon Ricotta Pancake", description: "Fluffy ricotta pancakes with a bright touch of lemon.", priceCents: null, signature: false, featured: false, available: true, published: true, dietary: [], order: (last?.order ?? 0) + 1 } },
      { upsert: true },
    );
    console.log(`Lemon Ricotta Pancake: ${r.upsertedCount ? "added" : "already exists"}`);
  } else console.log("Category 'the-classics' not found: Lemon Ricotta Pancake NOT added.");

  await MenuItem.updateMany({}, { $set: { signature: false } });
  const sig = await MenuItem.updateMany({ name: { $in: HOUSE_FAVOURITES } }, { $set: { signature: true } });
  console.log(`House favourites set: ${sig.modifiedCount} of ${HOUSE_FAVOURITES.length}`);
  await mongoose.disconnect();
}
main().catch((e) => { console.error(e); process.exit(1); });
