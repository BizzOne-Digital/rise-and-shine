// Verified public business content, sourced from https://www.risenshineyyc.com/ (menu, services, contact, home)
// and the owner's brief. Used for the seed script AND as the no-database public preview.
// NOTE: no menu prices are published here: none could be verified from the existing site HTML.
import type { DayHours, HolidayOverride } from "./hours";

export const BUSINESS = {
  name: "Rise N’ Shine Breakfast Place",
  email: "rnsbreakfast@gmail.com",
  // No single business line: guests call the location they are visiting.
  phone: "4032715170",
  phoneDisplay: "(403) 271-5170 (Forest Lawn) or (825) 205-6390 (The District)",
  menuPdf: "/downloads/rise-n-shine-menu.pdf",
  handle: "@rnsbreakfastplace",
  // Linked from the existing official website (re-verify before launch; see LAUNCH_CHECKLIST.md)
  social: {
    instagram: "https://instagram.com/rnsbreakfastplace",
    facebook: "https://facebook.com/rnsbreakfastplace",
    tiktok: "https://tiktok.com/@rnsbreakfastplace",
  },
  googleReviewUrl: "https://g.page/r/CYRsgTkp6YKiEAE/review",
  // One Google review link per location (provided by the client).
  reviewLinks: [
    { name: "Forest Lawn", url: "https://g.page/r/CYRsgTkp6YKiEAE/review" },
    { name: "The District", url: "https://g.page/r/CZLtcWWMi9jdEAE/review" },
  ],
  servingSince: 2020, // About page: "proudly serving the Calgary area and beyond as early as 2020"
};

/** Opens a Gmail compose window addressed to the restaurant (works from a desktop browser without a mail app). */
export const gmailComposeUrl = (to: string = BUSINESS.email, subject = "") =>
  `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}${subject ? `&su=${encodeURIComponent(subject)}` : ""}`;

const generalWeekly: DayHours[] = [
  { closed: false, open: "08:00", close: "15:00" }, // Sun
  { closed: false, open: "07:00", close: "15:00" },
  { closed: false, open: "07:00", close: "15:00" },
  { closed: false, open: "07:00", close: "15:00" },
  { closed: false, open: "07:00", close: "15:00" },
  { closed: false, open: "07:00", close: "15:00" },
  { closed: false, open: "08:00", close: "15:00" }, // Sat
];

export type SeedLocation = {
  slug: string; name: string; street: string; city: string; region: string; postalCode: string;
  phone: string; email: string; order: number; weekly: DayHours[]; overrides: HolidayOverride[];
  hoursConfirmed: boolean;
};

// The current site publishes ONE hours block and does not assign it to a location, so both locations
// start with it flagged unconfirmed. The owner confirms per-location hours in Admin > Locations.
export const LOCATIONS: SeedLocation[] = [
  {
    slug: "forest-lawn", name: "Forest Lawn", street: "2014 36 ST SE", city: "Calgary", region: "AB", postalCode: "T2B 0X8",
    phone: "4032715170", email: BUSINESS.email, order: 1, weekly: generalWeekly, overrides: [], hoursConfirmed: false,
  },
  {
    slug: "the-district", name: "The District", street: "Unit 120 - 11064 14 ST NE", city: "Calgary", region: "AB", postalCode: "T3K 0Z8",
    phone: "8252056390", email: BUSINESS.email, order: 2, weekly: generalWeekly, overrides: [], hoursConfirmed: false,
  },
];

export const HOURS_NOTE = "Last order for dining 2:30pm, last order for take out 2:45pm.";

export type SeedCategory = { slug: string; name: string; blurb: string; order: number };
export const CATEGORIES: SeedCategory[] = [
  { slug: "filipino-inspired", name: "Filipino Inspired", blurb: "The dishes that set us apart: garlic rice, mango salsa, tapa, tocino and more.", order: 1 },
  { slug: "the-classics", name: "The Classics", blurb: "Breakfast favourites: benedicts, omelettes, poutines, wraps, waffles and pancakes.", order: 2 },
  { slug: "starters-salads", name: "Starters & Salads", blurb: "Fresh, crisp and made to go with breakfast.", order: 3 },
  { slug: "desserts", name: "Desserts", blurb: "Something sweet to finish.", order: 4 },
];

export type SeedItem = { category: string; name: string; description: string; signature?: boolean };
export const ITEMS: SeedItem[] = [
  { category: "filipino-inspired", name: "Beef Tapa", signature: true, description: "House marinated beef strips, served with garlic rice, fried egg and mango salsa." },
  { category: "filipino-inspired", name: "Pork Tocino", signature: true, description: "Pan fried sugar-cured pork, served with garlic rice, fried egg and mango salsa." },
  { category: "filipino-inspired", name: "Longanisa", description: "Sweet skinless sausage made of ground pork and served with garlic rice, fried egg and mango salsa." },
  { category: "filipino-inspired", name: "Daing na Bangus", description: "House marinated milkfish with vinegar and spices, served with garlic rice, fried egg and mango salsa." },
  { category: "filipino-inspired", name: "Longga Breakfast Sandwich", description: "Double longanisa patty, cheddar cheese, tomato, avocado, on croissant with spicy garlic aioli. Served with hashbrown or salad." },
  { category: "filipino-inspired", name: "Crispy Sisig", signature: true, description: "Spicy crispy pork belly with red and green pepper, red onion, tossed with mayo and served with garlic rice and fried egg." },
  { category: "filipino-inspired", name: "Ube French Toast", signature: true, description: "Soft slices of ube-infused white bread soaked in a spiced milk and egg mix, layered with creamy ube cream cheese, topped with fluffy meringue, fried banana, and fresh strawberry slices, then drizzled with sweet condensed milk." },
  { category: "filipino-inspired", name: "Tapa Poutine", description: "All time favorite tapa, hashbrowns, curd cheese, 2 soft poached eggs, hollandaise sauce and choice of toast." },
  { category: "filipino-inspired", name: "Ensaymada Waffle", description: "Filipino inspired pastry topped with sweet cream cheese, and grated cheese." },
  { category: "filipino-inspired", name: "Sunrise Steak", description: "Grilled 6oz-7oz sirloin steak, served with garlic rice or hashbrown, fried egg, mango salsa and gravy." },
  { category: "the-classics", name: "Classic Breakfast", description: "Choice of maple pork sausage, chicken apple sausage, bacon, longanisa or chorizo, 2 fried eggs, hashbrowns and choice of toast or classic pancake." },
  { category: "the-classics", name: "French Toast", description: "White toast dipped in the richness of milk, eggs, nutmeg and cinnamon, topped with cream cheese and fruits served with whipped cream and maple syrup." },
  { category: "the-classics", name: "Loco Moco", signature: true, description: "Grilled hamburger patty over garlic hawaiian rice, caramelized mushroom, topped with bacon jam, gravy and 2 fried eggs." },
  { category: "the-classics", name: "Philly Steak Poutine", description: "Sliced steak, mushrooms, red pepper, onion, smothered with alfredo sauce, hashbrowns, curd cheese, 2 soft poached eggs, hollandaise sauce and choice of toast." },
  { category: "the-classics", name: "Breakfast Poutine", description: "Hashbrowns, choice of meat, curd cheese, 2 soft poached eggs, hollandaise sauce and choice of toast." },
  { category: "the-classics", name: "Philly Steak Benedict", description: "Roast beef, mushroom, onions, red pepper smothered with alfredo sauce, on a homemade waffle, topped with 2 soft poached eggs, hollandaise sauce, hashbrowns and fruits." },
  { category: "the-classics", name: "Classic Benedict", description: "Shaved ham on a waffle, 2 soft poached eggs, hollandaise sauce, hashbrowns and fruits." },
  { category: "the-classics", name: "Spicy Steak Benedict", description: "Spicy horseradish steak, mushrooms, onions, on a homemade waffle, topped with 2 soft poached eggs, hollandaise sauce, hashbrowns and fruits." },
  { category: "the-classics", name: "Veggie Benedict", description: "Grilled asparagus, tomato, mushroom, onion, spinach on a homemade waffle, topped with 2 soft poached eggs, hollandaise sauce, hashbrowns and fruits." },
  { category: "the-classics", name: "Farmers Omelette", description: "Chopped chorizo, ham, bacon, onions, tomatoes, red and green peppers, mushrooms and mixed cheese, served with hashbrowns or salad and choice of toast." },
  { category: "the-classics", name: "All Meat Omelette", description: "Ham, chorizo, bacon, maple sausage, mixed cheese, served with hashbrowns or salad and choice of toast." },
  { category: "the-classics", name: "Veggie Omelette", description: "Grilled asparagus, red and green peppers, onions, mushroom, tomatoes, spinach and mixed cheese, served with hashbrowns or salad, and choice of toast." },
  { category: "the-classics", name: "Ham & Cheese Omelette", description: "Chopped ham, mixed cheese, served with hashbrowns or salad and choice of toast." },
  { category: "the-classics", name: "Avocado Toast", description: "Sourdough toast topped with fresh avocado, caprese salad, 2 medium poached eggs and served with your choice of side salad." },
  { category: "the-classics", name: "Chorizo Breakfast Wrap", description: "Spicy chorizo, red onion, jalapeno, lettuce, tomato, scrambled eggs with green onion, mixed cheese, ranch, wrapped in whole wheat tortilla. Served with hashbrowns or salad." },
  { category: "the-classics", name: "BLT Egg Wrap", description: "Bacon, lettuce, tomato, scrambled eggs, mayo, mixed cheese, wrapped in whole wheat tortilla. Served with hashbrowns or salad." },
  { category: "the-classics", name: "Banana Nutella Waffle", description: "Waffle filled with banana, topped with nutella." },
  { category: "the-classics", name: "Choco Banana Pancake", description: "Chocolate pancake filled with banana and chocolate chip." },
  { category: "the-classics", name: "Lemon Ricotta Pancake", description: "Buttermilk pancake filled with lemon ricotta, topped with fruits, pumpkin seeds and flax oats with white chocolate chips and drizzled with white chocolate sauce." },
  { category: "filipino-inspired", name: "Fried Pork Belly", description: "Marinated with favorite spices, fresh seasonal veggie, gravy and choice of mashed potato, garlic rice or plain rice." },
  { category: "the-classics", name: "Grilled Chicken Benedict", description: "Grilled chicken, baby spinach, pesto, feta cheese on a waffle, 2 soft poached eggs, hollandaise sauce, hashbrowns and fruits." },
  { category: "the-classics", name: "Crispy Chicken Wrap", description: "Crispy chicken, lettuce, tomato, mixed cheese, smothered with your choice of spicy thai, ranch or caesar, served with french fries or salad." },
  { category: "the-classics", name: "Banana Walnut Waffle", description: "Waffle filled with banana, walnut, topped with fresh banana and roasted walnut, drizzled with caramel sauce." },
  { category: "starters-salads", name: "Summer Salad", description: "Mix greens with candied almonds, cucumber, tomatoes, strawberry, tossed with raspberry vinaigrette, topped with feta." },
  { category: "desserts", name: "Leche Flan", description: "Rich and creamy flan with caramelized sugar." },
  { category: "desserts", name: "Ube Bread Pudding", description: "A Filipino twist on a classic dessert: soft bread, ube custard and sweet drizzle, served with vanilla ice cream." },
];

export type ServiceCta = "booking" | "catering" | "custom" | "event" | "menu";
export type SeedService = { slug: string; title: string; summary: string; cta: ServiceCta; ctaLabel: string; order: number };
export const SERVICES: SeedService[] = [
  { slug: "breakfast-brunch", title: "Breakfast & brunch dining", summary: "Fresh, home-style plates made daily, from Filipino-inspired favourites to breakfast classics.", cta: "menu", ctaLabel: "See the menu", order: 1 },
  { slug: "reservations", title: "Reservation requests", summary: "Send us your preferred location, date and time. Your table is confirmed only after the restaurant approves the request.", cta: "booking", ctaLabel: "Request a table", order: 2 },
  { slug: "catering", title: "Catering", summary: "Customized menus and hassle-free setup and cleanup for events big or small. This is an inquiry, not a table booking.", cta: "catering", ctaLabel: "Ask about catering", order: 3 },
  { slug: "custom-orders", title: "Custom orders", summary: "Tell us about your dietary preferences and tastes and we will work with you on an order made for you.", cta: "custom", ctaLabel: "Start a custom order inquiry", order: 4 },
  { slug: "groups-events", title: "Group gatherings & events", summary: "Planning a family brunch or a get-together? Send an event inquiry and the team will help you plan.", cta: "event", ctaLabel: "Send an event inquiry", order: 5 },
];

/** Confirmed location numbers. Applied on top of whatever is stored in the database, so the old personal number can never show. */
export const LOCATION_PHONES: Record<string, string> = { "forest-lawn": "4032715170", "the-district": "8252056390" };

export const formatPhone = (p: string) => p.replace(/\D/g, "").replace(/^(\d{3})(\d{3})(\d{4})$/, "($1) $2-$3");
export const telHref = (p: string) => `tel:+1${p.replace(/\D/g, "")}`;

type Addr = { street: string; city: string; region: string; postalCode: string };
const q = (l: Addr) => `${l.street}, ${l.city}, ${l.region} ${l.postalCode}`;
export const mapsDirectionsUrl = (l: Addr) => `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(q(l))}`;
export const mapsEmbedUrl = (l: Addr) => `https://www.google.com/maps?q=${encodeURIComponent(q(l))}&output=embed`;
