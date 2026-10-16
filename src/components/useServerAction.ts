"use client";

import { useRef, useState, useTransition, type FormEvent } from "react";

/** Runs a server action from a form WITHOUT React 19's automatic form reset, so a failed submit keeps what the user typed.
 *  Returns the latest state, a pending flag and an onSubmit handler. */
export function useServerAction<S extends object>(action: (prev: S, fd: FormData) => Promise<S>, initial: S) {
  const [state, setState] = useState<S>(initial);
  const [pending, start] = useTransition();
  const ref = useRef<HTMLFormElement>(null);

  function onSubmit(e: FormEvent<HTMLFormElement>, after?: (s: S, form: HTMLFormElement) => void) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    start(async () => {
      const next = await action(state, fd);
      setState(next);
      after?.(next, form);
    });
  }
  return { state, pending, onSubmit, ref };
}
