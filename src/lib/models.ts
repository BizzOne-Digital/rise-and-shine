import mongoose, { Schema, type Model } from "mongoose";

const opts = { timestamps: true } as const;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function model(name: string, schema: Schema<any>): Model<any> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (mongoose.models[name] as Model<any>) || mongoose.model(name, schema);
}

const dayHours = new Schema({ closed: Boolean, open: String, close: String }, { _id: false });
const override = new Schema({ date: String, closed: Boolean, open: String, close: String, note: String }, { _id: false });

export const AdminUser = model("AdminUser", new Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  name: { type: String, default: "" },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["admin"], default: "admin" },
  active: { type: Boolean, default: true },
  failedLogins: { type: Number, default: 0 },
  lockedUntil: Date,
  lastLoginAt: Date,
}, opts));

export const Location = model("Location", new Schema({
  slug: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  street: String, city: String, region: String, postalCode: String,
  phone: String, email: String,
  order: { type: Number, default: 0, index: true },
  published: { type: Boolean, default: true },
  weekly: [dayHours],
  overrides: [override],
  hoursConfirmed: { type: Boolean, default: false },
  acceptsBookings: { type: Boolean, default: true },
  rules: {
    minPartySize: { type: Number, default: 1 }, maxPartySize: { type: Number, default: 20 },
    minLeadMinutes: { type: Number, default: 120 }, maxAdvanceDays: { type: Number, default: 60 },
    slotMinutes: { type: Number, default: 30 }, lastSeatingBeforeCloseMinutes: { type: Number, default: 30 },
  },
}, opts));

export const MenuCategory = model("MenuCategory", new Schema({
  slug: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  blurb: { type: String, default: "" },
  order: { type: Number, default: 0, index: true },
  published: { type: Boolean, default: true },
}, opts));

export const MenuItem = model("MenuItem", new Schema({
  category: { type: Schema.Types.ObjectId, ref: "MenuCategory", required: true, index: true },
  name: { type: String, required: true },
  description: { type: String, default: "" },
  priceCents: { type: Number, default: null, min: 1 }, // null = no verified price (never 0)
  image: { type: String, default: "" }, // public URL, e.g. /api/uploads/products/<file>
  dietary: [String], // only verified labels
  signature: { type: Boolean, default: false },
  featured: { type: Boolean, default: false },
  available: { type: Boolean, default: true },
  published: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  locationOverrides: [new Schema({
    locationSlug: String, priceCents: { type: Number, default: null }, available: { type: Boolean, default: true },
  }, { _id: false })],
}, opts));

export const Service = model("Service", new Schema({
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  summary: { type: String, default: "" },
  cta: { type: String, enum: ["booking", "catering", "custom", "event", "menu"], default: "catering" },
  ctaLabel: { type: String, default: "Get in touch" },
  published: { type: Boolean, default: true },
  order: { type: Number, default: 0, index: true },
}, opts));

export const BookingRequest = model("BookingRequest", new Schema({
  location: { type: String, required: true, index: true }, // location slug
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  partySize: { type: Number, required: true },
  date: { type: String, required: true, index: true }, // YYYY-MM-DD (America/Edmonton)
  time: { type: String, required: true }, // HH:MM
  startsAt: { type: Date, required: true },
  notes: { type: String, default: "" },
  status: { type: String, enum: ["pending", "approved", "declined", "cancelled", "completed"], default: "pending", index: true },
  internalNotes: { type: String, default: "" },
  history: [new Schema({ status: String, at: Date, by: String, note: String }, { _id: false })],
  dedupeKey: { type: String, index: true },
}, opts));

export const Testimonial = model("Testimonial", new Schema({
  authorName: { type: String, required: true },
  body: { type: String, required: true },
  visitedLocation: { type: String, default: "" },
  source: { type: String, enum: ["website", "admin"], default: "website" }, // never labelled as Google
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending", index: true },
  featured: { type: Boolean, default: false },
  moderationNote: { type: String, default: "" }, // private
  contactEmail: { type: String, default: "" }, // private
  dedupeKey: { type: String, index: true },
}, opts));

export const TeamMember = model("TeamMember", new Schema({
  name: { type: String, required: true },
  role: { type: String, default: "" },
  bio: { type: String, default: "" },
  image: { type: String, default: "" },
  published: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
}, opts));

const storedUploadSchema = new Schema({
  folder: { type: String, required: true, enum: ["products", "gallery", "pages", "misc"] },
  filename: { type: String, required: true },
  mimeType: { type: String, required: true },
  size: { type: Number, required: true },
  data: { type: Buffer, required: true },
}, opts);
storedUploadSchema.index({ folder: 1, filename: 1 }, { unique: true });
export const StoredUpload = model("StoredUpload", storedUploadSchema);

export const SiteSettings = model("SiteSettings", new Schema({
  key: { type: String, default: "main", unique: true },
  menuPdfUrl: { type: String, default: "" }, // set only when a valid file exists
  hoursNote: { type: String, default: "" },
  bookingsEnabled: { type: Boolean, default: true },
}, opts));

const rateSchema = new Schema({
  key: { type: String, required: true, unique: true },
  count: { type: Number, default: 0 },
  expiresAt: { type: Date, required: true },
});
rateSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
export const RateLimit = model("RateLimit", rateSchema);
