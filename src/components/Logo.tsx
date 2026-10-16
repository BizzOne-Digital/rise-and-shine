/** The supplied logo (public/brand/logo.png, 1280x720 on black) in a black rounded tile, cropped to the artwork. */
export function Logo({ className = "", size = "md" }: { className?: string; tone?: "dark" | "light"; size?: "md" | "lg" }) {
  const h = size === "lg" ? "h-[104px] sm:h-[124px]" : "h-[62px] sm:h-[70px] lg:h-[82px]";
  return (
    <span
      role="img"
      aria-label="Rise N’ Shine Breakfast Place"
      className={`block aspect-[780/370] overflow-hidden rounded-xl bg-black bg-no-repeat ${h} ${className}`}
      style={{ backgroundImage: "url(/brand/logo.png)", backgroundSize: "164.1% auto", backgroundPosition: "50% 50%" }}
    />
  );
}
