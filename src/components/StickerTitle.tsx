import type { ReactNode } from "react";

// Page title flanked by a sticker illustration on each side — same idea as
// the bees on the About page, but with no rotation.
export default function StickerTitle({
  children,
  sticker,
  mirrorRight = false,
  className = "",
}: {
  children: ReactNode;
  sticker: string;
  mirrorRight?: boolean;
  className?: string;
}) {
  const img =
    "absolute top-1/2 -translate-y-1/2 w-14 sm:w-20 lg:w-28 pointer-events-none select-none";
  return (
    <div className={`relative inline-block ${className}`}>
      <img
        src={sticker}
        alt=""
        aria-hidden
        className={`${img} -left-14 sm:-left-24 lg:-left-32`}
      />
      <h1 className="relative font-[BohoSans]">{children}</h1>
      <img
        src={sticker}
        alt=""
        aria-hidden
        className={`${img} -right-14 sm:-right-24 lg:-right-32 ${
          mirrorRight ? "-scale-x-100" : ""
        }`}
      />
    </div>
  );
}
