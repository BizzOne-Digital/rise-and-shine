"use client";

import type { ReactNode } from "react";
import { useServerAction } from "../useServerAction";
import { inputCls } from "../FormKit";

type State = { ok?: boolean; message?: string; error?: string };
type Action = (prev: State, fd: FormData) => Promise<State>;

export const aInput = inputCls.replace("py-3", "py-2");
export const aBtn = "btn-press inline-flex min-h-[44px] items-center justify-center rounded-lg px-4 text-sm font-extrabold disabled:opacity-60";

/** Form bound to a server action, with pending state, confirmation and accessible feedback. */
export function AForm({
  action, children, submit, confirm, variant = "primary", className = "", inline = false, reset = false,
}: {
  action: Action; children?: ReactNode; submit: string; confirm?: string; variant?: "primary" | "danger" | "ghost" | "success";
  className?: string; inline?: boolean; reset?: boolean;
}) {
  const { state, pending, onSubmit, ref } = useServerAction<State>(action, {});
  const v = {
    primary: "bg-sun text-white hover:bg-sun-red",
    danger: "bg-red-700 text-white hover:bg-red-800",
    ghost: "border-2 border-char/30 hover:bg-char/5",
    success: "bg-green-700 text-white hover:bg-green-800",
  }[variant];
  return (
    <form
      ref={ref}
      onSubmit={(e) => {
        if (confirm && !window.confirm(confirm)) { e.preventDefault(); return; }
        onSubmit(e, (s, form) => { if (s.ok && reset) form.reset(); });
      }}
      className={`${inline ? "inline-flex flex-wrap items-center gap-2" : "space-y-3"} ${className}`}
    >
      {children}
      <button type="submit" disabled={pending} className={`${aBtn} ${v}`}>{pending ? "Working…" : submit}</button>
      <span role="status" aria-live="polite" className="text-sm font-bold">
        {state.ok && <span className="text-green-800">{state.message}</span>}
        {state.error && <span className="text-red-800">{state.error}</span>}
      </span>
    </form>
  );
}

export function Check({ name, label, defaultChecked }: { name: string; label: string; defaultChecked?: boolean }) {
  return (
    <label className="inline-flex min-h-[44px] items-center gap-2 text-sm font-bold">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="h-5 w-5 accent-[#FF4D00]" /> {label}
    </label>
  );
}

export function ALabel({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-extrabold">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-char/75">{hint}</span>}
    </label>
  );
}
