import { BUSINESS, mapsDirectionsUrl } from "./content";
import { env } from "./env";
import { formatTime12, DAY_NAMES, type DayHours } from "./hours";
import type { PubLocation } from "./data";

function spec(weekly: DayHours[]) {
  return weekly
    .map((d, i) => ({ d, i }))
    .filter(({ d }) => !d.closed && d.open && d.close)
    .map(({ d, i }) => ({ "@type": "OpeningHoursSpecification", dayOfWeek: DAY_NAMES[i], opens: d.open, closes: d.close }));
}

/** Restaurant structured data. Only verified facts: no ratings, prices or awards. */
export function restaurantJsonLd(locations: PubLocation[]) {
  return locations.map((l) => ({
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: `${BUSINESS.name} (${l.name})`,
    url: env.siteUrl,
    telephone: `+1${BUSINESS.phone}`,
    email: BUSINESS.email,
    servesCuisine: ["Breakfast", "Brunch", "Filipino"],
    address: { "@type": "PostalAddress", streetAddress: l.street, addressLocality: l.city, addressRegion: l.region, postalCode: l.postalCode, addressCountry: "CA" },
    hasMap: mapsDirectionsUrl(l),
    openingHoursSpecification: l.hoursConfirmed ? spec(l.weekly) : undefined,
    sameAs: Object.values(BUSINESS.social),
  }));
}

export { formatTime12 };
