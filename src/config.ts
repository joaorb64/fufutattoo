// Canonical origin the site is served from (apex custom domain). Used to build
// absolute URLs for <link rel="canonical">, Open Graph tags and JSON-LD.
export const SITE_URL = "https://fufuart.com";

export const WHATSAPP_NUMBER = "34642269686";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;
export const EMAIL = "futattoo93@gmail.com";
export const INSTAGRAM_URL = "https://instagram.com/fufutattoo_";
export const INSTAGRAM_HANDLE = "@fufutattoo_";

// Discount applied to every flash price (0.2 = 20% off). Set to 0 to end the
// promotion: the banner disappears and prices go back to normal.
export const FLASH_DISCOUNT = 0.2;

export function discountedPrice(price: number): number {
  return Math.round(price * (1 - FLASH_DISCOUNT));
}
