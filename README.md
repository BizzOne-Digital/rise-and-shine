# Rise N’ Shine Breakfast Place

One Next.js 15 project (App Router, TypeScript, Tailwind, Motion, MongoDB Atlas via Mongoose, Zod). Public site and admin portal run in the same process: **there is no separate backend.**

## 1. Install and run

```bash
npm install
npx next dev        # or: npm run dev
```

Open http://localhost:3000. Without any configuration the public site runs in **preview mode** with verified built-in content. Forms are disabled with a clear message and nothing is ever reported as saved. `/admin` needs the database and an auth secret.

Production: `npm run build` then `npm start`.

Other scripts: `npm run typecheck`, `npm run lint`, `npm test`, `npm run seed`, `npm run create-admin`.

## 2. Connect MongoDB Atlas

1. Create a free cluster at https://cloud.mongodb.com, create a database user, and under Network Access allow your IP (or `0.0.0.0/0` for serverless hosts such as Vercel).
2. Connect, Drivers, copy the connection string (URL-encode special characters in the password).
3. `copy .env.example .env.local` and set `MONGODB_URI`, `MONGODB_DB_NAME`, and `AUTH_SECRET` (32+ random characters):
   `node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"`
4. Seed verified content (safe to re-run, never overwrites edits): `npm run seed`

The seed adds both locations, 2 menu categories, 29 menu items (no prices), 5 services and site settings. It does **not** add reviews, team members, prices or photos.

## 3. Create the first admin

```bash
npm run create-admin
```

It prompts for an email and a hidden password (12+ characters). Or pass `ADMIN_EMAIL` and `ADMIN_PASSWORD` inline. Use `-- --reset` to reset an existing admin password. There is no public registration and no default credentials. Sign in at `/admin/login`. Accounts lock for 15 minutes after 5 failed attempts, and sign-in is rate limited per IP.

## 4. Image uploads and optional email

- **Uploads need no extra service.** Admin images are stored in MongoDB (collection `StoredUpload`) and served from `/api/uploads/<folder>/<file>`, so they survive redeploys and work on Vercel or any read-only host. Nothing is written to disk. Limits: JPEG, PNG, WebP or GIF, 8 MB, real file type checked from the bytes. Only the URL string is saved on a product. Replacing, removing or deleting a product deletes the old stored image.
- Email notifications to staff are optional (Resend): set `RESEND_API_KEY`, `NOTIFY_EMAIL_FROM`, `NOTIFY_EMAIL_TO`. If absent, requests are still saved and no message ever claims an email was sent.

## 5. How things work

- **Menu prices** are stored as integer cents. A dish with no verified price shows “Price on request” and is easy to spot in Admin, Products (grey “No price” tag).
- **Hours** are per location with holiday overrides, in America/Edmonton. Booking requests are validated against them plus party size, notice and advance limits. This is a request flow, not live availability.
- **Admin scope**: the admin has two sections only. **Products** (add, edit, delete, with image upload) and **Orders** (the table booking requests customers send; view and delete only). Services, locations, hours and team content are fixed seeded/public content with no admin screens.
- **Security**: signed HttpOnly session cookie (jose, HS256, 8h) re-checked against the database on every request; middleware plus `requireAdmin()` inside every server action and the upload route; bcrypt (cost 12); Zod validation with explicit field picking (no mass assignment); Mongo-backed rate limits (login, bookings); honeypot and timing spam checks; duplicate-submission handling; admin routes `noindex`.
- **Motion**: Motion for React everywhere, `reducedMotion="user"`, parallax only on fine-pointer desktops, transform/opacity only, content visible without JS.

See `LAUNCH_CHECKLIST.md` for missing content, and `ASSETS.md` for imagery and licensing.
