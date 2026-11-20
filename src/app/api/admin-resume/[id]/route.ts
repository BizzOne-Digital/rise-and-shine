import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { requireAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { JobApplication } from "@/lib/models";

export const dynamic = "force-dynamic";

/** Resume download for the admin. The middleware does not cover /api, so the admin check is enforced here. */
export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  if (!mongoose.isValidObjectId(id)) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await connectDB();
  const a = await JobApplication.findById(id).select("resume resumeName resumeType").lean<{ resume: unknown; resumeName: string; resumeType?: string }>();
  if (!a) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const raw = a.resume as { buffer?: Uint8Array } | Uint8Array;
  const bytes = raw instanceof Uint8Array ? raw : new Uint8Array((raw as { buffer: Uint8Array }).buffer);
  const name = String(a.resumeName || "resume").replace(/[^\w.\- ]+/g, "_");
  return new NextResponse(new Uint8Array(bytes), {
    headers: {
      "Content-Type": a.resumeType || "application/octet-stream",
      "Content-Disposition": `attachment; filename="${name}"`,
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "private, no-store",
    },
  });
}
