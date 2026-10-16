import { connectDB } from "@/lib/db";
import { StoredUpload } from "@/lib/models";
import { isSafeFilename, isUploadFolder } from "@/lib/uploads";

export const runtime = "nodejs";

export async function GET(_req: Request, { params }: { params: Promise<{ folder: string; filename: string }> }) {
  const { folder, filename } = await params;
  // Reject traversal attempts and anything outside the whitelist before touching the database.
  if (!isUploadFolder(folder) || !isSafeFilename(filename) || filename.includes("/") || filename.includes("\\")) {
    return new Response("Not found", { status: 404 });
  }
  try {
    await connectDB();
    const doc = await StoredUpload.findOne({ folder, filename }).select("mimeType size data").lean<{ mimeType: string; size: number; data: { buffer?: Uint8Array } | Uint8Array }>();
    if (!doc) return new Response("Not found", { status: 404 });
    const raw = (doc.data as { buffer?: Uint8Array }).buffer ?? (doc.data as Uint8Array);
    const body = Buffer.from(raw);
    return new Response(new Uint8Array(body), {
      status: 200,
      headers: {
        "Content-Type": doc.mimeType,
        "Content-Length": String(body.length),
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (e) {
    console.error("[uploads GET]", (e as Error).message);
    return new Response("Unavailable", { status: 503 });
  }
}
