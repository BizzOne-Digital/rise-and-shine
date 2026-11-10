// Verified public business content, sourced from https://www.risenshineyyc.com/ (menu, services, contact, home)
// and the owner's brief. Used for the seed script AND as the no-database public preview.
// NOTE: no menu prices are published here: none could be verified from the existing site HTML.
import type { DayHours, HolidayOverride } from "./hours";

export const BUSINESS = {
  name: "Rise N’ Shine Breakfast Place",
  email: "rnsbreakfast@gmail.com",
  phone: "4037076529",
  phoneDisplay: "(403) 707-6529",
  handle: "@rnsbreakfastplace",
  // Linked from the existing official website (re-verify before launch; see LAUNCH_CHECKLIST.md)
  social: {
    instagram: "https://instagram.com/rnsbreakfastplace",
    facebook: "https://facebook.com/rnsbreakfastplace",
    tiktok: "https://tiktok.com/@rnsbreakfastplace",
  },
  googleReviewUrl: "https://g.page/r/CYRsgTkp6YKiEAE/review",
  // One Google review link per location. TODO: replace with each location's own review link.
  reviewLinks: [
    { name: "Forest Lawn", url: "https://g.page/r/CYRsgTkp6YKiEAE/review" },
    { name: "The District", url: "https://g.page/r/CYRsgTkp6YKiEAE/review" },
  ],
  servingSince: 2020, // About page: "proudly serving the Calgary area and beyond as early as 2020"
};

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
    phone: "4032716517", email: BUSINESS.email, order: 1, weekly: generalWeekly, overrides: [], hoursConfirmed: false,
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
];

export type SeedItem = { category: string; name: string; description: string; signature?: boolean };
export const ITEMS: SeedItem[] = [
  { category: "filipino-inspired", name: "Beef Tapa", signature: true, description: "House marinated beef strips, served with garlic rice, fried egg and mango salsa." },
  { category: "filipino-inspired", name: "Pork Tocino", description: "Pan fried sugar-cured pork, served with garlic rice, fried egg and mango salsa." },
  { category: "filipino-inspired", name: "Longanisa", description: "Sweet skinless sausage made of ground pork and served with garlic rice, fried egg and mango salsa." },
  { category: "filipino-inspired", name: "Daing na Bangus", description: "Milkfish house marinated with vinegar and spices, served with garlic rice, fried egg and mango salsa." },
  { category: "filipino-inspired", name: "Longga Breakfast Sandwich", description: "Double longanisa patty, cheddar cheese, tomato, avocado, on croissant with spicy garlic aioli. Served with hashbrown or salad." },
  { category: "filipino-inspired", name: "Crispy Sisig", signature: true, description: "Spicy crispy pork belly with red and green pepper, red onion, tossed with mayo and served with garlic rice and fried egg." },
  { category: "filipino-inspired", name: "Ube French Toast", signature: true, description: "Ube white toast dipped in milk, eggs, nutmeg and cinnamon mixture with ube cream cheese and drizzled with condensed milk." },
  { category: "filipino-inspired", name: "Tapa Poutine", signature: true, description: "All time favorite beef tapa, hashbrowns, curd cheese, 2 poached eggs, hollandaise sauce and choice of toast." },
  { category: "filipino-inspired", name: "Ensaymada Waffle", signature: true, description: "Filipino inspired pastry topped with sweet cream cheese, and grated cheese." },
  { category: "filipino-inspired", name: "Sunrise Steak", description: "Grilled 6oz-7oz sirloin steak, served with garlic rice or hashbrown, fried egg, mango salsa and gravy." },
  { category: "the-classics", name: "Classic Breakfast", signature: true, description: "Choice of bacon, maple sausage, apple sausage or ham, 2 fried eggs, hashbrowns and choice of toast or classic pancake." },
  { category: "the-classics", name: "French Toast", description: "White toast dipped in the richness of milk, eggs, nutmeg and cinnamon, topped with cream cheese. Served with fruits, whipped cream and maple syrup." },
  { category: "the-classics", name: "Loco Moco", description: "Grilled hamburger patty over garlic hawaiian rice, caramelized mushroom, onions, topped with bacon jam, gravy and 2 fried eggs." },
  { category: "the-classics", name: "Philly Steak Poutine", description: "Sliced steak, mushrooms, red pepper, onion, smothered with alfredo sauce, hashbrowns, curd cheese, 2 poached eggs, hollandaise sauce and choice of toast." },
  { category: "the-classics", name: "Breakfast Poutine", description: "Hashbrowns, choice of meat, curd cheese, 2 poached eggs, hollandaise sauce and choice of toast." },
  { category: "the-classics", name: "Philly Steak Benedict", description: "Sliced steak, mushroom, onions, red pepper and smothered with alfredo sauce, on a homemade waffle, topped with 2 soft poached eggs, hollandaise sauce, hashbrowns and fruits." },
  { category: "the-classics", name: "Classic Benedict", description: "Shaved ham on a waffle, 2 soft poached eggs, hollandaise sauce, hashbrowns and fruits." },
  { category: "the-classics", name: "Spicy Steak Benedict", description: "Spicy horseradish steak, mushrooms, onions, on a homemade waffle, topped with 2 soft poached eggs, hollandaise sauce, hashbrowns and fruits." },
  { category: "the-classics", name: "Veggie Benedict", description: "Grilled asparagus, tomato, mushroom, onion, spinach on a homemade waffle, topped with 2 soft poached eggs, hollandaise sauce, hashbrowns and fruits." },
  { category: "the-classics", name: "Farmers Omelette", description: "Chopped chorizo, ham, bacon, onions, tomatoes, red and green peppers, mushrooms and mixed cheese, served with hashbrowns or salad and choice of toast." },
  { category: "the-classics", name: "All Meat Omelette", description: "Ham, chorizo, bacon, maple sausage, mixed cheese, served with hashbrowns or salad and choice of toast." },
  { category: "the-classics", name: "Veggie Omelette", description: "Grilled asparagus, red and green peppers, onions, mushroom, tomatoes, spinach and mixed cheese, served with hashbrowns or salad, and choice of toast." },
  { category: "the-classics", name: "Ham & Cheese Omelette", description: "Chopped ham, mixed cheese, served with hashbrowns or salad and choice of toast." },
  { category: "the-classics", name: "Avocado Toast", description: "Two slices of multigrain bread, fresh avocado, tomatoes, toasted almonds, 2 fried eggs and choice of salad." },
  { category: "the-classics", name: "Chorizo Breakfast Wrap", description: "Spicy chorizo, red onion, jalapeno, lettuce, tomato, scrambled eggs with green onion, mixed cheese, ranch, wrapped in whole wheat tortilla. Served with hashbrowns or salad." },
  { category: "the-classics", name: "BLT Egg Wrap", description: "Bacon, lettuce, tomato, scrambled eggs, mayo, mixed cheese, wrapped in whole wheat tortilla. Served with hashbrowns or salad." },
  { category: "the-classics", name: "Banana Nutella Waffle", description: "Waffle filled with banana, topped with Nutella." },
  { category: "the-classics", name: "Choco Banana Pancake", description: "Chocolate pancake filled with banana and chocolate chip." },
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

type Addr = { street: string; city: string; region: string; postalCode: string };
const q = (l: Addr) => `${l.street}, ${l.city}, ${l.region} ${l.postalCode}`;
export const mapsDirectionsUrl = (l: Addr) => `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(q(l))}`;
export const mapsEmbedUrl = (l: Addr) => `https://www.google.com/maps?q=${encodeURIComponent(q(l))}&output=embed`;
