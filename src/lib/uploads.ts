import "server-only";
import { randomBytes } from "crypto";
import { connectDB } from "./db";
import { StoredUpload } from "./models";

/** Images are stored in MongoDB (not on disk), so they survive redeploys and work on read-only serverless hosts. */
export const UPLOAD_FOLDERS = ["products", "gallery", "pages", "misc"] as const;
export type UploadFolder = (typeof UPLOAD_FOLDERS)[number];
export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;
export const UPLOAD_URL_PREFIX = "/api/uploads/";

const EXT = { jpeg: "jpg", png: "png", webp: "webp", gif: "gif" } as const;
const MIME = { jpeg: "image/jpeg", png: "image/png", webp: "image/webp", gif: "image/gif" } as const;
export type ImageKind = keyof typeof EXT;

export const isUploadFolder = (v: unknown): v is UploadFolder => typeof v === "string" && (UPLOAD_FOLDERS as readonly string[]).includes(v);

/** Real image type from magic bytes; the client-supplied MIME type is never trusted. */
export function sniffImage(buf: Buffer): ImageKind | null {
  if (buf.length > 12 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "jpeg";
  if (buf.length > 8 && buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "png";
  if (buf.length > 12 && buf.subarray(0, 4).toString("ascii") === "RIFF" && buf.subarray(8, 12).toString("ascii") === "WEBP") return "webp";
  if (buf.length > 10 && (buf.subarray(0, 6).toString("ascii") === "GIF87a" || buf.subarray(0, 6).toString("ascii") === "GIF89a")) return "gif";
  return null;
}

/** A filename is safe only if it is a plain token: no slashes, no "..", limited charset. */
export const isSafeFilename = (f: string) => /^[A-Za-z0-9][A-Za-z0-9._-]{0,120}$/.test(f) && !f.includes("..");

export function makeFilename(kind: ImageKind) {
  return `${Date.now()}-${randomBytes(6).toString("hex")}.${EXT[kind]}`;
}

export async function saveUpload(folder: UploadFolder, buf: Buffer, kind: ImageKind) {
  await connectDB();
  const filename = makeFilename(kind);
  await StoredUpload.create({ folder, filename, mimeType: MIME[kind], size: buf.length, data: buf });
  return { url: `${UPLOAD_URL_PREFIX}${folder}/${filename}`, filename, size: buf.length, folder };
}

export function parseUploadUrl(url: string | null | undefined): { folder: UploadFolder; filename: string } | null {
  if (!url || !url.startsWith(UPLOAD_URL_PREFIX)) return null;
  const [folder, filename, ...rest] = url.slice(UPLOAD_URL_PREFIX.length).split("/");
  if (rest.length || !isUploadFolder(folder) || !filename || !isSafeFilename(filename)) return null;
  return { folder, filename };
}

/** Deletes the stored binary behind an /api/uploads/... URL. Other URLs (legacy, external) are ignored. */
export async function deleteUploadByUrl(url: string | null | undefined): Promise<boolean> {
  const p = parseUploadUrl(url);
  if (!p) return false;
  await connectDB();
  const r = await StoredUpload.deleteOne({ folder: p.folder, filename: p.filename });
  return r.deletedCount > 0;
}
