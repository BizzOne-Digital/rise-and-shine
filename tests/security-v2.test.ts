import { readFileSync, readdirSync, statSync } from "fs";
import path from "path";
import { describe, expect, it } from "vitest";
import { signSession, verifySession } from "@/lib/session";
import { bookingSchema, looksLikeSpam } from "@/lib/validation";
import { isSafeFilename, makeFilename, parseUploadUrl, sniffImage } from "@/lib/uploads";
import { formatCAD, parsePriceToCents } from "@/lib/money";

const SECRET = "x".repeat(40);

describe("admin session tokens", () => {
  it("round-trips a valid token", async () => {
    const t = await signSession("abc123", SECRET);
    expect(await verifySession(t, SECRET)).toBe("abc123");
  });
  it("rejects missing, tampered and wrongly-signed tokens", async () => {
    const t = await signSession("abc123", SECRET);
    expect(await verifySession(undefined, SECRET)).toBeNull();
    expect(await verifySession(t.slice(0, -3) + "abc", SECRET)).toBeNull();
    expect(await verifySession(t, "y".repeat(40))).toBeNull();
    expect(await verifySession("not.a.jwt", SECRET)).toBeNull();
  });
});

function walk(dir: string, out: string[] = []) {
  for (const f of readdirSync(dir)) {
    const p = path.join(dir, f);
    if (statSync(p).isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}
const slash = (p: string) => p.split(path.sep).join("/");

describe("authorization is enforced server-side", () => {
  const actions = readFileSync("src/app/admin/actions.ts", "utf8");
  it("run() requires an admin before executing any action body", () => {
    const run = actions.slice(actions.indexOf("async function run"), actions.indexOf("const f ="));
    expect(run.indexOf("requireAdmin()")).toBeGreaterThan(-1);
    expect(run.indexOf("requireAdmin()")).toBeLessThan(run.indexOf("fn(me)"));
  });
  it("every exported admin action delegates to run(), and only products/orders can be managed", () => {
    const all = [...actions.matchAll(/export async function (\w+)/g)].map((m) => m[1]);
    const guarded = [...actions.matchAll(/export async function (\w+)\([^)]*\)[^{]*\{\s*return run\(/g)].map((m) => m[1]);
    expect(all.sort()).toEqual(["deleteOrder", "deleteProduct", "saveProduct"]);
    expect(guarded.sort()).toEqual(all.sort());
    expect(actions).not.toMatch(/BookingRequest\.(updateOne|findByIdAndUpdate|create)/); // orders: delete only
  });
  it("admin has only Products and Orders pages; all are guarded", () => {
    const pages = walk("src/app/admin").map(slash).filter((f) => f.endsWith("page.tsx"));
    expect(pages.map((p) => p.split("src/app/admin/")[1]).sort()).toEqual(["(panel)/orders/page.tsx", "(panel)/page.tsx", "(panel)/products/page.tsx", "login/page.tsx"]);
    for (const p of pages.filter((x) => /orders|products/.test(x))) expect(readFileSync(p, "utf8"), p).toMatch(/requirePageAdmin\(\)/);
    expect(readFileSync("src/app/admin/(panel)/layout.tsx", "utf8")).toMatch(/requirePageAdmin\(\)/);
  });
  it("the upload API requires admin on POST and DELETE, and never writes to disk", () => {
    const up = readFileSync("src/app/api/upload/route.ts", "utf8");
    expect((up.match(/await admin\(\)/g) ?? []).length).toBe(2);
    expect(up).toMatch(/requireAdmin\(\)/);
    for (const f of ["src/app/api/upload/route.ts", "src/lib/uploads.ts", "src/app/api/uploads/[folder]/[filename]/route.ts"]) {
      expect(readFileSync(f, "utf8"), f).not.toMatch(/writeFile|createWriteStream|public\/uploads|from "fs"/);
    }
  });
  it("middleware guards /admin pages", () => {
    expect(readFileSync("src/middleware.ts", "utf8")).toMatch(/\/admin\/:path\*/);
  });
});

describe("public form validation", () => {
  const base = { name: "Sam Lee", email: "SAM@Example.com", phone: "403 555 0100", location: "forest-lawn", partySize: "4", date: "2026-10-10", time: "09:00" };
  it("normalises and accepts a valid booking", () => {
    const r = bookingSchema.safeParse(base);
    expect(r.success && r.data.email).toBe("sam@example.com");
    expect(r.success && r.data.partySize).toBe(4);
  });
  it("rejects bad email, phone and fractional party size", () => {
    expect(bookingSchema.safeParse({ ...base, email: "nope" }).success).toBe(false);
    expect(bookingSchema.safeParse({ ...base, phone: "abc" }).success).toBe(false);
    expect(bookingSchema.safeParse({ ...base, partySize: "2.5" }).success).toBe(false);
  });
  it("does not let clients inject extra fields (mass assignment)", () => {
    const r = bookingSchema.safeParse({ ...base, status: "approved", internalNotes: "x" });
    expect(r.success && "status" in r.data).toBe(false);
  });
  it("flags honeypot and too-fast submissions as spam", () => {
    const now = 1_000_000_000;
    expect(looksLikeSpam({ website: "http://spam", ts: now - 10_000 }, now)).toBe(true);
    expect(looksLikeSpam({ website: "", ts: now - 500 }, now)).toBe(true);
    expect(looksLikeSpam({ website: "", ts: 0 }, now)).toBe(true);
    expect(looksLikeSpam({ website: "", ts: now - 10_000 }, now)).toBe(false);
  });
});

describe("uploads and money", () => {
  it("detects real image types from bytes, not names", () => {
    expect(sniffImage(Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0, 0, 0, 0, 0, 0, 0, 0, 0]))).toBe("jpeg");
    expect(sniffImage(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0]))).toBe("png");
    expect(sniffImage(Buffer.concat([Buffer.from("RIFF"), Buffer.alloc(4), Buffer.from("WEBPVP8 ")]))).toBe("webp");
    expect(sniffImage(Buffer.from("GIF89a....................."))).toBe("gif");
    expect(sniffImage(Buffer.from("<svg onload=alert(1)></svg>"))).toBeNull();
    expect(sniffImage(Buffer.from("MZ executable pretending to be a png"))).toBeNull();
  });
  it("sanitises filenames and upload URLs", () => {
    expect(isSafeFilename("1700000000000-ab12cd34ef56.jpg")).toBe(true);
    for (const bad of ["../x.png", "a/b.png", "a\\b.png", "..", ".hidden", "x..png", ""]) expect(isSafeFilename(bad), bad).toBe(false);
    expect(makeFilename("png")).toMatch(/^\d{13}-[0-9a-f]{12}\.png$/);
    expect(parseUploadUrl("/api/uploads/products/1-abc.png")).toEqual({ folder: "products", filename: "1-abc.png" });
    expect(parseUploadUrl("/api/uploads/evil/1-abc.png")).toBeNull();
    expect(parseUploadUrl("/api/uploads/products/../x.png")).toBeNull();
    expect(parseUploadUrl("/uploads/legacy.png")).toBeNull();
    expect(parseUploadUrl("https://example.com/a.png")).toBeNull();
  });
  it("formats CAD from integer cents and refuses zero/invalid prices", () => {
    expect(formatCAD(1495)).toBe("$14.95");
    expect(formatCAD(0)).toBeNull();
    expect(formatCAD(null)).toBeNull();
    expect(formatCAD(12.5)).toBeNull();
    expect(parsePriceToCents("$14.95")).toBe(1495);
    expect(parsePriceToCents("0")).toBeNull();
    expect(parsePriceToCents("abc")).toBeNull();
    expect(parsePriceToCents("")).toBeNull();
  });
});
