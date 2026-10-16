import "server-only";
import { createHash } from "crypto";
import { headers } from "next/headers";
import { connectDB } from "./db";
import { RateLimit } from "./models";

export async function clientKey() {
  const h = await headers();
  const ip = (h.get("x-forwarded-for") ?? "").split(",")[0].trim() || h.get("x-real-ip") || "unknown";
  return createHash("sha256").update(ip + (process.env.AUTH_SECRET ?? "")).digest("hex").slice(0, 24);
}

/** Fixed-window limiter backed by MongoDB (works across serverless instances). */
export async function rateLimit(scope: string, who: string, limit: number, windowSec: number) {
  await connectDB();
  const bucket = Math.floor(Date.now() / (windowSec * 1000));
  const doc = await RateLimit.findOneAndUpdate(
    { key: `${scope}:${who}:${bucket}` },
    { $inc: { count: 1 }, $setOnInsert: { expiresAt: new Date((bucket + 1) * windowSec * 1000 + 60_000) } },
    { upsert: true, returnDocument: "after" },
  ).lean();
  return { ok: (doc?.count ?? 1) <= limit };
}
