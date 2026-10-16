# Launch checklist: content and credentials still needed

## Credentials
- [ ] MongoDB Atlas connection string (`MONGODB_URI`) and `AUTH_SECRET`
- [ ] Production `NEXT_PUBLIC_SITE_URL`
- [ ] Optional: Resend API key plus sender and notification addresses
- [ ] First admin email and a strong password (created with `npm run create-admin`)

## Business content to confirm (none of this is invented or published until supplied)
- [ ] **All 29 menu prices (CAD).** The current website lists dishes without prices in its page text. The downloadable menu PDF (menu 250625.pdf on the old site) could not be read automatically, so its prices are unverified. Enter prices in Admin, Products. Until then dishes show “Price on request”.
- [ ] Optional full menu PDF: set `menuPdfUrl` in the `SiteSettings` document (no admin screen). The download link only appears when set.
- [ ] **Hours per location.** The existing site shows one hours block (Mon-Fri 7am-3pm, Sat-Sun 8am-3pm, holidays 9am-3pm, last order 2:30pm dining / 2:45pm take out) without saying which location it belongs to. Both locations are seeded with it and flagged “hours not confirmed” (the site then tells guests to call). Hours, holidays and booking rules have no admin screen now (admin = Products and Orders only): send the confirmed hours and they are updated in `src/lib/content.ts` / the database.
- [ ] Booking rules per location (party size 1-20, 2 hours’ notice, 60 days ahead, 30-minute slots are defaults).
- [ ] Per-location phone/email if different from (403) 707-6529 and rnsbreakfast@gmail.com.
- [ ] Social links: Instagram, Facebook and TikTok URLs were taken from the existing website but not live-checked. Confirm they are correct (the existing site also lists X as x.com/@rnsbreakfast, not linked here).
- [ ] “Serving Calgary since 2020”: the existing About page says “as early as 2020”. Confirm wording.
- [ ] The existing menu has no dietary information. No dietary claims are published. Add verified labels per dish if wanted.
- [ ] Verify the Google review link (g.page/r/CYRsgTkp6YKiEAE/review) from the existing About page still works.
- [ ] Team: names, roles, bios and portraits with consent. The team page shows “coming soon” until profiles exist (no admin screen; needs a database entry).
- [ ] Testimonials: none published (no submission form or admin screen now; the page links to Google reviews).
- [ ] Real food photographs: upload them in Admin, Products (they replace the illustrative pictures automatically).
- [ ] Privacy statement and terms (the old site referenced them, they were not found). Add pages if required.
- [ ] Decide whether `/specials` (linked from the old Services page) exists; it is not part of this build.
