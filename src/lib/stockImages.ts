// AI-created concept imagery (see public/images/site-collection-v1/prompts.json). These are illustrative, NOT photographs of the
// restaurant's actual dishes, rooms or people. The UI labels them "Illustrative" and an uploaded photo always takes priority.
const B = "/images/site-collection-v1/";

const C = "/images/classic-menu-v1/";
const CLASSIC: Record<string, string> = {
  "classic breakfast": "01-classic-breakfast.png",
  "french toast": "02-french-toast.png",
  "loco moco": "03-loco-moco.png",
  "philly steak poutine": "04-philly-steak-poutine.png",
  "breakfast poutine": "05-breakfast-poutine.png",
  "philly steak benedict": "06-philly-steak-benedict.png",
  "classic benedict": "07-classic-benedict.png",
  "spicy steak benedict": "08-spicy-steak-benedict.png",
  "veggie benedict": "09-veggie-benedict.png",
  "farmers omelette": "10-farmers-omelette.png",
  "all meat omelette": "11-all-meat-omelette.png",
  "veggie omelette": "12-veggie-omelette.png",
  "ham & cheese omelette": "13-ham-cheese-omelette.png",
  "avocado toast": "14-avocado-toast.png",
  "chorizo breakfast wrap": "15-chorizo-breakfast-wrap.png",
  "blt egg wrap": "16-blt-egg-wrap.png",
  "banana nutella waffle": "17-banana-nutella-waffle.png",
  "choco banana pancake": "18-choco-banana-pancake.png",
};

const P = "/images/menu-products-v1/";

export const IMG = {
  sisig: P + "crispy-sisig.png",
  bangus: P + "daing-na-bangus.png",
  longga: P + "longga-breakfast-sandwich.png",
  steak: P + "sunrise-steak.png",
  hero: B + "01-breakfast-hero.png",
  ube: B + "02-ube-french-toast.png",
  tapa: B + "03-beef-tapa.png",
  tocino: B + "04-pork-tocino.png",
  longanisa: B + "05-longanisa.png",
  benedict: B + "06-benedict-waffle.png",
  pandan: B + "07-pandan-pancakes.png",
  ensaymada: B + "08-ensaymada-waffle.png",
  poutine: B + "09-breakfast-poutine.png",
  avocado: B + "10-avocado-toast.png",
  coffee: B + "11-coffee-and-juice.png",
  catering: B + "12-catering-spread.png",
  interior: B + "13-cafe-interior.png",
  family: B + "14-family-breakfast.png",
  chef: B + "15-chef-finishing-dish.png",
} as const;

/** Real photos of our own dishes, supplied by the restaurant. Keyed by lower-case dish name. */
const REAL_PHOTOS: Record<string, string> = {
  "beef tapa": "/images/dishes/beef-tapa.jpg",
  "ube french toast": "/images/dishes/ube-french-toast.jpg",
  "crispy sisig": "/images/dishes/crispy-sisig.png",
  "pork tocino": "/images/dishes/pork-tocino.png",
  "loco moco": "/images/dishes/loco-moco.png",
};
export const realPhotoFor = (name: string): string | null => REAL_PHOTOS[name.toLowerCase()] ?? null;

/** Concept image for a dish by name, only where the picture genuinely matches the dish type. */
export function conceptFor(name: string): string | null {
  const n = name.toLowerCase();
  if (CLASSIC[n]) return C + CLASSIC[n];
  if (n === "ube french toast") return IMG.ube;
  if (n === "beef tapa") return IMG.tapa;
  if (n === "pork tocino") return IMG.tocino;
  if (n === "longanisa") return IMG.longanisa;
  if (n === "buko pandan pancake") return IMG.pandan;
  if (n === "ensaymada waffle") return IMG.ensaymada;
  if (n === "avocado toast") return IMG.avocado;
  if (n === "crispy sisig") return IMG.sisig;
  if (n === "daing na bangus") return IMG.bangus;
  if (n === "longga breakfast sandwich") return IMG.longga;
  if (n === "sunrise steak") return IMG.steak;
  if (n.includes("benedict")) return IMG.benedict;
  if (n.includes("poutine")) return IMG.poutine;
  return null;
}

export const SERVICE_IMG: Record<string, string> = {
  "breakfast-brunch": IMG.benedict,
  reservations: IMG.interior,
  catering: IMG.catering,
  "custom-orders": IMG.chef,
  "groups-events": IMG.family,
};
export const serviceImage = (slug: string) => SERVICE_IMG[slug] ?? IMG.catering;

/** Product/team image URL from the database. Only images served by /api/uploads are trusted; legacy /uploads/... URLs
 *  (from a read-only filesystem era) return null so the UI falls back to the placeholder. */
export function resolveImage(url: string | null | undefined): string | null {
  return typeof url === "string" && url.startsWith("/api/uploads/") ? url : null;
}
