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
      <s className="text-[0.8em] text-zinc-500 decoration-red-800 decoration-2">
        €{price}
      </s>
      <span className="text-red-800">€{discountedPrice(price)}</span>
    </span>
  );
}
