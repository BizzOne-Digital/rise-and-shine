/* Adds the client's real 5-star Google reviews (copied from the client's Google profile, shared by the client on 2026-11-21)
 * as APPROVED testimonials. Idempotent: running it again does not create duplicates.   Run:  npm run add-testimonials
 * Names are shown as first name + last initial. Text is exactly as written by the reviewer. */
import { config } from "dotenv";
import { createHash } from "crypto";
import mongoose from "mongoose";
config({ path: ".env.local" });
config();
import { connectDB } from "../src/lib/db";
import { Testimonial } from "../src/lib/models";

const REVIEWS: { authorName: string; body: string; featured?: boolean }[] = [
  { authorName: "Daniel M.", featured: true, body: "Best breakfast steak in Calagry hands down. Amazing breakfast great variety. Very Clean and good staff , but it does get busy. Love the filipino options mixed in with some canadian flavor." },
  { authorName: "Sidney S.", featured: true, body: "Love this place!! My boyfriend and I came for brunch and the food and service was spectacular!! Highly recommend :)" },
  { authorName: "Tatiana K.", featured: true, body: "I am obsessed with the Filipino food now. This was delicious. The location was busy. Must be everyone is finding it good. Quite a wait but totally worth it." },
  { authorName: "Karl B.", body: "The food was great! The fried pork belly was crispy and delicious, and the pork sisig is definitely a must-try. The fried marinated bangus was flavorful and cooked perfectly. The garlic rice was also perfect and paired really well with everything.\n\nI definitely wouldn't mind coming back to try the other dishes on the menu. Highly recommended!" },
  { authorName: "Steve O.", body: "During a 14 hour layover in Calgary with my Filipina fiancé and stopped in for breakfast. Impressed both of us!\nFood spot on and authentic. The young lady working the tables was very efficient, conscientious, and handled a very full service prefectly.\nI highly recommend 👌!" },
  { authorName: "Nicholas L.", body: "Super interesting genre of food, and very delicious! Would definitely recommend because it is a very unique experience." },
];

async function main() {
  if (!process.env.MONGODB_URI) { console.error("MONGODB_URI is not set."); process.exit(1); }
  await connectDB();
  for (const r of REVIEWS) {
    const dedupeKey = createHash("sha256").update(`${r.authorName}|${r.body}`.toLowerCase()).digest("hex");
    const res = await Testimonial.updateOne(
      { dedupeKey },
      { $setOnInsert: { authorName: r.authorName, body: r.body, visitedLocation: "", source: "admin", status: "approved", featured: !!r.featured, rating: 5, dedupeKey } },
      { upsert: true },
    );
    console.log(`${r.authorName}: ${res.upsertedCount ? "added" : "already exists"}`);
  }
  await mongoose.disconnect();
}
main().catch((e) => { console.error(e); process.exit(1); });
