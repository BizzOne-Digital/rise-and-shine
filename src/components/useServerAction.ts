"use client";

import { useRef, useState, useTransition, type FormEvent } from "react";
import { BUSINESS } from "@/lib/content";

const FALLBACK = `We could not send that just now. Please try again, or email ${BUSINESS.email} or call ${BUSINESS.phoneDisplay}.`;

/** Runs a server action from a form WITHOUT React 19's automatic form reset, so a failed submit keeps what the user typed.
 *  Returns the latest state, a pending flag and an onSubmit handler.
 *  If the action throws (network drop, payload too large, a redeploy in between) the visitor sees a message in the form
 *  instead of the whole page crashing. `precheck` can reject the submit in the browser before anything is sent. */
export function useServerAction<S extends object>(action: (prev: S, fd: FormData) => Promise<S>, initial: S) {
  const [state, setState] = useState<S>(initial);
  const [pending, start] = useTransition();
  const ref = useRef<HTMLFormElement>(null);

  function onSubmit(e: FormEvent<HTMLFormElement>, after?: (s: S, form: HTMLFormElement) => void, precheck?: (fd: FormData) => S | null) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const blocked = precheck?.(fd);
    if (blocked) { setState(blocked); return; }
    start(async () => {
      let next: S;
      try {
        next = await action(state, fd);
      } catch {
        next = { error: FALLBACK } as unknown as S;
      }
      setState(next);
      after?.(next, form);
    });
  }
  return { state, pending, onSubmit, ref };
}
