import { NextResponse } from "next/server";
import { requireAdmin, UnauthorizedError } from "@/lib/auth";
import { deleteUploadByUrl, isUploadFolder, MAX_UPLOAD_BYTES, saveUpload, sniffImage } from "@/lib/uploads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function admin() {
  try {
    return await requireAdmin();
  } catch (e) {
    if (e instanceof UnauthorizedError) return null;
    throw e;
  }
}

export async function POST(req: Request) {
  if (!(await admin())) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  const folder = form?.get("folder");
  if (!isUploadFolder(folder)) return NextResponse.json({ success: false, error: "Invalid folder." }, { status: 400 });
  if (!(file instanceof File)) return NextResponse.json({ success: false, error: "Choose an image file." }, { status: 400 });
  if (file.size === 0) return NextResponse.json({ success: false, error: "That file is empty." }, { status: 400 });
  if (file.size > MAX_UPLOAD_BYTES) return NextResponse.json({ success: false, error: "Images must be 8 MB or smaller." }, { status: 413 });
  if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)) {
    return NextResponse.json({ success: false, error: "Only JPEG, PNG, WebP or GIF images are accepted." }, { status: 415 });
  }

  const buf = Buffer.from(await file.arrayBuffer());
  const kind = sniffImage(buf); // the file contents must really be an image, whatever the MIME type says
  if (!kind) return NextResponse.json({ success: false, error: "That file is not a valid JPEG, PNG, WebP or GIF image." }, { status: 415 });

  try {
    return NextResponse.json({ success: true, ...(await saveUpload(folder, buf, kind)) });
  } catch (e) {
    console.error("[upload]", (e as Error).message);
    return NextResponse.json({ success: false, error: "The upload could not be saved. Please try again." }, { status: 500 });
  }
}

/** Removes a freshly uploaded, not-yet-saved image (used when an admin replaces or removes it before saving). */
export async function DELETE(req: Request) {
  if (!(await admin())) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  const url = new URL(req.url).searchParams.get("url");
  const deleted = await deleteUploadByUrl(url);
  return NextResponse.json({ success: deleted });
}
