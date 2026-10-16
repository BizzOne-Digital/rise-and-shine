import Link from "next/link";

export function Pager({ page, total, size, base, params }: { page: number; total: number; size: number; base: string; params: Record<string, string | undefined> }) {
  const pages = Math.max(1, Math.ceil(total / size));
  const href = (p: number) => {
    const sp = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) if (v) sp.set(k, v);
    sp.set("page", String(p));
    return `${base}?${sp}`;
  };
  return (
    <nav aria-label="Pagination" className="mt-4 flex items-center justify-between text-sm font-bold">
      <span>{total} result{total === 1 ? "" : "s"} · page {Math.min(page, pages)} of {pages}</span>
      <span className="flex gap-2">
        {page > 1 && <Link href={href(page - 1)} className="min-h-[44px] rounded-lg border-2 border-char/30 px-4 py-2.5">Previous</Link>}
        {page < pages && <Link href={href(page + 1)} className="min-h-[44px] rounded-lg border-2 border-char/30 px-4 py-2.5">Next</Link>}
      </span>
    </nav>
  );
}
