// Runs only when TEST_MONGODB_URI points at a disposable MongoDB. Example:
//   TEST_MONGODB_URI=mongodb://127.0.0.1:27017/ npm test
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

const URI = process.env.TEST_MONGODB_URI;
let admin = true;

vi.mock("next/headers", () => ({ headers: async () => new Headers({ "x-forwarded-for": "1.2.3.4" }), cookies: async () => ({ get: () => undefined, set() {}, delete() {} }) }));
vi.mock("next/cache", () => ({ revalidatePath: () => {} }));
vi.mock("next/navigation", () => ({ redirect: () => { throw new Error("redirect"); } }));
vi.mock("@/lib/auth", async () => {
  class UnauthorizedError extends Error {}
  return { UnauthorizedError, requireAdmin: async () => { if (!admin) throw new UnauthorizedError(); return { id: "1", email: "owner@example.com", name: "Owner" }; } };
});

const PNG = Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), Buffer.alloc(64, 7)]);

describe.skipIf(!URI)("integration against MongoDB", () => {
  let models: typeof import("@/lib/models");
  let pub: typeof import("@/app/actions");
  let adm: typeof import("@/app/admin/actions");
  let upload: typeof import("@/app/api/upload/route");
  let serve: typeof import("@/app/api/uploads/[folder]/[filename]/route");
  const fd = (o: Record<string, string>) => { const f = new FormData(); for (const [k, v] of Object.entries(o)) f.set(k, v); return f; };
  const nextWeekday = () => { let d = new Date(Date.now() + 14 * 86400000); while ([0, 6].includes(d.getUTCDay())) d = new Date(d.getTime() + 86400000); return d.toISOString().slice(0, 10); };
  const ts = () => String(Date.now() - 10_000);
  const booking = (o: Record<string, string> = {}) => fd({ location: "forest-lawn", name: "Sam Lee", email: "sam@example.com", phone: "403 555 0100", partySize: "4", date: nextWeekday(), time: "09:00", ts: ts(), website: "", ...o });
  const uploadReq = (file: File | null, folder: string) => {
    const f = new FormData();
    if (file) f.set("file", file);
    f.set("folder", folder);
    return new Request("http://localhost/api/upload", { method: "POST", body: f });
  };
  const png = (name = "a.png", type = "image/png") => new File([PNG], name, { type });

  beforeAll(async () => {
    process.env.MONGODB_URI = URI; process.env.MONGODB_DB_NAME = "rns-vitest"; process.env.AUTH_SECRET = "z".repeat(40);
    const { connectDB } = await import("@/lib/db");
    const m = await connectDB();
    await m.connection.dropDatabase();
    models = await import("@/lib/models");
    const { LOCATIONS } = await import("@/lib/content");
    for (const l of LOCATIONS) await models.Location.create({ ...l, published: true, acceptsBookings: true });
    pub = await import("@/app/actions");
    adm = await import("@/app/admin/actions");
    upload = await import("@/app/api/upload/route");
    serve = await import("@/app/api/uploads/[folder]/[filename]/route");
  });
  beforeEach(() => { admin = true; });

  it("persists a valid booking, dedupes repeats, and rejects bad requests", async () => {
    expect((await pub.submitBooking({}, booking())).ok).toBe(true);
    await pub.submitBooking({}, booking());
    expect(await models.BookingRequest.countDocuments({ email: "sam@example.com" })).toBe(1);
    const before = await models.BookingRequest.countDocuments();
    expect((await pub.submitBooking({}, booking({ time: "05:00", email: "a@example.com" }))).ok).toBeFalsy();
    expect((await pub.submitBooking({}, booking({ partySize: "500", email: "b@example.com" }))).ok).toBeFalsy();
    expect((await pub.submitBooking({}, booking({ website: "http://spam", email: "c@example.com" }))).ok).toBeFalsy();
    expect(await models.BookingRequest.countDocuments()).toBe(before);
  });

  it("upload API requires admin, validates folder/type/size/content, and stores in MongoDB", async () => {
    admin = false;
    expect((await upload.POST(uploadReq(png(), "products"))).status).toBe(401);
    expect((await upload.DELETE(new Request("http://localhost/api/upload?url=/api/uploads/products/x.png", { method: "DELETE" }))).status).toBe(401);
    admin = true;
    expect((await upload.POST(uploadReq(png(), "evil"))).status).toBe(400);
    expect((await upload.POST(uploadReq(null, "products"))).status).toBe(400);
    expect((await upload.POST(uploadReq(new File(["hello"], "a.txt", { type: "text/plain" }), "products"))).status).toBe(415);
    expect((await upload.POST(uploadReq(new File(["<svg onload=alert(1)>"], "a.png", { type: "image/png" }), "products"))).status).toBe(415); // wrong content
    expect((await upload.POST(uploadReq(new File([Buffer.alloc(8 * 1024 * 1024 + 1, 1)], "big.png", { type: "image/png" }), "products"))).status).toBe(413);

    const ok = await upload.POST(uploadReq(png(), "products"));
    const j = await ok.json();
    expect(ok.status).toBe(200);
    expect(j.success).toBe(true);
    expect(j.url).toMatch(/^\/api\/uploads\/products\/\d{13}-[0-9a-f]{12}\.png$/);
    const doc = await models.StoredUpload.findOne({ filename: j.filename }).lean<{ size: number; mimeType: string }>();
    expect(doc?.size).toBe(PNG.length);
    expect(doc?.mimeType).toBe("image/png");
  });

  it("serves stored images with long-lived cache headers and blocks traversal", async () => {
    const j = await (await upload.POST(uploadReq(png("b.png"), "gallery"))).json();
    const ctx = (folder: string, filename: string) => ({ params: Promise.resolve({ folder, filename }) });
    const res = await serve.GET(new Request("http://localhost" + j.url), ctx("gallery", j.filename));
    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toBe("image/png");
    expect(res.headers.get("Content-Length")).toBe(String(PNG.length));
    expect(res.headers.get("Cache-Control")).toBe("public, max-age=31536000, immutable");
    expect(Buffer.from(await res.arrayBuffer()).equals(PNG)).toBe(true);
    expect((await serve.GET(new Request("http://localhost/x"), ctx("gallery", "../products/" + j.filename))).status).toBe(404);
    expect((await serve.GET(new Request("http://localhost/x"), ctx("gallery", "a/b.png"))).status).toBe(404);
    expect((await serve.GET(new Request("http://localhost/x"), ctx("secrets", j.filename))).status).toBe(404);
    expect((await serve.GET(new Request("http://localhost/x"), ctx("gallery", "1-missing.png"))).status).toBe(404);
  });

  it("products: add, edit, replace image (old binary deleted), delete (binary deleted); needs admin", async () => {
    const cat = await models.MenuCategory.create({ slug: "t", name: "T" });
    const a = await (await upload.POST(uploadReq(png("1.png"), "products"))).json();
    const b = await (await upload.POST(uploadReq(png("2.png"), "products"))).json();
    const base = { name: "Test Dish", category: String(cat._id), description: "d", price: "12.5", available: "on", published: "on" };

    admin = false;
    expect((await adm.saveProduct({}, fd({ ...base, image: a.url }))).error).toMatch(/expired/);
    expect(await models.MenuItem.countDocuments({ name: "Test Dish" })).toBe(0);
    admin = true;

    expect((await adm.saveProduct({}, fd({ ...base, image: a.url }))).ok).toBe(true);
    let item = await models.MenuItem.findOne({ name: "Test Dish" });
    expect(item.priceCents).toBe(1250);
    expect(item.image).toBe(a.url); // only the URL string is stored on the product

    expect((await adm.saveProduct({}, fd({ ...base, id: String(item._id), name: "Test Dish 2", image: b.url }))).ok).toBe(true);
    item = await models.MenuItem.findById(item._id);
    expect(item.name).toBe("Test Dish 2");
    expect(await models.StoredUpload.exists({ filename: a.filename })).toBeNull(); // replaced image removed
    expect(await models.StoredUpload.exists({ filename: b.filename })).not.toBeNull();

    expect((await adm.saveProduct({}, fd({ ...base, name: "Bad", price: "0" }))).error).toMatch(/Price/);
    expect((await adm.saveProduct({}, fd({ ...base, name: "Bad2", image: "/uploads/legacy.png" }))).error).toMatch(/image/i);
    expect((await adm.saveProduct({}, fd({ ...base, name: "Bad3", image: "https://evil.example/x.png" }))).error).toMatch(/image/i);

    expect((await adm.saveProduct({}, fd({ ...base, id: String(item._id), name: "Test Dish 2", image: "" }))).ok).toBe(true); // remove image
    expect(await models.StoredUpload.exists({ filename: b.filename })).toBeNull();

    const c = await (await upload.POST(uploadReq(png("3.png"), "products"))).json();
    await adm.saveProduct({}, fd({ ...base, id: String(item._id), name: "Test Dish 2", image: c.url }));
    expect((await adm.deleteProduct({}, fd({ id: String(item._id) }))).ok).toBe(true);
    expect(await models.MenuItem.countDocuments({ name: "Test Dish 2" })).toBe(0);
    expect(await models.StoredUpload.exists({ filename: c.filename })).toBeNull(); // image removed with product
  });

  it("orders can only be deleted, and only by an admin", async () => {
    const o = await models.BookingRequest.findOne({ email: "sam@example.com" });
    admin = false;
    expect((await adm.deleteOrder({}, fd({ id: String(o._id) }))).error).toMatch(/expired/);
    expect(await models.BookingRequest.exists({ _id: o._id })).not.toBeNull();
    admin = true;
    expect((await adm.deleteOrder({}, fd({ id: String(o._id) }))).ok).toBe(true);
    expect(await models.BookingRequest.exists({ _id: o._id })).toBeNull();
    expect((await adm.deleteOrder({}, fd({ id: "nope" }))).error).toBeTruthy();
  });
});
