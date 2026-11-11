"use client";

import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";
import { useServerAction } from "./useServerAction";

export type State = { ok?: boolean; message?: string; error?: string; fieldErrors?: Record<string, string> };
type Action = (prev: State, fd: FormData) => Promise<State>;

export const inputCls =
  "w-full rounded-xl border-2 border-char/25 bg-white px-4 py-3 text-base text-char placeholder:text-char/60 focus:border-sun focus:outline-none focus:ring-4 focus:ring-sun/25 aria-[invalid=true]:border-sun-red";

export function Field({ label, name, error, hint, children, idp = "" }: { label: ReactNode; name: string; error?: string; hint?: string; children: ReactNode; idp?: string }) {
  const id = idp + name;
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-extrabold">{label}</label>
      {children}
      {hint && !error && <p id={`${id}-hint`} className="mt-1 text-sm text-char/75">{hint}</p>}
      {error && <p id={`${id}-err`} className="mt-1 text-sm font-bold text-sun-red">{error}</p>}
    </div>
  );
}

export function describedBy(name: string, error?: string, hint?: string) {
  return { "aria-invalid": error ? true : undefined, "aria-describedby": error ? `${name}-err` : hint ? `${name}-hint` : undefined } as const;
}

/** Hidden anti-spam inputs: honeypot + render timestamp. */
export function SpamFields() {
  const [ts, setTs] = useState("");
  useEffect(() => setTs(String(Date.now())), []);
  return (
    <>
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>Leave this empty<input type="text" name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>
      <input type="hidden" name="ts" value={ts} />
    </>
  );
}

export function SubmitButton({ pending, children, className = "" }: { pending: boolean; children: ReactNode; className?: string }) {
  return (
    <motion.button whileTap={{ scale: 0.97 }} type="submit" disabled={pending} aria-busy={pending}
      className={`btn-press min-h-[54px] rounded-full bg-sun px-8 text-lg font-extrabold text-white shadow-[0_4px_0_#C93A00] hover:bg-sun-red disabled:cursor-wait disabled:opacity-70 ${className}`}>
      {pending ? "Sending…" : children}
    </motion.button>
  );
}

/** Wraps a server action with pending state and accessible success/error feedback. */
export function ActionForm({
  action, children, submitLabel, className = "", disabledReason, resetOnSuccess = true,
}: {
  action: Action; children: (s: State) => ReactNode; submitLabel: string; className?: string; disabledReason?: string; resetOnSuccess?: boolean;
}) {
  const { state, pending, onSubmit, ref } = useServerAction<State>(action, {});

  return (
    <form ref={ref} onSubmit={(e) => onSubmit(e, (s, form) => { if (s.ok && resetOnSuccess) form.reset(); })} noValidate className={`relative space-y-4 ${className}`}>
      {disabledReason && <p role="alert" className="rounded-xl border-2 border-gold bg-gold/20 p-4 font-bold">{disabledReason}</p>}
      <fieldset disabled={Boolean(disabledReason) || pending} className="space-y-4">
        {children(state)}
        <SpamFields />
      </fieldset>
      <div aria-live="polite" role="status">
        <AnimatePresence mode="wait">
          {state.ok && state.message && (
            <motion.p key="ok" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl bg-green-100 p-4 font-bold text-green-950">{state.message}</motion.p>
          )}
          {state.error && !state.ok && (
            <motion.p key="err" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl bg-red-100 p-4 font-bold text-red-950">{state.error}</motion.p>
          )}
        </AnimatePresence>
      </div>
      {!disabledReason && <SubmitButton pending={pending}>{submitLabel}</SubmitButton>}
    </form>
  );
}
