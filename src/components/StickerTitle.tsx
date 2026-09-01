import type { ReactNode } from "react";

// Shared page title. Optionally flanked by a sticker illustration on each side
// (like the bees on the About page or the jello on Session & Care). Pass no
// `sticker` for a plain centered title — every page title uses this component.
export default function StickerTitle({
  children,
  sticker,
  mirrorRight = false,
  tiltDeg = 0,
  className = "",
}: {
  children: ReactNode;
  sticker?: string;
  mirrorRight?: boolean;
  tiltDeg?: number;
  className?: string;
}) {
  const img =
    "absolute top-1/2 -translate-y-1/2 w-14 sm:w-20 lg:w-28 pointer-events-none select-none";
  return (
    <div className={`relative inline-block ${className}`}>
      {sticker && (
        <img
          src={sticker}
          alt=""
          aria-hidden
          className={`${img} -left-14 sm:-left-24 lg:-left-32`}
          style={tiltDeg ? { rotate: `${tiltDeg}deg` } : undefined}
        />
      )}
      <h1 className="relative font-[BohoSans]">{children}</h1>
      {sticker && (
        <img
          src={sticker}
          alt=""
          aria-hidden
          className={`${img} -right-14 sm:-right-24 lg:-right-32 ${
            mirrorRight ? "-scale-x-100" : ""
          }`}
          style={tiltDeg ? { rotate: `${-tiltDeg}deg` } : undefined}
        />
      )}
    </div>
  );
}
