"use client";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main id="main" className="grid min-h-screen place-items-center bg-cream px-6 text-center">
      <div>
        <h1 className="display-xl text-5xl text-sun">Something went sideways.</h1>
        <p className="mx-auto mt-3 max-w-md text-xl">Please try again. If it keeps happening, call us at (403) 707-6529.</p>
        <button onClick={reset} className="btn-press mt-6 min-h-[52px] rounded-full bg-sun px-7 text-lg font-extrabold text-white">Try again</button>
      </div>
    </main>
  );
}
