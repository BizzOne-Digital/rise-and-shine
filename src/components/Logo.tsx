/** The supplied logo (public/brand/logo.png, 1280x720 on black) in a black rounded tile, cropped to the artwork. */
export function Logo({ className = "", size = "md", plain = false }: { className?: string; tone?: "dark" | "light"; size?: "md" | "lg"; plain?: boolean }) {
  const h = size === "lg" ? "h-[104px] sm:h-[124px]" : "h-[52px] sm:h-[56px] lg:h-[62px]";
  if (plain) {
    // Header logo: square corners, artwork enlarged to fill the full bar height on the black header.
    return (
      <span role="img" aria-label="Rise N’ Shine Breakfast Place"
        className={`block aspect-[188/84] h-[72px] bg-black bg-no-repeat lg:h-[84px] ${className}`}
        style={{ backgroundImage: "url(/brand/logo.png)", backgroundSize: "auto 373%", backgroundPosition: "50% 50%" }} />
    );
  }
  return (
    <span
      role="img"
      aria-label="Rise N’ Shine Breakfast Place"
      className={`block aspect-[780/370] overflow-hidden rounded-xl bg-black bg-no-repeat ${h} ${className}`}
      style={{ backgroundImage: "url(/brand/logo.png)", backgroundSize: "164.1% auto", backgroundPosition: "50% 50%" }}
    />
  );
}
