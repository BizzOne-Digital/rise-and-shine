# Imagery and licensing

**No real photographs of the restaurant are used yet.** The site uses (a) AI-created concept images (see "Site collection" below) and (b) original SVG illustrations (`src/components/Art.tsx`: `DishArt`, `SunArcs`) as fallbacks. Neither documents the restaurant’s actual food.

When the client supplies phone photos: Admin, Products (Image), upload (with alt text), then select the photo on the dish in Admin, Menu (and on team profiles). Menu cards, signature tiles and team portraits switch to the real photo automatically.

The hero background is `public/images/hero-bg.png` (supplied by the owner, AI concept imagery). Replace that file with a real photograph when available.

## Note about a separate prototype
A separate process created a root-level `app/` prototype (header and hero) and an AI-generated image at `public/images/breakfast-hero.png` while this project was being built. The prototype conflicted with `src/app` (Next.js prefers a root `app/`), so it was moved, not deleted, to `_archived-hero-prototype/`. Its AI image `public/images/breakfast-hero.png` is not used by the site.

## Site collection (15 images)
`public/images/site-collection-v1/` holds 15 AI-created concept images (see its `prompts.json` disclosure). They are used for the hero, signature dishes, menu cards (only where the picture matches the dish type), Filipino feature, story collage, services, filmstrip, page headers and the group call to action. Every use is labelled “Illustrative image”, and the footer explains it. They are **not** photographs of the restaurant’s real dishes, rooms or people. As real photos are uploaded in Admin, Products and attached to dishes, they automatically replace the illustrative image for that dish. Mapping lives in `src/lib/stockImages.ts`.

## Menu products (4 images)
`public/images/menu-products-v1/` has concept images for Crispy Sisig, Daing na Bangus, Longga Breakfast Sandwich and Sunrise Steak, mapped in `src/lib/stockImages.ts`. Same AI-concept disclosure and “Illustrative image” label as above.

## Classic menu (18 images)
`public/images/classic-menu-v1/` has one concept image for each of the 18 Classics dishes, mapped by dish name in `src/lib/stockImages.ts` (they take priority over the generic benedict/poutine/avocado pictures). Same AI-concept disclosure and “Illustrative image” label. The original `.zip` files in `public/images/` can be deleted; they are not used by the site.
