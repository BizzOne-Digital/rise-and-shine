/* One-off, idempotent sync of the menu with the client's PDF (Menu 250625.pdf) into an EXISTING database.
 * (seed.ts never overwrites existing records, so already-seeded data must be updated here.)
 * Run once against the target database:  npm run sync-menu-from-pdf
 * Changes: updates dish descriptions to the PDF wording (Philly Steak Benedict uses "Roast beef" as the client asked,
 *          Classic Breakfast lists longanisa as a meat choice), adds the "Starters & Salads" and "Desserts" categories
 *          and seven dishes that have photos: Fried Pork Belly, Grilled Chicken Benedict, Crispy Chicken Wrap,
 *          Banana Walnut Waffle, Summer Salad, Leche Flan, Ube Bread Pudding. No prices are added. */
import { config } from "dotenv";
import mongoose from "mongoose";
config({ path: ".env.local" });
config();
import { connectDB } from "../src/lib/db";
import { MenuCategory, MenuItem } from "../src/lib/models";

const UPDATED: Record<string, string> = {
  "Daing na Bangus": "House marinated milkfish with vinegar and spices, served with garlic rice, fried egg and mango salsa.",
  "Ube French Toast": "Soft slices of ube-infused white bread soaked in a spiced milk and egg mix, layered with creamy ube cream cheese, topped with fluffy meringue, fried banana, and fresh strawberry slices, then drizzled with sweet condensed milk.",
  "Tapa Poutine": "All time favorite tapa, hashbrowns, curd cheese, 2 soft poached eggs, hollandaise sauce and choice of toast.",
  "Classic Breakfast": "Choice of maple pork sausage, chicken apple sausage, bacon, longanisa or chorizo, 2 fried eggs, hashbrowns and choice of toast or classic pancake.",
  "French Toast": "White toast dipped in the richness of milk, eggs, nutmeg and cinnamon, topped with cream cheese and fruits served with whipped cream and maple syrup.",
  "Loco Moco": "Grilled hamburger patty over garlic hawaiian rice, caramelized mushroom, topped with bacon jam, gravy and 2 fried eggs.",
  "Philly Steak Poutine": "Sliced steak, mushrooms, red pepper, onion, smothered with alfredo sauce, hashbrowns, curd cheese, 2 soft poached eggs, hollandaise sauce and choice of toast.",
  "Breakfast Poutine": "Hashbrowns, choice of meat, curd cheese, 2 soft poached eggs, hollandaise sauce and choice of toast.",
  "Philly Steak Benedict": "Roast beef, mushroom, onions, red pepper smothered with alfredo sauce, on a homemade waffle, topped with 2 soft poached eggs, hollandaise sauce, hashbrowns and fruits.",
  "Avocado Toast": "Sourdough toast topped with fresh avocado, caprese salad, 2 medium poached eggs and served with your choice of side salad.",
  "Banana Nutella Waffle": "Waffle filled with banana, topped with nutella.",
  "Lemon Ricotta Pancake": "Buttermilk pancake filled with lemon ricotta, topped with fruits, pumpkin seeds and flax oats with white chocolate chips and drizzled with white chocolate sauce."
};
const NEW_CATEGORIES = [
  {
    "slug": "starters-salads",
    "name": "Starters & Salads",
    "blurb": "Fresh, crisp and made to go with breakfast.",
    "order": 3
  },
  {
    "slug": "desserts",
    "name": "Desserts",
    "blurb": "Something sweet to finish.",
    "order": 4
  }
];
const NEW_ITEMS: [string, string, string][] = [
  [
    "filipino-inspired",
    "Fried Pork Belly",
    "Marinated with favorite spices, fresh seasonal veggie, gravy and choice of mashed potato, garlic rice or plain rice."
  ],
  [
    "the-classics",
    "Grilled Chicken Benedict",
    "Grilled chicken, baby spinach, pesto, feta cheese on a waffle, 2 soft poached eggs, hollandaise sauce, hashbrowns and fruits."
  ],
  [
    "the-classics",
    "Crispy Chicken Wrap",
    "Crispy chicken, lettuce, tomato, mixed cheese, smothered with your choice of spicy thai, ranch or caesar, served with french fries or salad."
  ],
  [
    "the-classics",
    "Banana Walnut Waffle",
    "Waffle filled with banana, walnut, topped with fresh banana and roasted walnut, drizzled with caramel sauce."
  ],
  [
    "starters-salads",
    "Summer Salad",
    "Mix greens with candied almonds, cucumber, tomatoes, strawberry, tossed with raspberry vinaigrette, topped with feta."
  ],
  [
    "desserts",
    "Leche Flan",
    "Rich and creamy flan with caramelized sugar."
  ],
  [
    "desserts",
    "Ube Bread Pudding",
    "A Filipino twist on a classic dessert: soft bread, ube custard and sweet drizzle, served with vanilla ice cream."
  ]
];

const exact = (name: string) => new RegExp("^" + name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "$", "i");

async function main() {
  if (!process.env.MONGODB_URI) { console.error("MONGODB_URI is not set."); process.exit(1); }
  await connectDB();

  for (const [name, description] of Object.entries(UPDATED)) {
    const r = await MenuItem.updateOne({ name: exact(name) }, { $set: { description } });
    console.log(`Description ${r.matchedCount ? "updated" : "NOT FOUND"}: ${name}`);
  }

  for (const k of NEW_CATEGORIES) {
    const r = await MenuCategory.updateOne({ slug: k.slug }, { $setOnInsert: { ...k, published: true } }, { upsert: true });
    console.log(`Category ${k.name}: ${r.upsertedCount ? "added" : "already exists"}`);
  }

  for (const [slug, name, description] of NEW_ITEMS) {
    const cat = await MenuCategory.findOne({ slug }).select("_id").lean<{ _id: unknown }>();
    if (!cat) { console.log(`Category '${slug}' not found: ${name} NOT added.`); continue; }
    const last = await MenuItem.findOne({ category: cat._id }).sort({ order: -1 }).select("order").lean<{ order: number }>();
    const r = await MenuItem.updateOne(
      { category: cat._id, name: exact(name) },
      { $setOnInsert: { category: cat._id, name, description, priceCents: null, signature: false, featured: false, available: true, published: true, order: (last?.order ?? 0) + 1 } },
      { upsert: true },
    );
    console.log(`${name}: ${r.upsertedCount ? "added" : "already exists"}`);
  }
  await mongoose.disconnect();
}
main().catch((e) => { console.error(e); process.exit(1); });
