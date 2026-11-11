import { FLASH_DISCOUNT, discountedPrice } from "../../config";

// Flash price. While a discount is on, the original price is struck through
// next to the discounted one.
export default function FlashPrice({
  price,
  className = "",
}: {
  price: number;
  className?: string;
}) {
  if (!FLASH_DISCOUNT) {
    return <span className={className}>€{price}</span>;
  }
  // `className` (font, size) goes on the wrapper so both prices share it.
  return (
    <span className={`inline-flex items-baseline gap-2 ${className}`}>
      {/* Thin diagonal slash instead of a line through the middle, which
          made the narrow display font hard to read. */}
      <s className="relative text-[0.8em] text-zinc-500 no-underline">
        €{price}
        <span
          aria-hidden
          className="absolute left-[-5%] right-[-5%] top-1/2 h-[1.5px] bg-red-800/80 -rotate-[20deg]"
        />
      </s>
      <span className="text-red-800">€{discountedPrice(price)}</span>
    </span>
  );
}
