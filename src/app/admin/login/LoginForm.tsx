"use client";

import { useServerAction } from "@/components/useServerAction";
import { login } from "./actions";
import { inputCls } from "@/components/FormKit";

export function LoginForm() {
  const { state, pending, onSubmit } = useServerAction<{ error?: string; email?: string }>(login, {});
  return (
    <form onSubmit={onSubmit} className="mt-5 space-y-4">
      <div><label htmlFor="email" className="mb-1 block text-sm font-extrabold">Email</label><input id="email" name="email" type="email" autoComplete="username" required className={inputCls} /></div>
      <div><label htmlFor="password" className="mb-1 block text-sm font-extrabold">Password</label><input id="password" name="password" type="password" autoComplete="current-password" required className={inputCls} /></div>
      <p role="alert" aria-live="assertive" className="min-h-[1.25rem] text-sm font-bold text-red-800">{state.error}</p>
      <button disabled={pending} className="btn-press min-h-[52px] w-full rounded-full bg-sun text-lg font-extrabold text-white shadow-[0_4px_0_#C93A00] disabled:opacity-60">{pending ? "Signing in…" : "Sign in"}</button>
    </form>
  );
}
