import "server-only";

/** Converts Mongoose lean documents into plain serialisable objects with string ids. */
export function plain<T>(doc: unknown): T {
  return JSON.parse(JSON.stringify(doc)) as T;
}

export const PAGE_SIZE = 20;

export function pageOf(raw: string | undefined) {
  const n = parseInt(raw ?? "1", 10);
  return Number.isFinite(n) && n > 0 ? Math.min(n, 1000) : 1;
}

export function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
