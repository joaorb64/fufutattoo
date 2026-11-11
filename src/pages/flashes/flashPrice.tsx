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
  return (
    <span className="inline-flex items-baseline gap-2">
      <s className="text-zinc-400 text-[0.65em] decoration-red-800 decoration-2">
        €{price}
      </s>
      <span className={`${className} text-red-800`}>
        €{discountedPrice(price)}
      </span>
    </span>
  );
}
