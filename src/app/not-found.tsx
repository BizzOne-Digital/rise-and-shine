import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main" className="grid min-h-screen place-items-center bg-sun px-6 text-center text-cream">
      <div>
        <p className="display-xl text-[clamp(6rem,25vw,14rem)] text-gold">404</p>
        <h1 className="display-lg text-4xl">This page burnt like toast.</h1>
        <p className="mx-auto mt-3 max-w-md text-xl">We could not find what you were looking for. Let us get you back to breakfast.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn-press min-h-[52px] rounded-full bg-char px-7 py-3 text-lg font-extrabold">Home</Link>
          <Link href="/menu" className="btn-press min-h-[52px] rounded-full bg-cream px-7 py-3 text-lg font-extrabold text-char">Menu</Link>
        </div>
      </div>
    </main>
  );
}
