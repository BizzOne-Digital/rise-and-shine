"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import mongoose from "mongoose";
import { requireAdmin, UnauthorizedError, type AdminSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { BookingRequest, MenuCategory, MenuItem } from "@/lib/models";
import { parsePriceToCents } from "@/lib/money";
import { deleteUploadByUrl, parseUploadUrl } from "@/lib/uploads";

export type State = { ok?: boolean; message?: string; error?: string; fieldErrors?: Record<string, string> };

/** Every exported action goes through run(), which enforces an authenticated admin BEFORE doing anything. */
async function run(fn: (me: AdminSession) => Promise<State>): Promise<State> {
  try {
    const me = await requireAdmin();
    await connectDB();
    const r = await fn(me);
    if (r.ok) revalidatePath("/", "layout");
    return r;
  } catch (e) {
    if (e instanceof UnauthorizedError) return { error: "Your session has expired. Please sign in again." };
    console.error("[admin action]", (e as Error).message);
    return { error: "That did not save. Please try again." };
  }
}

const f = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();
const bool = (fd: FormData, k: string) => fd.get(k) === "on" || fd.get(k) === "true";
const objectId = z.string().refine((v) => mongoose.isValidObjectId(v), "Invalid id");
const ok = (message: string): State => ({ ok: true, message });
const bad = (error: string): State => ({ error });

/** Only our own uploaded images (or nothing) may be stored on a product. */
const imageUrl = z.string().max(300).refine((v) => v === "" || parseUploadUrl(v) !== null, "Invalid image. Please upload the image again.");

// ---------------- Products ----------------
export async function saveProduct(_p: State, fd: FormData): Promise<State> {
  return run(async () => {
    const p = z.object({
      name: z.string().min(2, "Name is required").max(80),
      description: z.string().max(600),
      category: objectId,
      image: imageUrl,
    }).safeParse({ name: f(fd, "name"), description: f(fd, "description"), category: f(fd, "category"), image: f(fd, "image") });
    if (!p.success) return bad(p.error.issues[0].message);
    if (!(await MenuCategory.exists({ _id: p.data.category }))) return bad("Choose a valid category.");

    const priceRaw = f(fd, "price");
    const priceCents = priceRaw ? parsePriceToCents(priceRaw) : null;
    if (priceRaw && priceCents == null) return bad("Price must be a positive amount like 12.50. Leave it empty if the price is not confirmed.");

    const data = { ...p.data, priceCents, signature: bool(fd, "signature"), available: bool(fd, "available"), published: bool(fd, "published") };
    const id = f(fd, "id");
    if (id) {
      if (!mongoose.isValidObjectId(id)) return bad("Invalid id.");
      const old = await MenuItem.findById(id).select("image").lean<{ image?: string }>();
      if (!old) return bad("Product not found.");
      await MenuItem.updateOne({ _id: id }, { $set: data });
      if (old.image && old.image !== data.image) await deleteUploadByUrl(old.image); // replaced or removed
      return ok("Product saved.");
    }
    const last = await MenuItem.findOne({ category: p.data.category }).sort({ order: -1 }).select("order").lean<{ order: number }>();
    await MenuItem.create({ ...data, order: (last?.order ?? 0) + 1 });
    return ok("Product added.");
  });
}

export async function deleteProduct(_p: State, fd: FormData): Promise<State> {
  return run(async () => {
    const id = objectId.safeParse(f(fd, "id"));
    if (!id.success) return bad("Invalid id.");
    const item = await MenuItem.findByIdAndDelete(id.data).select("image").lean<{ image?: string }>();
    if (!item) return bad("Product not found.");
    await deleteUploadByUrl(item.image);
    return ok("Product deleted.");
  });
}

// ---------------- Orders (booking requests): view and delete only ----------------
export async function deleteOrder(_p: State, fd: FormData): Promise<State> {
  return run(async () => {
    const id = objectId.safeParse(f(fd, "id"));
    if (!id.success) return bad("Invalid id.");
    const r = await BookingRequest.deleteOne({ _id: id.data });
    return r.deletedCount ? ok("Order deleted.") : bad("Order not found.");
  });
}
