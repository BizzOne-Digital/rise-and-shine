"use client";

import { useEffect, useRef, useState } from "react";

export type UploadFolder = "products" | "gallery" | "pages" | "misc";
const MAX = 8 * 1024 * 1024;
const TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];

type Toast = { id: number; ok: boolean; text: string };

/** Admin image picker. Uploads to /api/upload (stored in MongoDB) and returns the saved public URL through onChange.
 *  Also renders a hidden input named `name` so it works inside normal forms. */
export function ImageField({
  name, folder, value = "", onChange, label = "Image",
}: { name?: string; folder: UploadFolder; value?: string; onChange?: (url: string) => void; label?: string }) {
  const [url, setUrl] = useState(value);
  const [busy, setBusy] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const fresh = useRef<string | null>(null); // uploaded in this session but not yet saved with the form
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => setUrl(value), [value]);

  function toast(ok: boolean, text: string) {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, ok, text }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4500);
  }
  function set(next: string) {
    setUrl(next);
    onChange?.(next);
  }
  async function discardFresh() {
    if (!fresh.current) return;
    const old = fresh.current;
    fresh.current = null;
    fetch(`/api/upload?url=${encodeURIComponent(old)}`, { method: "DELETE" }).catch(() => {});
  }

  async function pick(file: File | undefined) {
    if (!file) return;
    if (!TYPES.includes(file.type)) return toast(false, "Please choose a PNG, JPEG, WebP or GIF image.");
    if (file.size > MAX) return toast(false, "That image is over 8 MB. Please choose a smaller one.");
    setBusy(true);
    try {
      const fd = new FormData();
      fd.set("file", file);
      fd.set("folder", folder);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const j = await res.json().catch(() => ({}));
      if (!res.ok || !j.success) throw new Error(j.error ?? "Upload failed.");
      await discardFresh(); // replacing an image uploaded earlier in this session
      fresh.current = j.url;
      set(j.url);
      toast(true, "Image uploaded. Save to keep it.");
    } catch (e) {
      toast(false, (e as Error).message);
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  }

  return (
    <div>
      <span className="mb-1 block text-sm font-extrabold">{label}</span>
      <div className="flex items-center gap-3 rounded-xl border-2 border-char/25 bg-white p-3">
        <div className="relative grid h-20 w-24 shrink-0 place-items-center overflow-hidden rounded-lg bg-cream-dark text-xs font-bold text-char/70">
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt="Selected image preview" className="h-full w-full object-cover" />
          ) : (
            <span>No image</span>
          )}
          {busy && <span className="absolute inset-0 grid place-items-center bg-char/60 text-xs font-extrabold text-cream" role="status">Uploading…</span>}
        </div>
        <div className="flex min-w-0 flex-1 flex-wrap gap-2">
          <input ref={input} id={name ? `${name}-file` : undefined} type="file" accept={TYPES.join(",")} className="sr-only" onChange={(e) => pick(e.target.files?.[0])} disabled={busy} />
          <button type="button" disabled={busy} onClick={() => input.current?.click()} className="btn-press min-h-[44px] rounded-lg bg-char px-4 text-sm font-extrabold text-cream disabled:opacity-60">
            {url ? "Replace" : "Choose image"}
          </button>
          {url && (
            <button type="button" disabled={busy} onClick={() => { void discardFresh(); set(""); }} className="btn-press min-h-[44px] rounded-lg border-2 border-char/30 px-4 text-sm font-extrabold disabled:opacity-60">
              Remove
            </button>
          )}
          <p className="w-full text-xs text-char/75">PNG, JPEG, WebP or GIF, up to 8 MB.</p>
        </div>
      </div>
      {name && <input type="hidden" name={name} value={url} />}
      <div aria-live="polite" className="pointer-events-none fixed bottom-4 right-4 z-[60] flex w-[min(92vw,22rem)] flex-col gap-2">
        {toasts.map((t) => (
          <p key={t.id} role={t.ok ? "status" : "alert"} className={`pointer-events-auto rounded-xl px-4 py-3 text-sm font-bold shadow-lg ${t.ok ? "bg-green-700 text-white" : "bg-red-700 text-white"}`}>{t.text}</p>
        ))}
      </div>
    </div>
  );
}
